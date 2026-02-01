<template>
  <div class="mt-4 overflow-x-auto border p-2 rounded-xl" v-if="isOpenView">
    <div class="p-2">
      <!-- Back & Action Buttons -->
      <div class="flex justify-between">
        <div
          @click="toggleEdit"
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-green-500 text-white text-sm hover:text-green-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-green-900 hover:shadow-lg transition-all duration-300"
        >
          Edit
        </div>
        <div class="flex gap-2">
          <button
            @click="previewPDF"
            class="cursor-pointer flex gap-2 items-center tracking-wider bg-yellow-500 text-white text-sm hover:text-yellow-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-yellow-900 hover:shadow-lg transition-all duration-300"
          >
            Preview PDF
          </button>
          <button
            @click="downloadPDF"
            class="cursor-pointer flex gap-2 items-center tracking-wider bg-blue-500 text-white text-sm hover:text-blue-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-blue-900 hover:shadow-lg transition-all duration-300"
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
              <div class="flex justify-between">
                <div class="flex gap-[40px] under">
                  <h2>Full Name:</h2>
                  <p class="font-bold">
                    {{ matchingRecord.first_name }}
                    {{ matchingRecord.middle_name }}
                    {{ matchingRecord.last_name }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <h2 class="font-semibold">Status:</h2>
                  <span
                    class="px-3 py-1 rounded-full text-white text-xs font-bold"
                    :class="{
                      'bg-green-500':
                        matchingRecord.service_status === 'Verified',
                      'bg-yellow-500':
                        matchingRecord.service_status === 'Pending',
                      'bg-red-500':
                        matchingRecord.service_status === 'Rejected',
                      'bg-gray-400': !matchingRecord.service_status,
                    }"
                  >
                    {{ matchingRecord.service_status || "Not Yet Verified" }}
                  </span>
                </div>
              </div>

              <div class="flex gap-[27px] under">
                <h2>Date of Birth:</h2>
                <p class="font-bold">
                  {{ formatDate(matchingRecord.birthdate) }}
                </p>
              </div>
              <div class="flex gap-[22px] under">
                <h2>Place of Birth:</h2>
                <p class="font-bold">
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
  <editServiceOfRecords
    v-if="isEditServiceOFREcords"
    :employeeServiceRecord="selectedEmployeeServiceRecord"
    @close="closeEdit"
    @employee-updated="onEmployeeUpdated"
  />
</template>

<script>
import axios from "axios";
import editServiceOfRecords from "../modals/edit-service-of-records.vue";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

export default {
  name: "ViewServiceRecords",
  components: {
    editServiceOfRecords,
  },
  data() {
    return {
      isOpenView: true,
      matchingRecord: null,
      user: null,
      isEditServiceOFREcords: false, // toggle edit modal
      selectedEmployeeServiceRecord: null, // record to send to modal
    };
  },

  methods: {
    toggleEdit() {
      if (!this.matchingRecord) return;
      this.selectedEmployeeServiceRecord = this.matchingRecord; // send record to modal
      this.isEditServiceOFREcords = true; // open modal
    },

    closeEdit() {
      this.isEditServiceOFREcords = false;
      this.selectedEmployeeServiceRecord = null;
    },

    onEmployeeUpdated(updatedRecord) {
      this.matchingRecord = { ...updatedRecord }; // update local data
      this.closeEdit();
    },
    downloadPDF() {
      if (!this.matchingRecord) return alert("No record to download!");

      const pageSize = { width: 612, height: 935 };
      const pageOrientation = "portrait";
      const tableBody = [
        [
          { text: "FROM", alignment: "center" },
          { text: "TO", alignment: "center" },
          { text: "DESIGNATION", alignment: "center" },
          { text: "SG", alignment: "center" },
          { text: "STEP", alignment: "center" },
          { text: "STATUS", alignment: "center" },
          { text: "BASIC SALARY", colSpan: 2, alignment: "center" },
          {}, // required placeholder for colSpan
          { text: "OFFICE", alignment: "center" },
          { text: "REMARKS", alignment: "center" },
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
              headerRows: 2,
              widths: [55, 55, 70, 20, 25, 50, 30, 30, 60, "*"],
              body: tableBody,
            },
            layout: {
              fillColor: (rowIndex) => {
                return rowIndex === 0 ? "#CCCCCC" : null;
              },
            },
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
                margin: [0, 10, 0, 10],
                bold: true,
              },
            ],
          },
        ],
        styles: {
          header: { fontSize: 12, bold: true, alignment: "center" },
          subheader: { fontSize: 11, bold: true, alignment: "center" },
        },
        defaultStyle: { fontSize: 10 },
      };

      pdfMake.createPdf(docDefinition).download("service_record.pdf");
    },

    // Preview PDF in new window
    previewPDF() {
      if (!this.matchingRecord) return alert("No record to preview!");

      const pageSize = { width: 612, height: 935 }; // Portrait Long Bond
      const pageOrientation = "portrait";
      const tableBody = [
        [
          { text: "FROM", alignment: "center" },
          { text: "TO", alignment: "center" },
          { text: "DESIGNATION", alignment: "center" },
          { text: "SG", alignment: "center" },
          { text: "STEP", alignment: "center" },
          { text: "STATUS", alignment: "center" },
          { text: "BASIC SALARY", colSpan: 2, alignment: "center" },
          {}, // required placeholder for colSpan
          { text: "OFFICE", alignment: "center" },
          { text: "REMARKS", alignment: "center" },
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
              headerRows: 2,
              widths: [55, 55, 70, 20, 25, 50, 30, 30, 60, "*"],
              body: tableBody,
            },
            layout: {
              fillColor: (rowIndex) => {
                return rowIndex === 0 ? "#CCCCCC" : null;
              },
            },
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
                margin: [0, 10, 0, 10],
                bold: true,
              },
            ],
          },
        ],
        styles: {
          header: { fontSize: 12, bold: true, alignment: "center" },
          subheader: { fontSize: 11, bold: true, alignment: "center" },
        },
        defaultStyle: { fontSize: 10 },
      };

      pdfMake.createPdf(docDefinition).open();
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
    },

    // Fetch logged-in user
    async fetchUser() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/auth/me",
          { withCredentials: true },
        );

        this.user = response.data || null;

        if (this.user?.employee_id) {
          this.fetchServiceRecordsByEmployee(this.user.employee_id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },

    // Fetch service records for logged-in employee
    fetchServiceRecordsByEmployee(employeeId) {
      axios
        .get(process.env.VUE_APP_API_BASE_URL + "/service-of-records/get-all")
        .then((res) => {
          const allRecords = res.data || [];
          this.matchingRecord = allRecords.find(
            (r) => r.employee_id === employeeId,
          );
        })
        .catch((err) => console.error("Error fetching service records:", err));
    },
  },

  mounted() {
    this.fetchUser();
  },
};
</script>

<style scoped>
/* Optional: add your styling here */
</style>
