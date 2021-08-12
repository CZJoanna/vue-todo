import Vue from "vue";
import App from "./App.vue";
import "../node_modules/todomvc-app-css/index.css";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
