<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-center">
      <h1 class="font-semibold tracking-wide text-md">Attendance Reports</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <viewMonthlyReport />
    </div>
  </div>
</template>

<script>
import viewMonthlyReport from "./tables/view-table-monthly-report.vue";
export default {
  name: "StudentRecordsPage",
  components: {
    viewMonthlyReport,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
