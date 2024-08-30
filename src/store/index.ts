import Vue from "vue";
import Vuex from "vuex";
import { Address, Claim, State, User } from "@/types";
import { createClaim } from "@/core/createClaim";

Vue.use(Vuex);

export default new Vuex.Store<State>({
  state: {
    // Stores the current user object. Initially set to null until the user is authenticated.
    user: null,
    // List of addresses associated with the user. Initially contains a single empty address object.
    addresses: [{ line1: "", postcode: "", dateMovedIn: "" }] as Address[],
    // List of claims associated with the user. Initially empty until claims are loaded or created.
    claims: [] as Claim[],
    // Stores any error messages related to user operations. Initially empty.
    userError: "",
  },
  getters: {
    user(state): User | null {
      return state.user;
    },
    addresses(state): Address[] {
      return state.addresses;
    },
    anotherAddress(state): boolean {
      const maxAddresses = 3; // Maximum number of addresses allowed
      return state.addresses.length < maxAddresses;
    },
    isAddressHistoryValid(state): boolean {
      const minimumAddressesForValidity = 3; // Minimum number of addresses needed for automatic validity
      // If the user has 3 or more addresses, the address history is automatically valid
      if (state.addresses.length >= minimumAddressesForValidity) {
        return true;
      }
      // If there are no addresses, return false (invalid)
      if (state.addresses.length === 0) {
        return false;
      }
      // Check the date of the most recent address
      const lastAddress = state.addresses[state.addresses.length - 1];
      const lastDateMovedIn = new Date(lastAddress.dateMovedIn);
      const dateThreeYearsAgo = new Date();
      dateThreeYearsAgo.setFullYear(dateThreeYearsAgo.getFullYear() - 3);
      // The address history is valid if the last address is from at least 3 years ago
      return lastDateMovedIn <= dateThreeYearsAgo;
    },
  },
  mutations: {
    // Sets the current user object
    setUser(state: State, user: User) {
      state.user = user;
    },
    // Sets an error message for user operations
    setUserError(state: State, errorMessage: string) {
      state.userError = errorMessage;
    },
    // Clears any existing user error message
    clearUserError(state: State) {
      state.userError = "";
    },
    // Adds a new address to the addresses list
    addAddress(state: State, address: Address) {
      state.addresses.push(address);
    },
    // Removes an address by its index from the addresses list
    removeAddress(state: State, index: number) {
      if (index >= 0 && index < state.addresses.length) {
        state.addresses.splice(index, 1);
      }
    },
    // Updates an address at a specific index in the addresses list
    updateAddress(state: State, payload: { index: number; address: Address }) {
      const { index, address } = payload;
      if (index >= 0 && index < state.addresses.length) {
        Vue.set(state.addresses, index, address);
      }
    },
    // Resets the addresses list to a single empty address
    resetAddress(state: State) {
      state.addresses = [{ line1: "", postcode: "", dateMovedIn: "" }];
    },
    // Adds a new claim to the claims list
    setClaim(state: State, claim: Claim) {
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
});
