// server.js
const { createServer } = require("https");
const { parse } = require("url");
const fs = require("fs");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./server.key"),
  cert: fs.readFileSync("./server.cert"),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req: any, res: any) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err: any) => {
    if (err) throw err;
    console.log("> Ready on https://localhost:3000");
  });
});
