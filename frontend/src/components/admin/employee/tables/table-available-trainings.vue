<template>
  <div v-if="isTrainingTable">
    <!-- Header -->
    <div class="text-sm flex justify-between">
      <div class="text-[13px] text-text mt-4 font-regular">
        Pages / HR Trainings
      </div>
      <div class="flex gap-2">
        <div
          @click="toggleAddTraining"
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-green-500 text-white hover:text-green-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-green-900 hover:shadow-lg transition-all duration-300"
        >
          <icon :name="'add-account'"></icon>
          <button>Add Training</button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="text-[14px] bg-white rounded-xl mt-4">
      <div class="overflow-x-auto border p-2 rounded-xl">
        <table
          class="min-w-full table-fixed border-collapse text-text text-[13px]"
        >
          <thead
            class="bg-Green text-gray-700 tracking-wider font-regular sticky top-0 z-10"
          >
            <tr>
              <th class="px-2 py-3 text-left border-b">Training Title</th>
              <th class="px-2 py-3 text-left border-b">Description</th>
              <th class="px-2 py-3 text-left border-b">Date Range</th>
              <th class="px-2 py-3 text-left border-b">Category</th>
              <th class="px-2 py-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(training, index) in trainings"
              :key="training.training_id"
              :class="{ 'bg-blue-50 border-b': (index + 1) % 2 === 0 }"
            >
              <td class="px-2 py-1 border-b text-left">{{ training.title }}</td>
              <td class="px-2 py-1 border-b text-left">
                {{ training.title_description }}
              </td>
              <td class="px-2 py-1 border-b text-left">
                {{ formatDate(training.date_from) }} -
                {{ formatDate(training.date_to) }}
              </td>
              <td class="px-2 py-1 border-b text-left">
                <span
                  :class="{
                    'bg-green-100 text-green-700 px-2 py-1 rounded-md':
                      training.category === 'General',
                    'bg-blue-100 text-blue-700 px-2 py-1 rounded-md':
                      training.category === 'Specific',
                  }"
                >
                  {{ training.category }}
                </span>
              </td>
              <td class="px-2 py-2 border-b">
                <div class="flex gap-1 flex-wrap">
                  <button
                    class="p-2 py-1 h-8 border-2 border-blue-200 hover:bg-blue-300 text-blue-700 rounded-lg flex gap-1"
                    @click="goToViewTraining(training)"
                  >
                    <icon name="eye" /> View
                  </button>
                  <button
                    class="p-2 py-1 h-8 border-2 border-green-200 hover:bg-green-300 text-green-700 rounded-lg flex gap-1"
                    @click="toggleEditTraining(training)"
                  >
                    <icon name="edit" /> Edit
                  </button>
                  <button
                    class="p-2 py-1 h-8 border-2 border-red-200 hover:bg-red-300 text-red-700 rounded-lg flex gap-1"
                    @click="toggleDeleteTraining(training)"
                  >
                    <icon name="delete" /> Delete
                  </button>
                  <button
                    class="p-2 py-1 h-8 border-2 border-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex gap-1"
                    @click="openTrainingAttendeesModal(training)"
                  >
                    <icon name="eye" /> Preview
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="trainings.length === 0">
              <td colspan="5" class="text-center py-4">No trainings found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Training Modal -->
    <addAvailableTrainings
      v-if="isAddTraining || isEditTraining"
      :editData="selectedTraining"
      @close="closeTrainingModal"
      @refresh="fetchTrainings"
    />

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
    >
      <div
        class="rounded-xl shadow-lg w-[300px] md:w-[400px] bg-white py-6 px-4 flex flex-col items-center"
      >
        <div
          class="rounded-full w-16 h-16 md:w-20 md:h-20 flex justify-center items-center bg-red-300 animate-pulse"
        >
          <icon
            name="question"
            class="w-8 h-8 md:w-10 md:h-10 text-white flex justify-center items-center"
          />
        </div>
        <h1 class="text-[14px] md:text-[16px] font-semibold mt-4">
          Delete Confirmation
        </h1>
        <p class="mt-2 text-[12px] md:text-[13px] text-center">
          Are you sure you want to delete this record? This action cannot be
          undone.
        </p>
        <div class="tracking-wide flex gap-2 mt-6">
          <button
            class="bg-red-400 p-2 px-3 text-[11px] md:text-[13px] rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
            @click="showDeleteModal = false"
          >
            No, Cancel
          </button>
          <button
            class="bg-green-400 p-2 px-3 text-[11px] md:text-[13px] rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md"
            @click="confirmDeleteTraining"
          >
            Yes, Delete
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
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import addAvailableTrainings from "../modals/add-available-trainings.vue";
import { toast } from "vue3-toastify";
import axios from "axios";

export default {
  name: "TableHRTrainings",
  components: { icon, addAvailableTrainings },

  data() {
    return {
      trainings: [],
      employee_learning_development: [],
      eligibleEmployeesMap: {}, // ✅ NEW
      isTrainingTable: true,

      isAddTraining: false,
      isEditTraining: false,
      selectedTraining: null,

      showDeleteModal: false,
      recordToDelete: null,

      showTrainingAttendeesModal: false,
      trainingAttendees: [],
    };
  },

  methods: {
    /* ================= FETCH ================= */
    async fetchTrainings() {
      try {
        const res = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/available-trainings/get-training`
        );
        this.trainings = res.data || [];
      } catch (err) {
        console.error(err);
      }
    },
    async fetchEmployeeLearningDevelopment() {
      try {
        /* 1️⃣ Get learning & development records */
        const ldRes = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/upload/get-all`
        );

        /* 2️⃣ Get eligible employees (department & designation) */
        const eligibleRes = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/upload/get-eligible-employees-trainings`
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

    /* ================= FORMAT ================= */
    formatDate(dateStr) {
      if (!dateStr) return "";
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateStr));
    },

    /* ================= CRUD ================= */
    toggleAddTraining() {
      this.isAddTraining = true;
      this.selectedTraining = null;
    },

    toggleEditTraining(training) {
      this.isEditTraining = true;
      this.selectedTraining = training;
    },

    closeTrainingModal() {
      this.isAddTraining = false;
      this.isEditTraining = false;
      this.selectedTraining = null;
    },

    toggleDeleteTraining(training) {
      this.showDeleteModal = true;
      this.recordToDelete = training;
    },

    async confirmDeleteTraining() {
      if (!this.recordToDelete) return;

      try {
        await axios.delete(
          `${process.env.VUE_APP_API_BASE_URL}/available-trainings/${this.recordToDelete.training_id}`
        );

        this.trainings = this.trainings.filter(
          (t) => t.training_id !== this.recordToDelete.training_id
        );

        toast.success("Training deleted successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete training");
      } finally {
        this.showDeleteModal = false;
        this.recordToDelete = null;
      }
    },

    goToViewTraining(training) {
      this.$router.push({
        name: "view-eligible-trainings",
        query: { id: training.training_id },
      });
    },

    /* ================= ATTENDEES MODAL ================= */
    openTrainingAttendeesModal(training) {
      this.selectedTraining = training;

      const normalize = (str) => str?.toLowerCase().replace(/\s+/g, "").trim();

      const currentTitle = normalize(training.title);
      const currentFrom = training.date_from;
      const currentTo = training.date_to;

      this.trainingAttendees = this.employee_learning_development.filter(
        (emp) =>
          Array.isArray(emp.fifthTable) &&
          emp.fifthTable.some(
            (record) =>
              normalize(record.title_learning_development) === currentTitle &&
              record.ld_from === currentFrom &&
              record.ld_to === currentTo
          )
      );

      this.showTrainingAttendeesModal = true;
    },

    closeTrainingAttendeesModal() {
      this.trainingAttendees = [];
      this.showTrainingAttendeesModal = false;
    },
  },

  mounted() {
    this.fetchTrainings();
    this.fetchEmployeeLearningDevelopment();
  },
};
</script>
