<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-center">
      <h1 class="font-semibold tracking-wide text-md">My Service of Records</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableViewServiceOfRecords />
    </div>
  </div>
</template>

<script>
import tableViewServiceOfRecords from "./tables/table-view-service-of-records.vue";
export default {
  name: "StudentRecordsPage",
  components: {
    tableViewServiceOfRecords,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
