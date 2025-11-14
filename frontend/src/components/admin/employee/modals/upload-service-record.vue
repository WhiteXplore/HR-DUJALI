<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-screen"
  >
    <div
      class="flex justify-center items-center w-full max-w-md bg-white p-4 rounded-xl shadow-lg"
    >
      <div class="flex flex-col w-full">
        <!-- Header -->
        <div class="flex justify-start">
          <h1 class="font-semibold text-lg text-gray-800">
            Upload Employee Excel
          </h1>
        </div>

        <!-- Drag & Drop / Click Zone -->
        <div
          class="flex justify-center items-center cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-8 w-full max-w-xl mx-auto mt-3"
          :class="{ 'bg-gray-100': dragging }"
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
        >
          <div class="text-center">
            <p v-if="!file" class="text-gray-600">
              <span class="text-green-600">Upload a file</span> or drag and
              drop<br />
              Excel (.xlsx, .xls) up to 10MB
            </p>
            <p v-else class="text-green-600">File uploaded: {{ file.name }}</p>
            <input
              type="file"
              class="hidden"
              ref="fileInput"
              @change="handleFileChange"
              accept=".xlsx, .xls"
            />
          </div>
        </div>

        <!-- Accepted Files Info -->
        <div class="mt-3 text-[13px] flex justify-between text-left">
          <div>
            <p class="text-gray-600">Accepted Files: .xlsx, .xls</p>
            <p class="text-green-700">example.xlsx</p>
          </div>
        </div>

        <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

        <!-- Action Buttons -->
        <div class="tracking-wide flex justify-end gap-2 mt-4">
          <button
            class="bg-red-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            class="bg-green-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md"
            @click="uploadEmployees"
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
import * as XLSX from "xlsx";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
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
    handleFileChange(e) {
      if (e.target.files.length) this.file = e.target.files[0];
    },
    handleDrop(e) {
      this.dragging = false;
      if (e.dataTransfer.files.length) this.file = e.dataTransfer.files[0];
    },
    closeModal() {
      this.file = null;
      this.payload = [];
      this.$emit("close"); // optional: if parent needs to know
    },
    cellStr(val) {
      return val !== undefined && val !== null ? val.toString().trim() : "";
    },
    splitName(fullName) {
      const parts = fullName.split(" ").filter(Boolean);
      const first_name = parts[0] || "";
      const middle_name =
        parts.length > 2 ? parts.slice(1, -1).join(" ") : parts[1] || "";
      const last_name = parts.length > 1 ? parts[parts.length - 1] : "";
      return { first_name, middle_name, last_name };
    },
    formatDate(str) {
      const date = new Date(str);
      if (isNaN(date)) return "";
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    },
    parseExcel() {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const data = new Uint8Array(evt.target.result);
          const wb = XLSX.read(data, { type: "array" });
          const result = [];

          wb.SheetNames.forEach((sheetName) => {
            const ws = wb.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(ws, {
              header: 1,
              defval: "",
            });

            // Extract personal info
            const fullNameRow = rows.find((r) =>
              this.cellStr(r[0]).toLowerCase().includes("name")
            );
            const dobRow = rows.find((r) =>
              this.cellStr(r[0]).toLowerCase().includes("date of birth")
            );
            const pobRow = rows.find((r) =>
              this.cellStr(r[0]).toLowerCase().includes("place of birth")
            );
            const empRow = rows.find((r) =>
              this.cellStr(r[0]).toLowerCase().includes("employee id")
            );

            const fullName = fullNameRow?.[2] || "";
            const { first_name, middle_name, last_name } =
              this.splitName(fullName);

            const person = {
              first_name,
              middle_name,
              last_name,
              birthdate: this.formatDate(dobRow?.[2] || ""),
              birth_place: pobRow?.[2] || "",
              employee_id: empRow?.[2] || "",
              department: "",
              serviceRecords: [],
            };

            const startIndex = rows.findIndex(
              (r) =>
                this.cellStr(r[0]).toLowerCase().includes("from") &&
                this.cellStr(r[1]).toLowerCase().includes("to")
            );

            if (startIndex !== -1) {
              for (let i = startIndex + 1; i < rows.length; i++) {
                const row = rows[i];
                if (
                  !row ||
                  !row[0] ||
                  this.cellStr(row[0])
                    .toLowerCase()
                    .includes("issued in compliance")
                )
                  break;

                person.serviceRecords.push({
                  period_from: row[0] || "",
                  period_to: row[1] || "",
                  roa_designation: row[2] || "",
                  roa_sg: row[3] || "",
                  roa_step: row[4] || "",
                  roa_status: row[5] || "",
                  roa_basic_salary: row[6] || "",
                  roa_basic_salary_day: row[7] || "month",
                  office: row[8] || "",
                  remarks: row[9] || "",
                });
              }

              if (person.serviceRecords.length > 0) {
                const latestRecord =
                  person.serviceRecords[person.serviceRecords.length - 1];
                person.department = latestRecord.office || "";
              }
            }

            result.push(person);
          });

          resolve(result);
        };

        reader.readAsArrayBuffer(this.file);
      });
    },
    async uploadEmployees() {
      if (!this.file) return;
      this.uploading = true;

      try {
        this.payload = await this.parseExcel();
        await axios.post(
          process.env.VUE_APP_API_BASE_URL + "/service-of-records/bulk-import",
          this.payload
        );
        toast.success("Employees uploaded successfully!");
        this.closeModal();
        this.$emit("refresh");
      } catch (err) {
        console.error(err);
        toast.error("Upload failed!");
      } finally {
        this.uploading = false;
      }
    },
  },
};
</script>

<style scoped></style>
