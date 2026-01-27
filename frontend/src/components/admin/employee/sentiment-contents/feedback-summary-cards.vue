<template>
  <div class="p-6 space-y-6">
    <!-- Filter Section -->
    <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
      <select
        v-model="selectedMonth"
        class="p-2 border rounded-xl cursor-pointer"
      >
        <option value="">Select Month</option>
        <option v-for="(m, index) in months" :key="index" :value="index + 1">
          {{ m }}
        </option>
      </select>

      <select
        v-model="selectedYear"
        class="p-2 border rounded-xl cursor-pointer"
      >
        <option value="">Select Year</option>
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>

      <button
        @click="applyFilter"
        :disabled="loading || !selectedMonth || !selectedYear"
        class="cursor-pointer flex gap-2 items-center tracking-wider bg-blue-500 text-white text-sm hover:text-blue-700 px-4 py-2 rounded-xl hover:bg-white border hover:border-blue-900 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <p class="text-white text-lg font-semibold animate-pulse">
          Generating Report . . .
        </p>
        <div
          class="w-80 bg-gray-300 rounded-full h-3 overflow-hidden shadow-sm"
        >
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

    <!-- Cards -->
    <div
      v-if="filteredFeedbacks.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 flex-1"
    >
      <div
        class="bg-white border rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center items-center transition hover:shadow-md"
      >
        <p class="uppercase tracking-wider text-gray-400 text-xs font-semibold">
          Total Feedback
        </p>
        <p class="text-4xl font-bold text-gray-900 mt-3">
          {{ filteredFeedbacks.length }}
        </p>
      </div>

      <div
        class="bg-white border rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center items-center transition hover:shadow-md"
      >
        <p class="uppercase tracking-wider text-gray-400 text-xs font-semibold">
          Average Sentiment Score
        </p>
        <p class="text-4xl font-bold text-gray-900 mt-3">
          {{ avgSentimentScore }}
        </p>
      </div>

      <div
        class="bg-white border rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center items-center transition hover:shadow-md"
      >
        <p class="uppercase tracking-wider text-gray-400 text-xs font-semibold">
          Most Common Sentiment
        </p>
        <p class="text-4xl font-bold text-gray-900 mt-3">
          {{ mostCommonSentiment }}
        </p>
      </div>

      <div
        class="bg-white border rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center items-center transition hover:shadow-md"
      >
        <p class="uppercase tracking-wider text-gray-400 text-xs font-semibold">
          Total Offices
        </p>
        <p class="text-4xl font-bold text-gray-900 mt-3">{{ totalOffices }}</p>
      </div>
    </div>

    <!-- No Data Message -->
    <div
      v-else-if="!loading"
      class="text-gray-500 text-center py-10 text-lg font-medium mt-4"
    >
      No data available. Please select <strong>"Month"</strong> and
      <strong>"Year"</strong> and click <strong>"Apply Filter"</strong>.
    </div>

    <div class="mt-6">
      <router-link
        to="/feedback-report"
        class="text-blue-600 hover:underline font-medium"
      >
        ← Back to Report
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "FeedbackSummaryCards",
  data() {
    const now = new Date();
    return {
      feedbacks: [],
      filteredFeedbacks: [],
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
      loading: false,
      progress: 0,
    };
  },
  computed: {
    totalOffices() {
      const unique = new Set(
        this.filteredFeedbacks.map((f) => f.office).filter(Boolean),
      );
      return unique.size;
    },
    avgSentimentScore() {
      if (!this.filteredFeedbacks.length) return 0;
      const avg =
        this.filteredFeedbacks.reduce(
          (sum, f) => sum + Number(f.sentimentScore || 0),
          0,
        ) / this.filteredFeedbacks.length;
      return avg.toFixed(2);
    },
    mostCommonSentiment() {
      const counts = { Positive: 0, Negative: 0, Neutral: 0 };
      this.filteredFeedbacks.forEach(
        (f) => (counts[f.sentiment] = (counts[f.sentiment] || 0) + 1),
      );
      return (
        Object.entries(counts).reduce(
          (a, b) => (a[1] > b[1] ? a : b),
          [0, 0],
        )[0] || "-"
      );
    },
  },
  methods: {
    async fetchFeedbacks() {
      try {
        const res = await fetch(
          process.env.VUE_APP_API_BASE_URL + "/customer-feedback",
        );
        this.feedbacks = await res.json();
      } catch (err) {
        console.error(err);
      }
    },
    async applyFilter() {
      this.loading = true;
      this.progress = 0;

      // simulate progress
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          this.progress += Math.random() * 15;
          if (this.progress >= 100) {
            this.progress = 100;
            clearInterval(interval);
            resolve();
          }
        }, 200);
      });

      // filter feedbacks
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

      this.loading = false;
    },
  },
  mounted() {
    this.fetchFeedbacks();
  },
};
</script>
