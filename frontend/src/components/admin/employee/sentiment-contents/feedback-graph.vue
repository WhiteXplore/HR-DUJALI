<template>
  <div class="bg-white shadow-lg border rounded-xl p-6 mt-4">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">
      Feedback Count per Sentiment Status by Office
    </h2>
    <canvas ref="sentimentChart"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "StackedSentimentChart",
  props: {
    feedbacks: { type: Array, required: true }, // Pass your feedback data here
  },
  setup(props) {
    const sentimentChart = ref(null);
    let chartInstance = null;

    const renderChart = () => {
      if (!sentimentChart.value) return;
      if (chartInstance) chartInstance.destroy();

      // Aggregate counts per office per sentiment
      const officeMap = {};
      props.feedbacks.forEach((f) => {
        const office = f.Office || f.office || "Unknown Office"; // fallback if field differs
        const status = f.Sentiment || f.final_sentiment_status || "Neutral"; // fallback
        if (!officeMap[office])
          officeMap[office] = { Positive: 0, Negative: 0, Neutral: 0 };
        officeMap[office][status] += 1;
      });

      // Prepare data for chart
      const labels = Object.keys(officeMap);
      const positiveCounts = labels.map((label) => officeMap[label].Positive);
      const negativeCounts = labels.map((label) => officeMap[label].Negative);
      const neutralCounts = labels.map((label) => officeMap[label].Neutral);

      const ctx = sentimentChart.value.getContext("2d");
      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Positive",
              data: positiveCounts,
              backgroundColor: "rgba(34,197,94,0.8)", // green
            },
            {
              label: "Negative",
              data: negativeCounts,
              backgroundColor: "rgba(239,68,68,0.8)", // red
            },
            {
              label: "Neutral",
              data: neutralCounts,
              backgroundColor: "rgba(107,114,128,0.8)", // gray
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            tooltip: {
              mode: "index",
              intersect: false,
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.raw}`;
                },
              },
            },
          },
          interaction: { mode: "nearest", axis: "x", intersect: false },
          scales: {
            x: {
              stacked: true,
              title: { display: true, text: "Office" },
              ticks: { autoSkip: false, maxRotation: 90, minRotation: 45 }, // for long office names
            },
            y: {
              stacked: true,
              title: { display: true, text: "Number of Feedbacks" },
              beginAtZero: true,
            },
          },
        },
      });
    };

    onMounted(() => renderChart());

    watch(
      () => props.feedbacks,
      () => renderChart(),
      { deep: true },
    );

    return { sentimentChart };
  },
};
</script>

<style scoped>
canvas {
  /* Optional: smooth animation */
  transition: all 0.3s ease;
}
</style>
