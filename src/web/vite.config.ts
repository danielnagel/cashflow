import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { config } from "./wrapper.config";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    define: {
        config,
    },
});
