import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import FormView from "@/views/FormView.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/:userId",
    name: "form",
    component: FormView,
    beforeEnter: (to, from, next) => {
      // TODO load the user data from getUserDataById and store it with VueX
      next();
    },
  },
  {
    path: "/",
    name: "form",
    component: FormView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
