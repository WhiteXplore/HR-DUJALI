<template>
  <div class="bg-white shadow-sm border rounded-xl p-6 overflow-x-auto mt-2">
    <h2 class="text-lg text-left font-semibold text-gray-700 mb-4">
      Detailed Feedback
    </h2>

    <!-- Controls: Page size + Search + Total -->
    <div class="flex justify-between items-center mb-2 flex-wrap gap-2">
      <!-- Page size selector -->
      <div class="flex items-center gap-2">
        <label class="text-gray-600 text-sm">Show:</label>
        <select v-model.number="pageSize" class="p-1 border rounded-md">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>

      <!-- Search input -->
      <div class="flex items-center gap-2">
        <div class="relative">
          <span
            class="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400"
          >
            <!-- Magnifying glass icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </span>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search feedback..."
            class="pl-8 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm w-60 sm:w-80"
          />
        </div>
        <!-- Total records -->
        <div class="text-sm p-2 px-3 rounded-full bg-blue-800 text-white">
          Total Records: {{ filteredFeedbacks.length }}
        </div>
      </div>
    </div>

    <!-- Table -->
    <div
      class="h-[40vh] overflow-y-auto border border-gray-200 rounded-lg shadow-sm p-2"
    >
      <table
        class="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm text-left"
      >
        <thead class="bg-blue-900 text-white text-sm tracking-wider">
          <tr>
            <th class="p-3 border-b uppercase text-xs font-semibold">Date</th>
            <th class="p-3 border-b uppercase text-xs font-semibold">Office</th>
            <th class="p-3 border-b uppercase text-xs font-semibold">
              Service Availed
            </th>
            <th class="p-3 border-b uppercase text-xs font-semibold">
              Common Feedback
            </th>
            <th class="p-3 border-b uppercase text-xs font-semibold">
              Sentiment
            </th>
            <th
              class="p-3 border-b uppercase text-xs font-semibold text-center"
            >
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in paginatedFeedbacks"
            :key="item.id"
            class="hover:bg-gray-50 transition-colors duration-200 even:bg-gray-50"
          >
            <td class="p-3 border-b">{{ formatDate(item.fileDate) }}</td>
            <td class="p-3 border-b">{{ item.office || "-" }}</td>
            <td class="p-3 border-b">{{ item.serviceAvailed || "-" }}</td>
            <td class="p-3 border-b">{{ getFirstSentence(item.feedback) }}</td>
            <td
              class="p-3 border-b font-semibold"
              :class="{
                'text-green-600': item.final_sentiment_status === 'Positive',
                'text-red-600': item.final_sentiment_status === 'Negative',
                'text-gray-600': item.final_sentiment_status === 'Neutral',
              }"
            >
              {{ item.final_sentiment_status }}
            </td>
            <td class="p-3 border-b text-center">
              {{ item.final_sentiment_score }}
            </td>
          </tr>
          <tr v-if="filteredFeedbacks.length === 0">
            <td colspan="6" class="text-center p-4 text-gray-500">
              No records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination + Showing entries -->
    <div class="flex justify-between items-center mt-4 flex-wrap gap-2">
      <!-- Showing entries -->
      <div class="text-sm text-gray-600">
        Showing
        {{
          filteredFeedbacks.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
        }}
        to
        {{ Math.min(currentPage * pageSize, filteredFeedbacks.length) }}
        of {{ filteredFeedbacks.length }} entries
      </div>

      <!-- Pagination buttons -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Prev button as arrow -->
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-blue-100 disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <!-- Page numbers as circles -->
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="
            page === currentPage
              ? 'w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold'
              : 'w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-blue-50'
          "
        >
          {{ page }}
        </button>

        <!-- Next button as arrow -->
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-blue-100 disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailedFeedback",
  props: {
    feedbacks: { type: Array, required: true },
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      searchQuery: "",
    };
  },
  computed: {
    // Filter feedbacks based on search query
    filteredFeedbacks() {
      if (!this.searchQuery) return this.feedbacks;

      const query = this.searchQuery.toLowerCase();
      return this.feedbacks.filter((f) => {
        return (
          (f.office && f.office.toLowerCase().includes(query)) ||
          (f.serviceAvailed &&
            f.serviceAvailed.toLowerCase().includes(query)) ||
          (f.feedback && f.feedback.toLowerCase().includes(query)) ||
          (f.final_sentiment_status &&
            f.final_sentiment_status.toLowerCase().includes(query))
        );
      });
    },
    // Paginated feedbacks
    paginatedFeedbacks() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredFeedbacks.slice(start, start + this.pageSize);
    },
    // Total pages
    totalPages() {
      return Math.ceil(this.filteredFeedbacks.length / this.pageSize) || 1;
    },
  },
  methods: {
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
    getFirstSentence(text) {
      if (!text) return "-";
      const sentences = text.split(".");
      return sentences[0] ? sentences[0].trim() + "." : "-";
    },
    goToPage(page) {
      this.currentPage = page;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
  },
  watch: {
    pageSize() {
      this.currentPage = 1;
    },
    searchQuery() {
      this.currentPage = 1;
    },
  },
};
</script>
