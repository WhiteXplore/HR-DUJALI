<template>
  <!-- Progress Overlay -->
  <div
    v-if="loading"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
  >
    <div class="flex flex-col items-center w-11/12 md:w-1/2 space-y-3">
      <p class="text-white text-lg font-semibold animate-pulse">
        Generating Report . . .
      </p>
      <div class="w-80 bg-gray-300 rounded-full h-3 overflow-hidden shadow-sm">
        <div
          class="bg-blue-600 h-3 transition-all duration-300 ease-out"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
      <p class="text-white text-sm font-medium">{{ Math.floor(progress) }}%</p>
    </div>
  </div>
  <div
    class="flex flex-col p-4 space-y-6 h-[89vh] overflow-y-auto border rounded-2xl bg-gray-50"
  >
    <!-- Header & Filters -->
    <div class="flex flex-col md:flex-row justify-between items-end mb-4">
      <!-- Filter Header -->
      <div class="flex flex-col text-left">
        <h1 class="font-semibold tracking-wide text-md">
          Client Feedback Form Reports
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          View
          <span class="font-normal">
            Summary of feedback for {{ selectedMonthName || "?" }}
            {{ selectedYear || "Select Years" }}
          </span>
        </p>
      </div>

      <!-- Filters -->
      <div class="flex gap-4 text-sm mt-4 md:mt-0">
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
          <option value="">Select Years</option>
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
    </div>

    <!-- Summary Cards + Sentiment Distribution -->
    <div
      v-if="filteredFeedbacks.length"
      class="flex flex-col md:flex-row justify-between gap-6"
    >
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 gap-6 flex-1">
        <div
          class="bg-white border rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center items-center transition hover:shadow-lg"
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
          class="bg-white border rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center items-center transition hover:shadow-lg"
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
          class="bg-white border rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center items-center transition hover:shadow-lg"
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
          class="bg-white border rounded-2xl p-6 shadow-sm text-center flex flex-col justify-center items-center transition hover:shadow-lg"
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

      <!-- Sentiment Distribution -->
      <div class="flex-1">
        <sentimentDistribution :feedbacks="filteredFeedbacks" />
      </div>
    </div>

    <!-- Charts & Tables Section -->
    <div
      v-if="filterApplied && filteredFeedbacks.length"
      class="flex flex-col md:flex-row gap-6 mt-6"
    >
      <!-- Feedback by Office -->
      <feedbackByOffice :feedbacks="filteredFeedbacks" class="flex-1" />

      <!-- Feedback by Client Type -->
      <feedbackByClientType :feedbacks="filteredFeedbacks" class="flex-1" />
    </div>
    <div v-if="filteredFeedbacks.length">
      <feedbackGraph :feedbacks="filteredFeedbacks" />
    </div>
    <!-- Detailed Feedback Table -->
    <div v-if="filteredFeedbacks.length">
      <detailedFeedback :feedbacks="filteredFeedbacks" />
    </div>

    <!-- No Data Message -->
    <div
      v-else-if="!filteredFeedbacks.length && !loading"
      class="text-gray-500 text-center py-10 text-lg font-medium mt-4"
    >
      No data available. Please select <strong>"Month"</strong> and
      <strong>"Year"</strong> and click the
      <strong>"Apply Filter"</strong> button.
    </div>
  </div>
</template>

<script>
import sentimentDistribution from "../sentiment-contents/sentiment-distribution.vue";
import feedbackByClientType from "../sentiment-contents/feedback-by-client-type.vue";
import feedbackByOffice from "../sentiment-contents/feedback-by-office.vue";
import detailedFeedback from "../sentiment-contents/detailed-feedback.vue";
import feedbackGraph from "../sentiment-contents/feedback-graph.vue";

export default {
  name: "CustomerFeedbackReport",
  components: {
    sentimentDistribution,
    feedbackByOffice,
    feedbackByClientType,
    detailedFeedback,
    feedbackGraph,
  },
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
      filterApplied: false,
    };
  },
  computed: {
    selectedMonthName() {
      return this.selectedMonth
        ? this.months[this.selectedMonth - 1]
        : "Select Month";
    },
    totalOffices() {
      const unique = new Set(
        this.filteredFeedbacks.map((f) => f.office).filter(Boolean),
      );
      return unique.size;
    },
    avgSentimentScore() {
      if (!this.filteredFeedbacks.length) return 0;
      return (
        this.filteredFeedbacks.reduce(
          (sum, f) => sum + Number(f.final_sentiment_score || 0),
          0,
        ) / this.filteredFeedbacks.length
      );
    },
    mostCommonSentiment() {
      const counts = { Positive: 0, Negative: 0, Neutral: 0 };
      this.filteredFeedbacks.forEach(
        (f) =>
          (counts[f.final_sentiment_status] =
            (counts[f.final_sentiment_status] || 0) + 1),
      );
      return Object.entries(counts).reduce(
        (max, entry) => (entry[1] > max[1] ? entry : max),
        ["-", 0],
      )[0];
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

      this.loading = false;
    },
  },
  mounted() {
    this.fetchFeedbacks();
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
