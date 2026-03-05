<template>
  <div v-if="isTable">
    <div class="text-sm flex justify-between">
      <div class="text-[14px] text-text mt-4 font-regular">
        Pages / Certifiate of Employment
      </div>
      <div
        @click="toggleAddCOE"
        class="cursor-pointer flex gap-2 items-center tracking-wider bg-green-500 text-white hover:text-green-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-green-900 hover:shadow-lg transition-all duration-300"
      >
        <icon :name="'add-account'"></icon>
        <button>Add COE</button>
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
        <div class="w-full mt-3 rounded-t-lg overflow-x-auto" v-if="isTable">
          <div class="overflow-y-auto max-h-[550px]">
            <table
              class="min-w-full table-fixed border-collapse text-text text-[14px]"
            >
              <thead
                class="bg-Green text-gray-700 tracking-wider font-regular sticky top-0 z-10"
              >
                <tr>
                  <th class="w-[50px] px-5 py-3 text-center border-b">ID</th>
                  <th class="px-2 py-3 text-left border-b">Full Name</th>
                  <th class="px-2 py-3 text-left border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(data_service_records, index) in paginatedData"
                  :key="data_service_records.service_id"
                  :class="{ 'bg-blue-50 border-b': (index + 1) % 2 === 0 }"
                >
                  <td class="px-2 py-1 border-b">{{ startIndex + index }}</td>

                  <td class="px-2 py-1 border-b text-left uppercase">
                    {{ data_service_records.first_name }}
                    {{ data_service_records.middle_name }}
                    {{ data_service_records.last_name }}
                  </td>
                  <td class="px-2 py-2 border-b">
                    <div class="flex gap-1">
                      <router-link
                        to="/certificate-of-employment/view-coe"
                        class="p-2 py-1 h-8 border-2 border-blue-200 hover:bg-blue-300 text-blue-700 rounded-lg flex gap-1"
                        @click="toggleViewOpen(data_service_records)"
                      >
                        <icon name="eye" />View
                      </router-link>
                    </div>
                  </td>
                </tr>
                <tr v-if="paginatedData.length === 0">
                  <td colspan="5" class="text-center py-4">No records found</td>
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
              >
                {{ page }}
              </button>
            </span>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded-r-md hover:bg-gray-400"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isAddCOE">
    <coe @close="closeView" @back-to-table-coe="handleBackToTable" />
  </div>
  <viewCoe
    v-if="isRecordVisible"
    :recordData="selectedServiceRecord"
    @back-to-table-coe="handleBackToTable"
  />
</template>

<script>
import coe from "../formats/coe.vue";
import viewCoe from "../modals/view-coe.vue";
import icon from "@/assets/icon.vue";
import axios from "axios";

export default {
  name: "TableServiceOfRecords",
  components: { coe, icon, viewCoe },
  data() {
    return {
      data_service_records: [],
      data_employee_profile: [],
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
      isAddCOE: false,
      selectedServiceRecord: null,
      showCancellationModal: false,
      isRecordVisible: false,
      isTable: true,
    };
  },
  computed: {
    filteredData() {
      if (!this.data_service_records || !this.data_employee_profile) return [];

      const query = this.searchQuery.toLowerCase().trim();

      const filtered = this.data_service_records.filter((record) => {
        const matchEmployee = this.data_employee_profile.find(
          (emp) => emp.employee_id === record.employee_id,
        );

        if (!matchEmployee) return false;

        if (matchEmployee.employment_status !== "Active") return false;

        console.log("Matched Active employee_id:", record.employee_id);

        if (!query) return true;

        return (
          record.student_id?.toLowerCase().includes(query) ||
          record.first_name?.toLowerCase().includes(query) ||
          record.last_name?.toLowerCase().includes(query) ||
          record.program_course?.toLowerCase().includes(query)
        );
      });

      return filtered;
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
      this.isRecordVisible = false;
      this.isTable = true;
      this.selectedServiceRecord = null;
    },
    fetchServiceRecords() {
      axios
        .get(process.env.VUE_APP_API_BASE_URL + "/service-of-records/get-all")
        .then((response) => {
          this.data_service_records = response.data || [];
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the service records:",
            error,
          );
        });
    },
    fetchEmployeeRecords() {
      axios
        .get(process.env.VUE_APP_API_BASE_URL + "/upload/get-all")
        .then((response) => {
          this.data_employee_profile = response.data || [];
        })
        .catch((error) => {
          console.error(
            "There was an error fetching the service records:",
            error,
          );
        });
    },

    changePage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },

    closeView() {
      this.isAddCOE = false;
      this.isTable = true; // show table again when closing Add COE
    },
    toggleAddCOE() {
      this.isAddCOE = !this.isAddCOE;
      this.isTable = !this.isTable;
    },

    toggleViewOpen(serviceRecord) {
      // Find matching employee profile
      const employee = this.data_employee_profile.find(
        (emp) => emp.employee_id === serviceRecord.employee_id,
      );

      // Merge gender safely
      this.selectedServiceRecord = {
        ...serviceRecord,
        gender: employee ? employee.gender : null,
      };

      this.isRecordVisible = true;
      this.isTable = false;

      console.log(
        "Selected Service ID:",
        this.selectedServiceRecord.service_id,
      );
      console.log("Gender:", this.selectedServiceRecord.gender);
    },
    toggleLogHistory(item) {
      this.$emit("history-student", item);
    },
  },

  mounted() {
    this.fetchServiceRecords();
    this.fetchEmployeeRecords();
  },
};
</script>
