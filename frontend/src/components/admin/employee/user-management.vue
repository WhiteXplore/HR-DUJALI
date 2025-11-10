<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">User Management</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableUserManagement />
    </div>
  </div>
</template>

<script>
import tableUserManagement from "./tables/table-user-management.vue";
export default {
  name: "ServiceOfRecords",
  components: {
    tableUserManagement,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
