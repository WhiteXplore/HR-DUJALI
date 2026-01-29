<template>
  <div class="mt-4 overflow-x-auto border p-2 rounded-xl" v-if="isOpenView">
    <div class="p-2">
      <div class="flex justify-between">
        <div
          @click="toggleBack"
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-red-500 text-white text-sm hover:text-red-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-red-900 hover:shadow-lg transition-all duration-300"
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
                      v-for="record in getFullMonthRecords(employee)"
                      :key="employee.employee_id + '-' + record.date"
                      class="text-center hover:bg-gray-50"
                    >
                      <td class="border px-2 py-2">
                        {{ formatDate(record.date) }}
                      </td>
                      <td class="border px-2 py-2">
                        {{ getDayName(record.date) }}
                      </td>
                      <td class="border px-2 py-2">{{ record.in_am || "" }}</td>
                      <td class="border px-2 py-2">
                        {{ record.out_am || "" }}
                      </td>
                      <td class="border px-2 py-2">{{ record.in_pm || "" }}</td>
                      <td class="border px-2 py-2">
                        {{ record.out_pm || "" }}
                      </td>
                      <td class="border px-2 py-2">
                        {{
                          record.in_am || record.in_pm
                            ? displayZeroAsEmpty(
                                getRawHoursFormatted(record),
                                true,
                              )
                            : ""
                        }}
                      </td>
                      <td class="border px-2 py-2">
                        <span v-if="record.in_am || record.in_pm">8.00</span>
                      </td>
                      <td class="border px-2 py-2">
                        <span v-if="getRawHours(record) > 8">{{
                          getOvertime(record)
                        }}</span>
                      </td>
                      <td class="border px-2 py-2">
                        {{
                          record.in_am || record.in_pm
                            ? getLateness(record)
                            : ""
                        }}
                      </td>
                      <td class="border px-2 py-2">
                        <span v-if="record.in_am || record.in_pm">{{
                          getUndertime(record)
                        }}</span>
                      </td>
                      <td class="border px-2 py-2">
                        {{
                          record.in_am || record.in_pm
                            ? getStatusForDay(record)
                            : ""
                        }}
                      </td>
                    </tr>
                  </template>
                </tbody>
                <!-- Footer remains the same -->
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
                        {{
                          getMonthlySummary(employee)
                            ?.total_actual_work_hours ?? "0.00"
                        }}
                      </td>
                      <td colspan="2" class="border px-2 py-1">Late (LT):</td>
                      <td colspan="2" class="border px-2 py-1">
                        {{ getMonthlySummary(employee)?.total_late_days ?? 0 }}
                      </td>
                      <td colspan="3" class="border px-2 py-1"></td>
                    </tr>
                    <tr class="text-[13px] text-center border">
                      <td colspan="4" class="border px-2 py-1">
                        Official Hours Worked (OHW):
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        {{
                          getMonthlySummary(employee)
                            ?.official_work_hours_per_month ?? "0.00"
                        }}
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        Undertime (UT):
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        {{
                          getMonthlySummary(employee)?.total_undertime_hours ??
                          "0.00"
                        }}
                      </td>
                      <td colspan="3" class="border px-2 py-1"></td>
                    </tr>
                    <tr class="text-[13px] text-center border">
                      <td colspan="4" class="border px-2 py-1">
                        Overtime (OT):
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        {{
                          getMonthlySummary(employee)?.total_overtime_hours ??
                          "0.00"
                        }}
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        Days Present (DP):
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        {{
                          getMonthlySummary(employee)?.total_days_present ?? 0
                        }}
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
                            parseFloat(
                              getMonthlySummary(employee)
                                ?.total_days_present_final ?? 0,
                            ) *
                              8 +
                            Math.max(
                              0,
                              parseFloat(
                                getMonthlySummary(employee)
                                  ?.total_actual_work_hours ?? 0,
                              ) -
                                parseFloat(
                                  getMonthlySummary(employee)
                                    ?.official_work_hours_per_month ?? 0,
                                ),
                            )
                          ).toFixed(2)
                        }}
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        Total Deductions (LT + UT)
                      </td>
                      <td colspan="2" class="border px-2 py-1">
                        {{
                          (
                            parseFloat(
                              getMonthlySummary(employee)?.total_late_days ?? 0,
                            ) +
                            parseFloat(
                              getMonthlySummary(employee)
                                ?.total_undertime_hours ?? 0,
                            )
                          ).toFixed(2)
                        }}
                      </td>
                      <td colspan="3" class="border px-2 py-1">
                        Total Days Present:
                        {{
                          getMonthlySummary(employee)
                            ?.total_days_present_final ?? 0
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
      monthlyReport: [],
    };
  },
  watch: {
    attendanceId: "fetchData",
    "$route.params.date": "fetchData",
  },
  methods: {
    fetchData() {
      this.fetchAttendanceRecords();
      this.fetchMonthlyAttendanceReport();
    },

    // ------------------ Attendance API -------------------
    fetchAttendanceRecords() {
      if (!this.attendanceId) return;

      axios
        .get(
          `${process.env.VUE_APP_API_BASE_URL}/attendance-record/${this.attendanceId}`,
        )
        .then((res) => {
          let data = Array.isArray(res.data) ? res.data : [res.data];

          this.matchingRecord = data.map((emp) => {
            const recordsByMonth = {};
            emp.records.forEach((rec) => {
              if (!recordsByMonth[rec.month_year])
                recordsByMonth[rec.month_year] = [];
              recordsByMonth[rec.month_year].push(rec);
            });
            return { ...emp, recordsByMonth };
          });
        })
        .catch(() => {
          this.matchingRecord = [];
        });
    },

    fetchMonthlyAttendanceReport() {
      if (!this.attendanceId) return;

      const selectedMonth = this.$route.params.date;
      if (!selectedMonth) return;
      const [year, month] = selectedMonth.split("-").map(Number);

      axios
        .get(
          `${process.env.VUE_APP_API_BASE_URL}/attendance-record/monthly-attendance-report`,
          {
            params: { employee_id: this.attendanceId, year, month },
          },
        )
        .then((res) => {
          this.monthlyReport = Array.isArray(res.data) ? res.data : [res.data];
        })
        .catch(() => {
          this.monthlyReport = [];
        });
    },

    getMonthlySummary(employee) {
      const selectedMonthYear = this.$route.params.date;
      return this.monthlyReport.find(
        (rec) =>
          rec.employee_id === employee.employee_id &&
          rec.month_year === selectedMonthYear,
      );
    },

    getFullMonthRecords(employee) {
      const selectedMonthYear = this.$route.params.date;
      if (!selectedMonthYear) return employee.records;

      const [year, month] = selectedMonthYear.split("-").map(Number);
      const allDates = this.getAllDatesInMonth(month, year);

      const recordsMap = {};
      employee.records.forEach((rec) => {
        recordsMap[new Date(rec.date).toDateString()] = rec;
      });

      return allDates.map((d) => {
        const key = d.toDateString();
        return (
          recordsMap[key] || {
            date: d,
            in_am: null,
            out_am: null,
            in_pm: null,
            out_pm: null,
          }
        );
      });
    },

    getAllDatesInMonth(month, year) {
      const dates = [];
      const date = new Date(year, month - 1, 1);
      while (date.getMonth() === month - 1) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return dates;
    },

    toggleBack() {
      this.$emit("back-to-table-attendance");
      this.$router.push({ name: "attendance-records" });
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
      if (!timeStr || timeStr === "-") return "";
      let [hour, minute] = timeStr.split(":").map(Number);
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
      return this.getRawHours(record).toFixed(2);
    },

    getOvertime(record) {
      const total = this.getRawHours(record);
      return total > 8 ? (total - 8).toFixed(2) : "0";
    },

    getUndertime(record) {
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
      if (!record.in_am && !record.out_pm) return "Absent";
      const total = this.getRawHours(record);
      return total < 8 ? "Undertime" : "Present";
    },

    displayZeroAsEmpty(value, isAHW = false) {
      if (value === 0 || value === "0" || value === "0.00") return "";
      return isAHW ? parseFloat(value).toFixed(2) : value;
    },

    downloadAttendancePDF() {
      const employee = this.matchingRecord[0];
      if (!employee) return;

      const numCols = 12;
      const monthlySummary = this.getMonthlySummary(employee) || {};

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

      // --- Employee Attendance Rows (Full Month) ---
      const allRecords = this.getFullMonthRecords(employee);
      allRecords.forEach((rec) => {
        const dateObj =
          rec.date instanceof Date ? rec.date : new Date(rec.date);
        const hasData = rec.in_am || rec.out_pm || rec.in_pm || rec.out_am;

        const rawHours = hasData ? this.getRawHours(rec) : 0;
        const ahw = hasData
          ? this.displayZeroAsEmpty(this.getRawHoursFormatted(rec), true)
          : "";
        const ohw = hasData && rawHours > 0 ? "8.00" : "";
        const ot = hasData && rawHours > 8 ? this.getOvertime(rec) : "";
        const lt = hasData ? this.getLateness(rec) : "";
        const ut = hasData && rawHours > 0 ? this.getUndertime(rec) : "";
        const remarks = hasData ? this.getStatusForDay(rec) : "";

        tableBody.push([
          dateObj.getDate(),
          this.getDayName(dateObj),
          hasData ? this.formatTimeTo12Hour(rec.in_am, false) : "",
          hasData ? this.formatTimeTo12Hour(rec.out_am, false) : "",
          hasData ? this.formatTimeTo12Hour(rec.in_pm, true) : "",
          hasData ? this.formatTimeTo12Hour(rec.out_pm, true) : "",
          ahw,
          ohw,
          ot,
          lt,
          ut,
          remarks,
        ]);
      });

      // --- Helper to safely add summary rows ---
      const addSummaryRow = (cells) => {
        const row = [];
        cells.forEach((cell) => {
          if (cell.colSpan && cell.colSpan > 1) {
            row.push(cell);
            for (let i = 1; i < cell.colSpan; i++)
              row.push({ text: "", _span: true });
          } else {
            row.push(cell || { text: "" });
          }
        });
        while (row.length < numCols) row.push({ text: "", _span: true });
        tableBody.push(row);
      };

      // --- Add Summary Rows ---
      addSummaryRow([
        { text: "Gross", colSpan: numCols, alignment: "center", bold: true },
      ]);
      addSummaryRow([
        { text: "Actual Hours Worked (AHW)", colSpan: 4 },
        { text: monthlySummary?.total_actual_work_hours ?? "0.00", colSpan: 2 },
        { text: "Late (LT)", colSpan: 2 },
        { text: monthlySummary?.total_late_days ?? "0", colSpan: 2 },
        { text: "" },
      ]);
      addSummaryRow([
        { text: "Official Hours Worked (OHW)", colSpan: 4 },
        {
          text: monthlySummary?.official_work_hours_per_month ?? "0.00",
          colSpan: 2,
        },
        { text: "Undertime (UT)", colSpan: 2 },
        { text: monthlySummary?.total_undertime_hours ?? "0.00", colSpan: 2 },
        { text: "" },
      ]);
      addSummaryRow([
        { text: "Overtime (OT)", colSpan: 4 },
        { text: monthlySummary?.total_overtime_hours ?? "0.00", colSpan: 2 },
        { text: "Days Present (DP)", colSpan: 2 },
        { text: monthlySummary?.total_days_present ?? "0", colSpan: 2 },
        { text: "" },
      ]);
      addSummaryRow([
        { text: "Net", colSpan: numCols, alignment: "center", bold: true },
      ]);
      addSummaryRow([
        { text: "Total Hours Worked [(DP×8) + OT]", colSpan: 4 },
        { text: monthlySummary?.total_hours_worked ?? "0.00", colSpan: 2 },
        { text: "Total Deductions (LT + UT)", colSpan: 2 },
        { text: monthlySummary?.total_deductions ?? "0.00", colSpan: 2 },
        {
          text: `Total Days Present: ${
            monthlySummary?.total_days_present_final ?? 0
          }`,
          colSpan: 2,
        },
      ]);

      // --- PDF Definition ---
      const docDefinition = {
        pageSize: { width: 612, height: 936 },
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
                  { text: "Full Name: " },
                  { text: employee.name, bold: true },
                ],
                alignment: "left",
                margin: [0, 5, 0, 5],
              },
              {
                text: [
                  { text: "Employee ID: " },
                  { text: employee.employee_id, bold: true },
                ],
                alignment: "right",
                margin: [0, 5, 0, 5],
              },
            ],
          },
          {
            text: "This certifies that the employee named above has rendered attendance as recorded below.",
            margin: [0, 0, 0, 15],
            fontSize: 9,
          },
          {
            table: {
              headerRows: 1,
              widths: [25, 30, 35, 45, 45, 45, 40, 40, 30, 30, 30, 80],
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
            fontSize: 6,
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
  },

  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
/* Add styles if needed */
</style>
