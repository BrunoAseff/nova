const ASSETS_URL = (import.meta.env.VITE_ASSETS_URL ?? "/media").replace(/\/$/, "");

export function assetUrl(path: string) {
  return `${ASSETS_URL}/${path.replace(/^\//, "")}`;
}
