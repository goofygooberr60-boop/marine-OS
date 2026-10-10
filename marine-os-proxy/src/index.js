import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import wisp from "wisp-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

// Scramjet and libcurl are optional extras. Instead of relying on exact export names (which
// change between versions), find the folder inside node_modules that holds the needed file.
export function findDir(pkg, file) {
  const root = path.resolve("node_modules", pkg);
  if (!fs.existsSync(root)) return null;
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop();
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== "node_modules" && e.name !== "src") stack.push(p); }
      else if (e.name === file) return dir;
    }
  }
  return null;
}

const app = express();

// Marine OS + our config files come first so they win over the vendor copies.
app.use(express.static("./public"));
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));

const scramDir = findDir("@mercuryworkshop/scramjet", "scramjet.all.js");
const curlDir = findDir("@mercuryworkshop/libcurl-transport", "index.mjs");
if (scramDir && curlDir) {
  app.use("/scram/", express.static(scramDir));
  app.use("/libcurl/", express.static(curlDir));
  console.log("Scramjet engine: available");
} else {
  console.log("Scramjet engine: not installed (the Browser will use Ultraviolet)");
}

app.use((req, res) => res.status(404).send("Not found"));

const server = createServer();

server.on("request", (req, res) => {
  // Optional: only turn this on if the proxy loads but pages never arrive.
  // It can blank third-party game embeds, so it is off by default.  Start with:  ISOLATE=1 npm start
  if (process.env.ISOLATE) {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  }
  app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) wisp.routeRequest(req, socket, head);
  else socket.end();
});

const port = Number(process.env.PORT) || 8080;
server.listen({ port, host: "0.0.0.0" }, () => {
  console.log(`Marine OS is running:  http://localhost:${port}`);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => { server.close(); process.exit(0); });
}
