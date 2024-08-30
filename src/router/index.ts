import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import FormView from "@/views/FormView.vue";
import MainView from "@/views/MainView.vue";
import { getUserDataById } from "@/core/getUserDataById";
import store from "@/store";
// Install Vue Router plugin
Vue.use(VueRouter);

// Define routes for the application
const routes: Array<RouteConfig> = [
  {
    path: "/:userId",
    name: "form",
    component: FormView,
    beforeEnter: async (to, from, next) => {
      const userId = to.params.userId as string;
      try {
        const [user, error] = await getUserDataById(userId);
        if (error) {
          // Commit error message to Vuex store and redirect to main view with error query
          store.commit(
            "setUserError",
            "User does not exist, please try again."
          );
          next({
            name: "main",
            query: {
              userError: "User does not exist, please try again.",
            },
          });
        } else {
          // Commit user data to Vuex store and clear any existing error
          store.commit("setUser", user);
          store.commit("clearUserError");
          next();
        }
      } catch (error) {
        // Handle unexpected errors
        store.commit(
          "setUserError",
          "An unexpected error occurred. Please try again."
        );
        next({
          name: "main",
          query: {
            userError: "An unexpected error occurred. Please try again.",
          },
        });
      }
    },
  },
  {
    path: "/",
    name: "main",
    component: MainView,
  },
];

// Create and configure the router instance
const router = new VueRouter({
  routes,
});

// Export the router instance for use in the Vue application
export default router;
