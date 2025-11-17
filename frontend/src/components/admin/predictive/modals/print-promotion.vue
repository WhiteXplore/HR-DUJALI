<!-- PrintableModal.vue -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4"
  >
    <div
      class="bg-white rounded-2xl w-full max-w-3xl p-8 shadow-xl relative overflow-y-auto max-h-[95vh]"
    >
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-red-600 font-semibold text-xl"
      >
        ✕
      </button>

      <!-- Header -->
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">
        Promotion Eligibility Report
      </h2>

      <!-- Section: Employee Information -->
      <div class="border rounded-lg p-5 bg-gray-50 shadow-sm">
        <h3 class="text-lg font-semibold mb-3 text-gray-700">
          Employee Information
        </h3>

        <div class="grid grid-cols-2 gap-3 text-sm text-gray-700">
          <p>
            <strong>Name:</strong> {{ employeeData.first_name }}
            {{ employeeData.last_name }}
          </p>
          <p><strong>Age:</strong> {{ employeeData.age }}</p>
          <p><strong>Birthdate:</strong> {{ formattedBirthdate }}</p>
          <p>
            <strong>Designation:</strong> {{ employeeData.present_designation }}
          </p>

          <p class="col-span-2">
            <strong>Promotion Eligibility:</strong>
            <span
              v-if="predictionData.eligible"
              class="text-green-600 font-semibold"
            >
              Eligible
            </span>
            <span v-else class="text-red-600 font-semibold">Not Eligible</span>
          </p>
        </div>
      </div>

      <!-- Section: Criteria -->
      <div class="mt-8">
        <h3 class="text-lg font-semibold text-gray-700 mb-3">
          Eligibility Criteria Evaluation
        </h3>

        <div class="border rounded-xl overflow-hidden shadow-md">
          <table class="w-full text-sm">
            <thead class="bg-gray-200 text-gray-700">
              <tr>
                <th class="p-3 text-left w-1/4">Criteria</th>
                <th class="p-3 text-left w-2/4">Description</th>
                <th class="p-3 text-center w-1/4">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, key) in criteria"
                :key="key"
                class="border-t hover:bg-gray-50 transition"
              >
                <td class="p-3 font-semibold">{{ item.title }}</td>
                <td class="p-3 text-gray-600">{{ item.description }}</td>
                <td
                  class="p-3 text-center font-semibold"
                  :class="item.met ? 'text-green-600' : 'text-red-600'"
                >
                  {{ item.met ? "Requirement Met" : "Not Met" }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-6 flex justify-end gap-3">
        <button
          @click="downloadPDF"
          class="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Download PDF
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

export default {
  name: "PrintableModal",
  props: {
    show: Boolean,
    employeeData: Object,
    predictionData: Object,
    criteria: Object,
  },

  computed: {
    formattedBirthdate() {
      if (!this.employeeData?.birthdate) return "";
      const date = new Date(this.employeeData.birthdate);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },

  methods: {
    downloadPDF() {
      const criteriaTable = [
        [
          { text: "Criteria", style: "tableHeader" },
          { text: "Description", style: "tableHeader" },
          { text: "Status", style: "tableHeader", alignment: "center" },
        ],

        ...Object.values(this.criteria).map((c) => [
          { text: c.title, bold: true },
          c.description,
          {
            text: c.met ? "Requirement Met" : "Not Met",
            color: c.met ? "green" : "red",
            alignment: "center",
            bold: true,
          },
        ]),
      ];

      const docDefinition = {
        pageSize: "A4",
        pageMargins: [45, 45, 45, 45],

        content: [
          {
            text: "Promotion Eligibility Report",
            style: "header",
          },

          { text: "\n" },

          {
            style: "sectionHeader",
            text: "Employee Information",
          },

          {
            style: "infoTable",
            table: {
              widths: ["30%", "*"],
              body: [
                [
                  "Name:",
                  `${this.employeeData.first_name} ${this.employeeData.last_name}`,
                ],
                ["Age:", this.employeeData.age],
                ["Birthdate:", this.formattedBirthdate],
                ["Designation:", this.employeeData.present_designation],
                [
                  "Eligibility:",
                  this.predictionData.eligible ? "Eligible" : "Not Eligible",
                ],
              ],
            },
            layout: "lightHorizontalLines",
          },

          { text: "\n" },

          { text: "Eligibility Criteria Evaluation", style: "sectionHeader" },

          {
            table: {
              widths: ["25%", "55%", "20%"],
              body: criteriaTable,
            },
            layout: "lightHorizontalLines",
          },
        ],

        styles: {
          header: {
            fontSize: 20,
            bold: true,
            alignment: "center",
            margin: [0, 0, 0, 10],
          },
          sectionHeader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 6],
          },
          tableHeader: {
            bold: true,
            fillColor: "#e5e7eb",
            color: "#374151",
            margin: [0, 3],
          },
          infoTable: {
            margin: [0, 0, 0, 10],
          },
        },
      };

      pdfMake
        .createPdf(docDefinition)
        .download(
          `${this.employeeData.first_name}_${this.employeeData.last_name}_Promotion.pdf`
        );
    },
  },
};
</script>

<style scoped>
/* clean modern modal */
</style>
