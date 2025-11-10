<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-center">
      <h1 class="font-semibold tracking-wide text-md">
        Customer Feedback Form Reports
      </h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <viewTableCustomerFeedbackForm />
    </div>
  </div>
</template>

<script>
import viewTableCustomerFeedbackForm from "./tables/view-table-customer-feedback-form.vue";
export default {
  name: "StudentRecordsPage",
  components: {
    viewTableCustomerFeedbackForm,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
