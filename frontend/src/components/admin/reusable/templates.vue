<template>
  <!-- Main Content -->
  <div class="h-[80hv] 5 z-0 overflow-auto mt-4">
    <EmploymentCertificates />
  </div>
</template>

<script>
import EmploymentCertificates from "./employment-certificates.vue";
export default {
  name: "TemplatePage",
  components: {
    EmploymentCertificates,
  },
};
</script>

<style scoped>
/* Additional styling if needed */
</style>
