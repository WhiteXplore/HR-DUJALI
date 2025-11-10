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
      Apply Filter
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
      <div class="w-80 bg-gray-300 rounded-full h-3 overflow-hidden shadow-sm">
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
      <h2 class="text-2xl font-bold text-gray-800">Customer Feedback Report</h2>
      <p class="text-gray-600 mt-1">
        <span v-if="!filterApplied" class="font-normal"
          >Please select month and year</span
        >
        <span v-else class="font-normal">
          Summary of feedback for {{ selectedMonthName }}
          {{ selectedYear || "Select Years" }}
        </span>
      </p>
    </div>

    <!-- Summary & Chart Section -->
    <div
      v-if="filteredFeedbacks.length"
      class="flex flex-col md:flex-row gap-6 mt-6"
    >
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 flex-1">
        <div
          class="bg-white border rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center items-center transition hover:shadow-sm -xl"
        >
          <p
            class="uppercase tracking-wider text-gray-400 text-xs font-semibold"
          >
            Total Feedback
          </p>
          <p class="text-4xl font-bold text-gray-900 mt-3">
            {{ filteredFeedbacks.length }}
          </p>
        </div>

        <div
          class="bg-white border rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center items-center transition hover:shadow-sm -xl"
        >
          <p
            class="uppercase tracking-wider text-gray-400 text-xs font-semibold"
          >
            Average Sentiment Score
          </p>
          <p class="text-4xl font-bold text-gray-900 mt-3">
            {{ avgSentimentScore.toFixed(2) }}
          </p>
        </div>

        <div
          class="bg-white border rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center items-center transition hover:shadow-sm -xl"
        >
          <p
            class="uppercase tracking-wider text-gray-400 text-xs font-semibold"
          >
            Most Common Sentiment
          </p>
          <p class="text-4xl font-bold text-gray-900 mt-3">
            {{ mostCommonSentiment }}
          </p>
        </div>

        <div
          class="bg-white border rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center items-center transition hover:shadow-sm -xl"
        >
          <p
            class="uppercase tracking-wider text-gray-400 text-xs font-semibold"
          >
            Total Offices
          </p>
          <p class="text-4xl font-bold text-gray-900 mt-3">
            {{ totalOffices }}
          </p>
        </div>
      </div>

      <!-- Sentiment Chart -->
      <div
        class="bg-white shadow-sm border rounded-2xl flex-1 flex flex-col justify-center transition hover:shadow-sm -xl"
      >
        <h2
          class="text-xl font-semibold text-gray-700 mb-4 text-center md:text-left px-4 py-4"
        >
          Sentiment Distribution
        </h2>
        <div class="h-80">
          <Pie :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </div>

    <div
      v-if="filterApplied && filteredFeedbacks.length"
      class="flex flex-col md:flex-row gap-6 mt-6"
    >
      <!-- Feedback by Office Table -->
      <div class="bg-white shadow-sm border rounded-2xl p-6 flex-1">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 text-center">
          Feedback by Office
        </h3>
        <div
          class="h-[30vh] overflow-y-auto border border-gray-200 rounded-lg shadow-sm -sm"
        >
          <table
            class="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm text-left"
          >
            <thead class="bg-blue-900 text-white text-sm tracking-wider">
              <tr>
                <th class="p-2 border-b uppercase text-xs font-semibold">
                  Office
                </th>
                <th class="p-2 border-b uppercase text-xs font-semibold">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(count, office) in feedbackByOffice"
                :key="office"
                class="hover:bg-gray-50 transition-colors duration-200 even:bg-gray-50"
              >
                <td class="p-2 border-b">{{ office }}</td>
                <td class="p-2 pl-6 border-b font-bold text-gray-800">
                  {{ count }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Feedback by Client Type Table -->
      <div class="bg-white shadow-sm border rounded-2xl p-6 flex-1">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 text-center">
          Feedback by Client Type
        </h3>
        <div
          class="h-[30vh] overflow-y-auto border border-gray-200 rounded-lg shadow-sm -sm p-2"
        >
          <table
            class="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm text-left"
          >
            <thead class="bg-blue-900 text-white text-sm tracking-wider">
              <tr>
                <th class="p-2 border-b uppercase text-xs font-semibold">
                  Client Type
                </th>
                <th class="p-2 border-b uppercase text-xs font-semibold">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(count, client) in feedbackByClientType"
                :key="client"
                class="hover:bg-gray-50 transition-colors duration-200 even:bg-gray-50"
              >
                <td class="p-2 border-b">{{ client }}</td>
                <td class="p-2 pl-6 border-b font-bold text-gray-800">
                  {{ count }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Detailed Feedback Table -->
    <div
      v-if="filteredFeedbacks.length"
      class="bg-white shadow-sm border rounded-xl p-6 overflow-x-auto mt-2"
    >
      <h2 class="text-lg text-left font-semibold text-gray-700 mb-4">
        Detailed Feedback
      </h2>

      <!-- Page Size Selector -->
      <!-- Page Size Selector + Office Filter -->
      <div class="flex justify-between items-center mb-2">
        <div class="flex items-center gap-2">
          <label class="text-gray-600 text-sm">Show:</label>
          <select v-model.number="pageSize" class="p-1 border rounded-md">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <!-- <label class="text-gray-600 text-sm">Filter by Office:</label> -->
            <select
              v-model="selectedOffice"
              class="p-1 py-2 border rounded-md cursor-pointer"
            >
              <option value="">Select Office</option>
              <option
                v-for="office in uniqueOffices"
                :key="office"
                :value="office"
              >
                {{ office }}
              </option>
            </select>
          </div>
          <div class="text-gray-600 text-sm">
            Total Records: {{ filteredFeedbacks.length }}
          </div>
        </div>
      </div>

      <!-- Table -->
      <div
        class="h-[40vh] overflow-y-auto border border-gray-200 rounded-lg shadow-sm -sm p-2"
      >
        <table
          class="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm text-left"
        >
          <thead class="bg-blue-900 text-white text-sm tracking-wider">
            <tr>
              <th class="p-3 border-b uppercase text-xs font-semibold">
                Office
              </th>
              <th class="p-3 border-b uppercase text-xs font-semibold">
                Service Availed
              </th>
              <th class="p-3 border-b uppercase text-xs font-semibold">
                Sentiment
              </th>
              <th class="p-3 border-b uppercase text-xs font-semibold">
                Score
              </th>
              <th class="p-3 border-b uppercase text-xs font-semibold">
                Feedback
              </th>
              <th class="p-3 border-b uppercase text-xs font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in paginatedFeedbacks"
              :key="item.id"
              class="hover:bg-gray-50 transition-colors duration-200 even:bg-gray-50"
            >
              <td class="p-3 border-b">{{ item.office || "-" }}</td>
              <td class="p-3 border-b">{{ item.serviceAvailed || "-" }}</td>
              <td
                class="p-3 border-b font-semibold"
                :class="{
                  'text-green-600': item.sentiment === 'Positive',
                  'text-red-600': item.sentiment === 'Negative',
                  'text-gray-600': item.sentiment === 'Neutral',
                }"
              >
                {{ item.sentiment }}
              </td>
              <td class="p-3 border-b">{{ item.sentimentScore }}</td>
              <td class="p-3 border-b">{{ item.feedback || "-" }}</td>
              <td class="p-3 border-b">{{ formatDate(item.fileDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="flex justify-end items-center gap-2 mt-4">
        <!-- Previous Button -->
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="flex items-center justify-center px-3 py-1 rounded-lg bg-white border shadow-sm -sm hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <icon :name="'back'" class="w-4 h-4" />
        </button>

        <!-- Page Numbers -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-2 py-1 rounded-lg border shadow-sm -sm transition hover:bg-blue-50',
            page === currentPage
              ? 'bg-blue-600 text-white shadow-sm -md'
              : 'bg-white text-gray-700',
          ]"
        >
          {{ page }}
        </button>

        <!-- Next Button -->
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="flex items-center justify-center px-2 py-1 rounded-lg bg-white border shadow-sm -sm hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <icon :name="'next'" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- <div
      v-else-if="!loading"
      class="text-gray-500 text-center py-10 text-lg font-medium mt-4"
    >
      No feedback records available.
    </div> -->
  </div>
</template>

<script>
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import icon from "@/assets/icon.vue";
ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
  name: "CustomerFeedbackReport",
  components: { Pie, icon },
  data() {
    return {
      feedbacks: [],
      filteredFeedbacks: [],
      chartData: { labels: [], datasets: [] },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { font: { size: 12 } } },
        },
      },
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
      years: [2024, 2025, 2026],
      loading: false,
      progress: 0,
      filterApplied: false,
      currentPage: 1,
      pageSize: 10, // default entries per page
      pageSizeOptions: [10, 25, 50, 100],
      maxVisiblePages: 3,
      selectedOffice: "",
    };
  },
  computed: {
    feedbackByOffice() {
      const counts = {};
      this.filteredFeedbacks.forEach((f) => {
        if (f.office) counts[f.office] = (counts[f.office] || 0) + 1;
      });
      return counts;
    },
    feedbackByClientType() {
      const counts = {};
      this.filteredFeedbacks.forEach((f) => {
        if (f.clientType)
          counts[f.clientType] = (counts[f.clientType] || 0) + 1;
      });
      return counts;
    },
    uniqueOffices() {
      const offices = this.filteredFeedbacks
        .map((f) => f.office)
        .filter(Boolean);
      return [...new Set(offices)];
    },
    paginatedFeedbacks() {
      let data = this.filteredFeedbacks;

      // Apply office filter
      if (this.selectedOffice) {
        data = data.filter((f) => f.office === this.selectedOffice);
      }

      const start = (this.currentPage - 1) * this.pageSize;
      return data.slice(start, start + this.pageSize);
    },
    totalPages() {
      let data = this.filteredFeedbacks;
      if (this.selectedOffice) {
        data = data.filter((f) => f.office === this.selectedOffice);
      }
      return Math.ceil(data.length / this.pageSize);
    },
    visiblePages() {
      let pages = [];
      let startPage = Math.max(this.currentPage - 1, 1);
      let endPage = Math.min(
        startPage + this.maxVisiblePages - 1,
        this.totalPages
      );

      if (endPage - startPage + 1 < this.maxVisiblePages) {
        startPage = Math.max(endPage - this.maxVisiblePages + 1, 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
    selectedMonthName() {
      return this.selectedMonth
        ? this.months[this.selectedMonth - 1]
        : "Select Month";
    },
    totalOffices() {
      const unique = new Set(
        this.filteredFeedbacks.map((f) => f.office).filter(Boolean)
      );
      return unique.size;
    },
    avgSentimentScore() {
      if (!this.filteredFeedbacks.length) return 0;
      return (
        this.filteredFeedbacks.reduce(
          (sum, f) => sum + Number(f.sentimentScore || 0),
          0
        ) / this.filteredFeedbacks.length
      );
    },
    mostCommonSentiment() {
      const counts = { Positive: 0, Negative: 0, Neutral: 0 };
      this.filteredFeedbacks.forEach(
        (f) => (counts[f.sentiment] = (counts[f.sentiment] || 0) + 1)
      );
      return (
        Object.entries(counts).reduce(
          (a, b) => (a[1] > b[1] ? a : b),
          [0, 0]
        )[0] || "-"
      );
    },
  },
  watch: {
    selectedOffice() {
      this.currentPage = 1; // Reset page on office change
    },
    filteredFeedbacks() {
      this.currentPage = 1; // Reset page when filter changes
    },
    pageSize() {
      this.currentPage = 1; // Reset page when page size changes
    },
  },
  methods: {
    goToPage(page) {
      this.currentPage = page;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    async fetchFeedbacks() {
      try {
        const res = await fetch("http://localhost:8000/customer-feedback");
        this.feedbacks = await res.json();
      } catch (err) {
        console.error(err);
      }
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
      this.filterApplied = true;
      await this.simulateProgress();

      this.filteredFeedbacks = this.feedbacks.filter((f) => {
        const d = new Date(f.fileDate);
        const monthMatch = this.selectedMonth
          ? d.getUTCMonth() + 1 === Number(this.selectedMonth)
          : true;
        const yearMatch = this.selectedYear
          ? d.getUTCFullYear() === Number(this.selectedYear)
          : true;
        return monthMatch && yearMatch;
      });

      // update chart data
      const counts = { Positive: 0, Negative: 0, Neutral: 0 };
      this.filteredFeedbacks.forEach(
        (f) => (counts[f.sentiment] = (counts[f.sentiment] || 0) + 1)
      );
      this.chartData = {
        labels: ["Positive", "Negative", "Neutral"],
        datasets: [
          {
            label: "Sentiment Distribution",
            backgroundColor: ["#10B981", "#EF4444", "#6B7280"],
            data: [counts.Positive, counts.Negative, counts.Neutral],
          },
        ],
      };

      this.loading = false;
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
  },
  mounted() {
    this.fetchFeedbacks();
  },
};
</script>

<style scoped>
/* Smooth progress bar animation */
</style>
