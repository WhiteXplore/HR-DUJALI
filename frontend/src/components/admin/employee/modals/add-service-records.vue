<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50 w-screen"
  >
    <!-- Dynamic Width Container -->
    <div
      class="rounded-xl shadow-lg bg-white fixed top-20 transition-all duration-300"
      :class="step === 1 ? 'w-[50vw]' : 'w-full max-w-7xl'"
    >
      <div class="text-[13px] rounded-xl">
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-blue-900 text-white rounded-t-xl flex justify-between items-center"
        >
          <div class="flex gap-2 items-center">
            <icon name="add-account" />
            <h1 class="font-bold text-lg">Add Service Records</h1>
          </div>
          <icon
            name="circle-close3"
            class="cursor-pointer"
            @click="closeModal"
          />
        </div>

        <!-- Step Indicator -->
        <div class="flex gap-3 px-4 py-3 border-b">
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

        <!-- ================= STEP 1 ================= -->
        <div v-if="step === 1" class="p-4 space-y-4">
          <div class="space-y-4 border-b pb-4">
            <div class="flex gap-4">
              <div class="w-full">
                <label class="font-bold text-xs">First Name</label>
                <input v-model="form.first_name" class="input" />
              </div>
              <div class="w-full">
                <label class="font-bold text-xs">Middle Name</label>
                <input v-model="form.middle_name" class="input" />
              </div>
              <div class="w-full">
                <label class="font-bold text-xs">Last Name</label>
                <input v-model="form.last_name" class="input" />
              </div>
            </div>

            <div class="flex gap-4">
              <div class="w-full">
                <label class="font-bold text-xs">Employee ID</label>
                <input v-model="form.employee_id" class="input" />
              </div>
              <div class="w-full">
                <label class="font-bold text-xs">Date of Birth</label>
                <input type="date" v-model="form.birthdate" class="input" />
              </div>
              <div class="w-full">
                <label class="font-bold text-xs">Place of Birth</label>
                <input v-model="form.birth_place" class="input" />
              </div>
            </div>

            <div>
              <label class="font-bold text-xs">Department</label>
              <select v-model="form.department" class="input">
                <option disabled value="">Select Department</option>
                <option>Office of the Mayor</option>
                <option>Sangguniang Bayan Office</option>
                <option>Municipal Planning and Development Office</option>
                <option>Municipal Budget Office</option>
                <option>Municipal Accounting Office</option>
                <option>Municipal Treasury Office</option>
                <option>Municipal Assessor’s Office</option>
                <option>Municipal Engineering Office</option>
                <option>Municipal Health Office</option>
                <option>Municipal Social Welfare and Development Office</option>
              </select>
            </div>
          </div>
        </div>

        <!-- ================= STEP 2 ================= -->
        <div v-if="step === 2" class="p-4 space-y-4">
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
                <tr v-for="(record, index) in form.serviceRecords" :key="index">
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
            class="bg-gray-400 px-5 py-2 rounded text-white"
            @click="step = 1"
          >
            Back
          </button>

          <div class="ml-auto flex gap-2">
            <button
              v-if="step === 1"
              class="bg-blue-900 px-5 py-2 rounded text-white"
              @click="step = 2"
            >
              Next
            </button>

            <button
              v-if="step === 2"
              class="bg-green-600 px-5 py-2 rounded text-white"
              @click="submitData"
            >
              Save Changes
            </button>

            <button
              class="bg-gray-500 px-5 py-2 rounded text-white"
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

export default {
  name: "ServiceRecordModal",
  components: { icon },

  data() {
    return {
      step: 1,
      activeStep: "bg-blue-900 text-white",
      inactiveStep: "bg-gray-200 text-gray-600",
      form: {
        generated_service_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        birthdate: "",
        birth_place: "",
        employee_id: "",
        department: "",
        serviceRecords: [],
      },
    };
  },

  methods: {
    addRow() {
      this.form.serviceRecords.push({
        period_from: "",
        period_to: "",
        roa_designation: "",
        roa_sg: "",
        roa_step: "",
        roa_status: "",
        roa_basic_salary: "",
        roa_basic_salary_day: "",
        office: "",
        remarks: "",
      });
    },

    removeRow(index) {
      this.form.serviceRecords.splice(index, 1);
    },

    closeModal() {
      this.$emit("close");
    },

    generatedEmployeeID() {
      let lastId = localStorage.getItem("lastEmployeeID");
      let newId = lastId ? parseInt(lastId) + 1 : 100;
      return newId.toString();
    },

    async submitData() {
      if (this.form.serviceRecords.length === 0) {
        alert("Please add at least one service record.");
        return;
      }

      this.form.generated_service_id = this.generatedEmployeeID();
      localStorage.setItem("lastEmployeeID", this.form.generated_service_id);

      await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/service-of-records/add-service`,
        this.form
      );

      alert("Service record successfully added!");
      this.$emit("refresh");
      this.closeModal();
    },
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
