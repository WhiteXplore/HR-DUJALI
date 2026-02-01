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

        <!-- STEP 1 : PERSONAL INFORMATION -->
        <div class="p-4 space-y-4" v-if="step === 1">
          <div class="space-y-4 border-b pb-4">
            <!-- Row 1 -->
            <div class="flex gap-4">
              <div class="w-full space-y-1">
                <label class="font-bold">First Name</label>
                <input v-model="form.first_name" class="input" />
              </div>
              <div class="w-full space-y-1">
                <label class="font-bold">Middle Name</label>
                <input v-model="form.middle_name" class="input" />
              </div>
              <div class="w-full space-y-1">
                <label class="font-bold">Last Name</label>
                <input v-model="form.last_name" class="input" />
              </div>
            </div>

            <!-- Row 2 -->
            <div class="flex gap-4">
              <!-- <div class="w-full space-y-1">
                <label class="font-bold">Employee ID</label>
                <input v-model="form.employee_id" class="input" />
              </div> -->

              <div class="w-full space-y-1">
                <label class="font-bold">Date of Birth</label>
                <input type="date" v-model="form.birthdate" class="input" />
              </div>
              <div class="w-full space-y-1">
                <label class="font-bold">Place of Birth</label>
                <input v-model="form.birth_place" class="input" />
              </div>
              <!-- Department -->
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
        </div>

        <!-- STEP 2 : RECORD OF APPOINTMENT -->
        <div class="p-4 space-y-4" v-if="step === 2 && form.serviceRecords">
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
                  class="hover:bg-gray-50"
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
                      @click="removeRow(index)"
                      class="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            class="mt-2 bg-green-500 hover:bg-green-400 text-white text-xs px-3 py-1 rounded"
            @click="addRow"
          >
            Add Row
          </button>
        </div>

        <!-- Footer Buttons -->
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
    employeeServiceRecord: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      step: 1, // ✅ MASTER DEPARTMENT LIST
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
      form: {
        generated_service_id: "",
        first_name: this.employeeServiceRecord.first_name || "",
        middle_name: this.employeeServiceRecord.middle_name || "",
        last_name: this.employeeServiceRecord.last_name || "",
        birthdate: this.employeeServiceRecord.birthdate || "",
        birth_place: this.employeeServiceRecord.birth_place || "",
        employee_id: this.employeeServiceRecord.employee_id || "",
        department: this.employeeServiceRecord.department || "",

        // ✅ PRESERVE DATA
        serviceRecords: (this.employeeServiceRecord.serviceRecords || []).map(
          (r) => ({
            ...r, // keep record_id
          }),
        ),
      },
    };
  },

  computed: {
    // ✅ AUTO-INJECT UNKNOWN DEPARTMENT
    departmentOptions() {
      if (
        this.form.department &&
        !this.departments.includes(this.form.department)
      ) {
        return [this.form.department, ...this.departments];
      }
      return this.departments;
    },

    activeStep() {
      return "bg-green-600 text-white";
    },
    inactiveStep() {
      return "bg-gray-200 text-gray-600";
    },
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
      const record = this.form.serviceRecords[index];

      if (!confirm("Are you sure you want to delete this record?")) return;

      // ✅ delete from backend ONLY if existing
      if (record.record_id) {
        axios
          .delete(
            `${process.env.VUE_APP_API_BASE_URL}/service-of-records/${this.employeeServiceRecord.service_id}/record/${record.record_id}`,
          )
          .then(() => {
            this.form.serviceRecords.splice(index, 1);
            toast.success("Record deleted", { autoClose: 2000 });
          })
          .catch(() => {
            toast.error("Delete failed", { autoClose: 2000 });
          });
      } else {
        this.form.serviceRecords.splice(index, 1);
      }
    },

    submitData() {
      const payload = {
        ...this.form,
        serviceRecords: this.form.serviceRecords.map((r) => ({
          record_id: r.record_id,
          period_from: r.period_from || "",
          period_to: r.period_to || "",
          roa_designation: r.roa_designation || "",
          roa_sg: r.roa_sg || "",
          roa_step: r.roa_step || "",
          roa_status: r.roa_status || "",
          roa_basic_salary: r.roa_basic_salary || "",
          roa_basic_salary_day: r.roa_basic_salary_day || "",
          office: r.office || "",
          remarks: r.remarks || "",
          service_id: Number(this.employeeServiceRecord.service_id),
        })),
      };

      this.$emit("employee-updated", payload);
      toast.success("Record updated successfully!", { autoClose: 2000 });
      this.closeModal();
    },

    closeModal() {
      this.$emit("close");
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
