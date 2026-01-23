<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4"
  >
    <div
      class="bg-white rounded-2xl w-[50vw] h-[95vh] shadow-xl relative flex flex-col"
    >
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-red-600 font-semibold text-xl z-10"
      >
        ✕
      </button>

      <!-- Header -->
      <div class="p-4 border-b">
        <h2 class="text-xl font-bold text-gray-800 text-center">
          Promotion Eligibility Report (Preview)
        </h2>
      </div>

      <!-- PDF Preview -->
      <div class="flex-1 overflow-hidden">
        <iframe
          v-if="pdfUrl"
          :src="pdfUrl"
          class="w-full h-full border-none"
        ></iframe>

        <div
          v-else
          class="flex items-center justify-center h-full text-gray-500"
        >
          Loading PDF preview...
        </div>
      </div>

      <!-- Actions -->
      <div class="p-4 border-t flex justify-end gap-3">
        <button
          @click="downloadPDF"
          class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
    criteria: Object, // <-- criteria from parent
    currentPromotionDate: String,
    endPromotionDate: String,
  },

  data() {
    return {
      pdfUrl: null,
    };
  },

  computed: {
    formattedBirthdate() {
      if (!this.employeeData?.birthdate) return "—";
      const date = new Date(this.employeeData.birthdate);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    criteriaTableBody() {
      if (!this.criteria) return [];

      return [
        {
          label: "Age Requirement",
          description: `Must be at least ${
            this.criteria.age_requirement ?? "—"
          } years old`,
        },
        {
          label: "Education Requirement",
          description: `Must have completed: ${
            this.criteria.education_requirement?.join(", ") ?? "—"
          }`,
        },
        {
          label: "Work Experience Requirement",
          description: `Must have at least ${
            this.criteria.work_experience_requirement ?? "—"
          } years of experience`,
        },
        {
          label: "Commendation Count Requirement",
          description: `Must have at least ${
            this.criteria.commendation_count_requirement ?? "—"
          } commendations`,
        },
        {
          label: "Commendation Hours Requirement",
          description: `Must have at least ${
            this.criteria.commendation_hours_requirement ?? "—"
          } commendation hours`,
        },
        {
          label: "Attendance Hours Requirement",
          description: `Must have at least ${
            this.criteria.attendance_hours_requirement ?? "—"
          } hours`,
        },
      ].map((row) => [
        { text: row.label, style: "tableCellBold" },
        { text: row.description, style: "tableCell" },
        {
          text: "Met", // Always MET
          alignment: "center",
          bold: true,
          color: "#166534",
          fontSize: 10,
          margin: [0, 4, 0, 4],
        },
      ]);
    },
  },

  watch: {
    show(val) {
      if (val) {
        this.generatePreview();
      } else {
        this.pdfUrl = null;
      }
    },
    criteria: {
      immediate: true,
      handler() {
        if (this.show) this.generatePreview();
        console.log("Updated criteria prop:", this.criteria);
      },
    },
  },

  methods: {
    buildDocDefinition() {
      const tableBody = [
        [
          { text: "CRITERIA", style: "tableHeader" },
          { text: "DESCRIPTION", style: "tableHeader" },
          { text: "STATUS", style: "tableHeader", alignment: "center" },
        ],
        ...this.criteriaTableBody,
      ];

      return {
        pageSize: { width: 612, height: 936 }, // Long bond
        pageMargins: [50, 50, 50, 60],
        defaultStyle: { fontSize: 11, color: "#111827" },
        content: [
          { text: "Republic of the Philippines", style: "govHeader" },
          { text: "Province of Davao del Norte", style: "govSubHeader" },
          {
            text: "Municipality of Braulio E. Dujali",
            style: "govSubHeader",
            margin: [0, 0, 0, 15],
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 512,
                y2: 0,
                lineWidth: 1,
                lineColor: "#d1d5db",
              },
            ],
            margin: [0, 0, 0, 15],
          },
          {
            text: "PROMOTION ELIGIBILITY REPORT",
            style: "reportTitle",
            margin: [0, 0, 0, 20],
          },

          // Employee Info
          { text: "EMPLOYEE INFORMATION", style: "sectionHeader" },
          {
            table: {
              widths: ["35%", "*"],
              body: [
                [
                  "Full Name",
                  `${this.employeeData?.first_name || "—"} ${
                    this.employeeData?.last_name || "—"
                  }`,
                ],
                ["Age", this.employeeData?.age ?? "—"],
                ["Birthdate", this.formattedBirthdate],
                ["Designation", this.employeeData?.present_designation || "—"],
                [
                  "Overall Eligibility",
                  { text: "ELIGIBLE", bold: true, color: "#166534" },
                ],
              ],
            },
            layout: {
              fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#f9fafb" : null),
              paddingLeft: () => 8,
              paddingRight: () => 8,
              paddingTop: () => 6,
              paddingBottom: () => 6,
            },
            margin: [0, 0, 0, 20],
          },

          // Criteria Section
          { text: "ELIGIBILITY CRITERIA EVALUATION", style: "sectionHeader" },
          {
            table: {
              headerRows: 1,
              widths: ["30%", "50%", "20%"], // adjust column widths
              body: tableBody,
            },
            layout: {
              fillColor: (rowIndex) => (rowIndex === 0 ? "#f3f4f6" : null),
              paddingLeft: () => 8,
              paddingRight: () => 8,
              paddingTop: () => 6,
              paddingBottom: () => 6,
            },
            margin: [0, 0, 0, 20],
          },
          // Promotion Details
          { text: "PROMOTION DETAILS", style: "sectionHeader" },
          {
            table: {
              widths: ["40%", "*"],
              body: [
                ["Current Promotion Date", this.currentPromotionDate || "—"],
                ["End Promotion Date", this.endPromotionDate || "Present"],
                ["Criteria Met", { text: "Yes", bold: true, color: "#166534" }],
              ],
            },
            layout: {
              fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#f9fafb" : null),
              paddingLeft: () => 8,
              paddingRight: () => 8,
              paddingTop: () => 6,
              paddingBottom: () => 6,
            },
            margin: [0, 0, 0, 20],
          },
        ],
        styles: {
          govHeader: { fontSize: 12, bold: true, alignment: "center" },
          govSubHeader: {
            fontSize: 10.5,
            alignment: "center",
            color: "#374151",
          },
          reportTitle: {
            fontSize: 12,
            bold: true,
            alignment: "center",
            letterSpacing: 0.5,
          },
          sectionHeader: {
            fontSize: 11,
            bold: true,
            margin: [0, 10, 0, 6],
            color: "#1f2937",
          },
          tableHeader: {
            fontSize: 9,
            bold: true,
            color: "#1f2937",
            alignment: "center",
          },
          tableCell: { fontSize: 10 },
          tableCellBold: { fontSize: 10, bold: true },
        },
      };
    },

    generatePreview() {
      if (!this.employeeData) return;
      const docDefinition = this.buildDocDefinition();
      pdfMake.createPdf(docDefinition).getDataUrl((dataUrl) => {
        this.pdfUrl = dataUrl;
      });
    },

    downloadPDF() {
      if (!this.employeeData) return;
      const docDefinition = this.buildDocDefinition();
      pdfMake
        .createPdf(docDefinition)
        .download(
          `${this.employeeData.first_name}_${this.employeeData.last_name}_Promotion.pdf`
        );
    },
  },

  mounted() {
    console.log("Criteria prop on mount:", this.criteria);
  },
};
</script>

<style scoped>
iframe {
  background: #f9fafb;
}
</style>
