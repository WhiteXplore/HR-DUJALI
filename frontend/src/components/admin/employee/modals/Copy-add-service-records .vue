<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-50 w-screen"
  >
    <div class="rounded-xl shadow-lg w-full max-w-7xl bg-white fixed top-20">
      <div class="text-text1 text-[14px] rounded-xl">
        <!-- Header -->
        <div
          class="w-full p-4 bg-white border-b text-gray-900 rounded-t-xl flex justify-between items-center"
        >
          <div class="flex items-center gap-1">
            <icon name="circle-add" />
            <h1 class="font-bold tracking-wide text-[15px]">
              Add Service Records
            </h1>
          </div>
          <icon
            name="circle-close3"
            @click="closeModal"
            class="cursor-pointer"
          />
        </div>

        <!-- Main Content -->
        <div class="p-4 space-y-4">
          <div class="text-gray-700 space-y-3 border-b pb-4">
            <!-- Row 1  -->
            <div class="flex flex-row gap-4">
              <div class="w-full flex-col text-left items-center space-y-1">
                <label for="first_name" class="font-bold">First Name</label>
                <input
                  id="first_name"
                  v-model="form.first_name"
                  type="text"
                  class="py-2 px-3 w-full border flex-1 rounded-md"
                  placeholder="Enter First Name"
                />
              </div>
              <div class="w-full flex-col text-left items-center space-y-1">
                <label for="middle_name" class="font-bold">Middle Name</label>
                <input
                  id="middle_name"
                  v-model="form.middle_name"
                  type="text"
                  class="py-2 px-3 w-full border flex-1 rounded-md"
                  placeholder="Enter Middle Name"
                />
              </div>

              <div class="w-full flex-col text-left items-center space-y-1">
                <label for="last_name" class="font-bold">Last Name</label>
                <input
                  id="last_name"
                  v-model="form.last_name"
                  type="text"
                  class="py-2 px-3 w-full border flex-1 rounded-md"
                  placeholder="Enter Last Name"
                />
              </div>
            </div>
            <!-- ROW 2  -->
            <div class="flex flex-row gap-4">
              <div class="w-full flex-col text-left items-center space-y-1">
                <label for="birthdate" class="font-bold">Date of Birth</label>
                <input
                  id="birthdate"
                  v-model="form.birthdate"
                  type="date"
                  class="py-2 px-3 w-full border flex-1 rounded-md"
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
                  class="py-2 px-3 w-full border flex-1 rounded-md"
                  placeholder="Enter Birth Place"
                />
              </div>
            </div>
            <!-- Service Records  -->
            <div class="mt-5">
              <!-- Scroll container with fixed max height and overflow -->
              <div
                class="overflow-x-auto max-h-[300px] overflow-y-auto border border-gray-300"
              >
                <table
                  class="min-w-full text-[14px] border border-gray-400 table-fixed"
                >
                  <thead class="bg-blue-200 sticky top-0 z-10">
                    <tr>
                      <th class="border border-gray-400 px-2 py-2" colspan="2">
                        PERIOD
                      </th>
                      <th class="border border-gray-400 px-2 py-2" colspan="6">
                        RECORD OF APPOINTMENT
                      </th>
                      <th class="border border-gray-400 px-2 py-2" rowspan="2">
                        OFFICE
                      </th>
                      <th class="border border-gray-400 px-2 py-2" rowspan="2">
                        REMARKS
                      </th>
                      <th class="border border-gray-400 px-2 py-2" rowspan="2">
                        ACTION
                      </th>
                    </tr>
                    <tr>
                      <th class="border border-gray-400 px-2 py-2">FROM</th>
                      <th class="border border-gray-400 px-2 py-2">TO</th>
                      <th class="border border-gray-400 px-2 py-2">
                        DESIGNATION
                      </th>
                      <th class="border border-gray-400 px-2 py-2">SG</th>
                      <th class="border border-gray-400 px-2 py-2">STEP</th>
                      <th class="border border-gray-400 px-2 py-2">STATUS</th>
                      <th class="border border-gray-400 px-2 py-2" colspan="2">
                        BASIC SALARY
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="(record, index) in form.serviceRecords"
                      :key="index"
                    >
                      <td class="border border-gray-400 px-2 py-3">
                        <input
                          type="text"
                          v-model="record.period_from"
                          @blur="formatDate(record, 'period_from')"
                          class="w-full text-xs rounded py-2 text-center"
                          placeholder="MM/DD/YYYY"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-2">
                        <input
                          type="text"
                          v-model="record.period_to"
                          @blur="formatDate(record, 'period_to')"
                          class="w-full text-xs rounded py-2 text-center"
                          placeholder="MM/DD/YYYY"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-2">
                        <input
                          type="text"
                          v-model="record.roa_designation"
                          class="w-full text-xs rounded py-2 text-center"
                          placeholder="Enter Designation"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-2">
                        <input
                          type="text"
                          v-model="record.roa_sg"
                          class="w-full text-xs rounded py-2 text-center"
                          placeholder="Enter SG"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-2">
                        <input
                          type="text"
                          v-model="record.roa_step"
                          class="w-full text-xs rounded py-2 text-center"
                          placeholder="Enter Step"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-2">
                        <input
                          type="text"
                          v-model="record.roa_status"
                          class="w-full text-xs rounded py-2 text-center"
                          placeholder="Enter Status"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-2 text-center">
                        <input
                          type="text"
                          v-model="record.roa_basic_salary"
                          class="w-full text-xs rounded py-2 text-center"
                          placeholder="Basic Salary"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-2 text-center">
                        <input
                          type="text"
                          v-model="record.roa_basic_salary_day"
                          class="w-full text-xs rounded py-2 text-center"
                          placeholder="Day or Month"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-2">
                        <input
                          type="text"
                          v-model="record.office"
                          class="w-full text-xs rounded py-2 text-center"
                          placeholder="Enter Office"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-2">
                        <input
                          type="text"
                          v-model="record.remarks"
                          class="w-full text-xs rounded py-2 text-center"
                          placeholder="Enter Remarks"
                        />
                      </td>
                      <td class="border border-gray-400 px-2 py-2">
                        <button
                          @click="removeRow(index)"
                          class="text-red-500 text-xs"
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
        <div class="flex place-items-end justify-end gap-2 p-5">
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
          process.env.VUE_APP_API_BASE_URL + "/service-of-records/add-service", // check if this is the correct POST route!
          this.form,
        );

        console.log("Data successfully submitted:", response.data);
        alert("Service record successfully added!");
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
