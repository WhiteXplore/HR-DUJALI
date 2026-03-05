<template>
  <div class="mt-4 overflow-x-auto p-2 rounded-xl bg-gray-50">
    <!-- Header -->
    <div class="p-2">
      <div class="flex justify-between items-start w-full">
        <!-- Back Button -->
        <div
          @click="toggleBack"
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-red-500 text-white text-sm hover:text-red-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-red-900 hover:shadow-lg transition-all duration-300"
        >
          Back
        </div>

        <!-- Download Button -->
        <div
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-blue-500 text-white text-sm hover:text-blue-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-blue-900 hover:shadow-lg transition-all duration-300"
          @click="showDownloadAlert"
        >
          <icon name="download1" />
          Download PDF
        </div>
      </div>

      <h2 class="text-lg font-semibold mt-4">
        Certification of Employment Preview
      </h2>

      <!-- Certificate Preview -->
      <div class="w-full h-[740px] overflow-auto" v-if="recordData">
        <div class="flex justify-center w-full mt-2">
          <div class="bg-gray-200 p-4 border shadow flex justify-center">
            <div
              ref="certificate"
              class="bg-white w-[210mm] h-[297mm] p-[70px] box-border shadow-md text-gray-900 relative"
            >
              <!-- Logo -->
              <img
                src="../../../../assets/img/dujali-logo.png"
                alt="Logo"
                class="absolute top-[48px] left-20 w-24"
              />

              <!-- Header -->
              <div
                class="absolute top-2 left-1/2 transform -translate-x-1/2 mt-5 flex flex-col items-center gap-1 font-bold text-[16px]"
              >
                <h1>Republic of the Philippines</h1>
                <h1>Province of Davao del Norte</h1>
                <h1>Municipality of Braulio E. Dujali</h1>
              </div>

              <!-- Title -->
              <div class="mt-[140px] font-bold text-center">
                <h1>CERTIFICATION</h1>
              </div>

              <!-- Body -->
              <div class="text-[16px] mt-10">
                <p class="text-justify mb-6">
                  <span class="font-bold">THIS IS TO CERTIFY</span>
                  that
                  <span class="uppercase font-bold">
                    {{ recordData.first_name }}
                    {{ recordData.last_name }} </span
                  >, a Job Order under the Information and Communication
                  Technology of Municipal Mayor’s Office, this local government
                  unit since
                  <span class="uppercase font-bold">
                    {{
                      latestRecord.period_from
                        ? formatDate(latestRecord.period_from)
                        : "N/A"
                    }}
                  </span>
                  to Present.
                </p>

                <p class="text-justify mb-6">
                  Below is the summary of the salary history of
                  <span v-if="genderPrefix">{{ genderPrefix }}</span>
                  <span class="uppercase font-bold">
                    {{ recordData.first_name }}
                    {{ recordData.last_name }}
                  </span>
                  throughout {{ genderPronoun }} employment with this local
                  government unit.
                </p>

                <!-- Salary Table -->
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

                  <tbody v-if="latestRecord.record_id">
                    <tr>
                      <td class="border p-1 break-words whitespace-normal">
                        {{ formatDate(latestRecord.period_from) }} - Present
                        {{
                          latestRecord.period_to
                            ? formatDate(latestRecord.period_to)
                            : "Present"
                        }}
                      </td>

                      <td class="border p-1 break-words whitespace-normal">
                        {{ latestRecord.roa_designation || "N/A" }}
                      </td>

                      <td class="border p-1 break-words whitespace-normal">
                        {{ latestRecord.roa_status || "N/A" }}
                      </td>

                      <td class="border p-1 break-words whitespace-normal">
                        PHP
                        {{ formatSalary(latestRecord.roa_basic_salary) }}
                      </td>

                      <td class="border p-1 break-words whitespace-normal">
                        {{ latestRecord.roa_basic_salary_day || "N/A" }}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Closing -->
                <p class="text-justify mt-6">
                  Issued this
                  <span class="uppercase font-bold">{{ day }}</span>
                  day of
                  <span class="uppercase font-bold">{{ month }}</span
                  >,
                  <span class="uppercase font-bold">{{ year }}</span>
                  at Braulio E. Dujali, Davao del Norte, Philippines.
                </p>
              </div>

              <!-- Signatory -->
              <div class="mt-[440px] flex flex-col items-end font-bold">
                <div class="text-center space-y-1">
                  <p class="text-[14px]">
                    ERMALYN BONSO-GANOTISE, MPA MGDH I (MHRMO)
                  </p>
                  <p class="text-[12px]">Administrative Officer IV</p>
                  <p class="text-[12px]">
                    (Human Resource Management Officer II)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Download Modal -->
    <div
      v-if="isDownloadAlertOpen"
      class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
    >
      <div
        class="rounded-xl shadow-lg w-[350px] bg-white py-6 px-4 flex flex-col items-center"
      >
        <h1 class="text-[16px] font-semibold">Download PDF?</h1>
        <p class="mt-2 text-[14px]">
          Are you sure you want to download the certificate?
        </p>

        <div class="flex gap-3 mt-6">
          <button
            class="bg-red-400 px-4 py-2 rounded-md text-white"
            @click="cancelDownload"
          >
            Cancel
          </button>

          <button
            class="bg-green-500 px-4 py-2 rounded-md text-white"
            @click="confirmDownload"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import { jsPDF } from "jspdf";

export default {
  name: "ViewCOERecords",
  components: { icon },

  props: {
    recordData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isDownloadAlertOpen: false,
      day: "",
      month: "",
      year: "",
    };
  },

  computed: {
    latestRecord() {
      const records = this.recordData?.serviceRecords || [];
      return records.length ? records[records.length - 1] : {};
    },

    normalizedGender() {
      return this.recordData?.gender?.toLowerCase()?.trim() || "";
    },

    genderPrefix() {
      if (["male", "m"].includes(this.normalizedGender)) return "Mr.";
      if (["female", "f"].includes(this.normalizedGender)) return "Ms.";
      return "";
    },

    genderPronoun() {
      if (["male", "m"].includes(this.normalizedGender)) return "his";
      if (["female", "f"].includes(this.normalizedGender)) return "her";
      return "their";
    },
  },

  methods: {
    toggleBack() {
      this.$emit("back-to-table-coe");
    },

    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      if (isNaN(d)) return "";
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
    },

    formatSalary(value) {
      const num = parseFloat(value);
      if (isNaN(num)) return "0.00";
      return num.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    setCurrentDate() {
      const d = new Date();
      this.day = d.getDate();
      this.month = d.toLocaleString("default", { month: "long" });
      this.year = d.getFullYear();
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
            const fileName = `Certificate_of_Employment_${this.recordData.first_name}_${this.recordData.last_name}.pdf`;
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
    this.setCurrentDate();
  },
};
</script>
