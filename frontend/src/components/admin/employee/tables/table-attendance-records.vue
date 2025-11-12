<template>
  <div v-if="isTable">
    <div class="text-sm flex justify-between">
      <div class="text-[13px] text-text mt-4 font-regular">
        Pages / Attendance Records
      </div>

      <div
        @click="toggleAddAR"
        class="cursor-pointer flex gap-2 items-center tracking-wider bg-blue-900 text-white hover:text-blue-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-blue-900 hover:shadow-lg transition-all duration-300"
      >
        <icon :name="'download'"></icon>
        <button>Upload</button>
      </div>
    </div>

    <div class="text-[14px] bg-white rounded-xl">
      <div class="mt-4 overflow-x-auto border p-2 rounded-xl">
        <!-- Top controls -->
        <div
          class="text-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1 bg-gray-50 p-4 rounded-lg border"
        >
          <div class="flex gap-2">
            <!-- Month Selector -->
            <div class="flex items-center gap-3">
              <label class="text-sm font-medium text-gray-600"
                >Select Month:</label
              >

              <!-- Month Dropdown -->
              <select
                v-model="selectedMonthValue"
                class="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option disabled value="">-- Month --</option>
                <option
                  v-for="month in months"
                  :key="month.value"
                  :value="month.value"
                >
                  {{ month.name }}
                </option>
              </select>

              <!-- Year Dropdown -->
              <select
                v-model="selectedYear"
                class="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option
                  v-for="year in [2023, 2024, 2025, 2026]"
                  :key="year"
                  :value="year"
                >
                  {{ year }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-5">
            <!-- Show Inactive Checkbox -->
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                v-model="showInactive"
                id="showInactive"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div class="text-sm text-gray-600 flex items-center gap-1.5">
                <span>Show</span>
                <span
                  class="px-2 py-1 text-center bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-300"
                >
                  InActive
                </span>
              </div>
            </div>
            <!-- Search -->
            <div class="flex items-center w-full md:w-auto">
              <input
                v-model="searchQuery"
                type="text"
                class="w-full md:w-[300px] px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Search..."
                @input="changePage(1)"
              />
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="w-full mt-3 rounded-t-lg overflow-x-auto">
          <!-- Above the table or in your top controls -->
          <div class="flex items-center gap-2 mt-2">
            <label class="text-sm text-gray-600">Show entries:</label>
            <select
              v-model="itemsPerPage"
              class="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option
                v-for="option in perPageOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>

          <div class="overflow-y-auto max-h-[550px]">
            <table
              class="min-w-full table-fixed border-collapse text-text text-[13px]"
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
                  v-for="(record, index) in paginatedData"
                  :key="record.attendance_id"
                  :class="{ 'bg-blue-50 border-b': (index + 1) % 2 === 0 }"
                >
                  <td class="px-2 py-1 border-b text-center">
                    {{ startIndex + index }}
                  </td>

                  <td class="px-2 py-1 border-b text-left uppercase">
                    {{ record?.name }}
                  </td>
                  <td class="px-2 py-2 border-b">
                    <div class="flex gap-1">
                      <router-link
                        to="#"
                        class="p-2 py-1 h-8 border-2 border-blue-200 hover:bg-blue-300 text-blue-700 rounded-lg flex gap-1"
                        @click.prevent="toggleViewOpen(record)"
                      >
                        <icon name="eye" />View
                      </router-link>

                      <!-- <button
                        class="p-2 py-1 h-8 border-2 border-red-200 hover:bg-red-300 text-red-700 rounded-lg flex gap-1"
                        @click="toggleDelete(record)"
                      >
                        <icon name="delete" /> Delete
                      </button> -->
                    </div>
                  </td>
                </tr>
                <tr v-if="paginatedData.length === 0">
                  <td colspan="3" class="text-center py-4">No records found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center mt-4">
          <div class="text-gray-700">
            <span>
              Showing {{ startIndex }} to {{ endIndex }} of
              {{ filteredData.length }} entries
            </span>
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

  <div v-if="isUploadData">
    <uploadAttendanceRecord
      @close="closeView"
      @back-to-table-attendance="handleBackToTable"
      @refresh="fetchattendanceRecords"
    />
  </div>

  <viewAttendanceRecord
    v-if="isRecordVisible"
    :attendanceId="selectedAttendanceRecord?.attendance_id"
    @back-to-table-attendance="handleBackToTable"
    @refresh="fetchattendanceRecords"
  />

  <!-- Delete Confirmation Modal -->
  <div
    v-if="showDeleteModal"
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50 w-min-screen"
  ></div>
  <div
    v-if="showDeleteModal"
    class="rounded-xl shadow-lg w-[300px] md:w-[400px] bg-white py-6 px-4 flex flex-col items-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-poppins z-50"
  >
    <!-- Icon -->
    <div
      class="rounded-full w-16 h-16 md:w-20 md:h-20 flex justify-center items-center bg-red-300 animate-pulse"
    >
      <icon
        name="question"
        class="w-8 h-8 md:w-10 md:h-10 text-white flex justify-center items-center"
      />
    </div>

    <!-- Title -->
    <h1 class="text-[14px] md:text-[16px] font-semibold mt-4">
      Delete Confirmation
    </h1>
    <p class="mt-2 text-[12px] md:text-[13px] text-center">
      Are you sure you want to delete this record? This action cannot be undone.
    </p>

    <!-- Break Line -->
    <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

    <!-- Buttons -->
    <div class="tracking-wide flex gap-2 mt-4">
      <button
        class="bg-red-400 p-2 px-3 text-[11px] md:text-[13px] rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
        @click="showDeleteModal = false"
      >
        No, Cancel
      </button>
      <button
        class="bg-green-400 p-2 px-3 text-[11px] md:text-[13px] rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md"
        @click="confirmDelete"
      >
        Yes, Delete
      </button>
    </div>
  </div>
</template>

<script>
// import addAttendanceRecord from "../modals/add-attendance-record.vue";
import viewAttendanceRecord from "../modals/view-attendance-record.vue";
import uploadAttendanceRecord from "../modals/upload-attendance-record.vue";
import { toast } from "vue3-toastify";
import icon from "@/assets/icon.vue";
import axios from "axios";

export default {
  name: "TableAttendanceRecords",
  components: {
    // addAttendanceRecord,
    icon,
    viewAttendanceRecord,
    uploadAttendanceRecord,
  },
  data() {
    return {
      data_attendance_records: [],
      data_employee_profile: [],
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
      isUploadData: false,
      selectedAttendanceRecord: null,
      isRecordVisible: false,
      isTable: true,
      refreshInterval: null,
      showDeleteModal: false,
      recordToDelete: null,
      selectedMonth: null,
      currentYear: new Date().getFullYear(),
      showInactive: false,
      selectedYear: new Date().getFullYear(),
      months: [
        { name: "January", value: "01" },
        { name: "February", value: "02" },
        { name: "March", value: "03" },
        { name: "April", value: "04" },
        { name: "May", value: "05" },
        { name: "June", value: "06" },
        { name: "July", value: "07" },
        { name: "August", value: "08" },
        { name: "September", value: "09" },
        { name: "October", value: "10" },
        { name: "November", value: "11" },
        { name: "December", value: "12" },
      ],
      selectedMonthValue: null,

      perPageOptions: [10, 20, 50],
    };
  },
  computed: {
    inactiveEmployees() {
      return this.data_employee_profile
        .filter((emp) => emp.employment_status === "InActive")
        .map((emp) => emp.employee_id);
    },
    filteredData() {
      if (!this.data_attendance_records || !this.data_employee_profile)
        return [];

      const query = this.searchQuery.toLowerCase().trim();

      return this.data_attendance_records
        .map((record) => {
          // Attach employment_status from employee profile
          const employee = this.data_employee_profile.find(
            (emp) => emp.employee_id === record.employee_id
          );

          // Treat null or empty employment_status as InActive
          let employment_status = employee?.employment_status;
          if (!employment_status) employment_status = "InActive";

          return {
            ...record,
            employment_status,
          };
        })
        .filter((record) => {
          // Filter InActive employees
          if (!this.showInactive && record.employment_status !== "Active")
            return false;

          // Filter by selected month/year
          if (this.selectedMonthValue && this.selectedYear) {
            const hasRecordInMonth = record.records.some((r) => {
              if (!r.date) return false;
              const recordDate = new Date(r.date);
              const recordMonth = String(recordDate.getMonth() + 1).padStart(
                2,
                "0"
              );
              const recordYear = recordDate.getFullYear();
              return (
                recordMonth === this.selectedMonthValue &&
                recordYear === Number(this.selectedYear)
              );
            });
            if (!hasRecordInMonth) return false;
          }

          // Search filter
          if (!query) return true;
          return (
            record.name.toLowerCase().includes(query) ||
            (record.attendance_id &&
              record.attendance_id.toString().includes(query))
          );
        });
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
      const maxButtons = 3;
      let start = Math.max(this.currentPage - 1, 1);
      let end = Math.min(start + maxButtons - 1, this.totalPages);

      // Adjust start if near the end
      start = Math.max(end - maxButtons + 1, 1);

      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },
  methods: {
    getInactiveEmployeeIDs() {
      return this.data_employee_profile
        .filter((emp) => emp.employment_status === "InActive")
        .map((emp) => emp.employee_id);
    },
    onDragOver() {
      this.dragging = true;
    },
    onDragLeave() {
      this.dragging = false;
    },
    onDrop(event) {
      this.dragging = false;
      this.file = event.dataTransfer.files[0];
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    handleBackToTable() {
      this.isRecordVisible = false;
      this.isUploadData = false;
      this.isTable = true;
      this.selectedAttendanceRecord = null;
    },
    fetchattendanceRecords() {
      axios
        .get(process.env.VUE_APP_API_BASE_URL + "/attendance-record/get-all")
        .then((response) => {
          this.data_attendance_records = response.data || [];
        })
        .catch((error) => {
          console.error("Error fetching attendance records:", error);
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
            error
          );
        });
    },

    toggleDelete(item) {
      this.recordToDelete = item;
      this.showDeleteModal = true;
    },
    confirmDelete() {
      if (!this.recordToDelete) return;

      axios
        .delete(
          process.env.VUE_APP_API_BASE_URL +
            `/attendance-record/${this.recordToDelete.attendance_id}`
        )
        .then((response) => {
          console.log("Record deleted:", response.data);
          this.showDeleteModal = false;
          toast.success("Record deleted successfully!", { autoClose: 2000 });

          // Refresh data
          this.fetchattendanceRecords();

          // Reset deleted record
          this.recordToDelete = null;
        })
        .catch((error) => {
          console.error("Delete failed:", error);
          toast.error("Failed to delete the record.");
          this.showDeleteModal = false;
        });
    },
    changePage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },

    closeView() {
      this.isUploadData = false;
    },
    toggleAddAR() {
      this.isUploadData = !this.isUploadData;
    },
    toggleViewOpen(record) {
      if (!this.selectedYear || !this.selectedMonthValue) {
        toast.error("Please select both year and month before viewing.", {
          autoClose: 2000,
        });
        return;
      }

      this.selectedAttendanceRecord = record;
      this.isRecordVisible = true;
      this.isTable = false;

      this.$router.push({
        name: "view-attendance-records",
        params: {
          date: `${this.selectedYear}-${this.selectedMonthValue}`,
        },
      });
    },
  },
  mounted() {
    this.fetchattendanceRecords();
    this.fetchEmployeeRecords();
  },
};
</script>
