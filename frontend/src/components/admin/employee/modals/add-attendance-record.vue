<template>
  <div class="p-4">
    <div class="flex justify-start" @click="toggleBack">
      <div
        class="cursor-pointer text-red-800 hover:text-white border-red-800 border px-2 py-1 text-sm rounded-md hover:bg-red-800"
      >
        Back
      </div>
    </div>
    <h2 class="text-xl font-semibold mb-4">Upload Attendance Records</h2>

    <!-- CSV Upload -->
    <input
      type="file"
      accept=".csv"
      @change="handleFileUpload"
      ref="fileInput"
      class="mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />

    <!-- Wrap the table in a div with horizontal scroll -->
    <div class="overflow-x-auto max-w-full mb-4" style="max-height: 65vh">
      <table
        v-if="form.attendanceRecords.length"
        class="min-w-full border-collapse border border-gray-300"
      >
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 p-2 text-left">Date</th>
            <th class="border border-gray-300 p-2 text-left">Employee ID</th>
            <th class="border border-gray-300 p-2 text-left">Name</th>
            <th class="border border-gray-300 p-2 text-left">In AM</th>
            <th class="border border-gray-300 p-2 text-left">Out AM</th>
            <th class="border border-gray-300 p-2 text-left">In PM</th>
            <th class="border border-gray-300 p-2 text-left">Out PM</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(record, index) in form.attendanceRecords"
            :key="index"
            class="even:bg-gray-50"
          >
            <td class="border border-gray-300 p-2">{{ record.date }}</td>
            <td class="border border-gray-300 p-2">{{ record.employee_id }}</td>
            <td class="border border-gray-300 p-2">{{ record.name }}</td>
            <td class="border border-gray-300 p-2">{{ record.in_am }}</td>
            <td class="border border-gray-300 p-2">{{ record.out_am }}</td>
            <td class="border border-gray-300 p-2">{{ record.in_pm }}</td>
            <td class="border border-gray-300 p-2">{{ record.out_pm }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Upload Button -->
    <button
      class="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      :disabled="loading || !form.attendanceRecords.length"
      @click="uploadAttendanceRecords"
    >
      {{ loading ? "Uploading..." : "Upload Records" }}
    </button>

    <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
    <div v-if="success" class="text-green-600 mt-2">{{ success }}</div>
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
    };
  },
  methods: {
    toggleBack() {
      this.$emit("back-to-table-service");
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

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
            (field) => !results.meta.fields.includes(field)
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
      // Try to parse and convert to YYYY-MM-DD format
      const parsedDate = new Date(dateStr);
      if (isNaN(parsedDate)) {
        console.warn(`Invalid date encountered: "${dateStr}" - sending as is.`);
        return dateStr; // fallback to original if invalid
      }
      return parsedDate.toISOString().split("T")[0];
    },

    groupDataByName() {
      // Group records by employee name, keep employee_id and records array
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

      // Filter out invalid or empty groups before uploading
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
                r.out_pm !== null)
          )
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
          JSON.stringify(this.groupedData, null, 2)
        );

        const response = await axios.post(
          process.env.VUE_APP_API_BASE_URL + "/attendance-record/bulk",
          this.groupedData
        );

        toast.success("Service record successfully added!");
        console.log("Upload response:", response.data);

        // Clear form after success
        this.form.attendanceRecords = [];
        this.groupedData = null;
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
table {
  border-spacing: 0;
  border: 1px solid #ddd;
}
th,
td {
  padding: 8px 12px;
  border: 1px solid #ddd;
}
</style>
