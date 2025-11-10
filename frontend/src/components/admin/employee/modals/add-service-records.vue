<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50 w-screen"
  >
    <div class="rounded-xl shadow-lg w-full max-w-7xl bg-white fixed top-20">
      <div class="text-text1 text-[13px] rounded-xl">
        <!-- Header -->
        <div
          class="w-full p-5 py-3 bg-green-600 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'add-account'" />
            <h1 class="font-bold tracking-wide text-lg">Add Service Records</h1>
          </div>

          <icon
            :name="'circle-close3'"
            @click="closeModal"
            class="cursor-pointer"
          />
        </div>

        <!-- Main Content -->
        <div class="p-4 space-y-4">
          <div class="text-gray-700 border-b pb-4 space-y-4">
            <!-- Row 1 -->
            <div class="flex flex-row gap-4">
              <div class="w-full flex-col text-left items-center space-y-1">
                <label for="first_name" class="font-bold">First Name</label>
                <input
                  id="first_name"
                  v-model="form.first_name"
                  type="text"
                  class="py-3 px-3 w-full border rounded-md"
                  placeholder="Enter First Name"
                />
              </div>
              <div class="w-full flex-col text-left items-center space-y-1">
                <label for="middle_name" class="font-bold">Middle Name</label>
                <input
                  id="middle_name"
                  v-model="form.middle_name"
                  type="text"
                  class="py-3 px-3 w-full border rounded-md"
                  placeholder="Enter Middle Name"
                />
              </div>
              <div class="w-full flex-col text-left items-center space-y-1">
                <label for="last_name" class="font-bold">Last Name</label>
                <input
                  id="last_name"
                  v-model="form.last_name"
                  type="text"
                  class="py-3 px-3 w-full border rounded-md"
                  placeholder="Enter Last Name"
                />
              </div>
            </div>
            <!-- Row 2 -->
            <div class="flex flex-row gap-4">
              <div class="w-full flex-col text-left items-center space-y-1">
                <label for="birthdate" class="font-bold">Employee ID</label>
                <input
                  id="text"
                  v-model="form.employee_id"
                  type="text"
                  class="py-3 px-3 w-full border rounded-md"
                  placeholder="Enter Employee ID ..."
                />
              </div>
              <div class="w-full flex-col text-left items-center space-y-1">
                <label for="birthdate" class="font-bold">Date of Birth</label>
                <input
                  id="birthdate"
                  v-model="form.birthdate"
                  type="date"
                  class="py-3 px-3 w-full border rounded-md"
                />
              </div>
              <div class="w-full flex-col text-left items-center space-y-1">
                <label for="birth_place" class="font-bold"
                  >Place of Birth</label
                >
                <input
                  id="birth_place"
                  v-model="form.birth_place"
                  type="text"
                  class="py-3 px-3 w-full border rounded-md"
                  placeholder="Enter Birth Place"
                />
              </div>
            </div>

            <!-- Row 3  -->
            <div class="flex flex-row gap-4">
              <div class="w-full flex-col text-left items-center space-y-1">
                <label for="department" class="font-bold">Department</label>
                <select
                  id="department"
                  v-model="form.department"
                  class="py-3 px-3 w-full border rounded-md"
                >
                  <option disabled value="">Select Department</option>
                  <option value="Office of the Mayor">
                    Office of the Mayor
                  </option>
                  <option value="Sangguniang Bayan Office">
                    Sangguniang Bayan Office
                  </option>
                  <option value="Municipal Planning and Development Office">
                    Municipal Planning and Development Office
                  </option>
                  <option value="Municipal Budget Office">
                    Municipal Budget Office
                  </option>
                  <option value="Municipal Accounting Office">
                    Municipal Accounting Office
                  </option>
                  <option value="Municipal Treasury Office">
                    Municipal Treasury Office
                  </option>
                  <option value="Municipal Assessor’s Office">
                    Municipal Assessor’s Office
                  </option>
                  <option value="Municipal Engineering Office">
                    Municipal Engineering Office
                  </option>
                  <option value="Municipal Health Office">
                    Municipal Health Office
                  </option>
                  <option
                    value="Municipal Social Welfare and Development Office"
                  >
                    Municipal Social Welfare and Development Office
                  </option>
                </select>
              </div>
            </div>

            <!-- Service Records -->
            <div class="mt-5">
              <div class="overflow-x-auto max-h-96 border">
                <table class="min-w-full text-[14px]">
                  <thead class="bg-gray-100 sticky top-0">
                    <tr>
                      <th colspan="2" class="border border-gray-400 px-2 py-3">
                        PERIOD
                      </th>
                      <th colspan="6" class="border border-gray-400 px-2 py-3">
                        RECORD OF APPOINTMENT
                      </th>
                      <th rowspan="2" class="border border-gray-400 px-2 py-3">
                        OFFICE
                      </th>
                      <th rowspan="2" class="border border-gray-400 px-2 py-3">
                        REMARKS
                      </th>
                      <th rowspan="2" class="border border-gray-400 px-2 py-3">
                        ACTION
                      </th>
                    </tr>
                    <tr>
                      <th class="border px-2 border-gray-400 py-3">FROM</th>
                      <th class="border px-2 border-gray-400 py-3">TO</th>
                      <th class="border px-2 border-gray-400 py-3">
                        DESIGNATION
                      </th>
                      <th class="border px-2 border-gray-400 py-3">SG</th>
                      <th class="border px-2 border-gray-400 py-3">STEP</th>
                      <th class="border px-2 border-gray-400 py-3">STATUS</th>
                      <th class="border px-2 border-gray-400 py-3">
                        BASIC SALARY
                      </th>
                      <th class="border px-2 border-gray-400 py-3">
                        DAILY RATE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(record, index) in form.serviceRecords"
                      :key="index"
                      class="hover:bg-gray-50"
                    >
                      <td class="border border-gray-400 px-2 py-1 text-center">
                        <input
                          v-model="record.period_from"
                          type="text"
                          class="border border-gray-400 rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-1 text-center">
                        <input
                          v-model="record.period_to"
                          type="text"
                          class="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-1 text-center">
                        <input
                          v-model="record.roa_designation"
                          type="text"
                          class="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-1 text-center">
                        <input
                          v-model="record.roa_sg"
                          type="text"
                          class="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-1 text-center">
                        <input
                          v-model="record.roa_step"
                          type="text"
                          class="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-1 text-center">
                        <input
                          v-model="record.roa_status"
                          type="text"
                          class="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-1 text-center">
                        <input
                          v-model="record.roa_basic_salary"
                          type="text"
                          class="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-1 text-center">
                        <input
                          v-model="record.roa_basic_salary_day"
                          type="text"
                          class="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-1 text-center">
                        <input
                          v-model="record.office"
                          type="text"
                          class="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-1 text-center">
                        <input
                          v-model="record.remarks"
                          type="text"
                          class="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-1 text-center">
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
          </div>
        </div>

        <!-- Submit and Cancel Button -->
        <div class="flex place-items-end justify-end gap-2 p-4">
          <button
            class="bg-gray-500 hover:bg-gray-300 px-5 py-2 rounded-md text-white hover:text-gray-700 transition-all duration-200"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            class="bg-green-600 hover:bg-green-200 px-5 py-2 rounded-md text-white hover:text-green-700 transition-all duration-200"
            @click="submitData"
          >
            Save Changes
          </button>
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
  components: {
    icon,
  },
  data() {
    return {
      form: {
        generated_service_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        birthdate: "",
        birth_place: "",
        serviceRecords: [],
        employee_id: "",
        department: "",
      },
    };
  },
  methods: {
    formatDate(record, field) {
      const input = record[field];
      if (!input) return;

      const cleaned = input.replace(/[-.]/g, "/");
      const date = new Date(cleaned);

      if (!isNaN(date)) {
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();
        record[field] = `${month}/${day}/${year}`;
      } else {
        record[field] = input;
      }
    },
    removeRow(index) {
      this.form.serviceRecords.splice(index, 1);
    },
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
    closeModal() {
      this.$emit("close");
    },
    generatedEmployeeID() {
      let lastId = localStorage.getItem("lastEmployeeID");
      let newId = lastId ? parseInt(lastId) + 1 : 100;
      return newId.toString();
    },
    async submitData() {
      this.form.generated_service_id = this.generatedEmployeeID();
      localStorage.setItem("lastEmployeeID", this.form.generated_service_id);

      if (this.form.serviceRecords.length === 0) {
        alert("Please add at least one service record before submitting.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8000/service-of-records/add-service",
          this.form
        );

        console.log("Data successfully submitted:", response.data);
        alert("Service record successfully added!");
        this.$emit("refresh");
        this.closeModal();
      } catch (error) {
        console.error("Error submitting data:", error);
        alert("Failed to submit data. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
/* Optional: Add styles for the child component */
</style>
