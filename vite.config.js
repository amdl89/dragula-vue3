// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.js"),
            name: "show-case",
            fileName: (format) => (format === "es" ? "index.js" : "index.c.js"),
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: {
                    vue: "Vue",
                },
            },
        },
    },
    define: {
        global: "globalThis",
    },
});
