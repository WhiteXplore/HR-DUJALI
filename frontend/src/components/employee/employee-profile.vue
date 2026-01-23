<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-center">
      <h1 class="font-semibold tracking-wide text-md">Employee Profile</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableViewEmployeeProfile />
    </div>
  </div>
</template>

<script>
import tableViewEmployeeProfile from "./tables/table-view-employee-profile.vue";
export default {
  name: "StudentRecordsPage",
  components: {
    tableViewEmployeeProfile,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
