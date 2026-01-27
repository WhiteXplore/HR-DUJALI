<template>
  <div>
    <!-- Filter Header -->
    <div class="flex justify-between items-end mb-4">
      <div class="flex flex-col text-left">
        <h1 class="font-semibold tracking-wide text-md">Attendance Report</h1>
        <p class="text-sm text-gray-500 mt-1">{{ reportHeaderText }}</p>
      </div>

      <div class="flex gap-4 text-sm">
        <!-- Month Selector only if Monthly -->
        <select
          v-if="filterType === 'monthly'"
          v-model="selectedMonth"
          class="p-2 border rounded-xl cursor-pointer"
        >
          <option value="">Select Month</option>
          <option v-for="(m, index) in months" :key="index" :value="index + 1">
            {{ m }}
          </option>
        </select>

        <!-- Year Selector always visible -->
        <select
          v-model="selectedYear"
          class="p-2 border rounded-xl cursor-pointer"
        >
          <option value="">Select Year</option>
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>

        <!-- Filter Type -->
        <select
          v-model="filterType"
          class="p-2 border rounded-xl cursor-pointer"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <button
          @click="applyFilter"
          :disabled="
            loading ||
            !selectedYear ||
            (filterType === 'monthly' && !selectedMonth)
          "
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-blue-500 text-white text-sm hover:text-blue-700 px-4 py-2 rounded-xl hover:bg-white border hover:border-blue-900 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply Filter
        </button>

        <button
          @click="openPrintModal"
          :disabled="!filteredMonthlyReport.length"
          class="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download Report
        </button>
      </div>
    </div>

    <!-- Progress Overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
    >
      <div class="flex flex-col items-center w-11/12 md:w-1/2 space-y-3">
        <p class="text-white text-lg font-semibold animate-pulse">
          Generating Report . . .
        </p>
        <div class="w-80 bg-gray-300 rounded-full h-3 overflow-hidden shadow">
          <div
            class="bg-blue-600 h-3 transition-all duration-300 ease-out"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
        <p class="text-white text-sm font-medium">
          {{ Math.floor(progress) }}%
        </p>
      </div>
    </div>

    <!-- Attendance Table & Charts -->
    <div
      class="p-4 space-y-6 h-[82.5vh] overflow-y-auto border rounded-2xl bg-gray-50"
    >
      <div v-if="filterApplied">
        <div
          v-if="paginatedReport.length"
          class="bg-white rounded-md shadow p-4 space-y-4"
        >
          <!-- Employee Attendance Summary Header -->
          <h3 class="text-md text-left font-semibold">
            Employee Attendance Summary
          </h3>

          <div
            class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4"
          >
            <div class="flex items-center gap-2">
              <label class="text-gray-600 text-sm">Show:</label>
              <select v-model.number="pageSize" class="p-1 border rounded-md">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </div>

            <div
              class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
            >
              <!-- Lates Filter -->
              <select
                v-model="selectedLegend"
                class="p-2 border rounded-xl cursor-pointer"
              >
                <option value="">All Lates</option>
                <option
                  v-for="(color, key) in legendColors"
                  :key="key"
                  :value="key"
                  :disabled="tardySummary[key] === 0"
                >
                  {{ key }} Lates ({{ tardySummary[key] }})
                </option>
                <option value="latest">Latest</option>
              </select>

              <!-- Absent Filter -->
              <select
                v-model="selectedAbsentRange"
                class="p-2 border rounded-xl cursor-pointer"
              >
                <option value="">All Employees</option>
                <option
                  v-for="(range, key) in absentSummary"
                  :key="key"
                  :value="key"
                  :disabled="range === 0"
                >
                  {{ key }} Absents ({{ range }})
                </option>
              </select>

              <!-- Undertime Filter -->
              <select
                v-model="selectedUndertimeRange"
                class="p-2 border rounded-xl cursor-pointer"
              >
                <option value="">All Undertime</option>
                <option
                  v-for="(count, key) in undertimeSummary"
                  :key="key"
                  :value="key"
                  :disabled="count === 0"
                >
                  {{ key }} hrs ({{ count }})
                </option>
              </select>
            </div>
          </div>

          <!-- Attendance Table -->
          <div class="overflow-x-auto">
            <div
              class="h-[40vh] overflow-y-auto border border-gray-200 rounded-lg shadow-sm p-2"
            >
              <table
                class="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm"
              >
                <thead class="bg-blue-900 text-white text-sm tracking-wider">
                  <tr>
                    <th class="px-4 py-3 text-left border-b">Employee ID</th>
                    <th class="px-4 py-3 text-left border-b">Name</th>
                    <th class="px-4 py-3 text-center border-b">Present</th>
                    <th class="px-4 py-3 text-center border-b">Absent</th>
                    <th class="px-4 py-3 text-center border-b">Total Hours</th>
                    <th class="px-4 py-3 text-center border-b">Total Lates</th>
                    <th class="px-4 py-3 text-center border-b">
                      Total Under Time (hrs)
                    </th>
                  </tr>
                </thead>
                <tbody class="text-gray-700 divide-y divide-gray-100 uppercase">
                  <tr
                    v-for="employee in paginatedReport"
                    :key="employee.employee_id"
                    class="hover:bg-blue-50 transition-colors duration-200 even:bg-gray-50"
                  >
                    <td class="px-4 py-3 text-left">
                      {{ employee.employee_id }}
                    </td>
                    <td class="px-4 py-3 text-left">{{ employee.name }}</td>
                    <td class="px-4 py-3 text-center">
                      {{ employee.daysPresent }}
                    </td>
                    <td class="px-4 py-3 text-center">
                      {{ employee.daysAbsent }}
                    </td>
                    <td class="px-4 py-3 text-center">
                      {{ employee.totalHours }}
                    </td>
                    <td class="px-4 py-3 text-center">{{ employee.lates }}</td>
                    <td class="px-4 py-3 text-center">
                      {{ employee.totalUnderTime }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex justify-between items-center mt-4 flex-wrap gap-2">
            <div class="text-sm text-gray-600">
              Showing
              {{
                filteredMonthlyReport.length === 0
                  ? 0
                  : (currentPage - 1) * pageSize + 1
              }}
              to
              {{
                Math.min(currentPage * pageSize, filteredMonthlyReport.length)
              }}
              of {{ filteredMonthlyReport.length }} entries
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-blue-100 disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="
                  page === currentPage
                    ? 'w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold'
                    : 'w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-blue-50'
                "
              >
                {{ page }}
              </button>

              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-blue-100 disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Top Latecomers & Chart -->
        <div v-if="filteredMonthlyReport.length" class="space-y-6 mt-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            <!-- Top Latecomers Table -->
            <div
              class="bg-white rounded-xl p-5 border border-gray-200 xl:col-span-2"
            >
              <div class="mb-4 flex justify-between items-center">
                <h3 class="text-md font-semibold">Top 5 Latecomers</h3>
                <h3 class="text-md font-semibold">
                  <template v-if="filterType === 'monthly'"
                    >Month of {{ formattedMonth }}</template
                  >
                  <template v-else-if="filterType === 'yearly'"
                    >Year {{ selectedYear }}</template
                  >
                </h3>
              </div>
              <p class="text-gray-500 text-xs text-left mb-2">
                Based on number of late records.
              </p>

              <div class="overflow-x-auto">
                <div
                  class="h-[40vh] overflow-y-auto border border-gray-200 rounded-lg shadow-sm p-2"
                >
                  <table
                    class="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm"
                  >
                    <thead
                      class="bg-blue-900 text-white text-sm tracking-wider"
                    >
                      <tr>
                        <th
                          class="px-3 py-2 text-left border-b border-gray-200"
                        >
                          Name
                        </th>
                        <th class="px-4 py-3 text-center border-b">
                          Days Present
                        </th>
                        <th class="px-4 py-3 text-center border-b">
                          Total Hours
                        </th>
                        <th
                          class="px-3 py-2 text-center border-b border-gray-200"
                        >
                          Lates
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(emp, index) in topLateComers"
                        :key="emp.employee_id"
                        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
                      >
                        <td
                          class="px-3 py-2 border-b border-gray-200 text-left"
                        >
                          {{ emp.name }}
                        </td>
                        <td class="px-4 py-3 text-center">
                          {{ emp.daysPresent }}
                        </td>
                        <td class="px-4 py-3 text-center">
                          {{ emp.totalHours }}
                        </td>
                        <td
                          class="px-3 py-2 text-center border-b border-gray-200"
                        >
                          {{ emp.lates }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Late Distribution Chart -->
            <div
              class="bg-white rounded-2xl border p-6 xl:col-span-2 flex flex-col items-center"
            >
              <h4 class="text-lg font-semibold">
                Employee Tardiness Distribution
              </h4>
              <div
                class="w-full h-lg:h-[1000px] flex justify-center items-center"
              >
                <Bar :data="chartData" :options="chartOptions" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!filterApplied && !loading"
        class="text-gray-500 text-center py-10 text-lg font-medium mt-4"
      >
        No data available. Please select <strong>"Filter Type"</strong> and the
        corresponding <strong>"Month"</strong> or <strong>"Year"</strong>, then
        click <strong>"Apply Filter"</strong>.
      </div>
    </div>

    <!-- Printable Modal -->
    <printAttendanceReport
      v-if="showPrintModal"
      :show="showPrintModal"
      :criteria="{
        month: filterType === 'monthly' ? selectedMonth : null,
        year: selectedYear,
        filterType: filterType,
      }"
      :report-data="
        filteredMonthlyReport.filter(
          (emp) => emp.daysAbsent > 0 || emp.lates > 0,
        )
      "
      @close="showPrintModal = false"
    />
  </div>
</template>

<script>
import axios from "axios";
import { Bar } from "vue-chartjs";
import printAttendanceReport from "../modals/print-attendance-report.vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

export default {
  name: "ViewMonthlyReport",
  components: { Bar, printAttendanceReport },
  data() {
    const now = new Date();
    return {
      monthlyReport: [],
      selectedMonth: "",
      selectedYear: "",
      filterType: "monthly",
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      years: Array.from({ length: 10 }, (_, i) => now.getFullYear() - i),
      loading: false,
      progress: 0,
      filterApplied: false,
      showPrintModal: false,
      selectedLegend: "",
      selectedAbsentRange: "",
      selectedUndertimeRange: "",
      legendColors: {
        0: "bg-green-300",
        "1-3": "bg-blue-300",
        "4-5": "bg-yellow-300",
        "6-9": "bg-red-200",
        "10+": "bg-red-500",
      },
      data_employee_profile: [],
      pageSize: 10,
      currentPage: 1,
    };
  },
  computed: {
    filteredMonthlyReport() {
      let filtered = this.monthlyReport;

      // Filter by month/year
      if (this.filterType === "monthly" && this.selectedMonth)
        filtered = filtered.filter(
          (e) => e.month === Number(this.selectedMonth),
        );
      if (this.selectedYear)
        filtered = filtered.filter((e) => e.year === Number(this.selectedYear));

      // Lates
      if (this.selectedLegend && this.selectedLegend !== "latest") {
        const range = {
          0: [0, 0],
          "1-3": [1, 3],
          "4-5": [4, 5],
          "6-9": [6, 9],
          "10+": [10, Infinity],
        }[this.selectedLegend];
        filtered = filtered.filter(
          (e) => e.lates >= range[0] && e.lates <= range[1],
        );
      }

      // Absents
      if (this.selectedAbsentRange) {
        const range = {
          0: [0, 0],
          "1-3": [1, 3],
          "4-5": [4, 5],
          "6-9": [6, 9],
          "10+": [10, Infinity],
        }[this.selectedAbsentRange];
        filtered = filtered.filter(
          (e) => e.daysAbsent >= range[0] && e.daysAbsent <= range[1],
        );
      }

      // Undertime
      if (this.selectedUndertimeRange) {
        const range = {
          0: [0, 0],
          "1-10": [1, 10],
          "11-30": [11, 30],
          "31-60": [31, 60],
          "60+": [61, Infinity],
        }[this.selectedUndertimeRange];
        filtered = filtered.filter(
          (e) => e.totalUnderTime >= range[0] && e.totalUnderTime <= range[1],
        );
      }

      return filtered;
    },
    paginatedReport() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredMonthlyReport.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.filteredMonthlyReport.length / this.pageSize) || 1;
    },
    tardySummary() {
      const summary = { 0: 0, "1-3": 0, "4-5": 0, "6-9": 0, "10+": 0 };
      this.filteredMonthlyReport.forEach(({ lates }) => {
        if (lates === 0) summary["0"]++;
        else if (lates <= 3) summary["1-3"]++;
        else if (lates <= 5) summary["4-5"]++;
        else if (lates <= 9) summary["6-9"]++;
        else summary["10+"]++;
      });
      return summary;
    },
    absentSummary() {
      const summary = { 0: 0, "1-3": 0, "4-5": 0, "6-9": 0, "10+": 0 };
      this.filteredMonthlyReport.forEach(({ daysAbsent }) => {
        if (daysAbsent === 0) summary["0"]++;
        else if (daysAbsent <= 3) summary["1-3"]++;
        else if (daysAbsent <= 5) summary["4-5"]++;
        else if (daysAbsent <= 9) summary["6-9"]++;
        else summary["10+"]++;
      });
      return summary;
    },
    undertimeSummary() {
      const summary = { 0: 0, "1-10": 0, "11-30": 0, "31-60": 0, "60+": 0 };
      this.filteredMonthlyReport.forEach(({ totalUnderTime }) => {
        if (totalUnderTime === 0) summary["0"]++;
        else if (totalUnderTime <= 10) summary["1-10"]++;
        else if (totalUnderTime <= 30) summary["11-30"]++;
        else if (totalUnderTime <= 60) summary["31-60"]++;
        else summary["60+"]++;
      });
      return summary;
    },
    topLateComers() {
      return [...this.filteredMonthlyReport]
        .filter((e) => e.lates > 0)
        .sort((a, b) => b.lates - a.lates)
        .slice(0, 5);
    },
    chartData() {
      const summary = this.tardySummary;
      return {
        labels: ["0 Lates", "1–3 Lates", "4–5 Lates", "6–9 Lates", "10+ Lates"],
        datasets: [
          {
            label: "Number of Employees",
            data: [
              summary["0"],
              summary["1-3"],
              summary["4-5"],
              summary["6-9"],
              summary["10+"],
            ],
            backgroundColor: [
              "#34d399",
              "#60a5fa",
              "#facc15",
              "#f87171",
              "#b91c1c",
            ],
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      };
    },
    reportHeaderText() {
      if (this.filterType === "monthly")
        return this.selectedMonth && this.selectedYear
          ? `Month: ${this.months[this.selectedMonth - 1]} ${this.selectedYear}`
          : "Month: ?";
      if (this.filterType === "yearly")
        return this.selectedYear ? `Year of ${this.selectedYear}` : "Year: ?";
      return "?";
    },
    formattedMonth() {
      return this.selectedMonth
        ? `${this.months[this.selectedMonth - 1]} ${this.selectedYear}`
        : this.selectedYear
        ? `Year of ${this.selectedYear}`
        : "?";
    },
  },
  methods: {
    async fetchEmployeeRecords() {
      try {
        const { data } = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/upload/get-all`,
        );
        this.data_employee_profile = data || [];
      } catch (err) {
        console.error(err);
      }
    },
    async fetchMonthlyReport() {
      try {
        if (!this.data_employee_profile.length)
          await this.fetchEmployeeRecords();
        const { data } = await axios.get(
          "http://localhost:8000/attendance-record/monthly-attendance-report",
        );
        this.monthlyReport = data
          .map((emp) => {
            const [year, month] = emp.month_year.split("-").map(Number);
            const totalWorkdays = this.getTotalWorkdaysInMonth(year, month);
            const daysPresent = Number(emp.total_days_present);
            return {
              employee_id: emp.employee_id,
              name: emp.name,
              month,
              year,
              daysPresent,
              daysAbsent: totalWorkdays - daysPresent,
              totalHours: Number(emp.total_attendance_hours),
              lates: Number(emp.total_late_days),
              totalUnderTime: Number(emp.total_undertime_hours),
            };
          })
          .filter((emp) =>
            this.data_employee_profile.some(
              (a) =>
                a.employment_status === "Active" &&
                a.employee_id === emp.employee_id,
            ),
          );
      } catch (err) {
        console.error(err);
        this.monthlyReport = [];
      }
    },
    getTotalWorkdaysInMonth(year, month) {
      const start = new Date(year, month - 1, 1),
        end = new Date(year, month, 0);
      let workdays = 0;
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) workdays++;
      }
      return workdays;
    },
    simulateProgress() {
      this.progress = 0;
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          this.progress += Math.random() * 15;
          if (this.progress >= 100) {
            this.progress = 100;
            clearInterval(interval);
            resolve();
          }
        }, 200);
      });
    },
    async applyFilter() {
      this.loading = true;
      this.progress = 0;
      this.filterApplied = false;
      await this.simulateProgress();
      await this.fetchMonthlyReport();
      this.currentPage = 1;
      this.filterApplied = true;
      this.loading = false;
    },
    openPrintModal() {
      const printData = this.filteredMonthlyReport.filter(
        (e) => e.daysAbsent > 0 || e.lates > 0,
      );
      if (printData.length) this.showPrintModal = true;
      else this.$toast.info("No employees with absences or lates to print.");
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    goToPage(page) {
      this.currentPage = page;
    },
  },
  mounted() {
    this.fetchEmployeeRecords();
    this.fetchMonthlyReport();
  },
};
</script>
