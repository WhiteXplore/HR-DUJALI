<template>
  <div class="mt-4 overflow-x-auto border p-2 rounded-xl" v-if="isOpenView">
    <div class="p-2">
      <!-- Back & Action Buttons -->
      <div class="flex justify-between">
        <div
          @click="toggleBack"
          class="cursor-pointer text-red-800 hover:text-white border-red-800 border p-2 py-1 rounded-md hover:bg-red-800"
        >
          Back
        </div>
        <div class="flex gap-2">
          <button
            @click="previewPDF"
            class="px-2 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition text-sm"
          >
            Preview PDF
          </button>
          <button
            @click="downloadPDF"
            class="px-2 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div class="max-h-screen h-[80vh] overflow-auto">
        <div ref="certificate" class="bg-white p-5 text-gray-900 relative">
          <div v-if="matchingRecord" class="p-5">
            <!-- Header -->
            <div class="text-center font-semibold">
              <h1>Republic of the Philippines</h1>
              <h1>Province of Davao del Norte</h1>
              <h1>Municipality of Braulio E. Dujali</h1>
              <h1 class="mt-5 font-bold text-lg">Service Record</h1>
            </div>

            <!-- Employee Profile -->
            <div class="text-left mt-5 text-sm">
              <div class="flex gap-[40px] under">
                <h2>Full Name:</h2>
                <p class="underline font-bold">
                  {{ matchingRecord.first_name }}
                  {{ matchingRecord.middle_name }}
                  {{ matchingRecord.last_name }}
                </p>
              </div>
              <div class="flex gap-[27px] under">
                <h2>Date of Birth:</h2>
                <p class="underline font-bold">
                  {{ formatDate(matchingRecord.birthdate) }}
                </p>
              </div>
              <div class="flex gap-[22px] under">
                <h2>Place of Birth:</h2>
                <p class="underline font-bold">
                  {{ matchingRecord.birth_place }}
                </p>
              </div>
            </div>

            <!-- Sub Header -->
            <div class="text-justify mt-5 text-sm">
              This is to certify that the employee named herein above actually
              rendered services in this Office as shown by the service record
              below, each line of which is supported by appointment and other
              papers actually issued by this Office and approved by the
              authorities concerned.
            </div>

            <!-- Service Records Table -->
            <div>
              <table class="min-w-full text-xs border mt-5">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border border-gray-500 px-2 py-2" colspan="2">
                      PERIOD
                    </th>
                    <th class="border border-gray-500 px-2 py-2" colspan="6">
                      RECORD OF APPOINTMENT
                    </th>
                    <th class="border border-gray-500 px-2 py-2" rowspan="2">
                      OFFICE
                    </th>
                    <th class="border border-gray-500 px-2 py-2" rowspan="2">
                      REMARKS
                    </th>
                  </tr>
                  <tr>
                    <th class="border border-gray-500 px-2 py-2">FROM</th>
                    <th class="border border-gray-500 px-2 py-2">TO</th>
                    <th class="border border-gray-500 px-2 py-2">
                      DESIGNATION
                    </th>
                    <th class="border border-gray-500 px-2 py-2">SG</th>
                    <th class="border border-gray-500 px-2 py-2">STEP</th>
                    <th class="border border-gray-500 px-2 py-2">STATUS</th>
                    <th class="border border-gray-500 px-2 py-2" colspan="2">
                      BASIC SALARY
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(record, index) in matchingRecord.serviceRecords"
                    :key="index"
                  >
                    <td
                      class="border border-gray-500 px-2 py-1 text-[14px] text-center"
                    >
                      {{ record.period_from }}
                    </td>
                    <td
                      class="border border-gray-500 px-2 py-2 text-[14px] text-center"
                    >
                      {{ record.period_to }}
                    </td>
                    <td
                      class="border border-gray-500 px-2 py-2 text-[14px] text-center"
                    >
                      {{ record.roa_designation }}
                    </td>
                    <td
                      class="border border-gray-500 px-2 py-2 text-[14px] text-center"
                    >
                      {{ record.roa_sg }}
                    </td>
                    <td
                      class="border border-gray-500 px-2 py-2 text-[14px] text-center"
                    >
                      {{ record.roa_step }}
                    </td>
                    <td
                      class="border border-gray-500 px-2 py-2 text-[14px] text-center"
                    >
                      {{ record.roa_status }}
                    </td>
                    <td
                      class="border border-gray-500 px-2 py-2 text-[14px] text-center"
                    >
                      {{ record.roa_basic_salary }}
                    </td>
                    <td
                      class="border border-gray-500 px-2 py-2 text-[14px] text-center"
                    >
                      {{ record.roa_basic_salary_day }}
                    </td>
                    <td
                      class="border border-gray-500 px-2 py-2 text-[14px] text-center"
                    >
                      {{ record.office }}
                    </td>
                    <td
                      class="border border-gray-500 px-2 py-2 text-[14px] text-center"
                    >
                      {{ record.remarks }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="text-justify mt-5 text-sm">
              Issued in compliance with Executive Order No. 54 dated August 10,
              1954 and Circular No. 58 dated August 10, 1954 of the System.
            </div>

            <div class="mt-8 items-start text-sm flex justify-between">
              <h1>Certified Correct</h1>
              <div class="text-center space-y-1 font-bold">
                <p class="text-[14px]">ERMALYN C. BONSO-GANOTISE, MPA</p>
                <p class="text-[12px]">Administrative Officer IV</p>
                <p class="text-[12px]">
                  (Human Resource Management Officer II)
                </p>
              </div>
            </div>
          </div>

          <div v-else>No matching record found.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

export default {
  name: "ViewServiceRecords",
  props: { serviceId: { type: String, required: true } },
  data() {
    return {
      isOpenView: true,
      matchingRecord: null,
    };
  },
  methods: {
    toggleBack() {
      this.$emit("back-to-table-service");
    },

    // Download PDF in Long Bond Landscape
    downloadPDF() {
      if (!this.matchingRecord) return alert("No record to download!");

      const pageSize = { width: 935, height: 612 }; // Landscape Long Bond
      const pageOrientation = "landscape";

      const tableBody = [
        [
          "FROM",
          "TO",
          "DESIGNATION",
          "SG",
          "STEP",
          "STATUS",
          "BASIC SALARY",
          "BASIC SALARY/DAY",
          "OFFICE",
          "REMARKS",
        ],
      ];

      (this.matchingRecord.serviceRecords || []).forEach((r) => {
        tableBody.push([
          r.period_from ?? "",
          r.period_to ?? "",
          r.roa_designation ?? "",
          r.roa_sg ?? "",
          r.roa_step ?? "",
          r.roa_status ?? "",
          r.roa_basic_salary ?? "",
          r.roa_basic_salary_day ?? "",
          r.office ?? "",
          r.remarks ?? "",
        ]);
      });

      const docDefinition = {
        pageSize,
        pageOrientation,
        content: [
          { text: "Republic of the Philippines", style: "header" },
          { text: "Province of Davao del Norte", style: "header" },
          { text: "Municipality of Braulio E. Dujali", style: "header" },
          {
            text: "Service Record",
            style: "subheader",
            margin: [0, 10, 0, 10],
          },
          {
            columns: [
              { width: 120, text: "Full Name:" },
              {
                text: `${this.matchingRecord.first_name ?? ""} ${
                  this.matchingRecord.middle_name ?? ""
                } ${this.matchingRecord.last_name ?? ""}`,
                bold: true,
              },
            ],
          },
          {
            columns: [
              { width: 120, text: "Date of Birth:" },
              {
                text: this.matchingRecord.birthdate
                  ? this.formatDate(this.matchingRecord.birthdate)
                  : "",
                bold: true,
              },
            ],
          },
          {
            columns: [
              { width: 120, text: "Place of Birth:" },
              { text: this.matchingRecord.birth_place ?? "", bold: true },
            ],
          },
          {
            text: "\nThis is to certify that the employee named herein above actually rendered services in this Office as shown by the service record below.",
            margin: [0, 10, 0, 10],
          },
          {
            table: {
              headerRows: 1,
              widths: Array(10).fill("*"),
              body: tableBody,
            },
            layout: { fillColor: (i) => (i === 0 ? "#CCCCCC" : null) },
          },
          {
            text: "\nIssued in compliance with Executive Order No. 54 dated August 10, 1954 and Circular No. 58 dated August 10, 1954 of the System.",
            margin: [0, 10, 0, 10],
          },
          {
            columns: [
              { text: "Certified Correct" },
              {
                text: "ERMALYN C. BONSO-GANOTISE, MPA\nAdministrative Officer IV\n(Human Resource Management Officer II)",
                alignment: "center",
                bold: true,
              },
            ],
          },
        ],
        styles: {
          header: { fontSize: 14, bold: true, alignment: "center" },
          subheader: { fontSize: 12, bold: true, alignment: "center" },
        },
        defaultStyle: { fontSize: 10 },
      };

      pdfMake.createPdf(docDefinition).download("service_record.pdf");
    },

    // Preview PDF in new window
    previewPDF() {
      if (!this.matchingRecord) return alert("No record to preview!");

      const pageSize = { width: 935, height: 612 }; // Landscape Long Bond
      const pageOrientation = "landscape";

      const tableBody = [
        [
          "FROM",
          "TO",
          "DESIGNATION",
          "SG",
          "STEP",
          "STATUS",
          "BASIC SALARY",
          "BASIC SALARY/DAY",
          "OFFICE",
          "REMARKS",
        ],
      ];

      (this.matchingRecord.serviceRecords || []).forEach((r) => {
        tableBody.push([
          r.period_from ?? "",
          r.period_to ?? "",
          r.roa_designation ?? "",
          r.roa_sg ?? "",
          r.roa_step ?? "",
          r.roa_status ?? "",
          r.roa_basic_salary ?? "",
          r.roa_basic_salary_day ?? "",
          r.office ?? "",
          r.remarks ?? "",
        ]);
      });

      const docDefinition = {
        pageSize,
        pageOrientation,
        content: [
          { text: "Republic of the Philippines", style: "header" },
          { text: "Province of Davao del Norte", style: "header" },
          { text: "Municipality of Braulio E. Dujali", style: "header" },
          {
            text: "Service Record",
            style: "subheader",
            margin: [0, 10, 0, 10],
          },
          {
            columns: [
              { width: 120, text: "Full Name:" },
              {
                text: `${this.matchingRecord.first_name ?? ""} ${
                  this.matchingRecord.middle_name ?? ""
                } ${this.matchingRecord.last_name ?? ""}`,
                bold: true,
              },
            ],
          },
          {
            columns: [
              { width: 120, text: "Date of Birth:" },
              {
                text: this.matchingRecord.birthdate
                  ? this.formatDate(this.matchingRecord.birthdate)
                  : "",
                bold: true,
              },
            ],
          },
          {
            columns: [
              { width: 120, text: "Place of Birth:" },
              { text: this.matchingRecord.birth_place ?? "", bold: true },
            ],
          },
          {
            text: "\nThis is to certify that the employee named herein above actually rendered services in this Office as shown by the service record below.",
            margin: [0, 10, 0, 10],
          },
          {
            table: {
              headerRows: 1,
              widths: Array(10).fill("*"),
              body: tableBody,
            },
            layout: { fillColor: (i) => (i === 0 ? "#CCCCCC" : null) },
          },
          {
            text: "\nIssued in compliance with Executive Order No. 54 dated August 10, 1954 and Circular No. 58 dated August 10, 1954 of the System.",
            margin: [0, 10, 0, 10],
          },
          {
            columns: [
              { text: "Certified Correct" },
              {
                text: "ERMALYN C. BONSO-GANOTISE, MPA\nAdministrative Officer IV\n(Human Resource Management Officer II)",
                alignment: "center",
                bold: true,
              },
            ],
          },
        ],
        styles: {
          header: { fontSize: 14, bold: true, alignment: "center" },
          subheader: { fontSize: 12, bold: true, alignment: "center" },
        },
        defaultStyle: { fontSize: 10 },
      };

      pdfMake.createPdf(docDefinition).open();
    },

    fetchServiceRecords() {
      axios
        .get(
          `${process.env.VUE_APP_API_BASE_URL}/service-of-records/${this.serviceId}`
        )
        .then((res) => {
          this.matchingRecord = res.data || null;
        })
        .catch((err) => console.error("Error fetching service record:", err));
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
    },
  },

  mounted() {
    this.fetchServiceRecords();
  },
};
</script>

<style scoped>
/* Optional: add your styling here */
</style>
