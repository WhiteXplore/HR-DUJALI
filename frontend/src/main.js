import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/tailwind.css";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-vue-calendars/styles/material.css";

// ✅ Import and use vue3-toastify
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

// ✅ Import v-calendar and its styles
import VCalendar from "v-calendar";
import "v-calendar/dist/style.css";

const app = createApp(App);

// ✅ Register the toast plugin globally (optional config)
app
  .use(store)
  .use(router)
  .use(Vue3Toastify, {
    autoClose: 3000,
    position: "top-right",
    theme: "light",
  })
  .use(VCalendar, {}) // <-- Add this line to register v-calendar
  .mount("#app");
