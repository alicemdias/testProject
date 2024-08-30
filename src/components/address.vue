<script lang="ts">
import Vue from "vue";
import { getPostcode } from "@/core/getPostcode";
import { Address } from "@/types";
import { mapGetters } from "vuex";
import InputComponent from "@/components/input.vue";
export default Vue.extend({
  //Name of the component, used for debugging and as a unique identifier
  name: "AddressComponent",
  // Registering the InputComponent to be used within this component
  components: {
    InputComponent,
  },
  data() {
    return {
      // Array to store postcode suggestions for autocomplete functionality
      postcodeOptions: [] as string[][],
    };
  },
  computed: {
    // Maps Vuex getters to computed properties in this component
    // This allows the component to reactively access state from the Vuex store
    ...(mapGetters([
      "addresses",
      "anotherAddress",
      "isAddressHistoryValid",
    ]) as {
      addresses: () => Address[];
      anotherAddress: () => boolean;
      isAddressHistoryValid: () => boolean;
    }),
  },
  methods: {
    //This method initializes a new address with empty fields and commits it to the store.
    addEntry() {
      const nextAddress = { line1: "", postcode: "", dateMovedIn: "" };
      this.$store.commit("addAddress", nextAddress);
    },
    // Removes an address entry from the list of addresses in the Vuex store.
    // The address at the specified index will be removed.
    // The index parameter specifies which address to remove.
    removeEntry(index: number) {
      this.$store.commit("removeAddress", index);
    },
    // Updates an existing address entry in the Vuex store.
    // The address at the specified index is updated with the new data provided.
    // The index parameter specifies which address to update, and address parameter contains the new data.
    updateAddress(
      index: number,
      address: { line1: string; postcode: string; dateMovedIn: string }
    ) {
      this.$store.commit("updateAddress", { index, address });
    },
    // Handles the updating of postcode and provides autocomplete suggestions.
    // It first fetches postcode suggestions using an external API and then updates the address.
    // The index parameter specifies which address to update, and postcode is the new postcode value.
    async updatePostcode(index: number, postcode: string) {
      // Fetch and update postcode suggestions
      await this.postcodeAutocomplete(postcode, index);
      // Update the address with the new postcode
      this.updateAddress(index, { ...this.addresses[index], postcode });
    },
    // Fetches postcode suggestions from an external API and updates the local suggestions list.
    // This method prevents setting suggestions if the postcode input is empty.
    // The index parameter specifies which address's suggestions to update.
    async postcodeAutocomplete(postcode: string, index: number) {
      if (!postcode.trim()) {
        this.$set(this.postcodeOptions, index, []);
        return;
      }
      try {
        // Fetch postcode suggestions from the API
        const [results, error] = await getPostcode(postcode);
        if (error) {
          console.error("Error fetching postcode suggestions:", error);
          return;
        }
        this.$set(this.postcodeOptions, index, results || []);
      } catch (error) {
        console.error("Unexpected error during postcode autocomplete:", error);
      }
    },
  },
});
</script>
<template>
  <b-container>
    <div
      v-for="(address, index) in addresses"
      :key="index"
      class="border p-3 rounded bg-dark text-white shadow-lg mb-4"
    >
      <div class="inner-content">
        <InputComponent
          name="line1"
          type="text"
          class="mb-4"
          v-model="address.line1"
          label="Address Line 1"
          @input="updateAddress(index, { ...address, line1: $event })"
          :required="true"
        />
        <InputComponent
          name="postcode"
          type="text"
          class="mb-4"
          v-model="address.postcode"
          label="Postcode"
          @input="updatePostcode(index, $event)"
          :required="true"
          :options="postcodeOptions[index]"
          :showOptions="true"
        />
        <InputComponent
          name="dateMovedIn"
          type="date"
          class="mb-4"
          v-model="address.dateMovedIn"
          label="Date Moved In"
          @input="updateAddress(index, { ...address, dateMovedIn: $event })"
          :required="true"
        />
        <b-button @click="removeEntry(index)" v-if="addresses.length > 1"
          >Remove Address</b-button
        >
      </div>
    </div>
    <b-button
      @click="addEntry"
      v-if="anotherAddress && !isAddressHistoryValid"
      class="float-end btn-secondary"
      >Add Address</b-button
    >
  </b-container>
</template>
