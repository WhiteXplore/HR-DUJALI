<template>
  <div class="mt-4 overflow-x-auto p-2 rounded-xl bg-gray-50" v-if="isOpenView">
    <!-- Header -->
    <div class="p-2">
      <div class="flex justify-between items-start w-full">
        <div
          @click="toggleBack"
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-red-500 text-white text-sm hover:text-red-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-red-900 hover:shadow-lg transition-all duration-300"
        >
          Back
        </div>

        <div class="flex gap-2">
          <!-- Download COE -->
          <div
            class="cursor-pointer flex gap-2 items-center tracking-wider bg-blue-500 text-white text-sm hover:text-blue-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-blue-900 hover:shadow-lg transition-all duration-300"
          >
            <icon name="download1" />
            <button @click="showDownloadAlert">Download PDF</button>
          </div>
        </div>
      </div>

      <h2 class="text-lg font-semibold">Certification of Employment Preview</h2>

      <div class="w-full h-[740px] overflow-auto" v-if="matchingRecord">
        <div class="flex justify-center w-full mt-2">
          <div class="bg-gray-200 p-4 border shadow flex justify-center">
            <div
              ref="certificate"
              class="bg-white w-[210mm] h-[297mm] p-[70px] box-border shadow-md text-gray-900 relative"
            >
              <img
                src="../../../../assets/img/dujali-logo.png"
                alt="Logo"
                class="absolute top-[48px] left-20 w-24"
              />

              <!-- Header -->
              <div
                class="absolute top-2 left-1/2 transform -translate-x-1/2 mt-5 flex flex-col items-center gap-1 font-bold text-[16px] font-sans"
              >
                .
                <h1>Republic of the Philippines</h1>
                <h1>Province of Davao del Norte</h1>
                <h1>Municipality of Braulio E. Dujali</h1>
              </div>

              <!-- Title -->
              <div class="mt-[140px] font-bold text-center">
                <h1>CERTIFICATION</h1>
              </div>

              <!-- Body -->
              <div class="text-[16px] mt-10 font-sans">
                <p class="text-justify mb-6">
                  <span class="font-bold">THIS IS TO CERTIFY</span>&nbsp;that
                  <span class="ml-1 uppercase font-bold">
                    {{ matchingRecord.first_name }}</span
                  >, a Job Order under the Information and Communication
                  Technology of Municipal Mayor’s Office, this local government
                  unit since
                  <span class="ml-1 uppercase font-bold">
                    {{
                      matchingRecord.serviceRecords.length > 0
                        ? formatDate(
                            matchingRecord.serviceRecords[
                              matchingRecord.serviceRecords.length - 1
                            ].period_from
                          )
                        : "N/A"
                    }}
                  </span>
                  to Present.
                </p>

                <p class="text-justify mb-6">
                  Below is the summary of the salary history of Mr.
                  <span class="uppercase font-bold">{{
                    matchingRecord.last_name
                  }}</span>
                  throughout his employment with this local government unit.
                </p>

                <!-- Salary Table -->
                <div class="mt-4">
                  <table class="w-full text-[12px] border border-gray-400">
                    <thead class="bg-gray-100">
                      <tr>
                        <th class="border p-1">Period</th>
                        <th class="border p-1">Designation</th>
                        <th class="border p-1">Status</th>
                        <th class="border p-1">Salary</th>
                        <th class="border p-1">Per</th>
                      </tr>
                    </thead>
                    <tbody v-if="matchingRecord.serviceRecords.length">
                      <tr :key="latestRecord.record_id">
                        <td class="border p-1">
                          {{ latestRecord.period_from }} -
                          {{ latestRecord.period_to }}
                        </td>
                        <td class="border p-1">
                          {{ latestRecord.roa_designation }}
                        </td>
                        <td class="border p-1">
                          {{ latestRecord.roa_status }}
                        </td>
                        <td class="border p-1">
                          {{ latestRecord.roa_basic_salary }}
                        </td>
                        <td class="border p-1">
                          {{ latestRecord.roa_basic_salary_day }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Closing -->
                <p class="text-justify mt-6">
                  Issued this&nbsp;<span class="ml-1 uppercase font-bold">
                    {{ day }} </span
                  >&nbsp; day of
                  <span class="ml-1 uppercase font-bold"> {{ month }} </span>,
                  <span class="ml-1 uppercase font-bold"> {{ year }} </span>
                  at Braulio E. Dujali, Davao del Norte, Philippines.
                </p>
              </div>

              <!-- Signatories -->
              <div class="mt-[440px] flex flex-col items-end font-bold">
                <div class="text-center space-y-1">
                  <p class="text-[16px]">ERMALYN C. BONSO-GANOTISE, MPA</p>
                  <p class="text-[14px]">Administrative Officer IV</p>
                  <p class="text-[14px]">
                    (Human Resource Management Officer II)
                  </p>
                </div>
              </div>

              <!-- Optional Department Head Signature -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Dialog -->
    <div
      v-if="isDownloadAlertOpen"
      class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
    >
      <div
        class="rounded-xl shadow-lg w-[300px] md:w-[400px] bg-white py-6 px-4 flex flex-col items-center"
      >
        <div
          class="rounded-full w-16 h-16 md:w-20 md:h-20 flex justify-center items-center bg-red-300 animate-pulse"
        >
          <icon name="question" class="text-white" />
        </div>
        <h1 class="text-[14px] md:text-[16px] font-semibold mt-4">
          Download PDF?
        </h1>
        <p class="mt-2 text-[12px] md:text-[13px]">
          Are you sure you want to download the certificate?
        </p>
        <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>
        <div class="tracking-wide flex gap-2 mt-4">
          <button
            class="bg-red-400 p-2 px-3 text-[11px] md:text-[13px] rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
            @click="cancelDownload"
          >
            No, Cancel
          </button>
          <button
            class="bg-green-400 p-2 px-3 text-[11px] md:text-[13px] rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md"
            @click="confirmDownload"
          >
            Yes, Download
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import axios from "axios";
import { jsPDF } from "jspdf";

export default {
  name: "ViewCOERecords",
  components: { icon },
  props: {
    serviceId: { type: String, required: true },
  },
  data() {
    return {
      isDownloadAlertOpen: false,
      isOpenView: true,
      matchingRecord: null,
      day: "",
      month: "",
      year: "",
    };
  },
  computed: {
    latestRecord() {
      const records = this.matchingRecord?.serviceRecords || [];
      return records.length ? records[records.length - 1] : {};
    },
  },

  methods: {
    toggleBack() {
      this.$emit("back-to-table-coe");
    },
    fetchServiceRecords() {
      axios
        .get(
          process.env.VUE_APP_API_BASE_URL +
            `/service-of-records/${this.serviceId}`
        )
        .then((response) => {
          this.matchingRecord = response.data || null;
        })
        .catch((error) => {
          console.error("Error fetching service record:", error);
        });
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "2-digit" };
      return new Date(date).toLocaleDateString("en-US", options);
    },
    formatSalary(value) {
      const num = parseFloat(value?.replace(/[^\d.-]/g, "")) || 0;
      return num.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
      });
    },
    setCurrentDate() {
      const currentDate = new Date();
      this.day = currentDate.getDate();
      this.month = currentDate.toLocaleString("default", { month: "long" });
      this.year = currentDate.getFullYear();
    },
    showDownloadAlert() {
      this.isDownloadAlertOpen = true;
    },
    cancelDownload() {
      this.isDownloadAlertOpen = false;
    },
    confirmDownload() {
      const certificateElement = this.$refs.certificate;
      const images = certificateElement.querySelectorAll("img");

      const promises = Array.from(images).map((img) => {
        return new Promise((resolve) => {
          if (img.complete) resolve();
          else img.onload = resolve;
        });
      });

      Promise.all(promises).then(() => {
        const doc = new jsPDF({ unit: "mm", format: "a4" });
        doc.html(certificateElement, {
          callback: () => {
            const fileName = `Certificate_of_Employment_of_${this.matchingRecord.first_name}_${this.matchingRecord.last_name}.pdf`;
            doc.save(fileName);
            this.isDownloadAlertOpen = false;
          },
          x: 0,
          y: 0,
          width: 210,
          windowWidth: 800,
        });
      });
    },
  },
  mounted() {
    this.fetchServiceRecords();
    this.setCurrentDate();
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  font-family: Arial, sans-serif;
}

th,
td {
  border: 1px solid #999;
  padding: 6px;
  font-size: 12px;
  text-align: left;
}

thead {
  background-color: #f0f0f0;
  font-weight: bold;
}
</style>
