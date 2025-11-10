<template>
  <div v-if="isTable">
    <div class="text-sm flex justify-between">
      <div class="text-[13px] text-text mt-4 font-regular">
        Pages / Promotion Eligibility
      </div>
    </div>

    <div class="text-[14px] bg-white rounded-xl">
      <div class="mt-4 overflow-x-auto border p-2 rounded-xl">
        <!-- Top controls -->
        <div class="text-gray-700 flex justify-between items-start mt-1">
          <!-- Items Per Page -->
          <div class="flex items-center">
            <select
              v-model="itemsPerPage"
              class="px-1 py-1 border rounded-md"
              @change="changePage(1)"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
            <span class="ml-2">Per page</span>
          </div>

          <!-- Search -->
          <div class="flex items-center">
            <input
              v-model="searchQuery"
              type="text"
              class="px-3 w-[300px] py-3 border rounded-md"
              placeholder="Search..."
              @input="changePage(1)"
            />
          </div>
        </div>

        <!-- Table -->
        <div class="w-full mt-3 rounded-t-lg overflow-x-auto">
          <div class="overflow-y-auto max-h-[550px]">
            <table
              class="min-w-full table-fixed border-collapse text-text text-[13px]"
            >
              <thead
                class="bg-Green text-gray-700 tracking-wider font-regular sticky top-0 z-10"
              >
                <tr>
                  <th class="w-[50px] px-5 py-3 text-center border-b">#</th>
                  <th class="px-2 py-3 text-left border-b">Full Name</th>

                  <th class="px-2 py-3 text-left border-b">Education Level</th>
                  <th class="px-2 py-3 text-left border-b">
                    Experience (Years)
                  </th>
                  <th class="px-2 py-3 text-left border-b">Designation</th>
                  <th class="px-2 py-3 text-left border-b">
                    Attendance Hours Rendered
                  </th>
                  <th class="px-2 py-3 text-left border-b">
                    Learning Development Count
                  </th>
                  <th class="px-2 py-3 text-left border-b">
                    Learning Development Hours Rendered
                  </th>
                  <th class="px-2 py-3 text-left border-b">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(data_promotion, index) in paginatedData"
                  :key="data_promotion.records"
                  :class="{ 'bg-blue-50 border-b': (index + 1) % 2 === 0 }"
                >
                  <td class="px-2 py-1 border-b text-center">
                    {{ startIndex + index }}
                  </td>
                  <td class="px-2 py-1 border-b text-left">
                    {{ data_promotion.first_name }}
                    {{ data_promotion.last_name }}
                  </td>
                  <td class="px-2 py-1 border-b text-left">
                    {{ data_promotion.level }}
                  </td>
                  <td class="px-2 py-1 border-b text-left">
                    {{ data_promotion.total_years_experience }}
                  </td>
                  <td class="px-2 py-1 border-b text-left">
                    {{ data_promotion.present_designation }}
                  </td>
                  <td class="px-2 py-1 border-b text-left">
                    {{ data_promotion.total_attendance_hours }}
                  </td>
                  <td class="px-2 py-1 border-b text-left">
                    {{ data_promotion.total_count_of_learning_development }}
                  </td>
                  <td class="px-2 py-1 border-b text-left">
                    {{ data_promotion.total_ld_hours_rendered }}
                  </td>
                  <td class="px-2 py-2 border-b">
                    <div class="flex gap-1">
                      <button
                        class="p-2 py-1 h-8 border-2 border-blue-200 hover:bg-blue-300 text-blue-700 rounded-lg flex gap-1"
                        @click="toggleViewOpen(data_promotion)"
                      >
                        <icon name="eye" /> View
                      </button>
                    </div>
                  </td>
                </tr>

                <tr v-if="paginatedData.length === 0">
                  <td colspan="9" class="text-center py-4">No records found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center mt-4">
          <div class="text-gray-700">
            <span
              >Showing {{ startIndex }} to {{ endIndex }} of
              {{ filteredData.length }} entries</span
            >
          </div>
          <div class="flex items-center">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded-l-md hover:bg-gray-400"
              title="Previous page"
            >
              &lt;
            </button>
            <span v-for="page in pageNumbers" :key="'page-' + page">
              <button
                @click="changePage(page)"
                :class="{
                  'bg-blue-900 text-white': currentPage === page,
                  'bg-gray-200 text-gray-700': currentPage !== page,
                }"
                class="px-3 py-1 mx-1 rounded-md hover:bg-green-300"
                :title="'Page ' + page"
              >
                {{ page }}
              </button>
            </span>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400"
              title="Next page"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <viewPromotion
    v-if="
      isAttendanceVisible &&
      selectedPromotionRecord &&
      selectedPromotionRecord.first_name &&
      selectedPromotionRecord.last_name
    "
    :selected-first-name="selectedPromotionRecord.first_name"
    :selected-last-name="selectedPromotionRecord.last_name"
    @back-to-table-seminar="handleBackToTable"
  />
</template>

<script>
import icon from "@/assets/icon.vue";
import axios from "axios";
import viewPromotion from "../modals/view-promotion.vue";

export default {
  name: "TableServiceOfRecords",
  components: {
    icon,
    viewPromotion,
  },
  data() {
    return {
      data_promotion: [],
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
      selectedPromotionRecord: null,
      isAttendanceVisible: false,
      isTable: true,
    };
  },
  computed: {
    filteredData() {
      if (!this.data_promotion) return [];
      if (!this.searchQuery.trim()) return this.data_promotion;
      const query = this.searchQuery.toLowerCase();
      return this.data_promotion.filter(
        (item) =>
          item.first_name?.toLowerCase().includes(query) ||
          item.last_name?.toLowerCase().includes(query) ||
          item.place_of_birth?.toLowerCase().includes(query) ||
          item.present_designation?.toLowerCase().includes(query)
      );
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage) || 1;
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredData.slice(start, start + this.itemsPerPage);
    },
    startIndex() {
      return this.filteredData.length === 0
        ? 0
        : (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    endIndex() {
      const end = this.currentPage * this.itemsPerPage;
      return end > this.filteredData.length ? this.filteredData.length : end;
    },
    pageNumbers() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    },
  },
  methods: {
    handleBackToTable() {
      this.isAttendanceVisible = false;
      this.isTable = true;
      this.selectedPromotionRecord = null;
    },
    fetchpromotionRecords() {
      axios
        .get("http://localhost:8000/predictive/fetch-promotion")
        .then((response) => {
          this.data_promotion = response.data || [];
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the service records:",
            error
          );
        });
    },
    changePage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },
    toggleViewOpen(promotionRecord) {
      console.log("Clicked employee data:", promotionRecord);
      this.selectedPromotionRecord = promotionRecord;
      this.isAttendanceVisible = true;
      this.isTable = false;
    },
    toggleDelete(promotionRecord) {
      // Add your delete logic here
      console.log("Delete clicked for:", promotionRecord);
    },
  },
  mounted() {
    this.fetchpromotionRecords();
  },
};
</script>
