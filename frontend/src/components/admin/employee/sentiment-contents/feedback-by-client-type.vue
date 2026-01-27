<template>
  <div
    class="bg-white shadow-sm border rounded-2xl p-4 flex flex-col justify-center transition hover:shadow-sm -xl"
  >
    <h2
      class="text-xl font-semibold text-gray-700 mb-4 text-center md:text-left"
    >
      Feedback by Client Type
    </h2>

    <div class="h-80 overflow-y-auto border rounded-lg shadow-sm">
      <table
        class="min-w-full text-left text-sm border border-gray-200 rounded-lg overflow-hidden"
      >
        <thead class="bg-blue-900 text-white text-sm tracking-wider">
          <tr>
            <th class="p-2 border-b uppercase text-xs font-semibold">
              Client Type
            </th>
            <th class="p-2 border-b uppercase text-xs font-semibold">Count</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(count, type) in countsByClientType"
            :key="type"
            class="hover:bg-gray-50 transition-colors duration-200 even:bg-gray-50"
          >
            <td class="p-2 border-b">{{ type }}</td>
            <td class="p-2 pl-6 border-b font-bold text-gray-800">
              {{ count }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "FeedbackByClientType",
  props: {
    feedbacks: { type: Array, required: true },
  },
  computed: {
    countsByClientType() {
      const counts = {};
      this.feedbacks.forEach((f) => {
        if (f.clientType)
          counts[f.clientType] = (counts[f.clientType] || 0) + 1;
      });
      return counts;
    },
  },
};
</script>
