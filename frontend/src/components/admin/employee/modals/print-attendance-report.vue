<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4"
  >
    <div
      class="bg-white rounded-2xl w-[95%] max-w-[1000px] h-[95vh] shadow-xl relative flex flex-col"
    >
      <!-- Header -->
      <div
        class="p-4 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
      >
        <div class="flex flex-col text-left">
          <h2 class="text-xl font-bold text-gray-800">
            Attendance Report Preview
          </h2>
          <p class="text-sm text-gray-500">
            Summary for {{ selectedMonthName }} {{ criteria.year || "?" }}
          </p>
        </div>
        <!-- Close Button -->
        <button
          @click="$emit('close')"
          class="text-gray-600 font-semibold text-xl z-10"
        >
          ✕
        </button>
        <!-- <div class="flex gap-2">
          <button
            @click="downloadPDF"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Download PDF
          </button>
        </div> -->
      </div>

      <!-- PDF Preview -->
      <div class="flex-1 overflow-hidden relative">
        <iframe
          v-if="pdfUrl && !isGenerating"
          :src="pdfUrl"
          class="w-full h-full border-none"
        ></iframe>

        <div
          v-else
          class="flex items-center justify-center h-full text-gray-500"
        >
          <span v-if="isGenerating">Generating PDF preview...</span>
          <span v-else>No data to display.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

export default {
  name: "printAttendanceReport",

  props: {
    show: Boolean,
    criteria: { type: Object, required: true }, // {month, year}
    reportData: { type: Array, default: () => [] }, // filteredMonthlyReport
    topLateComers: { type: Array, default: () => [] }, // topLateComers
  },

  data() {
    return {
      pdfUrl: null,
      isGenerating: false,
    };
  },

  computed: {
    selectedMonthName() {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return this.criteria.month ? months[this.criteria.month - 1] : "?";
    },
  },

  watch: {
    reportData: {
      handler(newVal) {
        console.log("Report Data changed:", newVal);
        if (this.show && newVal.length) {
          this.generatePreview();
        }
      },
      deep: true,
      immediate: true, // runs immediately on mount
    },
    show(val) {
      if (!val) {
        this.cleanupPdfUrl();
      }
    },
  },

  methods: {
    cleanupPdfUrl() {
      if (this.pdfUrl) {
        URL.revokeObjectURL(this.pdfUrl);
        this.pdfUrl = null;
      }
    },

    buildDocDefinition() {
      const attendanceTableBody = [
        [
          {
            text: "Employee ID",
            bold: true,
            alignment: "left",
            fontSize: 10,
            noWrap: true,
          },
          {
            text: "Name",
            bold: true,
            alignment: "left",
            fontSize: 10,
            noWrap: true,
          },
          {
            text: "Present",
            bold: true,
            alignment: "center",
            fontSize: 10,
            noWrap: true,
          },
          {
            text: "Absent",
            bold: true,
            alignment: "center",
            fontSize: 10,
            noWrap: true,
          },
          {
            text: "Late",
            bold: true,
            alignment: "center",
            fontSize: 10,
            noWrap: true,
          },
          {
            text: "Total Hours",
            bold: true,
            alignment: "center",
            fontSize: 10,
            noWrap: true,
          },
          {
            text: "Undertime",
            bold: true,
            alignment: "center",
            fontSize: 10,
            noWrap: true,
          },
          {
            text: "Remarks",
            bold: true,
            alignment: "center",
            fontSize: 10,
            noWrap: true,
          },
        ],
        ...this.reportData.map((emp) => [
          {
            text: emp.employee_id || "-",
            alignment: "left",
            fontSize: 9,
            noWrap: true,
            margin: [0, 2],
          },
          {
            text: emp.name || "-",
            alignment: "left",
            fontSize: 9,
            noWrap: true,
            margin: [0, 2],
          },
          {
            text: emp.daysPresent ?? 0,
            alignment: "center",
            fontSize: 9,
            noWrap: true,
            margin: [0, 2],
          },
          {
            text: emp.daysAbsent ?? 0,
            alignment: "center",
            fontSize: 9,
            noWrap: true,
            margin: [0, 2],
          },
          {
            text: emp.lates ?? 0,
            alignment: "center",
            fontSize: 9,
            noWrap: true,
            margin: [0, 2],
          },
          {
            text: emp.totalHours ?? 0,
            alignment: "center",
            fontSize: 9,
            noWrap: true,
            margin: [0, 2],
          },
          {
            text: emp.totalUnderTime ?? 0,
            alignment: "center",
            fontSize: 9,
            noWrap: true,
            margin: [0, 2],
          },
          {
            text: emp.lates > 3 ? "Frequent Latecomer" : "",
            alignment: "center",
            fontSize: 9,
            noWrap: true,
            margin: [0, 2],
          },
        ]),
      ];

      return {
        pageSize: { width: 612, height: 936 }, // Folio size in points (8.5"x13")
        pageOrientation: "portrait",
        pageMargins: [25, 20, 20, 25], // narrow margins
        defaultStyle: { fontSize: 10, color: "#111827", font: "Roboto" },
        content: [
          { text: "Republic of the Philippines", style: "govHeader" },
          { text: "Province of Davao del Norte", style: "govSubHeader" },
          {
            text: "Municipality of Braulio E. Dujali",
            style: "govSubHeader",
            margin: [0, 0, 0, 10],
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 572, // full width minus margins
                y2: 0,
                lineWidth: 1,
                lineColor: "#d1d5db",
              },
            ],
            margin: [0, 0, 0, 10],
          },
          {
            text: "ATTENDANCE REPORT",
            style: "reportTitle",
            fontSize: 10,
            margin: [0, 0, 0, 5],
          },
          {
            text: `Month: ${this.selectedMonthName} ${
              this.criteria.year || ""
            }`,
            style: "subTitle",
            margin: [0, 0, 0, 10],
          },
          // { text: "Employee Attendance Summary", style: "sectionHeader" },
          {
            table: {
              headerRows: 1,
              widths: [
                "auto",
                "*",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
                "auto",
              ],
              body: attendanceTableBody,
            },
            layout: {
              fillColor: (rowIndex) => (rowIndex === 0 ? "#f3f4f6" : null),
              hLineWidth: () => 0.4,
              vLineWidth: () => 0.4,
              hLineColor: () => "#d1d5db",
              vLineColor: () => "#d1d5db",
              paddingLeft: () => 4, // wider horizontal padding
              paddingRight: () => 4,
              paddingTop: () => 6, // taller row
              paddingBottom: () => 6,
            },

            margin: [0, 0, 0, 5],
          },
        ],
        styles: {
          govHeader: { fontSize: 11, bold: true, alignment: "center" },
          govSubHeader: { fontSize: 10, alignment: "center" },
          reportTitle: { fontSize: 13, bold: true, alignment: "center" },
          subTitle: { fontSize: 10, alignment: "center" },
          sectionHeader: { fontSize: 11, bold: true, margin: [0, 5, 0, 5] },
        },
      };
    },

    generatePreview() {
      if (!this.reportData.length) return;
      this.isGenerating = true;

      try {
        const docDefinition = this.buildDocDefinition();

        pdfMake.createPdf(docDefinition).getBlob((blob) => {
          this.cleanupPdfUrl(); // revoke previous URL if any
          this.pdfUrl = URL.createObjectURL(blob);
          this.isGenerating = false;
        });
      } catch (err) {
        console.error("PDF generation error:", err);
        this.isGenerating = false;
      }
    },

    downloadPDF() {
      if (!this.reportData.length) return;
      const docDefinition = this.buildDocDefinition();
      pdfMake
        .createPdf(docDefinition)
        .download(
          `Attendance_Report_${this.selectedMonthName}_${this.criteria.year}.pdf`
        );
    },
  },
};
</script>

<style scoped>
iframe {
  background: #f9fafb;
  border-radius: 0.5rem;
}
</style>
