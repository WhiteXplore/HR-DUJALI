<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50 w-screen"
  >
    <div
      class="rounded-xl shadow-lg bg-white fixed top-20 transition-all duration-300"
      :class="step === 1 ? 'w-[50vw]' : 'w-full max-w-7xl'"
    >
      <div class="text-text1 text-[14px] rounded-xl">
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon name="edit" />
            <h1 class="font-bold tracking-wide text-lg">
              Edit Service Records
            </h1>
          </div>

          <icon
            name="circle-close3"
            @click="closeModal"
            class="cursor-pointer"
          />
        </div>

        <!-- Step Indicator -->
        <div class="flex items-center gap-4 px-4 py-3 border-b">
          <div
            :class="step === 1 ? activeStep : inactiveStep"
            class="step-pill"
          >
            1. Personal Information
          </div>
          <div
            :class="step === 2 ? activeStep : inactiveStep"
            class="step-pill"
          >
            2. Record of Appointment
          </div>
        </div>

        <!-- STEP 1 -->
        <div class="p-4 space-y-4" v-if="step === 1">
          <div class="flex gap-4">
            <div class="w-full">
              <label class="font-bold">First Name</label>
              <input v-model="form.first_name" class="input" />
            </div>
            <div class="w-full">
              <label class="font-bold">Middle Name</label>
              <input v-model="form.middle_name" class="input" />
            </div>
            <div class="w-full">
              <label class="font-bold">Last Name</label>
              <input v-model="form.last_name" class="input" />
            </div>
          </div>

          <div class="flex gap-4">
            <div class="w-full">
              <label class="font-bold">Date of Birth</label>
              <input type="date" v-model="form.birthdate" class="input" />
            </div>
            <div class="w-full">
              <label class="font-bold">Place of Birth</label>
              <input v-model="form.birth_place" class="input" />
            </div>
            <div class="w-full">
              <label class="font-bold">Department</label>
              <select v-model="form.department" class="input">
                <option disabled value="">Select Department</option>
                <option
                  v-for="dept in departmentOptions"
                  :key="dept"
                  :value="dept"
                >
                  {{ dept }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- STEP 2 -->
        <div class="p-4 space-y-4" v-if="step === 2">
          <div class="overflow-x-auto max-h-96 border">
            <table class="min-w-full text-[14px]">
              <thead class="bg-gray-100 sticky top-0">
                <tr>
                  <th colspan="2" class="th">PERIOD</th>
                  <th colspan="6" class="th">RECORD OF APPOINTMENT</th>
                  <th rowspan="2" class="th">OFFICE</th>
                  <th rowspan="2" class="th">REMARKS</th>
                  <th rowspan="2" class="th">ACTION</th>
                </tr>
                <tr>
                  <th class="th">FROM</th>
                  <th class="th">TO</th>
                  <th class="th">DESIGNATION</th>
                  <th class="th">SG</th>
                  <th class="th">STEP</th>
                  <th class="th">STATUS</th>
                  <th class="th">BASIC SALARY</th>
                  <th class="th">DAILY RATE</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(record, index) in form.serviceRecords"
                  :key="record.record_id || index"
                >
                  <td class="td">
                    <input v-model="record.period_from" class="table-input" />
                  </td>
                  <td class="td">
                    <input v-model="record.period_to" class="table-input" />
                  </td>
                  <td class="td">
                    <input
                      v-model="record.roa_designation"
                      class="table-input"
                    />
                  </td>
                  <td class="td">
                    <input v-model="record.roa_sg" class="table-input" />
                  </td>
                  <td class="td">
                    <input v-model="record.roa_step" class="table-input" />
                  </td>
                  <td class="td">
                    <input v-model="record.roa_status" class="table-input" />
                  </td>
                  <td class="td">
                    <input
                      v-model="record.roa_basic_salary"
                      class="table-input"
                    />
                  </td>
                  <td class="td">
                    <input
                      v-model="record.roa_basic_salary_day"
                      class="table-input"
                    />
                  </td>
                  <td class="td">
                    <input v-model="record.office" class="table-input" />
                  </td>
                  <td class="td">
                    <input v-model="record.remarks" class="table-input" />
                  </td>
                  <td class="td">
                    <button
                      class="text-red-500 text-xs"
                      @click="removeRow(index)"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            class="mt-2 bg-green-500 text-white text-xs px-3 py-1 rounded"
            @click="addRow"
          >
            Add Row
          </button>
        </div>

        <!-- Footer -->
        <div class="flex justify-between p-4 border-t">
          <button
            v-if="step === 2"
            class="bg-gray-400 px-5 py-2 rounded-md text-white"
            @click="step = 1"
          >
            Back
          </button>

          <div class="ml-auto flex gap-2">
            <button
              v-if="step === 1"
              class="bg-green-600 px-5 py-2 rounded-md text-white"
              @click="step = 2"
            >
              Next
            </button>

            <button
              v-if="step === 2"
              class="bg-green-600 px-5 py-2 rounded-md text-white"
              @click="submitData"
            >
              Save Changes
            </button>

            <button
              class="bg-gray-500 px-5 py-2 rounded-md text-white"
              @click="closeModal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import axios from "axios";
import { toast } from "vue3-toastify";

export default {
  name: "ServiceRecordModal",
  components: { icon },

  props: {
    employeeServiceRecord: Object,
    authenticatedUser: Object, // <-- new prop
  },

  data() {
    return {
      step: 1,
      departments: [
        "Office of the Mayor",
        "Sangguniang Bayan Office",
        "Municipal Planning and Development Office",
        "Municipal Budget Office",
        "Municipal Accounting Office",
        "Municipal Treasury Office",
        "Municipal Assessor’s Office",
        "Municipal Engineering Office",
        "Municipal Health Office",
        "Municipal Social Welfare and Development Office",
      ],
      originalForm: null,
      form: {
        first_name: this.employeeServiceRecord.first_name,
        middle_name: this.employeeServiceRecord.middle_name,
        last_name: this.employeeServiceRecord.last_name,
        birthdate: this.employeeServiceRecord.birthdate,
        birth_place: this.employeeServiceRecord.birth_place,
        department: this.employeeServiceRecord.department,
        serviceRecords: [...this.employeeServiceRecord.serviceRecords],
      },
    };
  },

  computed: {
    departmentOptions() {
      return this.departments.includes(this.form.department)
        ? this.departments
        : [this.form.department, ...this.departments];
    },
    activeStep() {
      return "bg-green-600 text-white";
    },
    inactiveStep() {
      return "bg-gray-200 text-gray-600";
    },
    editorName() {
      const user = this.authenticatedUser; // replace with the reactive user object
      if (!user) return "System";
      const middle = user.middle_name?.trim()
        ? ` ${user.middle_name.trim()}`
        : "";
      return `${user.first_name}${middle} ${user.last_name}`;
    },
  },

  methods: {
    hasChanges() {
      return JSON.stringify(this.form) !== JSON.stringify(this.originalForm);
    },
    fetchUsers() {
      axios
        .get(process.env.VUE_APP_API_BASE_URL + "/user")
        .then((res) => (this.users = res.data))
        .catch((err) => console.error("Failed to fetch users:", err));
    },
    addRow() {
      this.form.serviceRecords.push({});
    },

    removeRow(index) {
      const record = this.form.serviceRecords[index];
      if (!confirm("Delete this record?")) return;

      if (record.record_id) {
        axios.delete(
          `${process.env.VUE_APP_API_BASE_URL}/service-of-records/${this.employeeServiceRecord.service_id}/record/${record.record_id}`,
        );
      }

      this.form.serviceRecords.splice(index, 1);
    },

    submitData() {
      const middle = this.authenticatedUser?.middle_name?.trim()
        ? ` ${this.authenticatedUser.middle_name.trim()}`
        : "";

      const isChanged = this.hasChanges();

      const payload = {
        ...this.form,
        service_status: isChanged
          ? null
          : this.employeeServiceRecord.service_status,
        edited_by: this.authenticatedUser
          ? `${this.authenticatedUser.first_name}${middle} ${this.authenticatedUser.last_name}`
          : "System",
      };

      axios
        .patch(
          `${process.env.VUE_APP_API_BASE_URL}/service-of-records/${this.employeeServiceRecord.service_id}`,
          payload,
        )
        .then((res) => {
          toast.success(
            isChanged
              ? "Service record updated (status reset)."
              : "No changes detected.",
          );

          this.$emit("employee-updated", res.data);
          this.closeModal();
        })
        .catch(() => toast.error("Failed to save changes"));
    },

    closeModal() {
      this.$emit("close");
    },
  },
  mounted() {
    this.originalForm = JSON.parse(JSON.stringify(this.form));
  },
};
</script>

<style scoped>
.input {
  @apply py-3 px-3 w-full border rounded-md;
}
.step-pill {
  @apply px-4 py-1 rounded-full text-xs font-semibold;
}
.th {
  @apply border border-gray-400 px-2 py-3;
}
.td {
  @apply border border-gray-400 px-2 py-1;
}
.table-input {
  @apply border rounded px-2 py-1 w-full;
}
</style>
