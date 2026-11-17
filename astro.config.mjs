// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://furkancomoglu.dev",
  output: "static",
  build: { inlineStylesheets: "auto" },
});
