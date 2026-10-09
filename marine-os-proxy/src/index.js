import { createServer } from "node:http";
import express from "express";
import wisp from "wisp-server-node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";

const app = express();

// Marine OS + our uv.config.js / sw.js come first so they win over the vendor copies.
app.use(express.static("./public"));
app.use("/uv/", express.static(uvPath));
app.use("/epoxy/", express.static(epoxyPath));
app.use("/baremux/", express.static(baremuxPath));
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
