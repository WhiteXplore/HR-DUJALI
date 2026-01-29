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
        class="flex flex-col gap-3 text-left p-4 text-[14px]"
      >
        <!-- Department -->
        <div class="w-full space-y-1">
          <label class="font-bold text-xs">Department:</label>
          <select
            v-model="form.department"
            required
            class="w-full border px-3 py-2 rounded-md border-gray-600 text-sm"
          >
            <option value="" disabled>Select department</option>
            <option v-for="dept in departmentOptions" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
        </div>

        <!-- Age -->
        <div class="w-full space-y-1">
          <label class="font-bold text-xs">Age Requirement:</label>
          <input
            v-model.number="form.age_requirement"
            type="number"
            required
            class="w-full border px-3 py-3 rounded-md border-gray-600"
          />
        </div>

        <!-- Education -->
        <div class="w-full space-y-1 relative">
          <label class="font-bold text-xs">Education Requirement:</label>

          <div
            @click="toggleDropdown"
            class="border px-3 py-2 rounded-md border-gray-600 cursor-pointer flex flex-wrap gap-1 min-h-[40px]"
          >
            <template v-if="form.education_requirement.length">
              <span
                v-for="(edu, i) in form.education_requirement"
                :key="i"
                class="bg-blue-100 text-blue-900 px-2 py-1 rounded-full flex items-center gap-1 text-xs"
              >
                {{ edu }}
                <icon
                  name="circle-close3"
                  class="w-3 h-3 cursor-pointer"
                  @click.stop="removeEducation(i)"
                />
              </span>
            </template>
            <span v-else class="text-gray-400 text-sm">
              Select education levels...
            </span>

            <icon
              :name="isDropdownOpen ? 'chevron-up' : 'chevron-down'"
              class="ml-auto w-4 h-4"
            />
          </div>

          <div
            v-show="isDropdownOpen"
            @mouseleave="isDropdownOpen = false"
            class="absolute z-50 mt-1 w-full bg-white border rounded-md shadow max-h-40 overflow-y-auto"
          >
            <label class="flex items-center gap-2 px-3 py-2">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
              />
              <span class="text-sm font-medium">All</span>
            </label>

            <label
              v-for="edu in educationOptions"
              :key="edu"
              class="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
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

        <!-- Experience -->
        <div class="w-full space-y-1">
          <label class="font-bold text-xs">Work Experience (Years):</label>
          <input
            v-model.number="form.work_experience_requirement"
            type="number"
            required
            class="w-full border px-3 py-3 rounded-md border-gray-600"
          />
        </div>

        <!-- Commendations -->
        <div class="w-full space-y-1">
          <label class="font-bold text-xs">Commendation Count:</label>
          <input
            v-model.number="form.commendation_count_requirement"
            type="number"
            required
            class="w-full border px-3 py-3 rounded-md border-gray-600"
          />
        </div>

        <div class="w-full space-y-1">
          <label class="font-bold text-xs">Commendation Hours:</label>
          <input
            v-model.number="form.commendation_hours_requirement"
            type="number"
            required
            class="w-full border px-3 py-3 rounded-md border-gray-600"
          />
        </div>

        <div class="w-full space-y-1">
          <label class="font-bold text-xs">Attendance Hours:</label>
          <input
            v-model.number="form.attendance_hours_requirement"
            type="number"
            required
            class="w-full border px-3 py-3 rounded-md border-gray-600"
          />
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-2 mt-4">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-900 text-white rounded-md"
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
    criteria: Object,
  },
  data() {
    return {
      serviceRecords: [],
      isDropdownOpen: false,
      educationOptions: [
        "Elementary",
        "High School",
        "Vocational",
        "College",
        "Graduate School",
      ],
      form: {
        department: "",
        age_requirement: null,
        education_requirement: [],
        work_experience_requirement: null,
        commendation_count_requirement: null,
        commendation_hours_requirement: null,
        attendance_hours_requirement: null,
      },
    };
  },
  computed: {
    isEditMode() {
      return !!this.criteria?.id;
    },
    isAllSelected() {
      return (
        this.form.education_requirement.length === this.educationOptions.length
      );
    },
    departmentOptions() {
      return [
        ...new Set(
          this.serviceRecords.map((r) => r.department).filter(Boolean),
        ),
      ];
    },
  },
  watch: {
    criteria: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = {
            ...this.form,
            ...val,
            education_requirement: val.education_requirement || [],
          };
        }
      },
    },
  },
  methods: {
    async fetchServiceRecords() {
      const res = await axios.get(
        process.env.VUE_APP_API_BASE_URL + "/service-of-records/get-all",
      );
      this.serviceRecords = res.data;
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    removeEducation(i) {
      this.form.education_requirement.splice(i, 1);
    },
    toggleSelectAll(e) {
      this.form.education_requirement = e.target.checked
        ? [...this.educationOptions]
        : [];
    },
    closeModal() {
      this.$emit("close");
    },
    async submitForm() {
      try {
        const url = this.isEditMode
          ? `/promotion-criteria/${this.criteria.id}`
          : `/promotion-criteria`;

        const method = this.isEditMode ? "patch" : "post";

        await axios[method](process.env.VUE_APP_API_BASE_URL + url, this.form);

        toast.success(
          `Promotion criteria ${
            this.isEditMode ? "updated" : "added"
          } successfully`,
        );
        this.$emit("refresh");
        this.closeModal();
      } catch (err) {
        toast.error("Failed to save promotion criteria.");
      }
    },
  },
  mounted() {
    this.fetchServiceRecords();
  },
};
</script>
