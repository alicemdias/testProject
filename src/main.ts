import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import FormComponent from "@/components/form.vue";
import TextComponent from "@/components/text.vue";
import SubmitComponent from "./components/submit.vue";
import FormView from "@/views/FormView.vue";
import InputComponent from "./components/input.vue";
import AddressComponent from "./components/address.vue";
import MainView from "@/views/MainView.vue";
import "bootstrap/dist/css/bootstrap.css";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
new Vue({
  router,
  store,
  render: (h) => h(App),
  components: {
    App,
    InputComponent,
    AddressComponent,
    FormComponent,
    TextComponent,
    SubmitComponent,
    FormView,
    MainView,
  },
}).$mount("#app");
