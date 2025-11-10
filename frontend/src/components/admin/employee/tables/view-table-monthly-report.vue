<template>
  <!-- Filter Header -->
  <div class="flex gap-4 mb-4 items-center text-sm">
    <select
      v-model="selectedMonth"
      class="p-2 border rounded-md cursor-pointer"
    >
      <option value="">Select Month</option>
      <option v-for="(m, index) in months" :key="index" :value="index + 1">
        {{ m }}
      </option>
    </select>

    <select v-model="selectedYear" class="p-2 border rounded-md cursor-pointer">
      <option value="">Select Years</option>
      <option v-for="year in years" :key="year" :value="year">
        {{ year }}
      </option>
    </select>

    <button
      @click="applyFilter"
      :disabled="loading"
      class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
    >
      {{ loading ? "Loading..." : "Apply Filter" }}
    </button>
  </div>
  <!-- Progress Overlay -->
  <div
    v-if="loading"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
  >
    <div class="flex flex-col items-center w-11/12 md:w-1/2 space-y-3">
      <!-- Loading Text -->
      <p class="text-white text-lg font-semibold animate-pulse">
        Generating Report . . .
      </p>

      <!-- Progress Bar Container -->
      <div class="w-80 bg-gray-300 rounded-full h-3 overflow-hidden shadow">
        <!-- Progress Fill -->
        <div
          class="bg-blue-600 h-3 transition-all duration-300 ease-out"
          :style="{ width: progress + '%' }"
        ></div>
      </div>

      <!-- Optional Percentage Label -->
      <p class="text-white text-sm font-medium">{{ Math.floor(progress) }}%</p>
    </div>
  </div>
  <div
    class="p-6 space-y-6 h-[80vh] overflow-y-auto border rounded-2xl bg-gray-50"
  >
    <!-- Report Header -->
    <div>
      <h2 class="text-2xl font-bold">Attendance Report</h2>
      <p class="text-gray-600 mt-1">
        <span v-if="!filterApplied" class="font-normal"
          >Please select month and year</span
        >
        <span v-else class="font-normal">
          Summary of each employee’s total days present, hours worked, and lates
          for {{ formattedMonth }}
        </span>
      </p>
    </div>

    <!-- Monthly Report Section -->
    <div v-if="filterApplied">
      <!-- Monthly Report Card -->
      <div
        class="bg-white rounded-md shadow p-4 space-y-4 mt-4"
        v-if="filteredMonthlyReport.length"
      >
        <!-- Legend Filter -->
        <div class="flex flex-wrap gap-6 text-sm">
          <p
            v-for="(color, key) in legendColors"
            :key="key"
            class="flex items-center cursor-pointer transition hover:text-blue-600"
            :class="{
              'font-semibold underline text-blue-600': selectedLegend === key,
            }"
            @click="selectedLegend = selectedLegend === key ? null : key"
          >
            <span
              class="inline-block w-4 h-4 mr-2 border rounded-sm"
              :class="color"
            ></span>
            {{ key }} Lates ({{ tardySummary[key] }})
          </p>
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
                  <th class="px-4 py-3 text-center border-b">Days Present</th>
                  <th class="px-4 py-3 text-center border-b">Total Hours</th>
                  <th class="px-4 py-3 text-center border-b">Total Lates</th>
                </tr>
              </thead>
              <tbody class="text-gray-700 divide-y divide-gray-100 uppercase">
                <tr
                  v-for="employee in filteredMonthlyReport"
                  :key="employee.employee_id"
                  :class="[
                    getRowClass(employee.lates),
                    'transition hover:bg-blue-50/50',
                  ]"
                >
                  <td class="px-4 py-3 text-left">
                    {{ employee.employee_id }}
                  </td>
                  <td class="px-4 py-3 text-left">{{ employee.name }}</td>
                  <td class="px-4 py-3 text-center">
                    {{ employee.daysPresent }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    {{ employee.totalHours }}
                  </td>
                  <td class="px-4 py-3 text-center">{{ employee.lates }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- No Records Found Message -->
      <div
        v-else
        class="text-gray-500 text-center py-10 text-lg font-medium mt-4"
      >
        No records found for the selected month/year.
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
                Month of {{ formattedMonth }}
              </h3>
            </div>
            <p class="text-gray-500 text-xs text-left mb-2">
              Based on number of late records this month.
            </p>

            <div class="overflow-x-auto">
              <table
                class="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm"
              >
                <thead class="bg-blue-900 text-white text-sm tracking-wider">
                  <tr>
                    <th class="px-3 py-2 text-left border-b border-gray-200">
                      Name
                    </th>
                    <th class="px-4 py-3 text-center border-b">Days Present</th>
                    <th class="px-4 py-3 text-center border-b">Total Hours</th>
                    <th class="px-3 py-2 text-center border-b border-gray-200">
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
                    <td class="px-3 py-2 border-b border-gray-200 text-left">
                      {{ emp.name }}
                    </td>
                    <td class="px-4 py-3 text-center">{{ emp.daysPresent }}</td>
                    <td class="px-4 py-3 text-center">{{ emp.totalHours }}</td>
                    <td class="px-3 py-2 text-center border-b border-gray-200">
                      {{ emp.lates }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Late Distribution Chart -->
          <div
            class="bg-white rounded-2xl border p-6 xl:col-span-2 flex flex-col items-center"
          >
            <h4 class="text-lg font-semibold">Late Distribution Chart</h4>
            <div class="w-full h-lg:h-[500px] flex justify-center items-center">
              <Bar :data="chartData" :options="chartOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Bar } from "vue-chartjs";
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
  LinearScale
);

export default {
  name: "ViewMonthlyReport",
  components: { Bar },

  data() {
    const now = new Date();
    return {
      data_attendance_records: [],
      data_employee_profile: [],
      // selectedMonth: now.getMonth() + 1,
      // selectedYear: now.getFullYear(),
      selectedMonth: "",
      selectedYear: "",
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
      selectedLegend: null,
      legendColors: {
        0: "bg-green-300",
        "1-3": "bg-blue-300",
        "4-5": "bg-yellow-300",
        "6-9": "bg-red-200",
        "10+": "bg-red-500",
      },
      loading: false,
      progress: 0,
      filterApplied: false, // NEW: track if filter was applied
    };
  },

  computed: {
    formattedMonth() {
      if (!this.selectedMonth || !this.selectedYear) return "All Time";
      return `${this.months[this.selectedMonth - 1]} ${this.selectedYear}`;
    },

    monthlyReport() {
      return this.data_attendance_records
        .map((emp) => {
          const profile = this.data_employee_profile.find(
            (e) => e.employee_id === emp.employee_id
          );
          const employment_status = profile?.employment_status || "InActive";
          const [year, month] = emp.month_year.split("-").map(Number);
          return {
            employee_id: emp.employee_id,
            name: emp.name,
            daysPresent: Number(emp.total_days_present),
            totalHours: Number(emp.total_attendance_hours).toFixed(2),
            lates: Number(emp.total_late_days),
            employment_status,
            month,
            year,
          };
        })
        .filter((e) => e.employment_status === "Active");
    },

    filteredMonthlyReport() {
      let filtered = this.monthlyReport;
      if (this.selectedMonth)
        filtered = filtered.filter((e) => e.month === this.selectedMonth);
      if (this.selectedYear)
        filtered = filtered.filter((e) => e.year === this.selectedYear);

      if (this.selectedLegend) {
        const range = {
          "1-3": [1, 3],
          "4-5": [4, 5],
          "6-9": [6, 9],
          "10+": [10, Infinity],
        }[this.selectedLegend];
        filtered = filtered.filter(
          (emp) => emp.lates >= range[0] && emp.lates <= range[1]
        );
      }
      return filtered;
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

    topLateComers() {
      return this.filteredMonthlyReport
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
              "#93c5fd",
              "#fcd34d",
              "#fca5a5",
              "#f87171",
            ],
          },
        ],
      };
    },

    chartOptions() {
      return {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
            labels: { color: "#374151", font: { size: 12 } },
          },
        },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      };
    },
  },

  methods: {
    fetchAttendanceRecords() {
      return axios
        .get(
          "http://localhost:8000/attendance-record/monthly-attendance-report"
        )
        .then((res) => (this.data_attendance_records = res.data || []))
        .catch((err) =>
          console.error("Error fetching attendance records:", err)
        );
    },

    fetchEmployeeRecords() {
      return axios
        .get("http://localhost:8000/upload/get-all")
        .then((res) => (this.data_employee_profile = res.data || []))
        .catch((err) => console.error("Error fetching employee records:", err));
    },

    getRowClass(lates) {
      if (lates >= 1 && lates <= 3) return "bg-blue-100";
      if (lates >= 4 && lates <= 5) return "bg-yellow-100";
      if (lates >= 6 && lates <= 9) return "bg-red-100";
      if (lates >= 10) return "bg-red-300";
      return "bg-green-50";
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
      this.filterApplied = false; // reset filter state
      this.data_attendance_records = [];
      this.data_employee_profile = [];

      await this.simulateProgress();
      await Promise.all([
        this.fetchAttendanceRecords(),
        this.fetchEmployeeRecords(),
      ]);

      this.filterApplied = true; // now show the report
      this.loading = false;

      console.log("Filter applied:", this.selectedMonth, this.selectedYear);
      console.log("Filtered Monthly Report:", this.filteredMonthlyReport);
    },
  },
};
</script>
