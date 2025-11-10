<template>
  <div class="px-2 mt-2">
    <!-- Headers -->
    <div class="flex justify-between items-start">
      <h1 class="font-semibold tracking-wide text-md">HR Templates</h1>
    </div>

    <!-- Main Content  -->
    <div class="mt-3">
      <!-- Table -->
      <tableCoe />
    </div>
  </div>
</template>

<script>
import tableCoe from "./tables/table-coe.vue";
export default {
  name: "CertificateofEmployment",
  components: {
    tableCoe,
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
