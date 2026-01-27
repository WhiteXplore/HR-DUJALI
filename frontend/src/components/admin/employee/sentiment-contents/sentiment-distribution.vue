<template>
  <div
    class="bg-white shadow-sm border rounded-2xl p-4 flex flex-col justify-center transition hover:shadow-sm -xl"
  >
    <h2
      class="text-xl font-semibold text-gray-700 mb-4 text-center md:text-left"
    >
      Sentiment Distribution
    </h2>
    <div class="h-80">
      <PieChart :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
  name: "SentimentDistribution",
  components: {
    PieChart: Pie,
  },
  props: {
    feedbacks: { type: Array, required: true },
  },
  computed: {
    chartData() {
      // ✅ Use final_sentiment_status, not score
      const counts = { Positive: 0, Negative: 0, Neutral: 0 };
      this.feedbacks.forEach(
        (f) =>
          (counts[f.final_sentiment_status] =
            (counts[f.final_sentiment_status] || 0) + 1),
      );
      return {
        labels: ["Positive", "Negative", "Neutral"],
        datasets: [
          {
            label: "Sentiment Distribution",
            backgroundColor: ["#10B981", "#EF4444", "#6B7280"],
            data: [counts.Positive, counts.Negative, counts.Neutral],
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom", labels: { font: { size: 12 } } },
        },
      };
    },
  },
};
</script>
