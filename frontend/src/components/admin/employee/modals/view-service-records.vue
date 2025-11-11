<template>
  <div class="mt-4 overflow-x-auto border p-2 rounded-xl" v-if="isOpenView">
    <!-- Main Content  -->

    <div class="p-2">
      <!-- <div>Service ID: {{ serviceId }}</div> -->
      <div class="flex justify-between">
        <div
          @click="toggleBack"
          class="cursor-pointer text-red-800 hover:text-white border-red-800 border p-2 py-1 rounded-md hover:bg-red-800"
        >
          Back
        </div>
        <!-- <div
          class="px-2 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition flex gap-1 text-sm"
        >
          <icon name="download1" />
          <button @click="showDownloadAlert">Download PDF</button>
        </div> -->
      </div>
      <div class="max-h-screen h-[80vh] overflow-auto">
        <!-- <img
          src="../../../../assets/img/dujali-logo.png"
          alt=""
          class="w-20 top-[115px] left-[640px] z-20 relative"
        /> -->
        <div ref="certificate" class="bg-white p-5 text-gray-900 relative">
          <div v-if="matchingRecord" class="p-5">
            <!-- = Header =   -->
            <div class="text-center font-semibold">
              <h1>Republic of the Philippines</h1>
              <h1>Province of Davao del Norte</h1>
              <h1>Municipality of Braulio E. Dujali</h1>
              <h1 class="mt-5 font-bold text-lg">Service Record</h1>
            </div>
            <!-- = Employee Profile =  -->
            <div class="text-left mt-5 text-sm">
              <div class="flex gap-[40px] under">
                <h2>Full Name:</h2>
                <p class="underline font-bold">
                  {{ matchingRecord.first_name }} {{ matchingRecord.middle_name
                  }}{{ matchingRecord.last_name }}
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

            <!-- = Sub Header =  -->
            <div class="text-justify mt-5 text-sm">
              This is to certify that the employee named herein above actually
              rendered services in this Office as shown by the servvice record
              below, each line of which is supported by appointment and other
              papers actually issued by this Office and approved by the
              authorities concerned.
            </div>

            <!-- = Service Records Table =  -->
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
                    <th class="border border-gray-500 x-2 py-2" colspan="2">
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
            <!-- = Sub Header =  -->
            <div class="text-justify mt-5 text-sm">
              Issued in compliance with Executive Order No. 54 dated August 10,
              1954 and in accordance with Circular No. 58 dated August 10, 1954
              of the System.
            </div>

            <div class="mt-8 items-start text-sm flex justify-between">
              <h1>Certifide Coorect</h1>
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
  <!-- Alert Dialog -->
  <div
    v-if="isDownloadAlertOpen"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
  >
    <div
      class="rounded-xl shadow-lg w-[300px] md:w-[500px] bg-white py-6 px-4 flex flex-col items-center"
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
      <!-- Paper Size Selection -->
      <div class="w-full mt-4 flex flex-col items-center gap-2">
        <label class="text-[12px] md:text-[13px]">Select Paper Size:</label>
        <select
          v-model="paperSize"
          class="w-full text-sm border rounded-md px-2 py-3"
        >
          <option value="a4">A4 (210 × 297 mm)</option>
          <option value="short">Short Bond (216 × 279 mm)</option>
          <option value="long">Long Bond (216 × 330 mm)</option>
        </select>
      </div>

      <!-- Orientation Selection (already in your template) -->
      <div class="w-full mt-4 flex flex-col items-center gap-2">
        <label class="text-[12px] md:text-[13px]">Select Orientation:</label>
        <select
          v-model="pdfOrientation"
          class="w-full text-sm border rounded-md px-2 py-3"
        >
          <option value="portrait" class="py-2">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>

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
</template>

<script>
import icon from "@/assets/icon.vue";
import axios from "axios";
import { jsPDF } from "jspdf";
export default {
  name: "ViewServiceRecords",
  props: {
    serviceId: {
      type: String,
      required: true,
    },
  },
  components: {
    icon,
  },
  data() {
    return {
      isOpenView: true,
      matchingRecord: null,
      isDownloadAlertOpen: false,
      pdfOrientation: "portrait",
      paperSize: "a4", // default
    };
  },

  methods: {
    toggleBack() {
      this.$emit("back-to-table-service");
    },
    showDownloadAlert() {
      this.isDownloadAlertOpen = true;
    },
    cancelDownload() {
      this.isDownloadAlertOpen = false;
    },
    confirmDownload() {
      const certificateElement = this.$refs.certificate;

      let width = 210;
      let height = 297;

      const sizes = {
        a4: { w: 210, h: 297 },
        short: { w: 216, h: 279 },
        long: { w: 216, h: 330 },
      };

      if (this.paperSize in sizes) {
        const size = sizes[this.paperSize];
        width = this.pdfOrientation === "portrait" ? size.w : size.h;
        height = this.pdfOrientation === "portrait" ? size.h : size.w;
      }

      const doc = new jsPDF({
        orientation: this.pdfOrientation,
        unit: "mm",
        format: [width, height],
      });

      const logo = new Image();
      logo.src = require("@/assets/img/dujali-logo.png");

      logo.onload = () => {
        doc.html(certificateElement, {
          callback: () => {
            // Add logo only to the first page
            doc.setPage(1); // explicitly switch to the first page
            let x = this.pdfOrientation === "portrait" ? 40 : 80;
            let y = 10;
            let logoWidth = 25;
            let logoHeight = 25;

            doc.addImage(logo, "PNG", x, y, logoWidth, logoHeight);
            doc.save("certificate.pdf");
            this.isDownloadAlertOpen = false;
          },
          x: 0,
          y: 0,
          width,
          windowWidth: this.pdfOrientation === "landscape" ? 1123 : 794,
        });
      };

      logo.onerror = (err) => {
        console.error("Failed to load logo", err);
        alert("Failed to load the logo for export.");
      };
    },
    fetchServiceRecords() {
      axios
        .get(`http://localhost:8000/service-of-records/${this.serviceId}`)
        .then((response) => {
          this.matchingRecord = response.data || null;
          if (!this.matchingRecord) {
            console.warn(`No record found with ID: ${this.serviceId}`);
          }
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the service record:",
            error
          );
        });
    },
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "2-digit" };
      const formattedDate = new Date(date).toLocaleDateString("en-US", options);
      return formattedDate;
    },
  },
  mounted() {
    console.log(
      "Service ID received in ViewServiceRecords component:",
      this.serviceId
    );
    this.fetchServiceRecords(); // fetch records when component mounts
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
