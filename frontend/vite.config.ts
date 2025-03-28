/// <reference types="vitest" />

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Unfonts from "unplugin-fonts/vite";
import { resolve } from "path";

export default defineConfig({
  base: "/vue-poke-app/",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@common": resolve(__dirname, "src/components/common"),
      "@pages": resolve(__dirname, "src/pages"),
      "@parts": resolve(__dirname, "src/components/parts"),
    },
  },
  plugins: [
    vue(),
    Unfonts({
      google: {
        families: ["Reggae One"],
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    env: {
      VITE_POKEMON_URL: "TEST_VITE_POKEMON_URL",
      VITE_SPECIES_URL: "TEST_VITE_SPECIES_URL",
    },
    server: {
      deps: {
        inline: ["vuetify"],
      },
    },
  },
});
