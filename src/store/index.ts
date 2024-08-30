import Vue from "vue";
import Vuex from "vuex";
import { Address, Claim, State, User } from "@/types";
import { createClaim } from "@/core/createClaim";

Vue.use(Vuex);

export default new Vuex.Store<State>({
  state: {
    //Storing in global store to allow multiple components to have access to these states
    user: null,
    addresses: [{ line1: "", postcode: "", dateMovedIn: "" }] as Address[],
    claims: [] as Claim[],
    userError: "",
  },
  getters: {
    user(state): User | null {
      return state.user;
    },
    addresses(state): Address[] {
      return state.addresses;
    },
    needMoreAddresses(state): boolean {
      return state.addresses.length < 3;
    },
    //Method that checks if the address history is valid - either greater than 3 years OR 3 addresses
    isAddressHistoryValid(state): boolean {
      if (state.addresses.length === 0) return false;
      //Validation for address length
      if (state.addresses.length > 2) return true;

      //Validation for address date > 3 years
      const lastAddress = state.addresses[state.addresses.length - 1];
      const lastDate = new Date(lastAddress.dateMovedIn);
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
      return lastDate <= threeYearsAgo;
    },
  },
  mutations: {
    setUser(state, user: User) {
      state.user = user;
    },
    setUserError(state, errorMessage: string) {
      state.userError = errorMessage;
    },
    clearUserError(state) {
      state.userError = "";
    },
    addAddress(state, address: Address) {
      state.addresses.push(address);
    },
    removeAddress(state, index: number) {
      state.addresses.splice(index, 1);
    },
    updateAddress(
      state,
      { index, address }: { index: number; address: Address }
    ) {
      Vue.set(state.addresses, index, address);
    },
    resetAddress(state) {
      state.addresses = [{ line1: "", postcode: "", dateMovedIn: "" }];
    },
    setClaim(state, claim: Claim) {
      state.claims.push(claim);
    },
  },
  actions: {
    // This is an action, not method as its an async operation
    async createClaimAction(
      { commit },
      {
        userId,
        creationIpAddress,
        claimData,
      }: {
        userId: string;
        creationIpAddress: string;
        claimData: { addresses: Address[] };
      }
    ): Promise<[Claim | null, Error | null]> {
      try {
        const [newClaim, error] = await createClaim(
          userId,
          creationIpAddress,
          claimData
        );
        if (error) throw error;
        commit("setClaim", newClaim);
        return [newClaim, null];
      } catch (error) {
        return [null, error as Error];
      }
    },
  },
  modules: {},
});
