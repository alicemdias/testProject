<script lang="ts">
import Vue from "vue";
import FormComponent from "@/components/form.vue";
import TextComponent from "@/components/text.vue";
import SubmitComponent from "@/components/submit.vue";
import AddressComponent from "@/components/address.vue";
import { mapGetters } from "vuex";
import { User } from "@/types";
export default Vue.extend({
  name: "FormView",
  components: {
    FormComponent,
    TextComponent,
    SubmitComponent,
    AddressComponent,
  },
  computed: {
    ...(mapGetters(["user", "isAddressHistoryValid"]) as {
      user: () => User;
      isAddressHistoryValid: () => boolean;
    }),
  },
});
</script>
<template>
  <div>
    <FormComponent>
      <template v-slot:title>
        <TextComponent
          :text="`Welcome Back ${user.firstName}`"
          type="h1"
          classes="text-black"
          style="color: black"
        />
      </template>
      <template v-slot:subtitle>
        <TextComponent
          text="Please share your address history for the last 3 years"
          type="h5"
          classes="text-secondary"
        />
      </template>
      <template v-slot:question>
        <AddressComponent />
      </template>
      <template v-slot:submit>
        <p v-if="!isAddressHistoryValid" class="text-danger">
          The last address you provide must be from at least 3 years prior
        </p>
        <SubmitComponent
          :isButtonDisabled="!isAddressHistoryValid"
          isFormSubmission
        />
      </template>
    </FormComponent>
  </div>
</template>
