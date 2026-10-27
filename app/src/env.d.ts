/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend API origin (e.g. https://api.example.com). Required in production. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

