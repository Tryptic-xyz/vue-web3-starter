import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import Toast from "vue-toastification";

import "./assets/main.css";
import "vue-toastification/dist/index.css";

const options = {
  position: "top-center",
  draggable: false,
  closeOnClick: false,
  timeout: 20000,
  toastClassName: "osnipe",
};

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast, options);

app.mount("#app");
