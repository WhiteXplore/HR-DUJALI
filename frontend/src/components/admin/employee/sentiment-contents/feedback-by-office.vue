<template>
  <div
    class="bg-white shadow-sm border rounded-2xl p-4 flex flex-col justify-center transition hover:shadow-sm"
  >
    <h2
      class="text-xl font-semibold text-gray-700 mb-4 text-center md:text-left"
    >
      Most Common Sentiment by Office
    </h2>

    <div class="h-80 overflow-y-auto border rounded-lg shadow-sm">
      <table
        class="min-w-full text-left text-sm border border-gray-200 rounded-lg overflow-hidden"
      >
        <thead class="bg-blue-900 text-white text-sm tracking-wider">
          <tr>
            <th class="p-2 border-b uppercase text-xs font-semibold">Office</th>
            <th class="p-2 border-b uppercase text-xs font-semibold">Count</th>
            <th class="p-2 border-b uppercase text-xs font-semibold">
              Most Common Sentiment
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in sortedCountsByOffice"
            :key="item.office"
            class="hover:bg-blue-50 transition-colors duration-200 even:bg-gray-50"
          >
            <td class="p-2 border-b">{{ item.office }}</td>
            <td class="p-2 pl-6 border-b font-bold text-gray-800">
              {{ item.count }}
            </td>
            <td
              class="p-2 border-b font-semibold text-center"
              :class="sentimentColor(item.mostCommonSentiment)"
            >
              {{ item.mostCommonSentiment }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "FeedbackByOffice",
  props: {
    feedbacks: { type: Array, required: true },
  },
  computed: {
    sortedCountsByOffice() {
      const officeData = {};

      // Aggregate feedbacks by office
      this.feedbacks.forEach((f) => {
        if (!f.office) return;

        if (!officeData[f.office]) {
          officeData[f.office] = { count: 0, sentiments: {} };
        }

        officeData[f.office].count += 1;

        const sentiment = f.final_sentiment_status || "Neutral";
        officeData[f.office].sentiments[sentiment] =
          (officeData[f.office].sentiments[sentiment] || 0) + 1;
      });

      // Convert to array and calculate most common sentiment
      const result = Object.entries(officeData).map(([office, data]) => {
        const mostCommonSentiment = Object.entries(data.sentiments).reduce(
          (max, [sentiment, count]) =>
            count > max.count ? { sentiment, count } : max,
          { sentiment: "-", count: 0 },
        ).sentiment;

        return {
          office,
          count: data.count,
          mostCommonSentiment,
        };
      });

      // Sort descending by count
      return result.sort((a, b) => b.count - a.count);
    },
  },
  methods: {
    sentimentColor(status) {
      return {
        Positive: "text-green-600",
        Negative: "text-red-600",
        Neutral: "text-gray-600",
      }[status];
    },
  },
};
</script>
