<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="rounded-[15px] shadow-lg">
      <form
        @submit.prevent="saveTraining"
        class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg"
        ref="trainingForm"
      >
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
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
            <div v-if="currentStep === 2" class="flex flex-col gap-4">
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
                    <option value="Specific">Specific Training</option>
                  </select>
                </div>
                <div class="w-full space-y-2">
                  <label for="educational_level" class="font-bold"
                    >Education:</label
                  >
                  <multiselect
                    v-model="form.educational_level"
                    :options="educationalLevels"
                    :multiple="true"
                    :close-on-select="false"
                    :clear-on-select="false"
                    :preserve-search="true"
                    placeholder="Select one or more levels"
                    label="name"
                    track-by="name"
                    :show-labels="false"
                    class="w-full border px-2 py-2 border-gray-600 rounded-md text-md text-gray-800 bg-white"
                  >
                    <template #option="{ option, isSelected }">
                      <div class="flex items-center gap-2 px-2 py-1">
                        <input
                          type="checkbox"
                          :checked="isSelected"
                          class="cursor-pointer accent-green-600"
                        />
                        <span>{{ option.name }}</span>
                      </div>
                    </template>

                    <template #tag="{ option, remove }">
                      <span
                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {{ option.name }}
                        <button
                          class="ml-1 text-green-600 hover:text-red-600 font-bold"
                          @click.prevent="remove(option)"
                        >
                          ✕
                        </button>
                      </span>
                    </template>
                  </multiselect>
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
              <div class="w-full space-y-2">
                <label for="employment_status" class="font-bold"
                  >Employment Status:</label
                >
                <multiselect
                  v-model="form.employment_status"
                  :options="employmentStatuses"
                  :multiple="true"
                  :close-on-select="false"
                  :clear-on-select="false"
                  :preserve-search="true"
                  placeholder="Select one or more statuses"
                  label="name"
                  track-by="name"
                  :show-labels="false"
                  class="w-full border px-2 py-2 border-gray-600 rounded-md text-md text-gray-800 bg-white"
                >
                  <template #option="{ option, isSelected }">
                    <div class="flex items-center gap-2 px-2 py-1">
                      <input
                        type="checkbox"
                        :checked="isSelected"
                        class="cursor-pointer accent-green-600"
                      />
                      <span>{{ option.name }}</span>
                    </div>
                  </template>
                  <template #tag="{ option, remove }">
                    <span
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {{ option.name }}
                      <button
                        class="ml-1 text-green-600 hover:text-red-600 font-bold"
                        @click.prevent="remove(option)"
                      >
                        ✕
                      </button>
                    </span>
                  </template>
                </multiselect>
              </div>

              <!-- Positions -->
              <div class="w-full space-y-2">
                <label class="font-bold">Positions:</label>
                <multiselect
                  v-model="form.training_position"
                  :options="service_positions"
                  :multiple="true"
                  :close-on-select="false"
                  :clear-on-select="false"
                  :preserve-search="true"
                  placeholder="Select one or more positions"
                  label="name"
                  track-by="name"
                  :show-labels="false"
                  class="w-full border px-2 py-2 border-gray-600 rounded-md text-md text-gray-800 bg-white"
                >
                  <template #option="{ option, isSelected }">
                    <div class="flex items-center gap-2 px-2 py-1">
                      <input
                        type="checkbox"
                        :checked="isSelected"
                        class="cursor-pointer accent-green-600"
                      />
                      <span>{{ option.name }}</span>
                    </div>
                  </template>
                  <template #tag="{ option, remove }">
                    <span
                      class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {{ option.name }}
                      <button
                        class="ml-1 text-green-600 hover:text-red-600 font-bold"
                        @click.prevent="remove(option)"
                      >
                        ✕
                      </button>
                    </span>
                  </template>
                </multiselect>
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
              class="bg-gray-500 hover:bg-gray-300 px-5 py-2 rounded-md text-white hover:text-gray-700 transition-all duration-200"
            >
              Previous
            </button>

            <button
              v-if="currentStep < totalSteps"
              type="button"
              @click="nextStep"
              class="ml-auto bg-green-600 hover:bg-green-200 px-5 py-2 rounded-md text-white hover:text-green-700 transition-all duration-200"
            >
              Next
            </button>

            <button
              v-if="currentStep === totalSteps"
              class="ml-auto bg-green-600 hover:bg-green-200 px-5 py-2 rounded-md text-white hover:text-green-700 transition-all duration-200"
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
import Multiselect from "vue-multiselect";

export default {
  name: "AddAvailableTrainingModal",
  components: { icon, Multiselect },
  props: {
    editData: { type: Object, default: null },
  },
  data() {
    return {
      form: {
        title: "",
        title_description: "",
        date_from: "",
        date_to: "",
        category: "",
        target_group: "",
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
      target_groups: [],
      currentStep: 1,
      totalSteps: 2,
    };
  },

  watch: {
    "form.category"(newVal) {
      if (newVal === "General") {
        this.form.training_position = [...this.service_positions];
        this.form.educational_level = [...this.educationalLevels];
        this.form.employment_status = [...this.employmentStatuses];
      } else if (newVal === "Specific") {
        this.form.training_position = [];
        this.form.educational_level = [];
      }
    },
  },

  mounted() {
    if (this.editData) {
      this.form = {
        ...this.form,
        ...this.editData,
        type_of_ld: this.editData.type_of_ld || "",
        training_position: this.editData.training_positions || [],
        employment_status: this.editData.employment_statuses || [],
        educational_level: this.editData.educational_levels || [],
      };
    }

    this.fetchService();
  },

  methods: {
    fetchService() {
      axios
        .get("http://localhost:8000/service-of-records/get-all")
        .then((response) => {
          const allRecords = response.data.flatMap((emp) => emp.serviceRecords);
          const uniquePositions = [
            ...new Set(
              allRecords
                .map((r) => r.roa_designation?.trim())
                .filter((r) => r && r !== "N/A")
            ),
          ];
          this.service_positions = uniquePositions.map((pos) => ({
            name: pos,
          }));

          if (this.editData) {
            // ✅ Preserve existing values
            this.form.type_of_ld = this.editData.type_of_ld || "";

            this.form.training_position = this.editData.training_positions
              ? this.editData.training_positions.map((p) => {
                  return (
                    this.service_positions.find((sp) => sp.name === p.name) || {
                      name: p.name,
                    }
                  );
                })
              : [];

            if (this.editData.employment_status) {
              const selectedStatuses = this.editData.employment_status
                .split(",")
                .map((s) => s.trim());
              this.form.employment_status = this.employmentStatuses.filter(
                (e) => selectedStatuses.includes(e.name)
              );
            }

            if (this.editData.educational_level) {
              const selectedLevels = this.editData.educational_level
                .split(",")
                .map((s) => s.trim());
              this.form.educational_level = this.educationalLevels.filter((e) =>
                selectedLevels.includes(e.name)
              );
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching service positions:", error);
        });
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
          employment_status: this.form.employment_status.map((e) => e.name),
          training_educational_level: this.form.educational_level.map(
            (l) => l.name
          ),
        };

        // ✅ Log payload before sending to database
        console.log("Final Payload:", payload);

        if (this.editData && this.editData.training_id) {
          await axios.patch(
            `http://localhost:8000/available-trainings/update-training/${this.editData.training_id}`,
            payload
          );
        } else {
          await axios.post(
            "http://localhost:8000/available-trainings/add-training",
            payload
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
