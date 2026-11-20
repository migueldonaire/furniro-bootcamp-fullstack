/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_VERSION?: string; // the pipeline sets it when it builds
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
