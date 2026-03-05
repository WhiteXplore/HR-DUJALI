<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="saveTraining"
        class="w-auto bg-white text-[14px] rounded-[15px] shadow-lg"
        ref="trainingForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-blue-900 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="editData ? 'edit' : 'add-account'" />
            <h1 class="font-bold tracking-wide text-lg">
              {{ editData ? "Edit Training" : "Add Training" }}
            </h1>
          </div>
          <icon
            :name="'circle-close3'"
            @click="$emit('close')"
            class="cursor-pointer"
          />
        </div>

        <!-- Body -->
        <div class="p-4 w-[30vw]">
          <div class="w-full text-left gap-3 flex flex-col space-y-2">
            <!-- Step 1 -->
            <div v-if="currentStep === 1" class="flex flex-col gap-4">
              <!-- Title -->
              <div class="w-full space-y-2">
                <label for="title" class="font-bold">Training Title:</label>
                <input
                  v-model="form.title"
                  type="text"
                  id="title"
                  required
                  class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                  placeholder="Enter training title"
                />
              </div>

              <!-- Title Description-->
              <div class="w-full space-y-2">
                <label for="title_description" class="font-bold"
                  >Title Description:</label
                >
                <textarea
                  v-model="form.title_description"
                  id="title_description"
                  required
                  class="w-full border px-3 py-3 h-20 border-gray-600 rounded-md text-md text-gray-800"
                  placeholder="Enter title description"
                />
              </div>
            </div>

            <!-- Step 2 -->
            <div
              v-if="currentStep === 2"
              class="flex flex-col gap-4 h-[70vh] overflow-auto p-2"
            >
              <!-- Date Range -->
              <div class="gap-2 flex">
                <div class="w-full space-y-2">
                  <label for="date_from" class="font-bold">Date From:</label>
                  <input
                    v-model="form.date_from"
                    type="date"
                    id="date_from"
                    required
                    class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                  />
                </div>
                <div class="w-full space-y-2">
                  <label for="date_to" class="font-bold">Date To:</label>
                  <input
                    v-model="form.date_to"
                    type="date"
                    id="date_to"
                    required
                    class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                  />
                </div>
              </div>

              <div class="w-full space-y-2">
                <label for="type_of_ld" class="font-bold"
                  >Type of Learning Development Training:</label
                >
                <input
                  v-model="form.type_of_ld"
                  type="text"
                  id="type_of_ld"
                  required
                  class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                  placeholder="Enter type learning development"
                />
              </div>

              <!-- Training Hours -->
              <div class="w-full space-y-2">
                <label for="training_hours" class="font-bold"
                  >Training Hours:</label
                >
                <input
                  v-model="form.training_hours"
                  type="text"
                  id="training_hours"
                  required
                  class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                  placeholder="Enter number of training hours"
                />
              </div>

              <!-- Category & Education -->
              <div class="gap-2 flex">
                <div class="w-full space-y-2">
                  <label for="category" class="font-bold">Category:</label>
                  <select
                    v-model="form.category"
                    id="category"
                    required
                    class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800 bg-white"
                  >
                    <option disabled value="">Select Category</option>
                    <option value="General">General Training</option>
                    <option value="Specialized">Specialized Training</option>
                  </select>
                </div>
                <div class="w-full space-y-2">
                  <label class="font-bold">Education:</label>

                  <!-- Dropdown -->
                  <div class="relative">
                    <select
                      v-model="selectedEducation"
                      @change="addEducation"
                      class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800 bg-white cursor-pointer"
                    >
                      <option disabled value="">Select education level</option>
                      <option
                        v-for="level in educationalLevels"
                        :key="level.name"
                        :value="level.name"
                      >
                        {{ level.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Selected badges -->
                  <div class="flex flex-wrap gap-2 mt-2">
                    <span
                      v-for="(level, index) in form.educational_level"
                      :key="index"
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {{ level }}
                      <button
                        class="ml-1 text-green-600 hover:text-red-600 font-bold"
                        @click="removeEducation(level)"
                      >
                        ✕
                      </button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Experience Years -->
              <div class="gap-2 flex">
                <div class="w-full space-y-2">
                  <label for="experience_year_from" class="font-bold"
                    >Experience From (Years):</label
                  >
                  <input
                    type="number"
                    min="0"
                    v-model.number="form.experience_year_from"
                    id="experience_year_from"
                    class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                    placeholder="Enter minimum experience"
                  />
                </div>

                <div class="w-full space-y-2">
                  <label for="experience_year_to" class="font-bold"
                    >Experience To (Years):</label
                  >
                  <input
                    type="number"
                    min="0"
                    v-model.number="form.experience_year_to"
                    id="experience_year_to"
                    class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800"
                    placeholder="Enter maximum experience"
                  />
                </div>
              </div>

              <!-- Employment Status -->
              <!-- Employment Status -->
              <div class="w-full space-y-2">
                <label for="employment_status" class="font-bold"
                  >Employment Status:</label
                >
                <div class="relative">
                  <select
                    v-model="selectedEmploymentStatus"
                    @change="addEmploymentStatus"
                    class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800 bg-white cursor-pointer"
                  >
                    <option disabled value="">Select Employment Status</option>
                    <option
                      v-for="status in employmentStatuses"
                      :key="status.name"
                      :value="status.name"
                    >
                      {{ status.name }}
                    </option>
                  </select>
                </div>

                <!-- Selected badges -->
                <div class="flex flex-wrap gap-2 mt-2">
                  <span
                    v-for="(status, index) in form.employment_status"
                    :key="index"
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {{ status }}
                    <button
                      class="ml-1 text-green-600 hover:text-red-600 font-bold"
                      @click="removeEmploymentStatus(status)"
                    >
                      ✕
                    </button>
                  </span>
                </div>
              </div>

              <!-- Positions -->
              <div class="w-full space-y-2">
                <label class="font-bold">Positions:</label>

                <div class="relative">
                  <select
                    v-model="selectedPosition"
                    @change="addPosition"
                    class="w-full border px-3 py-3 border-gray-600 rounded-md text-md text-gray-800 bg-white cursor-pointer"
                  >
                    <option disabled value="">Select Position</option>
                    <option
                      v-for="pos in service_positions"
                      :key="pos.name"
                      :value="pos.name"
                    >
                      {{ pos.name }}
                    </option>
                  </select>
                </div>

                <!-- Selected badges -->

                <div class="flex flex-wrap gap-2 mt-2">
                  <span
                    v-for="(pos, index) in form.training_position"
                    :key="index"
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {{ pos.name }}
                    <button
                      class="ml-1 text-green-600 hover:text-red-600 font-bold"
                      @click="removePosition(pos)"
                    >
                      ✕
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

          <!-- Buttons -->
          <div class="tracking-wide flex justify-between mt-6">
            <button
              v-if="currentStep > 1"
              type="button"
              @click="prevStep"
              class="bg-gray-500 hover:bg-gray-300 px-5 py-2 rounded-lg text-white hover:text-gray-700 transition-all duration-200"
            >
              Previous
            </button>

            <button
              v-if="currentStep < totalSteps"
              type="button"
              @click="nextStep"
              class="ml-auto bg-blue-900 hover:bg-green-200 px-5 py-2 rounded-lg text-white hover:text-blue-700 transition-all duration-200"
            >
              Next
            </button>

            <button
              v-if="currentStep === totalSteps"
              class="ml-auto bg-green-600 hover:bg-green-200 px-5 py-2 rounded-lg text-white hover:text-green-700 transition-all duration-200"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import { toast } from "vue3-toastify";
import axios from "axios";

export default {
  name: "AddAvailableTrainingModal",
  components: { icon },

  props: {
    editData: { type: Object, default: null },
  },

  data() {
    return {
      isInitializing: true,

      form: {
        title: "",
        title_description: "",
        date_from: "",
        date_to: "",
        category: "",
        employment_status: [],
        educational_level: [],
        experience_year_from: "",
        experience_year_to: "",
        training_hours: "",
        type_of_ld: "",
        training_position: [],
      },

      service_positions: [],

      employmentStatuses: [
        { name: "Permanent" },
        { name: "Contractual" },
        { name: "Job Order" },
      ],

      educationalLevels: [
        { name: "College" },
        { name: "Secondary" },
        { name: "Vocational/Trade Course" },
        { name: "Elementary" },
      ],

      currentStep: 1,
      totalSteps: 2,

      selectedEmploymentStatus: "",
      selectedPosition: "",
      selectedEducation: "",
    };
  },

  watch: {
    "form.category"(newVal) {
      // 🚫 Prevent watcher from running during edit initialization
      if (this.isInitializing) return;

      if (newVal === "General") {
        // Auto-select all
        this.form.training_position = this.service_positions.map((p) => ({
          name: p.name,
        }));

        this.form.educational_level = this.educationalLevels.map((e) => e.name);

        this.form.employment_status = this.employmentStatuses.map(
          (e) => e.name,
        );
      } else if (newVal === "Specialized") {
        // Clear for manual selection
        this.form.training_position = [];
        this.form.educational_level = [];
        this.form.employment_status = [];
      }
    },
  },

  async mounted() {
    await this.fetchService();

    if (this.editData) {
      this.form = {
        ...this.form,
        ...this.editData,

        training_position: this.editData.training_positions
          ? this.editData.training_positions.map((p) => ({ name: p.name }))
          : [],

        employment_status: this.editData.employment_statuses
          ? this.editData.employment_statuses.map((s) => s.name)
          : [],

        educational_level: this.editData.training_educational_levels
          ? this.editData.training_educational_levels.map((e) => e.name)
          : [],
      };
    }

    // ✅ Allow watcher after initialization
    this.$nextTick(() => {
      this.isInitializing = false;
    });
  },

  methods: {
    async fetchService() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/service-of-records/get-all",
        );

        const allRecords = response.data.flatMap((emp) => emp.serviceRecords);

        const uniquePositions = [
          ...new Set(
            allRecords
              .map((r) => r.roa_designation?.trim())
              .filter((r) => r && r !== "N/A"),
          ),
        ];

        this.service_positions = uniquePositions.map((pos) => ({
          name: pos,
        }));
      } catch (error) {
        console.error("Error fetching service positions:", error);
      }
    },

    addPosition() {
      if (
        this.selectedPosition &&
        !this.form.training_position.some(
          (p) => p.name === this.selectedPosition,
        )
      ) {
        this.form.training_position.push({ name: this.selectedPosition });
      }
      this.selectedPosition = "";
    },

    removePosition(pos) {
      this.form.training_position = this.form.training_position.filter(
        (p) => p.name !== pos.name,
      );
    },

    addEmploymentStatus() {
      if (
        this.selectedEmploymentStatus &&
        !this.form.employment_status.includes(this.selectedEmploymentStatus)
      ) {
        this.form.employment_status.push(this.selectedEmploymentStatus);
      }
      this.selectedEmploymentStatus = "";
    },

    removeEmploymentStatus(status) {
      this.form.employment_status = this.form.employment_status.filter(
        (s) => s !== status,
      );
    },

    addEducation() {
      if (
        this.selectedEducation &&
        !this.form.educational_level.includes(this.selectedEducation)
      ) {
        this.form.educational_level.push(this.selectedEducation);
      }
      this.selectedEducation = "";
    },

    removeEducation(level) {
      this.form.educational_level = this.form.educational_level.filter(
        (l) => l !== level,
      );
    },

    async saveTraining() {
      const formEl = this.$refs.trainingForm;

      if (!formEl.checkValidity()) {
        formEl.reportValidity();
        return;
      }

      try {
        const payload = {
          title: this.form.title,
          title_description: this.form.title_description,
          date_from: this.form.date_from,
          date_to: this.form.date_to,
          type_of_ld: this.form.type_of_ld,
          training_hours: this.form.training_hours,
          category: this.form.category,
          experience_year_from: this.form.experience_year_from,
          experience_year_to: this.form.experience_year_to,
          training_position: this.form.training_position.map((p) => p.name),
          employment_status: this.form.employment_status,
          training_educational_level: this.form.educational_level,
        };

        if (this.editData?.training_id) {
          await axios.patch(
            `${process.env.VUE_APP_API_BASE_URL}/available-trainings/update-training/${this.editData.training_id}`,
            payload,
          );
        } else {
          await axios.post(
            `${process.env.VUE_APP_API_BASE_URL}/available-trainings/add-training`,
            payload,
          );
        }

        toast.success("Training saved successfully!");
        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        toast.error("Failed to save training!");
        console.error("Save training error:", error);
      }
    },

    nextStep() {
      if (this.currentStep < this.totalSteps) this.currentStep++;
    },

    prevStep() {
      if (this.currentStep > 1) this.currentStep--;
    },
  },
};
</script>
