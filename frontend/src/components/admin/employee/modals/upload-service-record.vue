<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-screen"
  >
    <div
      class="flex justify-center items-center w-full max-w-md bg-white p-4 rounded-xl shadow-lg"
    >
      <div class="flex flex-col w-full">
        <div class="flex justify-start">
          <h1 class="font-semibold text-lg text-gray-800">
            Upload Employee CSV
          </h1>
        </div>

        <div
          class="flex justify-center items-center cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-8 w-full max-w-xl mx-auto mt-3"
          :class="{ 'bg-gray-100': dragging }"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
          @click="triggerFileInput"
        >
          <div class="text-center">
            <p v-if="!file" class="text-gray-600">
              <span class="text-green-600">Upload a file</span> or drag and
              drop<br />
              CSV up to 10MB
            </p>
            <p v-else class="text-green-600">File uploaded: {{ file.name }}</p>
            <input
              type="file"
              class="hidden"
              ref="fileInput"
              @change="onFileChange"
              accept=".csv"
            />
          </div>
        </div>

        <div class="mt-3 text-[13px] flex justify-between text-left">
          <div>
            <p class="text-gray-600">Accepted Files: .csv</p>
            <p class="text-green-700">example.csv</p>
          </div>
        </div>

        <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

        <div class="tracking-wide flex justify-end gap-2 mt-4">
          <button
            class="bg-red-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            class="bg-green-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md"
            @click="submitData"
            :disabled="!file || uploading"
          >
            {{ uploading ? "Uploading..." : "Upload" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Papa from "papaparse";
import axios from "axios";
import { toast } from "vue3-toastify";

export default {
  props: {
    isOpen: Boolean,
  },
  data() {
    return {
      file: null,
      dragging: false,
      payload: [],
      uploading: false,
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onDragOver() {
      this.dragging = true;
    },
    onDragLeave() {
      this.dragging = false;
    },
    onDrop(e) {
      this.dragging = false;
      if (e.dataTransfer.files.length) {
        this.file = e.dataTransfer.files[0];
      }
    },
    onFileChange(e) {
      if (e.target.files.length) {
        this.file = e.target.files[0];
      }
    },
    closeModal() {
      this.file = null;
      this.payload = [];
      this.$emit("close");
    },
    formatDate(input) {
      const date = new Date(input);
      if (isNaN(date.getTime())) return null;
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    },
    submitData() {
      if (!this.file) return;

      this.uploading = true;

      Papa.parse(this.file, {
        header: false,
        skipEmptyLines: true,
        complete: async (results) => {
          const rows = results.data;
          const employees = [];
          let currentEmployee = null;
          let serviceRecords = [];
          let insideServiceRecords = false;

          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0) continue;

            const cell = (index) =>
              row[index] ? row[index].toString().trim() : "";

            // Detect new employee
            if (cell(0) === "Name") {
              if (currentEmployee) {
                currentEmployee.serviceRecords = serviceRecords;
                employees.push(currentEmployee);
              }
              const fullName = cell(2);
              const nameParts = fullName.split(" ");
              currentEmployee = {
                first_name: nameParts[0] || "",
                middle_name: nameParts.length > 2 ? nameParts[1] : "",
                last_name:
                  nameParts.length > 2
                    ? nameParts.slice(2).join(" ")
                    : nameParts[1] || "",
                birthdate: "",
                birth_place: "",
                employee_id: "",
                department: "Municipal Health Office",
                serviceRecords: [],
              };
              serviceRecords = [];
              insideServiceRecords = false;
              continue;
            }

            if (!currentEmployee) continue;

            if (cell(0) === "Date of Birth")
              currentEmployee.birthdate = this.formatDate(cell(2));
            if (cell(0) === "Place of Birth")
              currentEmployee.birth_place = cell(2);
            if (cell(0) === "Employee ID")
              currentEmployee.employee_id = cell(2);

            if (cell(0) === "FROM" && cell(1) === "TO") {
              insideServiceRecords = true;
              i++; // skip header row
              continue;
            }

            if (insideServiceRecords) {
              if (!cell(0)) {
                insideServiceRecords = false;
                continue;
              }
              serviceRecords.push({
                period_from: cell(0),
                period_to: cell(1),
                roa_designation: cell(2),
                roa_sg: cell(3),
                roa_step: cell(4),
                roa_status: cell(5),
                roa_basic_salary: cell(6).replace(/[^0-9.]/g, ""),
                roa_basic_salary_day: cell(7) || "month",
                office: cell(8),
                remarks: cell(9),
              });
            }
          }

          if (currentEmployee) {
            currentEmployee.serviceRecords = serviceRecords;
            employees.push(currentEmployee);
          }

          this.payload = employees;

          // LOG PAYLOAD TO CONSOLE
          console.log(
            "Parsed Employee Payload:",
            JSON.stringify(employees, null, 2)
          );

          try {
            await axios.post(
              "http://localhost:8000/service-of-records/bulk-import",
              employees
            );
            toast.success("Employees uploaded successfully!");
            this.closeModal();
          } catch (error) {
            console.error(error);
            alert("Upload failed!");
          } finally {
            this.uploading = false;
          }
        },
      });
    },
  },
};
</script>

<style scoped></style>
