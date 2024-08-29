<script lang="ts">
import Vue from "vue";
import InputComponent from "@/components/input.vue";
import { mapGetters } from "vuex";
import { getPostcode } from "@/core/getPostcode";
import { Address } from "@/types";
export default Vue.extend({
  name: "addressComponent",
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
      "needMoreAddresses",
      "isValidAddressHistory",
    ]) as {
      addresses: () => Address[];
      needMoreAddresses: () => boolean;
      isValidAddressHistory: () => boolean;
    }),
  },
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
      this.updateAddress(index, { ...this.addresses[index], postcode });
    },
    async postcodeAutocomplete(postcode: string, index: number) {
      if (!postcode.trim()) {
        // If postcode is empty or only whitespace, clear the options and return
        this.$set(this.postcodeOptions, index, []);
        return;
      }
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
      class="border p-3 rounded shadow-sm mb-4"
    >
      <InputComponent
        type="text"
        v-model="address.line1"
        label="Address Line 1"
        name="line1"
        @input="updateAddress(index, { ...address, line1: $event })"
        :required="true"
        class="mb-3"
      />
      <InputComponent
        type="text"
        v-model="address.postcode"
        label="Postcode"
        name="postcode"
        @input="updatePostcode(index, $event)"
        :required="true"
        :options="postcodeOptions[index]"
        :showOptions="true"
        class="mb-3"
      />
      <InputComponent
        type="date"
        v-model="address.dateMovedIn"
        label="Date Moved In"
        name="dateMovedIn"
        @input="updateAddress(index, { ...address, dateMovedIn: $event })"
        :required="true"
        class="mb-3"
      />
      <b-button @click="removeEntry(index)" v-if="addresses.length > 1"
        >Remove Address</b-button
      >
    </div>
    <b-button
      @click="addEntry"
      v-if="needMoreAddresses && !isValidAddressHistory"
      class="float-end"
      >Add Address</b-button
    >
  </b-container>
</template>
