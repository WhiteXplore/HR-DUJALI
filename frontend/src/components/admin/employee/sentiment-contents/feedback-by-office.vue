<template>
  <div
    class="bg-white shadow-sm border rounded-2xl p-4 flex flex-col justify-center transition hover:shadow-sm -xl"
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
    // Returns an array of { office, count } objects, sorted descending by count
    sortedCountsByOffice() {
      const counts = {};
      this.feedbacks.forEach((f) => {
        if (f.office) counts[f.office] = (counts[f.office] || 0) + 1;
      });

      // Convert object to array and sort by count descending
      return Object.entries(counts)
        .map(([office, count]) => ({ office, count }))
        .sort((a, b) => b.count - a.count);
    },
  },
};
</script>
