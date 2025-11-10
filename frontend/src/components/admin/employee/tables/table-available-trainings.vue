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
    <div class="text-[14px] bg-white rounded-xl">
      <div class="mt-4 overflow-x-auto border p-2 rounded-xl">
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

              <!-- <td class="px-2 py-1 border-b text-left w-[800px]">
                <div
                  v-if="training.training_positions?.length"
                  class="flex flex-wrap gap-1"
                >
                  <span
                    v-for="(pos, i) in training.training_positions"
                    :key="i"
                    class="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs"
                  >
                    {{ pos.name }}
                  </span>
                </div>
                <span v-else class="text-gray-500">All Employees</span>
              </td> -->

              <td class="px-2 py-2 border-b">
                <div class="flex gap-1">
                  <!-- View Button -->
                  <button
                    class="p-2 py-1 h-8 border-2 border-blue-200 hover:bg-blue-300 text-blue-700 rounded-lg flex gap-1"
                    @click="goToViewTraining(training)"
                  >
                    <icon name="eye" /> View
                  </button>
                  <!-- Edit Button -->
                  <button
                    class="p-2 py-1 h-8 border-2 border-green-200 hover:bg-green-300 text-green-700 rounded-lg flex gap-1"
                    @click="toggleEditTraining(training)"
                  >
                    <icon name="edit" /> Edit
                  </button>
                  <!-- Delete Button -->
                  <button
                    class="p-2 py-1 h-8 border-2 border-red-200 hover:bg-red-300 text-red-700 rounded-lg flex gap-1"
                    @click="toggleDeleteTraining(training)"
                  >
                    <icon name="delete" /> Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="trainings.length === 0">
              <td colspan="4" class="text-center py-4">No trainings found</td>
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
      isTrainingTable: true,
      isAddTraining: false,
      isEditTraining: false,
      isViewTraining: false,
      selectedTraining: null,
      showDeleteModal: false,
      recordToDelete: null,
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
    goToViewTraining(training) {
      this.$router.push({
        name: "view-eligible-trainings",
        query: { id: training.training_id },
      });
    },
    fetchTrainings() {
      axios
        .get("http://localhost:8000/available-trainings/get-training")
        .then((response) => {
          this.trainings = response.data || [];
        })
        .catch((error) => {
          console.error("There was an error fetching the trainings:", error);
        });
    },
    toggleAddTraining() {
      this.isAddTraining = true;
      this.selectedTraining = null;
    },
    toggleEditTraining(training) {
      this.selectedTraining = training;
      this.isEditTraining = true;
    },

    toggleViewTraining(training) {
      this.selectedTraining = training;
      this.isViewTraining = true;
    },
    closeViewModal() {
      this.isViewTraining = false;
      this.selectedTraining = null;
    },
    toggleDeleteTraining(training) {
      this.recordToDelete = training;
      this.showDeleteModal = true;
    },
    confirmDeleteTraining() {
      if (!this.recordToDelete) return;
      axios
        .delete(
          `http://localhost:8000/available-trainings/${this.recordToDelete.training_id}`
        )
        .then(() => {
          this.trainings = this.trainings.filter(
            (t) => t.training_id !== this.recordToDelete.training_id
          );
          this.showDeleteModal = false;
          this.recordToDelete = null;
          toast.success("Training deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting training:", error);
          this.showDeleteModal = false;
        });
    },
    closeTrainingModal() {
      this.isAddTraining = false;
      this.isEditTraining = false;
      this.selectedTraining = null;
    },
  },
  mounted() {
    this.fetchTrainings();
  },
};
</script>
