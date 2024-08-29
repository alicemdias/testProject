import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import FormView from "@/views/FormView.vue";
import MainView from "@/views/MainView.vue";
import { getUserDataById } from "@/core/getUserDataById";
import store from "@/store";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/:userId",
    name: "form",
    component: FormView,
    beforeEnter: async (to, from, next) => {
      const userId = to.params.userId as string;
      const [user, error] = await getUserDataById(userId);
      if (error) {
        store.commit("setUserError", "User does not exist, please try again."); // set the error message if routing unsuccessful
        //NOTE: I'm aware I get an error message in the console if the suer cannot be found - best action here would be to do the validation if user exists in the Home Vue, not the routing.
        next({
          name: "main",
          query: {
            userError: "User does not exist, please try again.",
          },
        });
      } else {
        store.commit("setUser", user);
        store.commit("clearUserError"); //clear the error if routing is successful
        next();
      }
    },
  },
  {
    path: "/",
    name: "main",
    component: MainView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
