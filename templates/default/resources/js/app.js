import "../css/app.css";

import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/inertia-vue3";
import { InertiaProgress } from "@inertiajs/progress";

let asyncViews = () => {
    return import.meta.glob("./Pages/**/*.vue");
};

const appName = window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

// import mixins from "./Plugins/mixins";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        if (import.meta.env.DEV) {
            return (await import(`./Pages/${name}.vue`)).default;
        } else {
            let pages = asyncViews();
            const importPage = pages[`./Pages/${name}.vue`];
            return importPage().then((module) => module.default);
        }
    },
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .mixin({
                methods: {
                    route,
                    // ...mixins,
                },
            })
            .mount(el);
    },
});

InertiaProgress.init({ color: "#4B5563" });
