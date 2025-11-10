<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-center">
      <h1 class="font-semibold tracking-wide text-md">Employee Profile</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableEmployeeProfile />
    </div>
  </div>
</template>

<script>
import tableEmployeeProfile from "./tables/table-employee-profile.vue";
export default {
  name: "StudentRecordsPage",
  components: {
    tableEmployeeProfile,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
