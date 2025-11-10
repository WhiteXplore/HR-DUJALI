<template>
  <div class="w-full h-full p-10">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
  name: "GraphPages",
  components: { Doughnut },
  data() {
    return {
      chartData: {
        labels: ["Blue", "Light Blue", "Yellow"],
        datasets: [
          {
            label: "Dataset",
            data: [44, 25, 13], // Sum of your values or any aggregated data for doughnut
            backgroundColor: ["#3b82f6", "#60a5fa", "#facc15"],
            borderWidth: 1,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              color: "#4b5563", // Tailwind gray-700
              font: { size: 12 },
            },
          },
          title: { display: false },
        },
      },
    };
  },
};
</script>

<style scoped></style>
