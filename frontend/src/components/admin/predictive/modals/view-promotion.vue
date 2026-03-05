<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <div>
        <h1 class="text-lg font-bold text-gray-800 text-left">
          Promotion Eligibility
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          View employee profile and promotion recommendations.
        </p>
      </div>
      <button
        @click="toggleBack"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl border border-red-500 hover:bg-white hover:text-red-500 hover:border-red-700 transition-all duration-300 shadow-sm"
      >
        Back
      </button>
    </div>

    <!-- Main Card -->
    <div
      class="bg-white rounded-lg shadow p-4 h-[80vh] overflow-auto space-y-4"
    >
      <!-- Loading -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center h-full space-y-4"
      >
        <div
          class="loader border-8 border-t-8 border-gray-200 rounded-full w-16 h-16"
        ></div>
        <p class="text-gray-600 text-sm">
          Analyzing profile and generating recommendations...
        </p>
      </div>

      <!-- Employee Content -->
      <div v-else-if="employeeData" class="space-y-4">
        <div class="flex justify-between gap-4 w-full">
          <!-- Profile Info -->
          <div
            class="flex gap-6 border rounded-lg p-4 bg-white shadow-sm w-1/2"
          >
            <img
              :src="
                getProfileImage() ||
                require('@/assets/img/employee_picture.png')
              "
              alt="Employee"
              class="w-[180px] h-[180px] object-cover rounded-md bg-gray-100"
            />
            <div class="flex-1 space-y-4 text-sm">
              <div class="flex gap-2">
                <span class="font-semibold">Name:</span>
                {{ employeeData.first_name }} {{ employeeData.last_name }}
              </div>
              <div class="flex gap-2">
                <span class="font-semibold">Age:</span> {{ employeeData.age }}
              </div>
              <div class="flex gap-2">
                <span class="font-semibold">Birthdate:</span>
                {{ formattedBirthdate }}
              </div>
              <div class="flex gap-2">
                <span class="font-semibold">Place of Birth:</span>
                {{ employeeData.place_of_birth }}
              </div>
              <div class="flex gap-2">
                <span class="font-semibold">Designation:</span>
                {{ employeeData.present_designation }}
              </div>
            </div>
          </div>

          <!-- Promotion Eligibility Card -->
          <div class="flex flex-col border rounded-lg p-4 bg-white w-1/2">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-800">
                Promotion Eligibility
              </h2>
              <span
                class="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800"
              >
                Eligible for Promotion
              </span>
            </div>

            <!-- Promotion Details -->
            <div class="flex flex-col gap-4 text-sm text-gray-700">
              <div class="flex justify-between">
                <span class="font-medium">Current Designation:</span>
                <span>{{ employeeData.present_designation }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Current Promotion Date:</span>
                <span>{{ formattedLastPromotionDate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">End Promotion Date:</span>
                <span>{{ formattedEndPromotionDate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Criteria Met:</span>
                <span
                  class="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800"
                >
                  Yes
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="text-gray-600 text-justify text-sm">
          After evaluating {{ employeeData.first_name }}'s profile—including
          age, education, work experience, current designation, commendations,
          and total attendance hours—the system recommends their promotion
          eligibility. This ensures a fair, data-driven assessment for career
          progression.
        </p>

        <!-- Summary Stats -->
        <div
          class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 border rounded-lg p-4 text-sm w-full"
        >
          <div class="flex flex-col justify-center items-center">
            <span class="font-semibold text-gray-700">Education</span>
            <span
              class="mt-2 inline-block bg-blue-100 text-blue-800 text-xs t font-medium px-2 py-1 rounded-full w-[50%]"
            >
              {{ employeeData.level }}
            </span>
          </div>
          <div class="flex flex-col justify-center items-center">
            <span class="font-semibold text-gray-700">Experience (Years)</span>
            <span
              class="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full w-[25%]"
            >
              {{ employeeData.total_years_experience }}
            </span>
          </div>

          <div class="flex flex-col justify-center items-center">
            <span class="font-semibold text-gray-700">Designation</span>
            <span
              class="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
            >
              {{ employeeData.present_designation }}
            </span>
          </div>

          <div class="flex flex-col justify-center items-center">
            <span class="font-semibold text-gray-700">Commendation Count</span>
            <span
              class="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full w-[20%]"
            >
              {{ employeeData.total_count_of_learning_development }}
            </span>
          </div>

          <div class="flex flex-col justify-center items-center">
            <span class="font-semibold text-gray-700">Commendation Hours</span>
            <span
              class="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full w-[25%]"
            >
              {{ employeeData.total_ld_hours_rendered }}
            </span>
          </div>
          <div class="flex flex-col justify-center items-center">
            <span class="font-semibold text-gray-700">Attendance Hours</span>
            <span
              class="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full w-[25%]"
            >
              {{ employeeData.total_attendance_hours }}
            </span>
          </div>
        </div>

        <!-- Tab Contents -->
        <div>
          <div class="flex justify-between items-center">
            <!-- Tabs -->
            <nav class="p-2 flex gap-2" aria-label="Tabs">
              <button
                @click="activeTab = 'service'"
                :class="tabClass('service')"
              >
                Service Records
              </button>
              <button
                @click="activeTab = 'learning'"
                :class="tabClass('learning')"
              >
                Accomplishments - Learning & Development
              </button>
            </nav>

            <!-- Edit Button (only for Service tab) -->
            <button
              v-if="activeTab === 'service'"
              @click="editServiceRecords(currentServiceId)"
              class="p-2 py-1 h-8 border-2 border-green-200 hover:bg-green-300 text-green-700 rounded-lg flex gap-1"
            >
              <icon name="edit" /> Update
            </button>
          </div>

          <!-- Service Records Tab -->
          <div v-show="activeTab === 'service'">
            <div
              v-if="filteredServiceRecords.length"
              class="overflow-x-auto border rounded-lg"
            >
              <table class="min-w-full divide-y divide-gray-200 text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-4 py-2 text-center">Period From</th>
                    <th class="px-4 py-2 text-center">Period To</th>
                    <th class="px-4 py-2 text-center">Designation</th>
                    <th class="px-4 py-2 text-center">Status</th>
                    <th class="px-4 py-2 text-center">Basic Salary</th>
                    <th class="px-4 py-2 text-left w-[15%]">Office</th>
                    <th class="px-4 py-2 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="record in filteredServiceRecords"
                    :key="record.record_id"
                  >
                    <td class="px-4 py-2">{{ record.period_from }}</td>
                    <td class="px-4 py-2">{{ record.period_to }}</td>
                    <td class="px-4 py-2">{{ record.roa_designation }}</td>
                    <td class="px-4 py-2">{{ record.roa_status }}</td>
                    <td class="px-4 py-2">
                      {{ record.roa_basic_salary }}
                      {{ record.roa_basic_salary_day }}
                    </td>
                    <td class="px-4 py-2 text-left">{{ record.office }}</td>
                    <td class="px-4 py-2 text-left">{{ record.remarks }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="text-gray-500 text-sm">
              No service records found.
            </p>
          </div>

          <!-- Learning & Development Tab -->
          <div v-show="activeTab === 'learning'">
            <div
              v-if="learningRecords.length"
              class="overflow-x-auto border rounded-lg"
            >
              <table class="min-w-full divide-y divide-gray-200 text-sm">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-4 py-2 text-left w-[50%]">Title</th>
                    <th class="px-4 py-2 text-center">From</th>
                    <th class="px-4 py-2 text-center">To</th>
                    <th class="px-4 py-2 text-center">Hours</th>
                    <th class="px-4 py-2 text-center">Type</th>
                    <th class="px-4 py-2 text-center">Sponsor</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="record in learningRecords" :key="record.ld_id">
                    <td class="px-4 py-2 text-left">{{ record.title }}</td>
                    <td class="px-4 py-2">{{ formatDate(record.from) }}</td>
                    <td class="px-4 py-2">{{ formatDate(record.to) }}</td>

                    <td class="px-4 py-2">{{ record.hours }}</td>
                    <td class="px-4 py-2">{{ record.type }}</td>
                    <td class="px-4 py-2">{{ record.sponsor }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-else class="text-gray-500 text-sm">
              No Learning & Development records found.
            </p>
          </div>
        </div>

        <!-- Download Button -->
        <div class="flex justify-end mt-4">
          <button
            @click="openPrintableModal"
            class="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <icon name="check" />
            Download
          </button>
        </div>
      </div>
    </div>

    <!-- Printable Modal -->
    <PrintableModal
      :show="showModal"
      :employeeData="employeeData"
      :predictionData="predictionData"
      :criteria="promotionCriteriaList"
      :serviceRecords="filteredServiceRecords"
      :learningRecords="learningRecords"
      :currentPromotionDate="formattedLastPromotionDate"
      :endPromotionDate="formattedEndPromotionDate"
      @close="showModal = false"
    />

    <editServiceRecords
      v-if="isEditSR"
      :serviceId="selectedServiceId"
      @back-to-table-service="handleBackToTable"
      @refresh="fetchServiceRecords"
    />
  </div>
</template>

<script>
import axios from "axios";
import icon from "@/assets/icon.vue";
import PrintableModal from "@/components/admin/predictive/modals/print-promotion.vue";
import editServiceRecords from "./edit-service-records.vue";

export default {
  name: "viewSeminar",
  components: { icon, PrintableModal, editServiceRecords },

  props: {
    selectedFirstName: String,
    selectedLastName: String,
    promotionCriteria: Object,
  },

  data() {
    return {
      showModal: false,
      employeeData: null,
      predictionData: { eligible: 0 },
      loading: false,
      // promotionCriteriaList: [],
      matchingServiceRecords: [],
      learningRecords: [],
      activeTab: "service",
      isEditSR: false,
      selectedServiceRecord: null,
      selectedServiceId: null,
      promotionCriteriaList: this.promotionCriteria || [],
    };
  },

  /* ===================== COMPUTED ===================== */
  computed: {
    currentServiceId() {
      if (!this.employeeData || !this.matchingServiceRecords.length)
        return null;

      const empFirst = this.employeeData.first_name?.toLowerCase();
      const empLast = this.employeeData.last_name?.toLowerCase();

      const matched = this.matchingServiceRecords.find(
        (r) =>
          r.first_name?.toLowerCase() === empFirst &&
          r.last_name?.toLowerCase() === empLast,
      );

      return matched?.service_id || null;
    },
    filteredServiceRecords() {
      return this.getFilteredServiceRecords();
    },

    formattedLastPromotionDate() {
      if (!this.filteredServiceRecords.length || !this.employeeData) return "";

      const currentDesignationRecords = this.filteredServiceRecords.filter(
        (r) => r.roa_designation === this.employeeData.present_designation,
      );

      if (!currentDesignationRecords.length) return "";

      const latestRecord = currentDesignationRecords.reduce(
        (latest, record) => {
          const recordDate = new Date(record.period_from);
          return recordDate > new Date(latest.period_from) ? record : latest;
        },
        currentDesignationRecords[0],
      );

      const date = new Date(latestRecord.period_from);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    formattedEndPromotionDate() {
      if (!this.filteredServiceRecords.length || !this.employeeData)
        return "Present";

      const currentDesignationRecords = this.filteredServiceRecords.filter(
        (r) => r.roa_designation === this.employeeData.present_designation,
      );

      if (!currentDesignationRecords.length) return "Present";

      const latestRecord = currentDesignationRecords.reduce(
        (latest, record) => {
          const recordDate = new Date(record.period_from);
          return recordDate > new Date(latest.period_from) ? record : latest;
        },
        currentDesignationRecords[0],
      );

      if (!latestRecord.period_to) return "Present";

      const date = new Date(latestRecord.period_to);
      if (isNaN(date)) return "Present";

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

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

  /* ===================== METHODS ===================== */
  methods: {
    async fetchEmployeeDetails(employeeId) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/upload/employee/${employeeId}`,
          { withCredentials: true },
        );

        // Suppose the API returns { image_filename: "file.png" }
        if (response.data && response.data.image_filename) {
          this.employeeData.image_filename = response.data.image_filename;
        }
      } catch (error) {
        console.error("Employee fetch failed:", error);
      }
    },
    getProfileImage() {
      if (!this.employeeData) return null;
      if (this.employeeData.image_filename) {
        return `${process.env.VUE_APP_API_BASE_URL}/uploads/${this.employeeData.image_filename}`;
      }
      return null;
    },
    formatDate(date) {
      if (!date) return "";

      const d = new Date(date);
      if (isNaN(d)) return "";

      return d.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    },
    /** ✅ MOVED LOGIC HERE (NO ESLINT ERROR) */
    getFilteredServiceRecords() {
      if (!this.employeeData || !this.matchingServiceRecords.length) {
        return [];
      }

      const empFirst = this.employeeData.first_name?.toLowerCase();
      const empMiddle = (this.employeeData.middle_name || "").toLowerCase();
      const empLast = this.employeeData.last_name?.toLowerCase();
      const empBirthdate = this.employeeData.birthdate;

      // Match by name
      const nameMatches = this.matchingServiceRecords.filter((record) => {
        return (
          record.first_name?.toLowerCase() === empFirst ||
          record.middle_name?.toLowerCase() === empMiddle ||
          record.last_name?.toLowerCase() === empLast
        );
      });

      if (nameMatches.length) {
        return nameMatches.flatMap((r) => r.serviceRecords || []);
      }

      // Fallback match by birthdate
      const birthMatches = this.matchingServiceRecords.filter(
        (record) => record.birthdate === empBirthdate,
      );

      if (birthMatches.length) {
        return birthMatches.flatMap((r) => r.serviceRecords || []);
      }

      return [];
    },

    tabClass(tab) {
      return [
        "px-3 py-2 text-sm font-medium border-b-2",
        this.activeTab === tab
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
      ];
    },

    openPrintableModal() {
      console.log(
        "Promotion Criteria being sent to PrintableModal:",
        this.promotionCriteriaList,
      );
      this.showModal = true;
    },
    toggleBack() {
      this.employeeData = null;
      this.$emit("back-to-table-seminar");
    },

    async fetchPromotionData() {
      this.loading = true;
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/predictive/fetch-promotion`,
        );

        // Find the employee by first_name, last_name, OR directly by employee_id if available
        const matched = res.data.find(
          (emp) =>
            emp.first_name === this.selectedFirstName &&
            emp.last_name === this.selectedLastName,
        );

        if (!matched) return;

        // Assign matched employee
        this.employeeData = matched;

        // ✅ Fetch the image if employee_id exists
        if (this.employeeData.employee_id) {
          await this.fetchEmployeeDetails(this.employeeData.employee_id);
        }

        await this.fetchLearningRecords();
      } catch (err) {
        console.error("Failed to fetch promotion data:", err);
      } finally {
        setTimeout(() => (this.loading = false), 500);
      }
    },
    async fetchLearningRecords() {
      try {
        const ldRes = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/upload/get-all`,
        );

        const empFirst = this.selectedFirstName.toUpperCase();
        const empLast = this.selectedLastName.toUpperCase();

        const matchedEmp = (ldRes.data || []).find(
          (emp) =>
            emp.first_name.toUpperCase() === empFirst &&
            emp.last_name.toUpperCase() === empLast,
        );

        if (!matchedEmp) {
          this.learningRecords = [];
          return;
        }

        this.learningRecords = (matchedEmp.fifthTable || []).map((ld) => ({
          ld_id: ld.fifth_table_id,
          title: ld.title_learning_development,
          from: ld.ld_from,
          to: ld.ld_to,
          hours: ld.ld_number_of_hours,
          type: ld.type_of_ld,
          sponsor: ld.ld_conducted_sponsor,
        }));
      } catch (err) {
        console.error("Error fetching Learning & Development records:", err);
        this.learningRecords = [];
      }
    },

    fetchServiceRecords() {
      axios
        .get(`${process.env.VUE_APP_API_BASE_URL}/service-of-records/get-all`)
        .then((res) => {
          this.matchingServiceRecords = res.data || [];
        })
        .catch((err) => console.error("Error fetching service records:", err));
    },
    editServiceRecords(serviceId) {
      if (!serviceId) {
        console.warn("No service ID found for this employee");
        return;
      }

      console.log("Editing Service ID:", serviceId);
      this.selectedServiceId = serviceId;
      this.isEditSR = true;
    },

    handleBackToTable() {
      this.isEditSR = false;
      this.selectedServiceRecord = null;
    },
  },

  /* ===================== WATCHERS ===================== */
  watch: {
    promotionCriteria: {
      immediate: true,
      handler(newVal) {
        this.promotionCriteriaList = newVal || [];
        console.log(
          "Promotion Criteria received in viewPromotion:",
          this.promotionCriteriaList,
        );
      },
    },
    selectedFirstName: {
      immediate: true,
      handler() {
        if (this.selectedFirstName && this.selectedLastName) {
          this.fetchPromotionData();
        }
      },
    },
    selectedLastName: {
      immediate: true,
      handler() {
        if (this.selectedFirstName && this.selectedLastName) {
          this.fetchPromotionData();
        }
      },
    },
  },

  mounted() {
    this.fetchServiceRecords();
  },
};
</script>

<style scoped>
.loader {
  border-top-color: #1d4ed8;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
