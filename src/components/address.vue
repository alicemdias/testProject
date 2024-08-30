<script lang="ts">
import Vue from "vue";
import { getPostcode } from "@/core/getPostcode";
import { Address } from "@/types";
import { mapGetters } from "vuex";
import InputComponent from "@/components/input.vue";
export default Vue.extend({
  // Name of the component
  name: "AddressComponent",
  components: {
    InputComponent,
  },
  data() {
    return {
      postcodeOptions: [],
    };
  },
  computed: {
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
    //The block should not let the form submit if the user has not provided more than 3 years of address history from the time of submission.
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
    //The postcode input should support autocomplete using an api from https://postcodes.io/ to improve the user experience.
    async updatePostcode(index: number, postcode: string) {
      this.postcodeAutocomplete(postcode, index);
      this.updateAddress(index, { ...this.addresses[index], postcode });
    },
    async postcodeAutocomplete(postcode: string, index: number) {
      if (!postcode.trim()) {
        this.$set(this.postcodeOptions, index, []);
        return;
      }
      //The block should prevent form submission if an address has not been entered.
      const [results, error] = await getPostcode(postcode);
      if (error) {
        console.error(error);
        return;
      }
      this.$set(this.postcodeOptions, index, results || []);
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
