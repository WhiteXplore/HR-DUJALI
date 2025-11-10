<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Service Records</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableServiceOfRecords />
    </div>
  </div>
</template>

<script>
import tableServiceOfRecords from "./tables/table-service-of-records.vue";
export default {
  name: "ServiceOfRecords",
  components: {
    tableServiceOfRecords,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
