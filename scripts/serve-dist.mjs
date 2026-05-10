import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";

const distDir = path.resolve(process.cwd(), "dist");
const port = Number(process.argv[2] || process.env.PORT || 4173);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://local").pathname);
    let filePath = path.join(distDir, pathname === "/" ? "index.html" : pathname);

    if (!filePath.startsWith(distDir)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const stat = await fs.stat(filePath).catch(() => null);
    if (!stat || stat.isDirectory()) {
      filePath = path.join(distDir, "index.html");
    }

    const body = await fs.readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mime[path.extname(filePath)] || "application/octet-stream",
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`SrikarFolio is running at http://127.0.0.1:${port}/`);
});
