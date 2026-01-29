<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-screen"
  >
    <div
      class="flex justify-center items-center w-full max-w-md bg-white p-4 rounded-xl shadow-lg"
    >
      <!-- Upload File Content -->
      <div class="flex flex-col w-full">
        <!-- Title -->
        <div class="flex justify-start">
          <h1 class="font-semibold text-lg text-gray-800">
            Upload Attendance CSV
          </h1>
        </div>

        <!-- Drag & Drop File Upload -->
        <div
          class="flex justify-center items-center cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-8 w-full max-w-xl mx-auto mt-3"
          :class="{ 'bg-green-100': dragging }"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
          @click="triggerFileInput"
        >
          <div class="text-center">
            <p v-if="!file" class="text-gray-600">
              <span class="text-green1">Upload a file</span> or drag and drop<br />
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

        <!-- Reminders -->
        <div class="mt-3 text-[14px] flex justify-between text-left">
          <div>
            <p class="text-gray-600">Accepted Files: .csv</p>
            <p class="text-green-700">example.csv</p>
          </div>
        </div>

        <!-- Divider -->
        <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

        <!-- Buttons -->
        <div class="tracking-wide flex justify-end gap-2 mt-4">
          <button
            class="bg-red-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            class="bg-green-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md"
            @click="uploadAttendanceRecords"
            :disabled="loading"
          >
            Upload
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
  data() {
    return {
      form: {
        attendanceRecords: [],
      },
      groupedData: null,
      loading: false,
      error: null,
      success: null,
      dragging: false,
      file: null,
    };
  },
  methods: {
    closeModal() {
      this.$emit("close"); // or your actual close modal logic
    },
    onDragOver() {
      this.dragging = true;
    },
    onDragLeave() {
      this.dragging = false;
    },
    onDrop(event) {
      this.dragging = false;
      const files = event.dataTransfer.files;
      if (files.length) {
        this.handleFileUpload({ target: { files } });
        this.file = files[0];
      }
    },
    onFileChange(event) {
      this.handleFileUpload(event);
      this.file = event.target.files[0];
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit");
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const requiredFields = [
            "date",
            "employee_id",
            "name",
            "in_am",
            "out_am",
            "in_pm",
            "out_pm",
          ];
          const missingFields = requiredFields.filter(
            (field) => !results.meta.fields.includes(field),
          );

          if (missingFields.length) {
            alert("Missing columns in CSV: " + missingFields.join(", "));
            return;
          }

          this.form.attendanceRecords = results.data.map((row) => ({
            date: this.formatDateToISO(row.date),
            employee_id: row.employee_id?.trim() || "",
            name: row.name?.trim() || "",
            in_am: row.in_am || null,
            out_am: row.out_am || null,
            in_pm: row.in_pm || null,
            out_pm: row.out_pm || null,
          }));

          this.groupDataByName();

          this.$refs.fileInput.value = null;
        },
        error: (err) => {
          alert("Error parsing file: " + err.message);
        },
      });
    },
    formatDateToISO(dateStr) {
      const parsedDate = new Date(dateStr);
      if (isNaN(parsedDate)) {
        console.warn(`Invalid date encountered: "${dateStr}" - sending as is.`);
        return dateStr;
      }
      return parsedDate.toISOString().split("T")[0];
    },
    groupDataByName() {
      const grouped = this.form.attendanceRecords.reduce((acc, record) => {
        if (!acc[record.name]) {
          acc[record.name] = {
            employee_id: record.employee_id,
            name: record.name,
            records: [],
          };
        }
        acc[record.name].records.push({
          date: record.date,
          in_am: record.in_am,
          out_am: record.out_am,
          in_pm: record.in_pm,
          out_pm: record.out_pm,
        });
        return acc;
      }, {});

      this.groupedData = Object.values(grouped);
    },
    async uploadAttendanceRecords() {
      if (!this.groupedData || !this.groupedData.length) {
        alert("No attendance data to upload!");
        return;
      }

      this.groupedData = this.groupedData.filter(
        (group) =>
          group.employee_id.trim() !== "" &&
          group.name.trim() !== "" &&
          group.records.some(
            (r) =>
              r.date &&
              (r.in_am !== null ||
                r.out_am !== null ||
                r.in_pm !== null ||
                r.out_pm !== null),
          ),
      );

      if (!this.groupedData.length) {
        alert("No valid attendance data to upload after filtering!");
        return;
      }

      this.loading = true;
      this.error = null;
      this.success = null;

      try {
        console.log(
          "Data sent to API:",
          JSON.stringify(this.groupedData, null, 2),
        );

        const response = await axios.post(
          process.env.VUE_APP_API_BASE_URL + "/attendance-record/bulk",
          this.groupedData,
        );
        this.$emit("refresh");
        this.$emit("close");
        toast.success("Service record successfully added!");
        console.log("Upload response:", response.data);

        // Clear form after success
        this.form.attendanceRecords = [];
        this.groupedData = null;
        this.file = null;
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || "Upload failed";
        console.error("Upload error:", err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Example styling for dragging effect */
.bg-green-100 {
  background-color: #dcfce7 !important;
}
</style>
