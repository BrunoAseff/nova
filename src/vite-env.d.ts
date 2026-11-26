/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base pública do bucket R2 com fundos e sons. Em dev, cai para `/media` (pasta local). */
  readonly VITE_ASSETS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
