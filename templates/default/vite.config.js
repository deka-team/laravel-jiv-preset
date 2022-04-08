const { resolve } = require("path");
import vue from "@vitejs/plugin-vue";

import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

export default ({ command }) => ({
    base: command === "serve" ? "" : "/dist/",
    publicDir: "fake_dir_so_nothing_gets_copied",
    build: {
        manifest: true,
        outDir: resolve(__dirname, "public/dist"),
        rollupOptions: {
            external: {},
            input: "resources/js/app.js",
        },
    },

    plugins: [
        vue(),
        Components({
            resolvers: [
                IconsResolver({
                    componentPrefix: "icon", // <--
                }),
            ],
        }),
        Icons({
            autoInstall: true,
        }),
    ],

    resolve: {
        alias: {
            "@": resolve("./resources/js"),
        },
    },
});
