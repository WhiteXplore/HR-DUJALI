<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-xl shadow-lg w-[30%]">
      <!-- Header -->
      <div
        class="w-full p-5 py-3 bg-blue-900 text-white rounded-t-xl flex justify-between items-center border-b shadow"
      >
        <div class="flex gap-1 items-center">
          <icon :name="'add-account'" />
          <h1 class="font-bold tracking-wide text-lg">
            {{
              isEditMode ? "Edit Promotion Criteria" : "Add Promotion Criteria"
            }}
          </h1>
        </div>

        <icon
          :name="'circle-close3'"
          @click="closeModal"
          class="cursor-pointer"
        />
      </div>

      <!-- Form -->
      <form
        @submit.prevent="submitForm"
        class="flex flex-col gap-3 text-left p-4 text-[13px]"
      >
        <!-- Age Requirement -->
        <div class="w-full space-y-1">
          <label for="age_requirement" class="font-bold text-xs"
            >Age Requirement:</label
          >
          <input
            v-model="form.age_requirement"
            type="number"
            id="age_requirement"
            required
            class="w-full border px-3 py-3 border-gray-600 rounded-md text-sm text-gray-800"
            placeholder="Enter age requirement"
          />
        </div>

        <!-- Education Requirement (Dropdown Multi-Select) -->
        <div class="w-full space-y-1 relative">
          <label class="font-bold text-xs">Education Requirement:</label>

          <!-- Input / Toggle -->
          <div
            @click="toggleDropdown"
            class="border px-3 py-2 rounded-md border-gray-600 cursor-pointer flex flex-wrap gap-1 min-h-[40px] items-center"
          >
            <template v-if="form.education_requirement.length">
              <span
                v-for="(edu, index) in form.education_requirement"
                :key="index"
                class="bg-blue-100 text-blue-900 px-2 py-1 rounded-full flex items-center gap-1 text-xs"
              >
                {{ edu }}
                <icon
                  name="circle-close3"
                  class="cursor-pointer w-3 h-3"
                  @click.stop="removeEducation(index)"
                />
              </span>
            </template>
            <template v-else>
              <span class="text-gray-400 text-sm"
                >Select education levels...</span
              >
            </template>
            <icon
              :name="isDropdownOpen ? 'chevron-up' : 'chevron-down'"
              class="ml-auto w-4 h-4 text-gray-600"
            />
          </div>

          <!-- Dropdown Options -->
          <div
            v-show="isDropdownOpen"
            class="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow max-h-40 overflow-y-auto"
            @mouseleave="isDropdownOpen = false"
          >
            <!-- Select All -->
            <label
              class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
              />
              <span class="font-medium text-sm">All</span>
            </label>

            <!-- Options -->
            <label
              v-for="edu in educationOptions"
              :key="edu"
              class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                :value="edu"
                v-model="form.education_requirement"
              />
              <span class="text-sm">{{ edu }}</span>
            </label>
          </div>
        </div>

        <!-- Work Experience -->
        <div class="w-full space-y-1">
          <label for="work_experience_requirement" class="font-bold text-xs">
            Work Year of Experience:
          </label>
          <input
            v-model="form.work_experience_requirement"
            type="number"
            id="work_experience_requirement"
            required
            class="w-full border px-3 py-3 border-gray-600 rounded-md text-sm text-gray-800"
            placeholder="Enter work experience requirement"
          />
        </div>

        <!-- Commendation Count -->
        <div class="w-full space-y-1">
          <label for="commendation_count_requirement" class="font-bold text-xs">
            Commendations:
          </label>
          <input
            v-model="form.commendation_count_requirement"
            type="number"
            id="commendation_count_requirement"
            required
            class="w-full border px-3 py-3 border-gray-600 rounded-md text-sm text-gray-800"
            placeholder="Enter commendation count requirement"
          />
        </div>

        <!-- Commendation Hours -->
        <div class="w-full space-y-1">
          <label for="commendation_hours_requirement" class="font-bold text-xs">
            Commendation Hours:
          </label>
          <input
            v-model="form.commendation_hours_requirement"
            type="number"
            id="commendation_hours_requirement"
            required
            class="w-full border px-3 py-3 border-gray-600 rounded-md text-sm text-gray-800"
            placeholder="Enter commendation hours requirement"
          />
        </div>

        <!-- Attendance Hours -->
        <div class="w-full space-y-1">
          <label for="attendance_hours_requirement" class="font-bold text-xs">
            Attendance Hours:
          </label>
          <input
            v-model="form.attendance_hours_requirement"
            type="number"
            id="attendance_hours_requirement"
            required
            class="w-full border px-3 py-3 border-gray-600 rounded-md text-sm text-gray-800"
            placeholder="Enter attendance hours requirement"
          />
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-2 mt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700"
          >
            {{ isEditMode ? "Update" : "Add" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import icon from "@/assets/icon.vue";

export default {
  name: "AddPromotionCriteriaPage",
  components: { icon },
  props: {
    criteria: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        age_requirement: "",
        education_requirement: [],
        work_experience_requirement: "",
        commendation_count_requirement: "",
        commendation_hours_requirement: "",
        attendance_hours_requirement: "",
      },
      educationOptions: [
        "Elementary",
        "High School",
        "Vocational",
        "College",
        "Graduate School",
      ],
      isDropdownOpen: false,
    };
  },
  watch: {
    criteria: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = {
            ...newVal,
            education_requirement: Array.isArray(newVal.education_requirement)
              ? newVal.education_requirement
              : [],
          };
        }
      },
    },
  },
  computed: {
    isEditMode() {
      return !!this.criteria?.id;
    },
    isAllSelected() {
      return (
        Array.isArray(this.form.education_requirement) &&
        this.form.education_requirement.length === this.educationOptions.length
      );
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    removeEducation(index) {
      this.form.education_requirement.splice(index, 1);
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.form.education_requirement = [...this.educationOptions];
      } else {
        this.form.education_requirement = [];
      }
    },
    async submitForm() {
      try {
        const payload = {
          age_requirement: this.form.age_requirement ?? null,
          education_requirement: this.form.education_requirement,
          work_experience_requirement:
            this.form.work_experience_requirement ?? null,
          commendation_count_requirement:
            this.form.commendation_count_requirement ?? null,
          commendation_hours_requirement:
            this.form.commendation_hours_requirement ?? null,
          attendance_hours_requirement:
            this.form.attendance_hours_requirement ?? null,
        };

        if (this.isEditMode) {
          await axios.patch(
            `${process.env.VUE_APP_API_BASE_URL}/promotion-criteria/${this.criteria.id}`,
            payload
          );
          toast.success("Promotion criteria updated successfully!");
        } else {
          await axios.post(
            `${process.env.VUE_APP_API_BASE_URL}/promotion-criteria`,
            payload
          );
          toast.success("Promotion criteria added successfully!");
        }

        // Emit events to parent
        this.$emit("refresh"); // parent should re-fetch or update the table
        this.$emit("close"); // parent should close the modal
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to save promotion criteria."
        );
        console.error(err);
      }
    },
    handleClickOutside(e) {
      if (!this.$el.contains(e.target) && this.isDropdownOpen) {
        this.isDropdownOpen = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>
