import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const port = Number(process.env.PORT ?? 5173);

const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".ico": "image/x-icon",
};

createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const relative = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\/+/, "");
  const filePath = normalize(join(root, relative));

  if (!filePath.startsWith(root) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Hindi nahanap.");
    return;
  }

  res.writeHead(200, { "content-type": types[extname(filePath)] ?? "application/octet-stream" });
  createReadStream(filePath).pipe(res);
}).listen(port, () => {
  console.log(`Tindahan ni Aling Rosa → http://localhost:${port}`);
});
