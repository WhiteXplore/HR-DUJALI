<template>
  <div class="max-h-[90vh] overflow-auto bg-gray-50 p-2">
    <!-- Header -->
    <div class="w-full justify-between flex">
      <div class="mb-4 text-left">
        <h1 class="text-md font-bold text-gray-800">Training Details</h1>
        <p class="text-sm text-gray-500 mt-1">
          View training information and eligible employees.
        </p>
      </div>
      <router-link to="/available-trainings">
        <div
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-red-500 text-white text-sm hover:text-red-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-red-900 hover:shadow-lg transition-all duration-300"
        >
          Back
        </div></router-link
      >
    </div>

    <!-- Content Container -->
    <div class="bg-white rounded-2xl shadow p-2.5 w-full mx-auto min-h-[90vh]">
      <!-- Training Info -->
      <div class="p-6 text-sm mb-6 rounded-xl border bg-gray-50">
        <p class="flex items-center justify-end mb-6">
          <span class="font-medium text-gray-600 w-40">Training Date:</span>
          <span class="text-gray-800 font-semibold">
            {{
              training?.date_from
                ? formatDate(training.date_from) +
                  " - " +
                  formatDate(training.date_to)
                : "Not Specified"
            }}
          </span>
        </p>

        <div
          v-if="training"
          class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm pb-6 rounded-xl border-gray-100 text-left"
        >
          <p class="flex items-center">
            <span class="font-medium text-gray-600 w-40">Title:</span>
            <span class="text-gray-800 font-semibold">
              {{ training?.title }}
            </span>
          </p>

          <p class="flex items-center">
            <span class="font-medium text-gray-600 w-40"
              >Title Description:</span
            >
            <span class="text-gray-800 font-semibold">
              {{ training?.title_description }}
            </span>
          </p>

          <p class="flex items-center">
            <span class="font-medium text-gray-600 w-40"
              >Experience Range:</span
            >
            <span class="text-gray-800 font-semibold">
              {{
                training?.experience_year_from && training?.experience_year_to
                  ? `${training.experience_year_from} - ${training.experience_year_to}`
                  : training?.experience_year_from
                  ? training.experience_year_from
                  : training?.experience_year_to
                  ? training.experience_year_to
                  : "N/A"
              }}
              years
            </span>
          </p>

          <p class="flex items-center">
            <span class="font-medium text-gray-600 w-40">Training Hours:</span>
            <span class="text-gray-800 font-semibold">
              {{ training?.training_hours || "Not Specified" }} hrs
            </span>
          </p>

          <p class="flex items-start">
            <span class="font-medium text-gray-600 w-40"
              >Employment Status:</span
            >
            <span>
              <template v-if="training?.employment_statuses?.length">
                <span
                  v-for="(status, idx) in training.employment_statuses"
                  :key="status.id || idx"
                  class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs mr-2 inline-block"
                >
                  {{ status.name }}
                </span>
              </template>
              <span v-else class="text-gray-800">Not Specified</span>
            </span>
          </p>

          <p class="flex items-start">
            <span class="font-medium text-gray-600 w-40"
              >Educational Levels:</span
            >
            <span>
              <template v-if="training?.training_educational_levels?.length">
                <span
                  v-for="(lvl, idx) in training.training_educational_levels"
                  :key="lvl.id || idx"
                  class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs mr-2 inline-block"
                >
                  {{ lvl.name }}
                </span>
              </template>
              <span v-else class="text-gray-800">Not Specified</span>
            </span>
          </p>

          <p class="md:col-span-2 flex items-start">
            <span class="font-medium text-gray-600 w-40"
              >Target Positions:</span
            >
            <span>
              <template v-if="training?.training_positions?.length">
                <span
                  v-for="(pos, idx) in training.training_positions"
                  :key="pos.id || idx"
                  class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs mr-2 inline-block"
                >
                  {{ pos.name }}
                </span>
              </template>
              <span v-else class="text-gray-800">All Positions</span>
            </span>
          </p>
        </div>
      </div>

      <!-- Eligible Employees -->
      <div class="flex items-end justify-between">
        <div>
          <h3 class="text-md font-semibold text-gray-800 mt-4 text-left">
            Eligible Employees
          </h3>
          <p class="text-sm text-gray-500 mt-1 mb-3 text-left">
            Select employees to assign for this training.
          </p>
        </div>
        <div class="flex gap-2">
          <!-- Preview Assigned -->
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md text-sm font-medium transition flex gap-1"
            @click="openTrainingAttendeesModal"
          >
            <icon name="eye" /> Preview
          </button>

          <!-- Assign -->
          <button
            @click="openConfirmModal"
            class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-md text-sm font-medium transition"
          >
            Assign
          </button>
        </div>
      </div>

      <div class="mt-5 border rounded-xl p-2 max-h-[53vh] overflow-y-auto">
        <div
          v-if="eligibleEmployees.length > 0"
          class="overflow-y-auto rounded-lg border"
        >
          <table class="w-full text-sm text-left border-collapse">
            <thead class="bg-blue-900 text-white">
              <tr>
                <th class="px-4 py-3 border-b">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="toggleSelectAll"
                  />
                </th>
                <th class="px-4 py-3 border-b w-[8%]">Employee ID</th>
                <th class="px-4 py-3 border-b w-[10%]">Name</th>
                <th class="px-4 py-3 border-b w-[15%]">Department</th>
                <th class="px-4 py-3 border-b w-[15%]">Designation</th>
                <th class="px-4 py-3 border-b w-[15%]">
                  Number of Trainings / Seminars
                </th>
                <th class="px-4 py-3 border-b w-[15%]">Training Hours</th>
                <th class="px-4 py-3 border-b w-[15%]">Years of Service</th>
                <th class="px-4 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="emp in eligibleEmployees"
                :key="emp.employee_id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3 border-b">
                  <input
                    type="checkbox"
                    v-model="selectedEmployees"
                    :value="emp"
                  />
                </td>
                <td class="px-4 py-3 border-b">{{ emp.employee_id }}</td>
                <td class="px-4 py-3 border-b">
                  {{ emp.first_name }}
                  {{ emp.middle_name ? emp.middle_name + " " : "" }}
                  {{ emp.last_name }}
                </td>
                <td class="px-4 py-3 border-b">{{ emp.department }}</td>
                <td class="px-4 py-3 border-b">
                  {{ emp.present_designation }}
                </td>
                <td class="px-4 py-3 border-b">
                  {{ emp.total_count_of_learning_development }}
                </td>
                <td class="px-4 py-3 border-b">
                  {{ emp.total_ld_hours_rendered }}
                </td>
                <td class="px-4 py-3 border-b">
                  {{ formatExperience(emp.total_years_experience) }}
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

    <!-- ✅ Confirmation Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">
        <h2 class="text-lg font-bold text-gray-800 mb-4">
          Confirm Employee Assignment
        </h2>
        <p class="text-sm text-gray-600 mb-4">
          You are about to assign the following employees to this training:
        </p>

        <!-- Selected employees preview -->
        <div class="max-h-60 overflow-y-auto border rounded-lg mb-4">
          <table class="w-full text-sm text-left border-collapse">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-3 py-2 border-b">Employee ID</th>
                <th class="px-3 py-2 border-b">Name</th>
                <th class="px-3 py-2 border-b">Department</th>
                <th class="px-3 py-2 border-b">Designation</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="emp in selectedEmployees"
                :key="emp.employee_id"
                class="hover:bg-gray-50"
              >
                <td class="px-3 py-2 border-b">{{ emp.employee_id }}</td>
                <td class="px-3 py-2 border-b">
                  {{ emp.first_name }} {{ emp.middle_name || "" }}
                  {{ emp.last_name }}
                </td>
                <td class="px-3 py-2 border-b">{{ emp.department }}</td>
                <td class="px-3 py-2 border-b">
                  {{ emp.present_designation }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3">
          <button
            @click="showConfirmModal = false"
            class="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            @click="confirmAssign"
            class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Confirm & Assign
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- ✅ Preview Modal -->
  <div
    v-if="showPreviewModal && previewEmployee"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold text-gray-800">
          {{ previewEmployee.first_name }} {{ previewEmployee.last_name }} -
          Trainings
        </h2>
        <button
          @click="closePreviewModal"
          class="text-gray-600 hover:text-gray-800 font-bold"
        >
          X
        </button>
      </div>

      <div
        v-if="employeeFifthTable(previewEmployee)?.length"
        class="overflow-y-auto max-h-72 border rounded p-2"
      >
        <table class="w-full text-sm text-left border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-3 py-2 border-b">Title</th>
              <th class="px-3 py-2 border-b">From</th>
              <th class="px-3 py-2 border-b">To</th>
              <th class="px-3 py-2 border-b">Hours</th>
              <th class="px-3 py-2 border-b">Type</th>
              <th class="px-3 py-2 border-b">Sponsor</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in employeeFifthTable(previewEmployee)"
              :key="record.fifth_table_id"
              class="hover:bg-gray-50"
            >
              <td class="px-3 py-2 border-b">
                {{ record.title_learning_development }}
              </td>
              <td class="px-3 py-2 border-b">{{ record.ld_from }}</td>
              <td class="px-3 py-2 border-b">{{ record.ld_to }}</td>
              <td class="px-3 py-2 border-b">
                {{ record.ld_number_of_hours }}
              </td>
              <td class="px-3 py-2 border-b">{{ record.type_of_ld }}</td>
              <td class="px-3 py-2 border-b">
                {{ record.ld_conducted_sponsor }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-center text-gray-500 py-4">
        No previous trainings found.
      </p>

      <div class="flex justify-end mt-4">
        <button
          @click="closePreviewModal"
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
  <!-- ✅ Employees Already Attended Modal -->
  <div
    v-if="showTrainingAttendeesModal"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold text-gray-800">
          Employees Who Already Attended "{{ selectedTraining?.title }}"
        </h2>
        <button
          @click="closeTrainingAttendeesModal"
          class="text-gray-600 hover:text-gray-800 font-bold"
        >
          X
        </button>
      </div>

      <div
        v-if="trainingAttendees.length"
        class="overflow-y-auto max-h-72 border rounded p-2"
      >
        <table class="w-full text-sm text-left border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-3 py-2 border-b">Employee Name</th>
              <th class="px-3 py-2 border-b">Department</th>
              <th class="px-3 py-2 border-b">Designation</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="emp in trainingAttendees"
              :key="emp.first_table_id"
              class="hover:bg-gray-50"
            >
              <td class="px-3 py-2 border-b">
                {{ emp.first_name }} {{ emp.middle_name || "" }}
                {{ emp.last_name }}
              </td>
              <td class="px-3 py-2 border-b">{{ emp.department }}</td>
              <td class="px-3 py-2 border-b">
                {{ emp.present_designation }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-center text-gray-500 py-4">
        No employees have attended this training yet.
      </p>

      <div class="flex justify-end mt-4">
        <button
          @click="closeTrainingAttendeesModal"
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import icon from "@/assets/icon.vue";
export default {
  name: "ViewEligibleTrainings",
  components: {
    icon,
  },
  data() {
    return {
      training: null,
      eligibleEmployees: [],
      selectedEmployees: [],
      employee_learning_development: [],

      // ✅ NEW
      showTrainingAttendeesModal: false,
      trainingAttendees: [],
      selectedTraining: null,

      selectAll: false,
      showConfirmModal: false,
      showPreviewModal: false,
      previewEmployee: null,
    };
  },

  methods: {
    /* -------------------- UI -------------------- */
    openPreviewModal(emp) {
      this.previewEmployee = emp;
      this.showPreviewModal = true;
    },
    closePreviewModal() {
      this.previewEmployee = null;
      this.showPreviewModal = false;
    },

    /* -------------------- HELPERS -------------------- */
    normalize(str) {
      return str?.toLowerCase().replace(/\s+/g, "").trim();
    },

    // 🔥 Removes year (2024, 2025, etc.) for base-title comparison
    normalizeBaseTitle(str) {
      return str
        ?.toLowerCase()
        .replace(/\d{4}/g, "") // remove years
        .replace(/\s+/g, "")
        .trim();
    },

    employeeFifthTable(emp) {
      const empLD = this.employee_learning_development.find(
        (e) => e.first_table_id === emp.first_table_id,
      );
      return empLD?.fifthTable || [];
    },

    /* -------------------- FETCH -------------------- */
    async fetchEmployeeLearningDevelopment() {
      try {
        /* 1️⃣ Get learning & development records */
        const ldRes = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/upload/get-all`,
        );

        /* 2️⃣ Get eligible employees (department & designation) */
        const eligibleRes = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/upload/get-eligible-employees-trainings`,
        );

        /* 3️⃣ Map eligible employees by employee_id */
        this.eligibleEmployeesMap = {};
        (eligibleRes.data || []).forEach((emp) => {
          this.eligibleEmployeesMap[emp.employee_id] = emp;
        });

        /* 4️⃣ Merge department & designation into learning records */
        this.employee_learning_development = (ldRes.data || []).map((emp) => {
          const matched = this.eligibleEmployeesMap[emp.employee_id];

          return {
            ...emp,
            department: matched?.department || "—",
            present_designation: matched?.present_designation || "—",
          };
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load employee records");
      }
    },

    async fetchTrainingDetails() {
      try {
        const id = this.$route.query.id;
        const res = await axios.get(
          process.env.VUE_APP_API_BASE_URL + `/available-trainings/${id}`,
        );
        this.training = res.data || null;
      } catch (error) {
        console.error("Error fetching training details:", error);
      }
    },

    /* -------------------- CORE LOGIC -------------------- */
    async fetchEligibleEmployees() {
      if (!this.training || !this.employee_learning_development.length) return;

      try {
        const res = await axios.get(
          process.env.VUE_APP_API_BASE_URL +
            "/upload/get-eligible-employees-trainings",
        );

        const employees = res.data || [];

        /* ------------------ PREP ------------------ */

        const exactTitle = this.normalize(this.training.title);
        const baseTitle = this.normalizeBaseTitle(this.training.title);

        // ✅ EXPERIENCE RANGE (YEAR-BASED, INCLUSIVE)
        const minYears =
          typeof this.training.experience_year_from === "number"
            ? this.training.experience_year_from
            : parseFloat(this.training.experience_year_from) || 0;

        const maxYears =
          typeof this.training.experience_year_to === "number"
            ? this.training.experience_year_to
            : parseFloat(this.training.experience_year_to) || Infinity;

        // ✅ TRAINING HOURS
        const trainingHours = parseFloat(this.training.training_hours);

        const FOUR_YEARS_AGO = new Date();
        FOUR_YEARS_AGO.setFullYear(FOUR_YEARS_AGO.getFullYear() - 4);

        const priorityEmployees = [];

        /* ------------------ LOOP ------------------ */
        employees.forEach((emp) => {
          const empLD = this.employee_learning_development.find(
            (e) => e.first_table_id === emp.first_table_id,
          );

          const fifthTable = empLD?.fifthTable || [];

          /* ❌ EXCLUDE: exact same training title */
          if (
            fifthTable.some(
              (r) =>
                this.normalize(r.title_learning_development) === exactTitle,
            )
          ) {
            return;
          }

          /* ❌ EXCLUDE: same base title within 4 years */
          if (
            fifthTable.some((r) => {
              if (
                this.normalizeBaseTitle(r.title_learning_development) !==
                baseTitle
              )
                return false;

              return new Date(r.ld_from) >= FOUR_YEARS_AGO;
            })
          ) {
            return;
          }

          /* ---------------- ELIGIBILITY ---------------- */

          /* Employment Status */
          const matchesStatus =
            !this.training.employment_statuses?.length ||
            this.training.employment_statuses.some(
              (s) =>
                this.normalize(emp.current_roa_status) ===
                this.normalize(s.name),
            );

          /* Education */
          const matchesEducation =
            !this.training.training_educational_levels?.length ||
            this.training.training_educational_levels.some(
              (lvl) => this.normalize(emp.level) === this.normalize(lvl.name),
            );

          /* ✅ EXPERIENCE (YEAR-BASED, INCLUSIVE) */
          const rawYears = parseFloat(emp.total_years_experience);
          const wholeYears = isNaN(rawYears) ? 0 : Math.floor(rawYears);

          const matchesYears = wholeYears >= minYears && wholeYears <= maxYears;

          /* Position */
          const matchesPosition =
            !this.training.training_positions?.length ||
            this.training.training_positions.some(
              (pos) =>
                this.normalize(emp.present_designation) ===
                this.normalize(pos.name),
            );

          /* LD HOURS (FIT IN RANGE ONLY) */
          const renderedHours = parseFloat(emp.total_ld_hours_rendered);
          const matchesHours =
            isNaN(trainingHours) ||
            (!isNaN(renderedHours) && renderedHours >= trainingHours);

          /* ---------------- FINAL FILTER ---------------- */

          if (
            matchesStatus &&
            matchesEducation &&
            matchesYears &&
            matchesPosition &&
            matchesHours
          ) {
            priorityEmployees.push(emp);
          }
        });

        /* ------------------ SORT: MOST FIT FIRST ------------------ */
        const experienceMid =
          maxYears === Infinity ? minYears : (minYears + maxYears) / 2;

        priorityEmployees.sort((a, b) => {
          // 1️⃣ Most training hours first
          const hoursA = parseFloat(a.total_ld_hours_rendered) || 0;
          const hoursB = parseFloat(b.total_ld_hours_rendered) || 0;
          if (hoursA !== hoursB) return hoursB - hoursA;

          // 2️⃣ Experience closeness to required range
          const expA = Math.abs(
            (parseFloat(a.total_years_experience) || 0) - experienceMid,
          );
          const expB = Math.abs(
            (parseFloat(b.total_years_experience) || 0) - experienceMid,
          );
          if (expA !== expB) return expA - expB;

          // 3️⃣ Fewer trainings attended
          const countA = parseInt(a.total_count_of_learning_development) || 0;
          const countB = parseInt(b.total_count_of_learning_development) || 0;
          return countA - countB;
        });

        /* ------------------ ASSIGN ------------------ */

        this.eligibleEmployees = priorityEmployees;
      } catch (error) {
        console.error("Error fetching eligible employees:", error);
      }
    },
    /* -------------------- ACTIONS -------------------- */
    toggleSelectAll() {
      this.selectedEmployees = this.selectAll
        ? [...this.eligibleEmployees]
        : [];
    },

    openConfirmModal() {
      if (!this.selectedEmployees.length) {
        toast.warning("Please select at least one employee");
        return;
      }
      this.showConfirmModal = true;
    },

    async confirmAssign() {
      try {
        for (const emp of this.selectedEmployees) {
          const payload = {
            learningRecords: [
              {
                title_learning_development: this.training.title,
                ld_from: this.training.date_from,
                ld_to: this.training.date_to,
                ld_number_of_hours: String(this.training.training_hours || "0"),
                type_of_ld: this.training.type_of_ld || "General",
                ld_conducted_sponsor: "Internal",
              },
            ],
          };

          await axios.patch(
            process.env.VUE_APP_API_BASE_URL +
              `/upload/update-fifth/${emp.first_table_id}`,
            payload,
          );
        }

        toast.success("Selected employees assigned successfully!");

        /* 🔄 REFRESH DATA */
        await this.fetchEmployeeLearningDevelopment();
        await this.fetchEligibleEmployees();

        /* 🧹 RESET UI */
        this.selectedEmployees = [];
        this.selectAll = false;
        this.showConfirmModal = false;
      } catch (error) {
        console.error("Error assigning employees:", error);
        toast.error("Failed to assign employees.");
      }
    },
    /* -------------------- FORMATTERS -------------------- */
    formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    },

    formatExperience(yearsFloat) {
      if (yearsFloat === null || yearsFloat === undefined) return "N/A";

      const totalMonths = Math.floor(parseFloat(yearsFloat) * 12);
      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;

      if (years && months)
        return `${years} year${years > 1 ? "s" : ""}, ${months} month${
          months > 1 ? "s" : ""
        }`;
      if (years) return `${years} year${years > 1 ? "s" : ""}`;
      if (months) return `${months} month${months > 1 ? "s" : ""}`;
      return "Less than a month";
    },
    openTrainingAttendeesModal() {
      if (!this.training) return;

      this.selectedTraining = this.training;

      const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "").trim();

      const currentTitle = normalize(this.training.title);
      const currentFrom = this.training.date_from;
      const currentTo = this.training.date_to;

      this.trainingAttendees = this.employee_learning_development.filter(
        (emp) =>
          Array.isArray(emp.fifthTable) &&
          emp.fifthTable.some(
            (record) =>
              normalize(record.title_learning_development) === currentTitle &&
              record.ld_from === currentFrom &&
              record.ld_to === currentTo,
          ),
      );

      this.showTrainingAttendeesModal = true;
    },
    closeTrainingAttendeesModal() {
      this.showTrainingAttendeesModal = false;
      this.trainingAttendees = [];
      this.selectedTraining = null;
    },
  },

  async mounted() {
    await this.fetchTrainingDetails();
    await this.fetchEmployeeLearningDevelopment();
    await this.fetchEligibleEmployees();
  },
};
</script>
