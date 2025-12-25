// Base path for GitHub Pages deployment
export const basePath = process.env.NODE_ENV === "production" ? "/quiz" : "";

export function getImagePath(path: string): string {
  if (path.startsWith("http")) return path;
  return `${basePath}${path}`;
}
