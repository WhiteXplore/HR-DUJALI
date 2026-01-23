<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-center">
      <h1 class="font-semibold tracking-wide text-md">My Attendance Records</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableViewAttendanceRecords />
    </div>
  </div>
</template>

<script>
import tableViewAttendanceRecords from "./tables/table-view-attendance-records.vue";
export default {
  name: "StudentRecordsPage",
  components: {
    tableViewAttendanceRecords,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
