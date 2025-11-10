<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50 w-min-screen"
  >
    <div class="rounded-[15px] shadow-lg fixed top-20">
      <div class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg">
        <div
          class="w-full p-5 py-3 bg-blue-900 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-2 items-center">
            <icon :name="'download'" />
            <h1 class="font-bold tracking-wide text-lg">
              Upload Service Record
            </h1>
          </div>

          <icon
            :name="'circle-close3'"
            @click="closeModal"
            class="cursor-pointer"
          />
        </div>

        <!-- Content Here  -->
        <div class="w-[80vw] h-auto overflow-y-auto p-5">
          <!-- Row 1 -->
          <div class="flex flex-row gap-2 w-full mb-4">
            <div class="flex flex-col flex-1 text-left space-y-1">
              <label for="first_name" class="font-bold">First Name</label>
              <input
                id="first_name"
                v-model="form.first_name"
                type="text"
                class="py-2 px-3 w-full border rounded-md"
                placeholder="Enter First Name"
              />
            </div>
            <div class="flex flex-col flex-1 text-left space-y-1">
              <label for="middle_name" class="font-bold">Middle Name</label>
              <input
                id="middle_name"
                v-model="form.middle_name"
                type="text"
                class="py-2 px-3 w-full border rounded-md"
                placeholder="Enter Middle Name"
              />
            </div>
            <div class="flex flex-col flex-1 text-left space-y-1">
              <label for="last_name" class="font-bold">Last Name</label>
              <input
                id="last_name"
                v-model="form.last_name"
                type="text"
                class="py-2 px-3 w-full border rounded-md"
                placeholder="Enter Last Name"
              />
            </div>
          </div>

          <!-- Row 2 -->
          <div class="flex flex-row gap-2 w-full mb-6">
            <div class="flex flex-col flex-1 text-left space-y-1">
              <label for="birthdate" class="font-bold">Date of Birth</label>
              <input
                id="birthdate"
                v-model="form.birthdate"
                type="date"
                class="py-2 px-3 w-full border rounded-md"
              />
            </div>
            <div class="flex flex-col flex-1 text-left space-y-1">
              <label for="birth_place" class="font-bold">Place of Birth</label>
              <input
                id="birth_place"
                v-model="form.birth_place"
                type="text"
                class="py-2 px-3 w-full border rounded-md"
                placeholder="Enter Birth Place"
              />
            </div>
          </div>

          <!-- Second Content Here  -->
          <div class="w-full mb-6">
            <label class="font-semibold mb-1 block"
              >Paste Excel Rows Below:</label
            >
            <textarea
              v-model="pastedData"
              class="w-full h-[10vh] border border-gray-400 rounded-lg p-2 text-sm resize-none"
              placeholder="Paste rows like: 01/01/2023	09/30/2024	Licensing Officer II	15	4	Permanent	28,326.00	month	MAYORS Braulio E. Dujali	Salary Adjustment"
            ></textarea>

            <button
              class="mt-3 bg-blue-600 text-white text-xs px-4 py-2 rounded hover:bg-blue-500 transition"
              @click="handleSavePastedRows"
            >
              Save to Table
            </button>
          </div>

          <!-- Table Here   -->
          <div class="w-full mb-6">
            <div
              class="overflow-x-auto border border-gray-300 rounded-lg max-h-[300px]"
            >
              <table
                class="min-w-full text-sm text-left table-auto border-collapse"
              >
                <thead
                  class="bg-gray-100 sticky top-0 z-10 text-gray-700 uppercase text-xs"
                >
                  <tr>
                    <th
                      colspan="2"
                      class="px-3 py-2 border border-gray-300 text-center"
                    >
                      Period
                    </th>
                    <th
                      colspan="6"
                      class="px-3 py-2 border border-gray-300 text-center"
                    >
                      Record of Appointment
                    </th>
                    <th
                      rowspan="2"
                      class="px-3 py-2 border border-gray-300 text-center"
                    >
                      Office
                    </th>
                    <th
                      rowspan="2"
                      class="px-3 py-2 border border-gray-300 text-center"
                    >
                      Remarks
                    </th>
                    <th
                      rowspan="2"
                      class="px-3 py-2 border border-gray-300 text-center"
                    >
                      Action
                    </th>
                  </tr>
                  <tr>
                    <th class="px-3 py-2 border border-gray-300 text-center">
                      From
                    </th>
                    <th class="px-3 py-2 border border-gray-300 text-center">
                      To
                    </th>
                    <th class="px-3 py-2 border border-gray-300 text-center">
                      Designation
                    </th>
                    <th class="px-3 py-2 border border-gray-300 text-center">
                      SG
                    </th>
                    <th class="px-3 py-2 border border-gray-300 text-center">
                      Step
                    </th>
                    <th class="px-3 py-2 border border-gray-300 text-center">
                      Status
                    </th>
                    <th
                      colspan="2"
                      class="px-3 py-2 border border-gray-300 text-center"
                    >
                      Basic Salary
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(record, index) in form.serviceRecords"
                    :key="index"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-3 py-2 border border-gray-300">
                      <input
                        type="text"
                        v-model="record.period_from"
                        class="w-full text-xs px-2 py-1 border rounded text-center"
                        placeholder="MM/DD/YYYY"
                      />
                    </td>
                    <td class="px-3 py-2 border border-gray-300">
                      <input
                        type="text"
                        v-model="record.period_to"
                        class="w-full text-xs px-2 py-1 border rounded text-center"
                        placeholder="MM/DD/YYYY"
                      />
                    </td>
                    <td class="px-3 py-2 border border-gray-300">
                      <input
                        type="text"
                        v-model="record.roa_designation"
                        class="w-full text-xs px-2 py-1 border rounded text-center"
                        placeholder="Designation"
                      />
                    </td>
                    <td class="px-3 py-2 border border-gray-300">
                      <input
                        type="text"
                        v-model="record.roa_sg"
                        class="w-full text-xs px-2 py-1 border rounded text-center"
                        placeholder="SG"
                      />
                    </td>
                    <td class="px-3 py-2 border border-gray-300">
                      <input
                        type="text"
                        v-model="record.roa_step"
                        class="w-full text-xs px-2 py-1 border rounded text-center"
                        placeholder="Step"
                      />
                    </td>
                    <td class="px-3 py-2 border border-gray-300">
                      <input
                        type="text"
                        v-model="record.roa_status"
                        class="w-full text-xs px-2 py-1 border rounded text-center"
                        placeholder="Status"
                      />
                    </td>
                    <td class="px-3 py-2 border border-gray-300">
                      <input
                        type="text"
                        v-model="record.roa_basic_salary"
                        class="w-full text-xs px-2 py-1 border rounded text-center"
                        placeholder="Salary"
                      />
                    </td>
                    <td class="px-3 py-2 border border-gray-300">
                      <input
                        type="text"
                        v-model="record.roa_basic_salary_day"
                        class="w-full text-xs px-2 py-1 border rounded text-center"
                        placeholder="Day/Month"
                      />
                    </td>
                    <td class="px-3 py-2 border border-gray-300">
                      <input
                        type="text"
                        v-model="record.office"
                        class="w-full text-xs px-2 py-1 border rounded text-center"
                        placeholder="Office"
                      />
                    </td>
                    <td class="px-3 py-2 border border-gray-300">
                      <input
                        type="text"
                        v-model="record.remarks"
                        class="w-full text-xs px-2 py-1 border rounded text-center"
                        placeholder="Remarks"
                      />
                    </td>
                    <td class="px-3 py-2 border border-gray-300 text-center">
                      <button
                        @click="removeRow(index)"
                        class="text-red-600 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              class="mt-4 bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2 rounded shadow"
              @click="addRow"
            >
              Add Row
            </button>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-2 w-full">
            <button
              class="bg-red-700 hover:bg-red-600 text-white text-sm px-6 py-2 rounded transition"
              @click="closeModal"
            >
              Close
            </button>
            <button
              class="bg-blue-700 hover:bg-blue-600 text-white text-sm px-6 py-2 rounded transition"
              @click="submitData"
            >
              Submit All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import icon from "@/assets/icon.vue";
export default {
  components: {
    icon,
  },
  data() {
    return {
      pastedData: "",
      form: {
        first_name: "",
        middle_name: "",
        last_name: "",
        birthdate: "",
        birth_place: "",
        serviceRecords: [],
        generated_service_id: "",
        isOpen: true,
      },
    };
  },
  methods: {
    fillNA(value) {
      if (
        value === undefined ||
        value === null ||
        value.toString().trim() === ""
      ) {
        return "N/A";
      }
      return value;
    },
    handleSavePastedRows() {
      const rows = this.pastedData.trim().split(/\r?\n/);

      for (const row of rows) {
        const parts = row.trim().split(/\t+|\s{2,}/);

        this.form.serviceRecords.push({
          period_from: this.fillNA(parts[0]),
          period_to: this.fillNA(parts[1]),
          roa_designation: this.fillNA(parts[2]),
          roa_sg: this.fillNA(parts[3]),
          roa_step: this.fillNA(parts[4]),
          roa_status: this.fillNA(parts[5]),
          roa_basic_salary: this.fillNA((parts[6] || "").replace(/,/g, "")),
          roa_basic_salary_day: this.fillNA(parts[7]),
          office: this.fillNA(parts[8]),
          remarks: this.fillNA(parts.slice(9).join(" ")),
        });
      }

      this.pastedData = "";
    },
    addRow() {
      this.form.serviceRecords.push({
        period_from: "N/A",
        period_to: "N/A",
        roa_designation: "N/A",
        roa_sg: "N/A",
        roa_step: "N/A",
        roa_status: "N/A",
        roa_basic_salary: "N/A",
        roa_basic_salary_day: "N/A",
        office: "N/A",
        remarks: "N/A",
      });
    },
    removeRow(index) {
      this.form.serviceRecords.splice(index, 1);
    },
    generatedEmployeeID() {
      return "EMP-" + Date.now();
    },
    closeModal() {
      this.form.first_name = "";
      this.form.middle_name = "";
      this.form.last_name = "";
      this.form.birthdate = "";
      this.form.birth_place = "";
      this.form.serviceRecords = [];
      this.form.generated_service_id = "";
      this.isOpen = false;
      this.$emit("close");
    },
    sanitizeForm() {
      this.form.first_name = this.fillNA(this.form.first_name);
      this.form.middle_name = this.fillNA(this.form.middle_name);
      this.form.last_name = this.fillNA(this.form.last_name);
      this.form.birthdate = this.fillNA(this.form.birthdate);
      this.form.birth_place = this.fillNA(this.form.birth_place);

      this.form.serviceRecords = this.form.serviceRecords.map((record) => ({
        period_from: this.fillNA(record.period_from),
        period_to: this.fillNA(record.period_to),
        roa_designation: this.fillNA(record.roa_designation),
        roa_sg: this.fillNA(record.roa_sg),
        roa_step: this.fillNA(record.roa_step),
        roa_status: this.fillNA(record.roa_status),
        roa_basic_salary: this.fillNA(record.roa_basic_salary),
        roa_basic_salary_day: this.fillNA(record.roa_basic_salary_day),
        office: this.fillNA(record.office),
        remarks: this.fillNA(record.remarks),
      }));
    },
    async submitData() {
      this.sanitizeForm();

      this.form.generated_service_id = this.generatedEmployeeID();

      console.log("Submitting Data:", JSON.stringify(this.form, null, 2)); // Log saved data in console

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
        toast.success("Service record successfully added!");
        this.closeModal();
      } catch (error) {
        toast.error("Failed to submit data. Please try again.");
      }
    },
  },
};
</script>
