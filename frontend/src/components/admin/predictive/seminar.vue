<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-center">
      <h1 class="font-semibold tracking-wide text-md">Seminar Eligibility</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableSeminar />
    </div>
  </div>
</template>

<script>
import tableSeminar from "./tables/table-seminar.vue";
export default {
  name: "SeminarPages",
  components: {
    tableSeminar,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
