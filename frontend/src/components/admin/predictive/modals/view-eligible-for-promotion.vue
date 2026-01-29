<template>
  <div class="min-h-screen bg-gray-50 p-2" v-if="isTable">
    <!-- Header -->
    <div class="w-full flex justify-between items-center mb-4">
      <div class="text-left">
        <h1 class="text-md font-bold text-gray-800">Promotion Details</h1>
        <p class="text-sm text-gray-500 mt-1">
          View promotion information and eligible employees.
        </p>
      </div>

      <!-- Back Button -->
      <router-link
        to="/promotion-page"
        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl border border-red-500 hover:bg-white hover:text-red-500 hover:border-red-700 transition-all duration-300 shadow-sm"
      >
        Back
      </router-link>
    </div>

    <!-- Content Container -->
    <div class="bg-white rounded-2xl shadow p-2.5 w-full mx-auto min-h-[90vh]">
      <!-- Promotion Criteria Summary -->
      <div
        v-if="promotionCriteria"
        class="mb-6 p-4 rounded-xl border bg-gray-50"
      >
        <h3 class="text-md font-semibold text-gray-800 mb-3 text-left">
          Promotion Criteria Applied
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div class="flex gap-2">
            <span class="font-medium text-gray-600">Minimum Age:</span>
            <span class="font-semibold text-gray-800">
              {{ promotionCriteria.age_requirement ?? 0 }}
            </span>
          </div>

          <div class="flex gap-2">
            <span class="font-medium text-gray-600">Department:</span>
            <span class="font-semibold text-gray-800">
              {{ promotionCriteria.department }}
            </span>
          </div>

          <div class="flex gap-2">
            <span class="font-medium text-gray-600">Work Experience:</span>
            <span class="font-semibold text-gray-800">
              {{ promotionCriteria.work_experience_requirement ?? 0 }} yrs
            </span>
          </div>

          <div class="flex gap-2">
            <span class="font-medium text-gray-600">Commendations:</span>
            <span class="font-semibold text-gray-800">
              {{ promotionCriteria.commendation_count_requirement ?? 0 }}
            </span>
          </div>

          <div class="flex gap-2">
            <span class="font-medium text-gray-600">Commendation Hours:</span>
            <span class="font-semibold text-gray-800">
              {{ promotionCriteria.commendation_hours_requirement ?? 0 }} hrs
            </span>
          </div>

          <div class="flex gap-2">
            <span class="font-medium text-gray-600">Attendance Hours:</span>
            <span class="font-semibold text-gray-800">
              {{ promotionCriteria.attendance_hours_requirement ?? 0 }} hrs
            </span>
          </div>

          <div class="md:col-span-1">
            <span class="font-medium text-gray-600 block mb-1 text-left">
              Required Education Levels:
            </span>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="(edu, idx) in promotionCriteria.education_requirement ||
                []"
                :key="idx"
                class="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-200"
              >
                {{ edu }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Eligible Employees Table Header -->
      <div class="flex items-end justify-between">
        <div>
          <h3 class="text-md font-semibold text-gray-800 text-left">
            Eligible Employees
          </h3>
          <p class="text-sm text-gray-500 mt-1 mb-3 text-left">
            View employees who meet the criteria.
          </p>
        </div>
      </div>

      <!-- Eligible Employees Table -->
      <div class="border rounded-xl p-2 max-h-[53vh] overflow-y-auto">
        <div
          v-if="eligibleEmployees.length > 0"
          class="overflow-y-auto rounded-lg border"
        >
          <table class="w-full text-sm text-left border-collapse">
            <thead class="bg-blue-900 text-white">
              <tr>
                <th class="px-4 py-3 border-b">#</th>
                <th class="px-4 py-3 border-b">Name</th>
                <th class="px-4 py-3 border-b">Age</th>
                <th class="px-4 py-3 border-b">Designation</th>
                <th class="px-4 py-3 border-b">Work Experience</th>
                <th class="px-4 py-3 border-b">Commendations Completed</th>
                <th class="px-4 py-3 border-b">
                  Commendations Completed Hours
                </th>
                <th class="px-4 py-3 border-b">Attendance Hours</th>
                <th class="px-4 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(emp, index) in eligibleEmployees"
                :key="index"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3 border-b">{{ index + 1 }}</td>
                <td class="px-4 py-3 border-b">
                  {{ emp.first_name }} {{ emp.last_name }}
                </td>
                <td class="px-4 py-3 border-b">{{ formatAge(emp.age) }}</td>
                <td class="px-4 py-3 border-b">
                  {{ emp.present_designation }}
                </td>
                <td class="px-4 py-3 border-b">
                  {{ formatExperience(emp.total_years_experience) }}
                </td>
                <td class="px-4 py-3 border-b">
                  {{ emp.total_count_of_learning_development }}
                </td>
                <td class="px-4 py-3 border-b">
                  {{ formatHours(emp.total_ld_hours_rendered) }}
                </td>
                <td class="px-4 py-3 border-b">
                  {{ formatHours(emp.total_attendance_hours) }}
                </td>
                <td class="px-4 py-3 border-b">
                  <button
                    @click="openPreviewModal(emp)"
                    class="px-2 py-2 text-sm bg-gray-200 rounded-lg flex gap-1 hover:bg-gray-300"
                  >
                    <icon name="eye" /> Preview
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-else class="text-sm text-gray-500 text-center py-6">
          No employees meet the criteria.
        </p>
      </div>
    </div>
  </div>
  <viewPromotion
    v-if="isAttendanceVisible && selectedPromotionRecord"
    :selected-first-name="selectedPromotionRecord.first_name"
    :selected-last-name="selectedPromotionRecord.last_name"
    :promotion-criteria="promotionCriteria"
    @back-to-table-seminar="handleBackToTable"
  />
</template>

<script>
import icon from "@/assets/icon.vue";
import axios from "axios";
import viewPromotion from "./view-promotion.vue";

export default {
  name: "ViewEligibleForPromotion",
  components: { icon, viewPromotion },

  props: ["id"],

  data() {
    return {
      data_promotion: [], // fetched employee data
      promotionCriteria: null, // promotion criteria

      // View toggles
      isTable: true,
      isAttendanceVisible: false,

      // Selected employee for preview
      selectedPromotionRecord: null,
    };
  },

  computed: {
    eligibleEmployees() {
      if (!this.promotionCriteria || !this.data_promotion.length) return [];

      const criteria = this.promotionCriteria;
      const requiredLevels = (criteria.education_requirement || []).map((lvl) =>
        lvl.toLowerCase().trim(),
      );

      const criteriaDepartment = (criteria.department || "")
        .toLowerCase()
        .trim();

      return this.data_promotion.filter((emp) => {
        const age = Number(emp.age) || 0;
        const experience = Number(emp.total_years_experience) || 0;
        const commCount = Number(emp.total_count_of_learning_development) || 0;
        const commHours = Number(emp.total_ld_hours_rendered) || 0;
        const attendance = Number(emp.total_attendance_hours) || 0;
        const level = (emp.level || "").toLowerCase().trim();
        const empDepartment = (emp.department || "").toLowerCase().trim();

        const meetsAge = age >= (Number(criteria.age_requirement) || 0);
        const meetsExperience =
          experience >= (Number(criteria.work_experience_requirement) || 0);
        const meetsCommCount =
          commCount >= (Number(criteria.commendation_count_requirement) || 0);
        const meetsCommHours =
          commHours >= (Number(criteria.commendation_hours_requirement) || 0);
        const meetsAttendance =
          attendance >= (Number(criteria.attendance_hours_requirement) || 0);
        const meetsEducation =
          !requiredLevels.length || requiredLevels.includes(level);

        const meetsDepartment =
          !criteriaDepartment || empDepartment === criteriaDepartment;

        return (
          meetsAge &&
          meetsExperience &&
          meetsCommCount &&
          meetsCommHours &&
          meetsAttendance &&
          meetsEducation &&
          meetsDepartment
        );
      });
    },
  },

  methods: {
    formatExperience(years) {
      if (isNaN(years)) return "-";
      const totalMonths = Math.floor(Number(years) * 12);
      const y = Math.floor(totalMonths / 12);
      const m = totalMonths % 12;
      if (y > 0 && m > 0)
        return `${y} yr${y > 1 ? "s" : ""} ${m} mo${m > 1 ? "s" : ""}`;
      if (y > 0) return `${y} yr${y > 1 ? "s" : ""}`;
      if (m > 0) return `${m} mo${m > 1 ? "s" : ""}`;
      return "0 mo";
    },

    formatHours(hours) {
      if (!hours || isNaN(hours)) return "-";
      const h = Number(hours).toFixed(2);
      return `${h} hr${h == 1 ? "" : "s"}`;
    },

    formatAge(age) {
      return age ? Math.floor(Number(age)) : "-";
    },

    fetchPromotionCriteria() {
      const criteriaId = this.id || this.$route.params.id;
      axios
        .get(
          `${process.env.VUE_APP_API_BASE_URL}/promotion-criteria/${criteriaId}`,
        )
        .then((res) => (this.promotionCriteria = res.data))
        .catch((err) =>
          console.error("Failed to load promotion criteria", err),
        );
    },

    fetchPromotionRecords() {
      axios
        .get(`${process.env.VUE_APP_API_BASE_URL}/predictive/fetch-promotion`)
        .then((res) => (this.data_promotion = res.data || []))
        .catch((err) => console.error("Failed to load employees", err));
    },

    // Switch to preview component
    openPreviewModal(emp) {
      this.selectedPromotionRecord = emp;
      this.isAttendanceVisible = true;
      this.isTable = false;
    },

    // Return to table view
    handleBackToTable() {
      this.selectedPromotionRecord = null;
      this.isAttendanceVisible = false;
      this.isTable = true;
    },
  },

  mounted() {
    this.fetchPromotionRecords();
    this.fetchPromotionCriteria();
  },
};
</script>

<style scoped></style>
