<template>
  <div v-if="isTable">
    <!-- Header -->
    <div class="text-sm flex justify-between items-center">
      <div class="text-[13px] text-text mt-4">
        Pages / Promotion Eligibility
      </div>

      <button
        @click="showAddCriteriaModal = true"
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        + Add Promotion Criteria
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl mt-3 p-3 border">
      <!-- Controls -->
      <div class="flex justify-between items-center mb-3">
        <div class="flex items-center gap-2">
          <select
            v-model="itemsPerPage"
            class="border px-2 py-1 rounded"
            @change="changePage(1)"
          >
            <option v-for="n in [5, 10, 15, 20]" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
          <span class="text-sm">Per page</span>
        </div>

        <input
          v-model="searchQuery"
          placeholder="Search age / experience..."
          class="border px-3 py-2 rounded w-[250px]"
          @input="changePage(1)"
        />
      </div>

      <!-- Table -->
      <div class="w-full mt-3 rounded-t-lg overflow-x-auto">
        <div class="overflow-y-auto max-h-[550px]">
          <table
            class="min-w-full table-fixed border-collapse text-text text-[13px]"
          >
            <thead
              class="border-b text-gray-700 tracking-wider font-regular sticky top-0 z-10"
            >
              <tr>
                <th class="px-3 py-2">#</th>
                <th class="px-3 py-2">Age</th>
                <th class="px-3 py-2 w-[30%]">Education</th>
                <th class="px-3 py-2">Experience (yrs)</th>
                <th class="px-3 py-2">Commendations</th>
                <th class="px-3 py-2">Comm. Hours</th>
                <th class="px-3 py-2">Attendance Hrs</th>
                <th class="px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(item, index) in paginatedData"
                :key="item.id"
                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
              >
                <td class="px-2 py-1 text-center">
                  {{ startIndex + index }}
                </td>

                <td class="px-2 py-1">{{ item.age_requirement }}</td>

                <td class="px-2 py-1">
                  <div class="flex flex-wrap gap-1 justify-center">
                    <span
                      v-for="edu in item.education_requirement"
                      :key="edu"
                      class="px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-100 text-blue-700 border border-blue-200"
                    >
                      {{ edu }}
                    </span>
                  </div>
                </td>

                <td class="px-2 py-1">
                  {{ item.work_experience_requirement }}
                </td>

                <td class="px-2 py-1">
                  {{ item.commendation_count_requirement }}
                </td>

                <td class="px-2 py-1">
                  {{ item.commendation_hours_requirement }}
                </td>

                <td class="px-2 py-1">
                  {{ item.attendance_hours_requirement }}
                </td>

                <td class="px-2 py-1 flex justify-center gap-1">
                  <button
                    class="p-2 py-1 h-8 border-2 border-green-200 hover:bg-green-300 text-green-700 rounded-lg flex gap-1"
                    @click="openEditCriteria(item)"
                  >
                    <icon name="edit" /> Edit
                  </button>
                  <button
                    class="p-2 py-1 h-8 border-2 border-blue-200 hover:bg-blue-300 text-blue-700 rounded-lg flex gap-1"
                    @click="goToViewEligibleForPromotion(item)"
                  >
                    <icon name="eye" /> View
                  </button>
                </td>
              </tr>

              <tr v-if="paginatedData.length === 0">
                <td colspan="8" class="text-center py-4">No records found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Pagination -->
      <div class="flex justify-between items-center mt-3 text-sm">
        <span>
          Showing {{ startIndex }} to {{ endIndex }} of
          {{ filteredData.length }} entries
        </span>

        <div class="flex gap-1">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-2 py-1 border rounded"
          >
            ‹
          </button>

          <button
            v-for="p in totalPages"
            :key="p"
            @click="changePage(p)"
            :class="[
              'px-3 py-1 rounded border',
              currentPage === p ? 'bg-blue-600 text-white' : 'bg-gray-100',
            ]"
          >
            {{ p }}
          </button>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-2 py-1 border rounded"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Modal -->
  <!-- Add Modal -->
  <addPromotionCriteria
    v-if="showAddCriteriaModal"
    :criteria="editCriteria"
    @close="closeModal"
    @refresh="fetchPromotionCriteria"
  />
</template>

<script>
import axios from "axios";
import addPromotionCriteria from "../modals/add-promotion-criteria.vue";
import icon from "@/assets/icon.vue";
export default {
  name: "PromotionEligibilityTable",
  components: { addPromotionCriteria, icon },

  data() {
    return {
      isTable: true,
      showAddCriteriaModal: false,

      promotionCriteriaList: [],
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
      editCriteria: null,
    };
  },

  computed: {
    filteredData() {
      if (!this.searchQuery) return this.promotionCriteriaList;

      const q = this.searchQuery.toLowerCase();
      return this.promotionCriteriaList.filter(
        (item) =>
          String(item.age_requirement).includes(q) ||
          String(item.work_experience_requirement).includes(q)
      );
    },

    totalPages() {
      return Math.max(
        1,
        Math.ceil(this.filteredData.length / this.itemsPerPage)
      );
    },

    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredData.slice(start, start + this.itemsPerPage);
    },

    startIndex() {
      return this.filteredData.length
        ? (this.currentPage - 1) * this.itemsPerPage + 1
        : 0;
    },

    endIndex() {
      return Math.min(
        this.currentPage * this.itemsPerPage,
        this.filteredData.length
      );
    },
  },

  methods: {
    changePage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },

    goToViewEligibleForPromotion(item) {
      this.$router.push({
        name: "view-eligible-for-promotion",
        params: { id: item.id },
      });
    },

    // NEW: open modal in edit mode
    openEditCriteria(item) {
      this.editCriteria = { ...item }; // clone to avoid direct mutation
      this.showAddCriteriaModal = true;
    },

    // NEW: close modal helper
    closeModal() {
      this.showAddCriteriaModal = false;
      this.editCriteria = null;
    },
    fetchPromotionCriteria() {
      axios
        .get(process.env.VUE_APP_API_BASE_URL + "/promotion-criteria")
        .then((res) => {
          this.promotionCriteriaList = res.data || [];
        })
        .catch(console.error);
    },
  },

  mounted() {
    this.fetchPromotionCriteria();
  },
};
</script>
