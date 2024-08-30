<script lang="ts">
import Vue from "vue";
import AddressInput from "@/components/input.vue";
import { mapGetters } from "vuex";
import { getPostcode } from "@/core/getPostcode";
import { Address } from "@/types";
export default Vue.extend({
  name: "AddressFormComponent",
  //Respecting PascalCase
  components: {
    AddressInput,
  },
  data() {
    return {
      postCodeOptions: [],
    };
  },
  computed: {
    ...(mapGetters([
      "userAddresses", //user's addresses
      "additionalAddressesNeeded", //aditional addresses if the date moved in is less than 3 years ago, then the user should be provided with the option to add a second address
      "isAddressHistoryValid", //check if it's more than 3 years
    ]) as {
      userAddresses: () => Address[];
      additionalAddressesNeeded: () => boolean; //true or false
      isAddressHistoryValid: () => boolean; //true or false
    }),
  },
  //used the Spread Operator to allow me to add it all together, otherwise it would one on each line
  methods: {
    addEntry() {
      const nextAddress = { line1: "", postcode: "", dateMovedIn: "" };
      this.$store.commit("addAddress", nextAddress);
    },
    removeEntry(index: number) {
      this.$store.commit("removeAddress", index);
    },
    updateAddress(
      index: number,
      address: { line1: string; postcode: string; dateMovedIn: string }
    ) {
      this.$store.commit("updateAddress", { index, address });
    },
    //postcode requires own update method due to autocompletion from API
    async updatePostcode(index: number, postcode: string) {
      this.postcodeAutocomplete(postcode, index);
      this.updateAddress(index, { ...this.userAddresses[index], postcode });
    },
    async postcodeAutocomplete(postcode: string, index: number) {
      if (!postcode.trim()) {
        // If postcode is empty or only whitespace, clear the options and return
        this.$set(this.postCodeOptions, index, []);
        return;
      }
      const [results, error] = await getPostcode(postcode);
      if (error) {
        console.error(error);
        return;
      }
      this.$set(this.postCodeOptions, index, results || []);
    },
  },
});
</script>
<template>
  <b-container>
    <div
      v-for="(address, index) in userAddresses"
      :key="index"
      class="border p-3 rounded shadow-sm mb-4"
    >
      <AddressInput
        type="text"
        v-model="address.line1"
        label="Address Line 1"
        name="line1"
        @input="updateAddress(index, { ...address, line1: $event })"
        :required="true"
        class="mb-3"
      />
      <AddressInput
        type="text"
        v-model="address.postcode"
        label="Postcode"
        name="postcode"
        @input="updatePostcode(index, $event)"
        :required="true"
        :options="postCodeOptions[index]"
        :showOptions="true"
        class="mb-3"
      />
      <AddressInput
        type="date"
        v-model="address.dateMovedIn"
        label="Date Moved In"
        name="dateMovedIn"
        @input="updateAddress(index, { ...address, dateMovedIn: $event })"
        :required="true"
        class="mb-3"
      />
      <b-button @click="removeEntry(index)" v-if="userAddresses.length > 1"
        >Remove Address</b-button
      >
    </div>
    <b-button
      @click="addEntry"
      v-if="additionalAddressesNeeded && !isAddressHistoryValid"
      class="float-end"
      >Add Address</b-button
    >
  </b-container>
</template>
