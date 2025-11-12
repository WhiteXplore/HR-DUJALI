<template>
  <div class="min-h-screen bg-gray-50 p-2">
    <!-- Header -->
    <div class="mb-4 text-left">
      <h1 class="text-md font-bold text-gray-800">Training Details</h1>
      <p class="text-sm text-gray-500 mt-1">
        View training information and eligible employees.
      </p>
    </div>

    <!-- Content Container -->
    <div class="bg-white rounded-2xl shadow p-2.5 w-full mx-auto min-h-[90vh]">
      <!-- Training Info -->
      <div class="p-6 text-sm">
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
        <div>
          <button
            @click="openConfirmModal"
            class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md text-sm font-medium transition"
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
                <th class="px-4 py-3 border-b">Employee ID</th>
                <th class="px-4 py-3 border-b">Name</th>
                <th class="px-4 py-3 border-b">Department</th>
                <th class="px-4 py-3 border-b">Designation</th>
                <th class="px-4 py-3 border-b">Years of Service</th>
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
                  {{ emp.total_years_experience }}
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
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";

export default {
  name: "ViewEligibleTrainings",
  data() {
    return {
      training: null,
      eligibleEmployees: [],
      selectedEmployees: [],
      selectAll: false,
      showConfirmModal: false,
    };
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    },

    async fetchTrainingDetails() {
      try {
        const id = this.$route.query.id;
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + `/available-trainings/${id}`
        );
        this.training = response.data || null;
      } catch (error) {
        console.error("Error fetching training details:", error);
      }
    },

    async fetchEligibleEmployees() {
      if (!this.training) return;

      try {
        const res = await axios.get(
          process.env.VUE_APP_API_BASE_URL +
            "/upload/get-eligible-employees-trainings"
        );
        const employees = res.data || [];

        const normalize = (str) =>
          str?.toLowerCase().replace(/\s+/g, "").trim();

        this.eligibleEmployees = employees.filter((emp) => {
          const matchesStatus =
            !this.training.employment_status ||
            normalize(emp.current_roa_status) ===
              normalize(this.training.employment_status);

          const matchesEducation =
            !this.training.educational_level ||
            normalize(emp.level) === normalize(this.training.educational_level);

          const years = parseFloat(emp.total_years_experience) || 0;
          const minYears = Number(this.training.experience_year_from ?? 0);
          const matchesYears = years >= minYears;

          const matchesPosition =
            !this.training.training_positions?.length ||
            this.training.training_positions.some((pos) =>
              normalize(emp.present_designation).includes(normalize(pos.name))
            );

          return (
            matchesStatus && matchesEducation && matchesYears && matchesPosition
          );
        });
      } catch (error) {
        console.error("Error fetching eligible employees:", error);
      }
    },

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
            payload
          );
        }

        toast.success("Selected employees assigned successfully!");
        this.showConfirmModal = false;
        this.selectedEmployees = [];
      } catch (error) {
        console.error("Error assigning employees:", error);
        toast.error("Failed to assign employees.");
      }
    },
  },

  async mounted() {
    await this.fetchTrainingDetails();
    await this.fetchEligibleEmployees();
  },
};
</script>
