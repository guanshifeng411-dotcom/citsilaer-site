import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentPath = path.join(root, "content", "site-content.json");
const contentJsPath = path.join(root, "content", "site-content.js");
const photosDir = path.join(root, "assets", "photos");

const existing = JSON.parse(await fs.readFile(contentPath, "utf8"));
const photoFiles = (await fs.readdir(photosDir))
  .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

function inferOrientation(filename) {
  const landscapeNames = new Set(["08.jpg", "09.jpg"]);
  return landscapeNames.has(filename) ? "landscape" : "square";
}

existing.photos = photoFiles.map((file, index) => ({
  src: `./assets/photos/${file}`,
  alt: `photo ${index + 1}`,
  orientation: inferOrientation(file)
}));

await fs.writeFile(contentPath, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
await fs.writeFile(
  contentJsPath,
  `window.DEFAULT_SITE_CONTENT = ${JSON.stringify(existing, null, 2)};\n`,
  "utf8"
);
console.log(`Updated content with ${existing.photos.length} photos.`);
