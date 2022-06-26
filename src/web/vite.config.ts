import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import "dotenv/config";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    define: {
        // I use process.env with dotenv package,
        // because import.meta.env from vite can't be used when using jest.
        // To make the build work, I need to map all env variables.
        "process.env.BACKEND_ADDRESS": `"${process.env.BACKEND_ADDRESS}"`,
    },
});
