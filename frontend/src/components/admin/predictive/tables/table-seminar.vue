<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-screen"
  >
    <div
      class="flex justify-center items-center w-full max-w-md bg-white p-4 rounded-xl shadow-lg"
    >
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
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
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
            :disabled="loading || !file"
          >
            <span v-if="loading">Uploading...</span>
            <span v-else>Upload</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const fileInput = ref(null);
const file = ref(null);
const dragging = ref(false);
const loading = ref(false);
const groupedRecords = ref({});

const triggerFileInput = () => fileInput.value.click();
const onFileChange = (e) => (file.value = e.target.files[0]);
const onDrop = (e) => {
  dragging.value = false;
  file.value = e.dataTransfer.files[0];
};
const closeModal = () => {
  /* implement modal close logic */
};

// Convert AM/PM time to 24-hour HH:MM:SS
function convertTo24Hour(timeStr) {
  if (!timeStr) return null;
  timeStr = timeStr.trim();
  const match = timeStr.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3];
  if (period) {
    if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
  }
  return `${hours.toString().padStart(2, "0")}:${minutes}:00`;
}

// Convert MM/DD/YY to YYYY-MM-DD for MySQL
function convertToDateSQL(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("/").map((p) => parseInt(p.trim(), 10));
  if (parts.length !== 3) return null;
  let [month, day, year] = parts;
  if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
  if (year < 100) year += 2000;
  const jsDate = new Date(year, month - 1, day);
  if (isNaN(jsDate.getTime())) return null;
  return `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
}

const uploadAttendanceRecords = async () => {
  if (!file.value) return;
  loading.value = true;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const text = e.target.result;

    // Parse CSV
    const rows = text
      .split(/\r?\n/)
      .map((r) => r.split(",").map((c) => c.trim()));

    groupedRecords.value = {};
    let currentEmployee = null;
    let tableStartIndex = 0;

    for (let i = 0; i < rows.length; i++) {
      const rowText = rows[i].join("");
      const empMatch = rowText.match(/Employee:\s*\[(\d+)\]\s*(.+)/);
      if (empMatch) {
        currentEmployee = empMatch[1];
        let employeeName = empMatch[2].trim();
        if (
          (employeeName.startsWith('"') && employeeName.endsWith('"')) ||
          (employeeName.startsWith("'") && employeeName.endsWith("'"))
        ) {
          employeeName = employeeName.slice(1, -1);
        }
        employeeName = employeeName.replace(/\\*"?$/, "");

        groupedRecords.value[currentEmployee] = {
          employeeId: currentEmployee,
          employeeName,
          attendance: [],
        };
        tableStartIndex = i + 4;
        i = tableStartIndex - 1;
        continue;
      }

      if (currentEmployee && i >= tableStartIndex) {
        const rowObj = {
          Schedule: rows[i][0]?.replace(/["\\]/g, "").trim() || "",
          Date: rows[i][1]?.replace(/["\\]/g, "").trim().split(" ")[0] || "",
          SchdIn:
            rows[i][2]?.replace(/["\\]/g, "").trim() ||
            rows[i][3]?.replace(/["\\]/g, "").trim() ||
            "",
          SchdOut:
            rows[i][4]?.replace(/["\\]/g, "").trim() ||
            rows[i][5]?.replace(/["\\]/g, "").trim() ||
            "",
          LogIn:
            rows[i][6]?.replace(/["\\]/g, "").trim() ||
            rows[i][8]?.replace(/["\\]/g, "").trim() ||
            "",
          LogOut:
            rows[i][7]?.replace(/["\\]/g, "").trim() ||
            rows[i][9]?.replace(/["\\]/g, "").trim() ||
            "",
          Remarks:
            rows[i][16]?.replace(/["\\]/g, "").trim() ||
            rows[i][17]?.replace(/["\\]/g, "").trim() ||
            "",
        };

        const scheduleLower = rowObj.Schedule.toLowerCase();
        const isValidRow =
          rowObj.Date &&
          !scheduleLower.includes("total") &&
          !scheduleLower.includes("employee signature") &&
          !scheduleLower.includes("printed on") &&
          !scheduleLower.includes("i certify") &&
          !scheduleLower.includes("employee daily time attendance") &&
          !rowObj.Date.toLowerCase().includes("aug");

        if (isValidRow) {
          groupedRecords.value[currentEmployee].attendance.push(rowObj);
        }
      }
    }

    // Prepare payload
    const finalPayload = [];

    for (const empKey in groupedRecords.value) {
      const emp = groupedRecords.value[empKey];
      const mergedByDate = {};

      emp.attendance.forEach((row) => {
        const dateKey = row.Date;
        if (!mergedByDate[dateKey]) {
          mergedByDate[dateKey] = {
            Date: dateKey,
            in_am: null,
            out_am: null,
            in_pm: null,
            out_pm: null,
          };
        }
        if (row.SchdIn.startsWith("08") || row.SchdIn.includes("AM")) {
          mergedByDate[dateKey].in_am = convertTo24Hour(row.LogIn);
          mergedByDate[dateKey].out_am = convertTo24Hour(row.LogOut);
        } else if (row.SchdIn.startsWith("01") || row.SchdIn.includes("PM")) {
          mergedByDate[dateKey].in_pm = convertTo24Hour(row.LogIn);
          mergedByDate[dateKey].out_pm = convertTo24Hour(row.LogOut);
        }
      });

      const recordsData = Object.values(mergedByDate)
        .map((r) => {
          const convertedDate = convertToDateSQL(r.Date);
          if (!convertedDate) return null;
          return {
            date: convertedDate,
            in_am: r.in_am,
            out_am: r.out_am,
            in_pm: r.in_pm,
            out_pm: r.out_pm,
          };
        })
        .filter((r) => r !== null);

      if (recordsData.length) {
        finalPayload.push({
          employee_id: emp.employeeId,
          name: emp.employeeName,
          records: recordsData,
        });
      }
    }
    console.log(
      "Payload going to backend:",
      JSON.stringify(finalPayload, null, 2),
    );

    // Send to API
    try {
      const response = await fetch(
        process.env.VUE_APP_API_BASE_URL + "/attendance-record/bulk",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalPayload),
        },
      );
      if (!response.ok) throw new Error("Upload failed");
      alert("Attendance uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to upload attendance. Check console.");
    } finally {
      loading.value = false;
    }
  };

  reader.readAsText(file.value, "UTF-8");
};
</script>
