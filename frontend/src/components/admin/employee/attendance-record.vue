<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">Attendance Records</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableAttendanceRecords />
    </div>
  </div>
</template>

<script>
import tableAttendanceRecords from "./tables/table-attendance-records.vue";
export default {
  name: "AttendanceRecords",
  components: {
    tableAttendanceRecords,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
