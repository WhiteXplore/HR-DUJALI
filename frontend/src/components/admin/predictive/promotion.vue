<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-center">
      <h1 class="font-semibold tracking-wide text-md">Promotion</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tablePromotion />
    </div>
  </div>
</template>

<script>
import tablePromotion from "./tables/table-promotion.vue";
export default {
  name: "SeminarPages",
  components: {
    tablePromotion,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
