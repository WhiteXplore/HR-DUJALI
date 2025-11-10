<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4"
  >
    <div
      ref="certificate"
      class="w-[820pt] h-[578pt] text-gray-900 flex flex-col justify-center items-center shadow-md"
      :style="{
        backgroundImage:
          'url(' + require('@/assets/img/a4-certificate.png') + ')',
        backgroundSize: 'contain', // Ensure the image fits within the container
        backgroundRepeat: 'no-repeat', // Avoid repeating the image if it doesn't fill the space
        backgroundPosition: 'center',
        boxSizing: 'border-box',
      }"
    >
      <h1 class="text-4xl font-bold mb-4">Certificate of Employment</h1>
      <p class="text-lg mb-2">This is to certify that</p>

      <input
        v-model="employeeName"
        class="text-3xl font-semibold text-center border-b border-gray-600 w-[400pt] mb-4 bg-transparent focus:outline-none"
      />

      <p class="text-lg text-center max-w-[600pt]">
        has been employed at <strong>Amexem Ministry</strong> as a
        <strong>Staff Member</strong> from <strong>January 1, 2020</strong> to
        <strong>December 31, 2024</strong>.
      </p>

      <p class="mt-4 text-lg">
        Given this day <strong>{{ today }}</strong
        >.
      </p>

      <div class="mt-12 w-full flex justify-end pr-[60pt]">
        <div class="text-right">
          <p class="font-semibold">__________________________</p>
          <p class="text-sm">Authorized Signature</p>
        </div>
      </div>
    </div>

    <div class="text-center mt-6">
      <button
        @click="downloadPDF"
        class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Download PDF (No Blank Page)
      </button>
    </div>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";
export default {
  name: "EmploymentCertificates",
  data() {
    return {
      employeeName: "John Doe",
    };
  },
  computed: {
    today() {
      const date = new Date();
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
  methods: {
    downloadPDF() {
      const element = this.$refs.certificate;

      const opt = {
        margin: 0,
        filename: `${this.employeeName}_Employment_Certificate.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
          unit: "pt",
          format: [820, 578], // A4 landscape
          orientation: "landscape",
        },
        pagebreak: { avoid: "div" },
      };

      html2pdf().set(opt).from(element).save();
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: #f9fafb;
}
</style>
