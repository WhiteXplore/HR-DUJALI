<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-center">
      <h1 class="font-semibold tracking-wide text-md">Available Trainings</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableAvailableTrainings />
    </div>
  </div>
</template>

<script>
import tableAvailableTrainings from "./tables/table-available-trainings.vue";
export default {
  name: "AvailableTrainingsPage",
  components: {
    tableAvailableTrainings,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
