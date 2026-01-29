<template>
  <div class="mt-4 overflow-x-auto border p-2 rounded-xl" v-if="isOpenView">
    <!-- Main Content -->
    <div class="p-2">
      <!-- Filters and Download -->
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-2"
      >
        <!-- Filters -->
        <div class="flex flex-col md:flex-row md:items-center gap-1">
          <label class="text-sm font-medium text-gray-600">Select Month:</label>

          <div class="flex gap-2">
            <!-- Month Dropdown -->
            <select
              v-model="selectedMonthValue"
              class="cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option disabled value="">-- Month --</option>
              <option
                v-for="month in months"
                :key="month.value"
                :value="month.value"
              >
                {{ month.name }}
              </option>
            </select>

            <!-- Year Dropdown -->
            <select
              v-model="selectedYear"
              class="cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option
                v-for="year in [2023, 2024, 2025, 2026]"
                :key="year"
                :value="year"
              >
                {{ year }}
              </option>
            </select>
          </div>
        </div>

        <!-- Download Button -->
        <button
          @click="downloadAttendancePDF"
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-blue-500 text-white text-sm hover:text-blue-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-blue-900 hover:shadow-lg transition-all duration-300"
        >
          <icon name="download1" />
          Download PDFs
        </button>
      </div>

      <!-- Attendance Report -->
      <div class="max-h-screen h-[80vh] overflow-auto">
        <div ref="attendanceReport" class="bg-white p-5 text-gray-900 relative">
          <div v-if="filteredAttendance && filteredAttendance.length">
            <template
              v-for="employee in filteredAttendance"
              :key="employee.employee_id"
            >
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
                  <p class="font-bold">{{ employee.name }}</p>
                </div>
                <div class="flex gap-3">
                  <h2>Employee ID:</h2>
                  <p class="font-bold">{{ employee.employee_id }}</p>
                </div>
              </div>

              <!-- Sub Header -->
              <div class="text-justify mt-5 text-sm">
                This certifies that the employee named above has rendered
                attendance as recorded below. Each entry corresponds to the
                actual time the employee checked in and out during the period of
                service.
              </div>

              <!-- Legend -->
              <div
                class="mt-4 px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-[14px] flex flex-wrap gap-x-20 text-center justify-center"
              >
                <div><strong>AHW</strong> - Actual Hours Worked</div>
                <div><strong>OHW</strong> - Official Hours Worked</div>
                <div><strong>OT</strong> - Overtime</div>
                <div><strong>LT</strong> - Lates</div>
                <div><strong>UT</strong> - Undertime</div>
              </div>

              <!-- Attendance Table -->
              <div class="overflow-auto">
                <table
                  class="min-w-full border border-gray-300 text-[14px] mt-5"
                >
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
                        {{ formatTimeTo12Hour(record.in_am) }}
                      </td>
                      <td class="border px-2 py-2">
                        {{ formatTimeTo12Hour(record.out_am) }}
                      </td>
                      <td class="border px-2 py-2">
                        {{ formatTimeTo12Hour(record.in_pm, true) }}
                      </td>
                      <td class="border px-2 py-2">
                        {{ formatTimeTo12Hour(record.out_pm, true) }}
                      </td>
                      <td class="border px-2 py-2">
                        {{
                          displayZeroAsEmpty(getRawHoursFormatted(record), true)
                        }}
                      </td>
                      <td class="border px-2 py-2">
                        <span v-if="getRawHours(record) > 0">8.00</span>
                      </td>
                      <td class="border px-2 py-2">
                        <span v-if="getRawHours(record) > 8">{{
                          getOvertime(record)
                        }}</span>
                      </td>
                      <td class="border px-2 py-2">
                        {{ displayZeroAsEmpty(getLateness(record)) }}
                      </td>
                      <td class="border px-2 py-2">
                        <span v-if="getRawHours(record) > 0">{{
                          getUndertime(record)
                        }}</span>
                      </td>
                      <td class="border px-2 py-2">
                        {{ getStatusForDay(record) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr
                      class="bg-gray-50 font-semibold text-sm text-center border"
                    >
                      <td colspan="13" class="border px-2 py-1">Gross</td>
                    </tr>
                    <tr class="text-[14px] text-center border">
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
                    <tr class="text-[14px] text-center border">
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
                    <tr class="text-[14px] text-center border">
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
                    <tr class="text-[14px] text-center font-semibold border">
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
                  </tfoot>
                </table>
              </div>
            </template>
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

pdfMake.vfs = pdfFonts.vfs;

export default {
  name: "ViewServiceRecords",
  components: { icon },
  data() {
    return {
      isOpenView: true,
      selectedMonthValue: null,
      selectedYear: new Date().getFullYear(),
      months: [
        { name: "January", value: "01" },
        { name: "February", value: "02" },
        { name: "March", value: "03" },
        { name: "April", value: "04" },
        { name: "May", value: "05" },
        { name: "June", value: "06" },
        { name: "July", value: "07" },
        { name: "August", value: "08" },
        { name: "September", value: "09" },
        { name: "October", value: "10" },
        { name: "November", value: "11" },
        { name: "December", value: "12" },
      ],
      data_attendance_records: [], // all records fetched
      data_employee_profile: [], // employee profiles if needed
      searchQuery: "",
      user: null, // logged-in user
    };
  },
  computed: {
    filteredAttendance() {
      if (!this.user || !this.data_attendance_records) return [];

      const query = this.searchQuery.toLowerCase().trim();
      const month = this.selectedMonthValue;
      const year = Number(this.selectedYear);

      return this.data_attendance_records
        .filter((record) => record.employee_id === this.user.employee_id)
        .map((emp) => {
          // Get all dates for the month
          const allDates =
            month && year ? this.getAllDatesInMonth(month, year) : [];

          // Map records by date string for fast lookup
          const recordsMap = {};
          emp.records.forEach((r) => {
            recordsMap[new Date(r.date).toDateString()] = r;
          });

          // Build records for all dates
          const fullRecords = allDates.map((d) => {
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

          return { ...emp, records: fullRecords };
        })
        .filter((emp) => {
          if (!query) return true;
          return (
            emp.name.toLowerCase().includes(query) ||
            (emp.attendance_id && emp.attendance_id.toString().includes(query))
          );
        });
    },
  },

  methods: {
    getAllDatesInMonth(month, year) {
      const dates = [];
      const date = new Date(year, month - 1, 1);
      while (date.getMonth() === month - 1) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
      return dates;
    },
    async fetchUser() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/auth/me",
          { withCredentials: true },
        );
        if (response.data) {
          this.user = response.data;
          console.log("Logged-in user:", this.user);
        } else {
          this.$router.push("/");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        this.$router.push("/");
      }
    },
    fetchAttendanceRecords() {
      axios
        .get(process.env.VUE_APP_API_BASE_URL + "/attendance-record/get-all")
        .then((res) => {
          this.data_attendance_records = res.data || [];
        })
        .catch((err) => {
          console.error(err);
          this.data_attendance_records = [];
        });
    },

    // Utilities
    displayZeroAsEmpty(value, isAHW = false) {
      if (value === 0 || value === "0" || value === "0.00") return "";
      return isAHW ? parseFloat(value).toFixed(2) : value;
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
      if (!timeStr || timeStr === "-" || timeStr === null) return "";
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
      return (
        this.getRawDuration(record.in_am, record.out_am) +
        this.getRawDuration(record.in_pm, record.out_pm, true, true)
      );
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
      if (!record.in_am && !record.out_pm) return "";
      const total = this.getRawHours(record);
      return total < 8 ? "Undertime" : "Present";
    },
    totalAHW(emp) {
      return emp.records.reduce((sum, r) => sum + this.getRawHours(r), 0);
    },
    totalLate(emp) {
      return emp.records.reduce(
        (sum, r) => sum + parseFloat(this.getLateness(r)),
        0,
      );
    },
    totalOT(emp) {
      return emp.records.reduce(
        (sum, r) => sum + parseFloat(this.getOvertime(r)),
        0,
      );
    },
    totalUT(emp) {
      return emp.records.reduce(
        (sum, r) => sum + parseFloat(this.getUndertime(r)),
        0,
      );
    },
    totalPresentDays(emp) {
      return emp.records.filter((r) => this.getStatusForDay(r) === "Present")
        .length;
    },

    // PDF download for logged-in user
    downloadAttendancePDF() {
      const employee = this.filteredAttendance[0];
      if (!employee) return;

      const numCols = 12;
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

      employee.records.forEach((rec) => {
        tableBody.push([
          new Date(rec.date).getDate(),
          this.getDayName(rec.date),
          this.formatTimeTo12Hour(rec.in_am),
          this.formatTimeTo12Hour(rec.out_am),
          this.formatTimeTo12Hour(rec.in_pm, true),
          this.formatTimeTo12Hour(rec.out_pm, true),
          this.displayZeroAsEmpty(this.getRawHoursFormatted(rec), true),
          "8.00",
          this.getRawHours(rec) > 8 ? this.getOvertime(rec) : "",
          this.getLateness(rec),
          this.getRawHours(rec) > 0 ? this.getUndertime(rec) : "",
          this.getStatusForDay(rec),
        ]);
      });

      const addSummaryRow = (cells) => {
        const row = [];
        cells.forEach((cell) => {
          if (cell.colSpan && cell.colSpan > 1) {
            row.push(cell);
            for (let i = 1; i < cell.colSpan; i++) row.push({ _span: true });
          } else row.push(cell);
        });
        while (row.length < numCols) row.push({ text: "" });
        tableBody.push(row);
      };

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
            text: "This certifies that the employee named above has rendered attendance as recorded below. Each entry corresponds to the actual time the employee checked in and out during the period of service.",
            margin: [0, 0, 0, 15],
            fontSize: 9,
          },
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
          {
            table: {
              headerRows: 1,
              widths: [25, 30, 35, 45, 45, 45, 40, 40, 30, 30, 30, 80],
              body: tableBody,
            },
            layout: {
              hLineWidth: () => 0.5,
              vLineWidth: () => 0.5,
              hLineColor: () => "#000",
              vLineColor: () => "#000",
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
  },
  async mounted() {
    await this.fetchUser();
    this.fetchAttendanceRecords();
  },
};
</script>

<style scoped>
/* Add styles if needed */
</style>
