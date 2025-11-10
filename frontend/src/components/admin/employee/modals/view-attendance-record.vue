<template>
  <div class="mt-4 overflow-x-auto border p-2 rounded-xl" v-if="isOpenView">
    <!-- Main Content -->
    <div class="p-2">
      <div class="flex justify-between">
        <div
          @click="toggleBack"
          class="cursor-pointer text-red-800 hover:text-white border-red-800 border p-2 py-1.5 text-sm rounded-md hover:bg-red-800"
        >
          Back
        </div>
        <div
          class="px-2 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition flex gap-1 text-sm items-center"
        >
          <icon name="download1" />
          <button @click="downloadAttendancePDF">Download PDFs</button>
        </div>
      </div>
      <div class="max-h-screen h-[80vh] overflow-auto">
        <div ref="attendanceReport" class="bg-white p-5 text-gray-900 relative">
          <div v-if="matchingRecord && matchingRecord.length">
            <!-- Header -->
            <div class="text-center font-semibold">
              <h1>Republic of the Philippines</h1>
              <h1>Province of Davao del Norte</h1>
              <h1>Municipality of Braulio E. Dujali</h1>
              <h1 class="mt-5 font-bold text-lg">Attendance Record</h1>
            </div>

            <!-- Employee Profile -->
            <div class="text-left mt-5 text-sm flex justify-between">
              <div class="flex gap-3">
                <h2>Full Name:</h2>
                <p class="font-bold">{{ matchingRecord[0].name }}</p>
              </div>
              <div class="flex gap-3">
                <h2>Employee ID:</h2>
                <p class="font-bold">{{ matchingRecord[0].employee_id }}</p>
              </div>
            </div>

            <!-- Sub Header -->
            <div class="text-justify mt-5 text-sm">
              This certifies that the employee named above has rendered
              attendance as recorded below. Each entry corresponds to the actual
              time the employee checked in and out during the period of service.
            </div>

            <!-- Legend -->
            <div
              class="mt-4 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-[13px] flex flex-wrap gap-x-20 text-center justify-center"
            >
              <div><strong>AHW</strong> - Actual Hours Worked</div>
              <div><strong>OHW</strong> - Official Hours Worked</div>
              <div><strong>OT</strong> - Overtime</div>
              <div><strong>LT</strong> - Lates</div>
              <div><strong>UT</strong> - Undertime</div>
            </div>

            <!-- Attendance Table -->
            <div class="overflow-auto">
              <table class="min-w-full border border-gray-300 text-[13px] mt-5">
                <thead>
                  <tr class="bg-gray-50 text-center">
                    <th rowspan="2" class="border px-2 py-2">Date</th>
                    <th rowspan="2" class="border px-2 py-2">Day</th>
                    <th rowspan="2" class="border px-2 py-2">In</th>
                    <th colspan="2" class="border px-2 py-2">Break</th>
                    <th rowspan="2" class="border px-2 py-2">Out</th>
                    <!-- <th rowspan="2" class="border px-2 py-2"></th> -->
                    <th rowspan="2" class="border px-2 py-2">AHW</th>
                    <th rowspan="2" class="border px-2 py-2">OHW</th>
                    <th rowspan="2" class="border px-2 py-2">OT</th>
                    <th rowspan="2" class="border px-2 py-2">LT</th>
                    <th rowspan="2" class="border px-2 py-2">UT</th>
                    <th rowspan="2" class="border px-2 py-2">Remarks</th>
                  </tr>
                  <tr class="bg-gray-50 text-center">
                    <th class="border px-2 py-2">Out</th>
                    <th class="border px-2 py-2">In</th>
                  </tr>
                </thead>
                <tbody>
                  <template
                    v-for="employee in matchingRecord"
                    :key="employee.employee_id"
                  >
                    <tr
                      v-for="record in employee.records"
                      :key="employee.employee_id + '-' + record.date"
                      class="text-center hover:bg-gray-50"
                    >
                      <td class="border px-2 py-2">
                        {{ formatDate(record.date) }}
                      </td>
                      <td class="border px-2 py-2">
                        {{ getDayName(record.date) }}
                      </td>
                      <td class="border px-2 py-2">
                        {{ formatTimeTo12Hour(record.in_am, false) }}
                      </td>
                      <td class="border px-2 py-2">
                        {{ formatTimeTo12Hour(record.out_am, false) }}
                      </td>
                      <td class="border px-2 py-2">
                        {{ formatTimeTo12Hour(record.in_pm, true) }}
                      </td>
                      <td class="border px-2 py-2">
                        {{ formatTimeTo12Hour(record.out_pm, true) }}
                      </td>
                      <!-- <td class="border px-2 py-2">-</td> -->
                      <td class="border px-2 py-2">
                        {{
                          displayZeroAsEmpty(getRawHoursFormatted(record), true)
                        }}
                      </td>

                      <td class="border px-2 py-2">
                        <span v-if="getRawHours(record) > 0">
                          {{ displayZeroAsEmpty("8.0") }}
                        </span>
                      </td>

                      <td class="border px-2 py-2">
                        <span v-if="getRawHours(record) > 8">
                          {{ displayZeroAsEmpty(getOvertime(record)) }}
                        </span>
                      </td>

                      <td class="border px-2 py-2">
                        {{ displayZeroAsEmpty(getLateness(record)) }}
                      </td>
                      <td class="border px-2 py-2">
                        <span v-if="getRawHours(record) > 0">
                          {{ displayZeroAsEmpty(getUndertime(record)) }}
                        </span>
                      </td>

                      <td class="border px-2 py-2">
                        {{ getStatusForDay(record) }}
                      </td>
                    </tr>
                  </template>
                </tbody>
                <tfoot>
                  <template
                    v-for="employee in matchingRecord"
                    :key="employee.employee_id + '-summary'"
                  >
                    <tr
                      class="bg-gray-50 font-semibold text-sm text-center border"
                    >
                      <td colspan="13" class="border px-2 py-1">Gross</td>
                    </tr>
                    <tr class="text-[13px] text-center border">
                      <td colspan="4" class="border px-2 py-1">
                        Actual Hours Worked (AHW):
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        {{ totalAHW(employee).toFixed(2) }}
                      </td>
                      <td colspan="2" class="border px-2 py-1">Late (LT):</td>
                      <td colspan="2" class="border px-2 py-1">
                        {{ totalLate(employee).toFixed(2) }}
                      </td>
                      <td colspan="3" class="border px-2 py-1"></td>
                    </tr>
                    <tr class="text-[13px] text-center border">
                      <td colspan="4" class="border px-2 py-1">
                        Official Hours Worked (OHW):
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        {{ (employee.records.length * 8).toFixed(2) }}
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        Undertime (UT):
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        {{ totalUT(employee).toFixed(2) }}
                      </td>
                      <td colspan="3" class="border px-2 py-1"></td>
                    </tr>
                    <tr class="text-[13px] text-center border">
                      <td colspan="4" class="border px-2 py-1">
                        Overtime (OT):
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        {{ totalOT(employee).toFixed(2) }}
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        Days Present (DP):
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        {{ totalPresentDays(employee) }}
                      </td>
                      <td colspan="3" class="border px-2 py-1"></td>
                    </tr>
                    <tr
                      class="bg-gray-50 font-semibold text-sm text-center border"
                    >
                      <td colspan="13" class="border px-2 py-1">Net</td>
                    </tr>
                    <tr class="text-[13px] text-center font-semibold border">
                      <td colspan="4" class="border px-2 py-1">
                        Total Hours Worked [(DP×8) + OT]
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        {{
                          (
                            totalPresentDays(employee) * 8 +
                            totalOT(employee)
                          ).toFixed(2)
                        }}
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        Total Deductions (LT + UT)
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        {{
                          (totalLate(employee) + totalUT(employee)).toFixed(2)
                        }}
                      </td>
                      <td colspan="3" class="border px-2 py-1">
                        Total Days Present:
                        {{
                          (
                            (totalAHW(employee) -
                              totalLate(employee) -
                              totalUT(employee)) /
                            8
                          ).toFixed(2)
                        }}
                      </td>
                    </tr>
                  </template>
                </tfoot>
              </table>
            </div>
          </div>
          <div v-else>No matching record found.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;
export default {
  name: "ViewServiceRecords",
  props: {
    attendanceId: { type: [String, Number], required: true },
  },
  components: { icon },
  data() {
    return {
      isOpenView: true,
      matchingRecord: [],
      isDownloadAlertOpen: false,
    };
  },
  watch: {
    "$route.params.date": "fetchAttendanceRecords",
    attendanceId: "fetchAttendanceRecords",
  },
  methods: {
    downloadAttendancePDF() {
      const employee = this.matchingRecord[0];
      if (!employee) return;

      const numCols = 12;

      // --- Table Header ---
      const tableBody = [
        [
          "Date",
          "Day",
          "In",
          "Out (AM)",
          "In (PM)",
          "Out",
          "AHW",
          "OHW",
          "OT",
          "LT",
          "UT",
          "Remarks",
        ],
      ];

      // --- Employee Attendance Rows ---
      employee.records.forEach((rec) => {
        tableBody.push([
          new Date(rec.date).getDate(), // just day number
          this.getDayName(rec.date),
          this.formatTimeTo12Hour(rec.in_am),
          this.formatTimeTo12Hour(rec.out_am),
          this.formatTimeTo12Hour(rec.in_pm, true),
          this.formatTimeTo12Hour(rec.out_pm, true),
          this.displayZeroAsEmpty(this.getRawHoursFormatted(rec), true),
          rec ? "8.00" : "",
          this.getRawHours(rec) > 8 ? this.getOvertime(rec) : "",
          this.getLateness(rec),
          this.getRawHours(rec) > 0 ? this.getUndertime(rec) : "",
          this.getStatusForDay(rec),
        ]);
      });

      // --- Helper to add summary rows with colSpan ---
      const addSummaryRow = (cells) => {
        const row = [];
        cells.forEach((cell) => {
          if (cell.colSpan && cell.colSpan > 1) {
            row.push(cell);
            for (let i = 1; i < cell.colSpan; i++) row.push({ _span: true });
          } else {
            row.push(cell);
          }
        });
        while (row.length < numCols) row.push({ text: "" });
        tableBody.push(row);
      };

      // --- Summary Rows ---
      addSummaryRow([{ text: "Gross", colSpan: numCols, alignment: "center" }]);
      addSummaryRow([
        { text: "Actual Hours Worked (AHW)", colSpan: 4 },
        { text: this.totalAHW(employee).toFixed(2), colSpan: 2 },
        { text: "Late (LT)", colSpan: 2 },
        { text: this.totalLate(employee).toFixed(2), colSpan: 2 },
        { text: "" },
      ]);
      addSummaryRow([
        { text: "Official Hours Worked (OHW)", colSpan: 4 },
        { text: (employee.records.length * 8).toFixed(2), colSpan: 2 },
        { text: "Undertime (UT)", colSpan: 2 },
        { text: this.totalUT(employee).toFixed(2), colSpan: 2 },
        { text: "" },
      ]);
      addSummaryRow([
        { text: "Overtime (OT)", colSpan: 4 },
        { text: this.totalOT(employee).toFixed(2), colSpan: 2 },
        { text: "Days Present (DP)", colSpan: 2 },
        { text: this.totalPresentDays(employee), colSpan: 2 },
        { text: "" },
      ]);
      addSummaryRow([{ text: "Net", colSpan: numCols, alignment: "center" }]);
      addSummaryRow([
        { text: "Total Hours Worked [(DP×8) + OT]", colSpan: 4 },
        {
          text: (
            this.totalPresentDays(employee) * 8 +
            this.totalOT(employee)
          ).toFixed(2),
          colSpan: 2,
        },
        { text: "Total Deductions (LT + UT)", colSpan: 2 },
        {
          text: (this.totalLate(employee) + this.totalUT(employee)).toFixed(2),
          colSpan: 2,
        },
        {
          text: `Total Days Present: ${(
            (this.totalAHW(employee) -
              this.totalLate(employee) -
              this.totalUT(employee)) /
            8
          ).toFixed(2)}`,
          colSpan: 2,
        },
      ]);

      // --- PDF Definition ---
      const docDefinition = {
        pageSize: { width: 612, height: 936 }, // long bond 8.5"x14"
        pageOrientation: "portrait",
        pageMargins: [30, 40, 30, 40],
        content: [
          { text: "Republic of the Philippines", style: "header" },
          { text: "Province of Davao del Norte", style: "header" },
          { text: "Municipality of Braulio E. Dujali", style: "header" },
          { text: "Attendance Record", style: "subheader" },
          {
            columns: [
              {
                text: [
                  { text: "Full Name: ", bold: false }, // label normal
                  { text: employee.name, bold: true }, // value bold
                ],
                alignment: "left",
                margin: [0, 5, 0, 5],
              },
              {
                text: [
                  { text: "Employee ID: ", bold: false }, // label normal
                  { text: employee.employee_id, bold: true }, // value bold
                ],
                alignment: "right",
                margin: [0, 5, 0, 5],
              },
            ],
          },
          // Certification
          {
            text: "This certifies that the employee named above has rendered attendance as recorded below. Each entry corresponds to the actual time the employee checked in and out during the period of service.",
            margin: [0, 0, 0, 15],
            fontSize: 9,
          },

          // Legend
          {
            columns: [
              { text: "AHW - Actual Hours Worked", fontSize: 9 },
              { text: "OHW - Official Hours Worked", fontSize: 9 },
              { text: "OT - Overtime", fontSize: 9 },
              { text: "LT - Lates", fontSize: 9 },
              { text: "UT - Undertime", fontSize: 9 },
            ],
            columnGap: 20,
            margin: [0, 0, 0, 20],
          },

          // Attendance Table
          {
            table: {
              headerRows: 1,
              widths: [
                25, // Date
                30, // Day
                35, // In
                45, // Out (AM)
                45, // In (PM)
                45, // Out (PM)
                40, // AHW
                40, // OHW
                30, // OT
                30, // LT
                30, // UT
                80, // Remarks
              ],
              body: tableBody,
            },
            layout: {
              hLineWidth: () => 0.5,
              vLineWidth: () => 0.5,
              hLineColor: () => "#000000",
              vLineColor: () => "#000000",
              paddingLeft: () => 3,
              paddingRight: () => 3,
              paddingTop: () => 5,
              paddingBottom: () => 5,
            },
            fontSize: 9,
            alignment: "center",
          },
        ],
        styles: {
          header: { fontSize: 11, bold: true, alignment: "center" },
          subheader: {
            fontSize: 10,
            bold: true,
            alignment: "center",
            margin: [0, 5, 0, 5],
          },
        },
        defaultStyle: { fontSize: 9 },
      };

      pdfMake
        .createPdf(docDefinition)
        .download(`${employee.name}-Attendance.pdf`);
    },
    displayZeroAsEmpty(value, isAHW = false) {
      if (value === 0 || value === "0" || value === "0.00") {
        return isAHW ? "" : "";
      }
      return isAHW ? parseFloat(value).toFixed(2) : value;
    },
    toggleBack() {
      this.$emit("back-to-table-attendance");
      this.$router.push({ name: "attendance-records" });
    },
    showDownloadAlert() {
      this.isDownloadAlertOpen = true;
    },
    fetchAttendanceRecords() {
      if (!this.attendanceId) return;

      const selectedMonth = this.$route.params.date;
      if (!selectedMonth) return;

      const [year, month] = selectedMonth.split("-").map(Number);

      axios
        .get(`http://localhost:8000/attendance-record/${this.attendanceId}`)
        .then((res) => {
          let data = Array.isArray(res.data) ? res.data : [res.data];
          this.matchingRecord = data
            .map((emp) => ({
              ...emp,
              records: emp.records.filter((rec) => {
                const d = new Date(rec.date);
                return d.getFullYear() === year && d.getMonth() + 1 === month;
              }),
            }))
            .filter((emp) => emp.records.length > 0);
        })
        .catch((err) => {
          console.error(err);
          this.matchingRecord = [];
        });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
    getDayName(date) {
      return new Date(date).toLocaleDateString("en-US", { weekday: "short" });
    },
    parseTimeToDate(timeStr, isPM = false) {
      if (!timeStr || timeStr === "-") return null;
      let [hour, minute] = timeStr.split(":").map(Number);
      if (isPM && hour < 12) hour += 12;
      const d = new Date();
      d.setHours(hour, minute, 0, 0);
      return d;
    },
    formatTimeTo12Hour(timeStr, isPM = false) {
      if (!timeStr || timeStr === "-" || timeStr === null) return ""; // empty instead of "-"
      let [hour, minute] = timeStr
        .replace(/\s*(AM|PM)$/i, "")
        .split(":")
        .map(Number);
      if (isPM && hour < 12) hour += 12;
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
    },
    getRawDuration(start, end, isPMStart = false, isPMEnd = false) {
      const s = this.parseTimeToDate(start, isPMStart);
      const e = this.parseTimeToDate(end, isPMEnd);
      if (!s || !e) return 0;
      let dur = (e - s) / (1000 * 60 * 60);
      if (dur < 0) dur += 24;
      return dur;
    },
    getRawHours(record) {
      const am = this.getRawDuration(record.in_am, record.out_am, false, false);
      const pm = this.getRawDuration(record.in_pm, record.out_pm, true, true);
      return am + pm;
    },
    getRawHoursFormatted(record) {
      return this.getRawHours(record).toFixed(2); // ensures 2 decimal places
    },
    getOvertime(record) {
      const total = this.getRawHours(record);
      return total > 8 ? (total - 8).toFixed(2) : "0";
    },
    getUndertime(record) {
      // If the employee was absent, no undertime should be recorded
      if (this.getStatusForDay(record) === "Absent") return 0;

      const total = this.getRawHours(record);
      return total < 8 ? (8 - total).toFixed(2) : "0";
    },
    getLateness(record) {
      if (this.getStatusForDay(record) === "Absent") return 0;

      const inTime = this.parseTimeToDate(record.in_am);
      const expected = new Date();
      expected.setHours(8, 0, 0, 0);
      if (!inTime) return 0;
      const diff = (inTime - expected) / (1000 * 60);
      return diff > 0 ? (diff / 60).toFixed(2) : 0;
    },
    getStatusForDay(record) {
      if (!record.in_am && !record.out_pm) return "";
      const total = this.getRawHours(record);
      return total < 8 ? "Undertime" : "Present";
    },
    totalAHW(employee) {
      return employee.records.reduce((sum, r) => sum + this.getRawHours(r), 0);
    },
    totalLate(employee) {
      return employee.records.reduce(
        (sum, r) => sum + parseFloat(this.getLateness(r)),
        0
      );
    },
    totalOT(employee) {
      return employee.records.reduce(
        (sum, r) => sum + parseFloat(this.getOvertime(r)),
        0
      );
    },
    totalUT(employee) {
      return employee.records.reduce(
        (sum, r) => sum + parseFloat(this.getUndertime(r)),
        0
      );
    },
    totalPresentDays(employee) {
      return employee.records.filter(
        (r) => this.getStatusForDay(r) === "Present"
      ).length;
    },
  },
  mounted() {
    this.fetchAttendanceRecords();
  },
};
</script>

<style scoped>
/* Add styles if needed */
</style>
