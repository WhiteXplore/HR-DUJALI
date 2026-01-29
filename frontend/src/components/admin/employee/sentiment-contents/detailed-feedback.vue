<template>
  <div class="bg-white shadow-sm border rounded-xl p-6 overflow-x-auto mt-2">
    <h2 class="text-lg text-left font-semibold text-gray-700 mb-4">
      Detailed Feedback
    </h2>

    <!-- Controls -->
    <div class="flex justify-between items-center mb-3 flex-wrap gap-2">
      <div class="flex items-center gap-2">
        <label class="text-gray-600 text-sm">Show:</label>
        <select v-model.number="pageSize" class="p-1 border rounded-md">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <div class="relative">
          <span
            class="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400"
            >🔍</span
          >
          <input
            v-model="searchQuery"
            placeholder="Search feedback..."
            class="pl-8 pr-3 py-2 border rounded-lg text-sm w-60"
          />
        </div>

        <div class="text-sm px-3 py-2 rounded-full bg-blue-800 text-white">
          Total Records: {{ filteredFeedbacks.length }}
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="h-[40vh] overflow-y-auto border rounded-lg">
      <table class="min-w-full text-sm text-left">
        <thead class="bg-blue-900 text-white">
          <tr>
            <th class="p-3">Date</th>
            <th class="p-3">Office</th>
            <th class="p-3">Service</th>
            <th class="p-3">Feedback</th>
            <th class="p-3">Sentiment</th>
            <th class="p-3 text-center">Score</th>
            <th class="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in paginatedFeedbacks"
            :key="item.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="p-3">{{ formatDate(item.fileDate) }}</td>
            <td class="p-3">{{ item.office }}</td>
            <td class="p-3">{{ item.serviceAvailed }}</td>
            <td class="p-3">{{ getFirstSentence(item.feedback) }}</td>

            <td
              class="p-3 font-semibold"
              :class="sentimentColor(item.final_sentiment_status)"
            >
              {{ item.final_sentiment_status }}
            </td>

            <td class="p-3 text-center">
              {{ item.final_sentiment_score }}
            </td>

            <td class="p-3 text-center">
              <button
                @click="openModal(item)"
                class="px-3 py-1 rounded-full text-xs bg-blue-600 text-white hover:bg-blue-700"
              >
                View
              </button>
            </td>
          </tr>

          <tr v-if="filteredFeedbacks.length === 0">
            <td colspan="7" class="text-center p-4 text-gray-500">
              No records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Info -->
    <div class="text-sm text-gray-600 mt-4">
      Showing
      {{
        filteredFeedbacks.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
      }}
      to
      {{ Math.min(currentPage * pageSize, filteredFeedbacks.length) }}
      of {{ filteredFeedbacks.length }} entries
    </div>

    <!-- MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-2xl w-[95%] max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <!-- Header -->
        <div class="flex justify-between items-center border-b pb-3 mb-6">
          <h3 class="font-semibold text-lg text-gray-800">Feedback Analysis</h3>
          <button
            @click="showModal = false"
            class="text-gray-400 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        <!-- Meta Info -->
        <div class="grid grid-cols-2 gap-4 text-sm mb-6">
          <div class="flex flex-col">
            <p class="text-xs text-left text-gray-500 mb-1">Office</p>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="font-medium text-gray-800">
                {{ selectedFeedback.office }}
              </p>
            </div>
          </div>
          <div class="flex flex-col">
            <p class="text-xs text-left text-gray-500 mb-1">Service</p>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="font-medium text-gray-800">
                {{ selectedFeedback.serviceAvailed }}
              </p>
            </div>
          </div>
        </div>

        <!-- Full Feedback -->
        <div class="mb-6">
          <p class="text-xs text-gray-500 mb-2 font-semibold text-left">
            Client Feedback
          </p>
          <div
            class="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 leading-relaxed text-left"
          >
            {{ selectedFeedback.feedback }}
          </div>
        </div>

        <!-- Sentiment Summary -->
        <div
          class="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex justify-between items-center"
        >
          <div>
            <p class="text-xs text-gray-500 mb-1">Final Sentiment</p>
            <span
              class="inline-flex px-3 py-1 rounded-full text-sm font-semibold"
              :class="sentimentBadge(selectedFeedback.final_sentiment_status)"
            >
              {{ selectedFeedback.final_sentiment_status }}
            </span>
          </div>

          <div class="text-right">
            <p class="text-xs text-gray-500 mb-1">Score</p>
            <p class="text-2xl font-bold text-gray-800">
              {{ selectedFeedback.final_sentiment_score }}
            </p>
          </div>
        </div>

        <!-- Survey Answers -->
        <div v-if="selectedFeedback.answers?.length" class="mb-8">
          <p class="text-sm font-semibold text-gray-700 mb-3 text-left">
            Citizen’s Charter Awareness
          </p>

          <div class="overflow-hidden border rounded-lg">
            <table class="min-w-full text-sm text-left">
              <thead class="bg-gray-100 text-gray-600">
                <tr>
                  <th class="p-3 font-medium">Question</th>
                  <th class="p-3 font-medium text-center w-[180px]">
                    Response
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="a in selectedFeedback.answers"
                  :key="a.id"
                  class="border-t"
                >
                  <td class="p-3 text-gray-700">
                    {{ a.question }}
                  </td>

                  <td class="p-3 text-center">
                    <span
                      class="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
                    >
                      {{ getLikertLabel(a.value) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Likert Evaluation -->
        <div v-if="selectedFeedback.likertAnswers?.length" class="mb-8">
          <p class="text-sm font-semibold text-gray-700 mb-3 text-left">
            Service Evaluation
          </p>

          <div class="overflow-hidden border rounded-lg">
            <table class="min-w-full text-sm text-left">
              <thead class="bg-gray-100 text-gray-600">
                <tr>
                  <th class="p-3 font-medium">Statement</th>
                  <th class="p-3 font-medium text-center w-[180px]">Rating</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="l in selectedFeedback.likertAnswers"
                  :key="l.id"
                  class="border-t hover:bg-gray-50"
                >
                  <td class="p-3 text-gray-700">
                    {{ l.question }}
                  </td>

                  <td class="p-3 text-center">
                    <span
                      class="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
                    >
                      {{ getLikertLabel(l.value) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-right border-t pt-4">
          <button
            @click="showModal = false"
            class="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
          >
            Close
          </button>
        </div>
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
      showModal: false,
      selectedFeedback: null,
      likertChoices: [
        { value: "1", label: "Strongly Disagree", icon: "strongly-disagree" },
        { value: "2", label: "Disagree", icon: "disagree" },
        {
          value: "3",
          label: "Neither Agree nor Disagree",
          icon: "neutral",
        },
        { value: "4", label: "Agree", icon: "agree" },
        { value: "5", label: "Strongly Agree", icon: "strongly-agree" },
        { value: "6", label: "N/A", icon: "na" },
      ],
    };
  },
  computed: {
    filteredFeedbacks() {
      if (!this.searchQuery) return this.feedbacks;
      const q = this.searchQuery.toLowerCase();
      return this.feedbacks.filter((f) =>
        [f.office, f.serviceAvailed, f.feedback, f.final_sentiment_status].some(
          (v) => v && v.toLowerCase().includes(q),
        ),
      );
    },
    paginatedFeedbacks() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredFeedbacks.slice(start, start + this.pageSize);
    },
  },
  methods: {
    openModal(item) {
      this.selectedFeedback = item;
      this.showModal = true;
    },

    formatDate(d) {
      return new Date(d).toLocaleDateString();
    },

    getFirstSentence(text) {
      return text ? text.split(".")[0] + "." : "-";
    },

    sentimentColor(status) {
      return {
        Positive: "text-green-600",
        Negative: "text-red-600",
        Neutral: "text-gray-600",
      }[status];
    },

    sentimentBadge(status) {
      return {
        Positive: "bg-green-100 text-green-700",
        Negative: "bg-red-100 text-red-700",
        Neutral: "bg-gray-200 text-gray-700",
      }[status];
    },

    getLikertLabel(value) {
      const found = this.likertChoices.find((c) => c.value === value);
      return found ? found.label : value;
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
