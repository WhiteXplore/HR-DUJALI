<template>
  <div v-if="isTable">
    <div class="text-sm flex justify-between">
      <div class="text-[13px] text-text mt-4 font-regular">
        Pages / Service Records
      </div>
      <div class="flex gap-2">
        <div
          @click="toggleUploadData"
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-blue-900 text-white hover:text-blue-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-blue-900 hover:shadow-lg transition-all duration-300"
        >
          <icon :name="'download'"></icon>
          <button>Upload</button>
        </div>
        <div
          @click="toggleAddSR"
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-green-500 text-white hover:text-green-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-green-900 hover:shadow-lg transition-all duration-300"
        >
          <icon :name="'add-account'"></icon>
          <button>Add Service Record</button>
        </div>
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
                  <th class="w-[50px] px-5 py-3 text-center border-b">ID</th>
                  <th class="px-2 py-3 text-left border-b">Full Name</th>
                  <th class="px-2 py-3 text-left border-b">Department</th>
                  <th class="px-2 py-3 text-left border-b">Designation</th>
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
                  <td class="px-2 py-1 border-b text-left">
                    {{ data_service_records.department }}
                  </td>
                  <td class="px-2 py-1 border-b text-left">
                    {{ data_service_records.latestDesignation }}
                  </td>

                  <td class="px-2 py-2 border-b">
                    <div class="flex gap-1">
                      <router-link
                        to="/service-of-records/view-service-records"
                        class="p-2 py-1 h-8 border-2 border-blue-200 hover:bg-blue-300 text-blue-700 rounded-lg flex gap-1"
                        @click="toggleViewOpen(data_service_records)"
                      >
                        <icon name="eye" />View
                      </router-link>

                      <button
                        class="p-2 py-1 h-8 border-2 border-green-200 hover:bg-green-300 text-green-700 rounded-lg flex gap-1"
                        @click="toggleEdit(data_service_records)"
                      >
                        <icon name="edit" /> Edit
                      </button>

                      <button
                        class="p-2 py-1 h-8 border-2 border-red-200 hover:bg-red-300 text-red-700 rounded-lg flex gap-1"
                        @click="toggleDelete(data_service_records)"
                      >
                        <icon name="delete" /> Delete
                      </button>
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
  <div v-if="isAddSR">
    <AddServiceRecords @close="closeView" @refresh="fetchServiceRecords" />
  </div>
  <div v-if="isUploadData">
    <uploadServiceRecord
      @close="closeView"
      @back-to-table-service="handleBackToTable"
      @refresh="fetchServiceRecords"
    />
  </div>
  <view-service-records
    v-if="isRecordVisible"
    :serviceId="selectedServiceRecord?.service_id"
    @back-to-table-service="handleBackToTable"
  />

  <EditServiceRecords
    v-if="isEditSR"
    :serviceId="selectedServiceRecord?.service_id"
    @back-to-table-service="handleBackToTable"
    @refresh="fetchServiceRecords"
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
import AddServiceRecords from "./../modals/add-service-records.vue";
import viewServiceRecords from "../modals/view-service-records.vue";
import EditServiceRecords from "../modals/edit-service-records.vue";
import uploadServiceRecord from "../modals/upload-service-record.vue";
import icon from "@/assets/icon.vue";
import axios from "axios";
import { toast } from "vue3-toastify";

export default {
  name: "TableServiceOfRecords",
  components: {
    AddServiceRecords,
    icon,
    viewServiceRecords,
    EditServiceRecords,
    uploadServiceRecord,
  },
  data() {
    return {
      data_service_records: [],
      data_employee_profile: [],
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
      isAddSR: false,
      selectedServiceRecord: null,
      showCancellationModal: false,
      isRecordVisible: false,
      isEditSR: false,
      isTable: true,
      showDeleteModal: false,
      recordToDelete: null,
      isUploadData: false,
    };
  },
  computed: {
    filteredData() {
      if (!this.data_service_records || !this.data_employee_profile) return [];

      const query = this.searchQuery.toLowerCase().trim();

      const filtered = this.data_service_records.filter((record) => {
        const matchEmployee = this.data_employee_profile.find(
          (emp) => emp.employee_id === record.employee_id
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
    toggleUploadData() {
      this.isUploadData = !this.isUploadData;
    },
    handleBackToTable() {
      this.isRecordVisible = false;
      this.isEditSR = false; // 👈 reset edit flag
      this.isAddSR = false; // (optional) reset add modal if needed
      this.isTable = true;
      this.selectedServiceRecord = null;
      this.isUploadData = false;
    },
    fetchServiceRecords() {
      axios
        .get(process.env.VUE_APP_API_BASE_URL + "/service-of-records/get-all")
        .then((response) => {
          this.data_service_records = (response.data || []).map((record) => {
            if (record.serviceRecords?.length) {
              // Function to parse date, treating "present" as a far future date
              const parseDate = (dateStr) => {
                if (!dateStr) return new Date(0);
                if (dateStr.toLowerCase() === "present")
                  return new Date(9999, 0, 1);
                const [month, day, year] = dateStr.split("/").map(Number);
                return new Date(year, month - 1, day);
              };

              // Sort by TO date descending and pick the latest designation
              record.latestDesignation =
                record.serviceRecords
                  .slice()
                  .sort(
                    (a, b) => parseDate(b.period_to) - parseDate(a.period_to)
                  )[0].roa_designation || "N/A";
            } else {
              record.latestDesignation = "N/A";
            }
            return record;
          });
        })
        .catch((error) => {
          console.error("Error fetching service records:", error);
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
    async fetchUser() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/auth/me",
          { withCredentials: true }
        );

        if (response.data) {
          this.user = response.data;

          // Fetch linked employee records
          await this.fetchEmployeeRecords(this.user.employee_id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
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
            `/service-of-records/service/${this.recordToDelete.service_id}`
        )
        .then((response) => {
          console.log("Record deleted:", response.data);
          this.showDeleteModal = false;
          toast.success("Record deleted successfully!", { autoClose: 2000 });

          // Refresh data
          this.fetchServiceRecords(); // fix: should match fetchServiceRecords not fetchEmployeeRecords
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
      this.isAddSR = false;
      this.isUploadData = false;
    },
    toggleAddSR() {
      this.isAddSR = !this.isAddSR;
    },
    toggleViewOpen(serviceRecord) {
      // Set the selected service record to show in viewServiceRecords
      this.selectedServiceRecord = serviceRecord;
      this.isRecordVisible = true;
      console.log("Selected Service ID:", serviceRecord.service_id); // Log the service_id to console
      this.isTable = false;
    },

    toggleEdit(serviceRecord) {
      // Set the selected service record to show in viewServiceRecords
      this.selectedServiceRecord = serviceRecord;
      this.isEditSR = true;
      console.log("Selected Service ID:", serviceRecord.service_id); // Log the service_id to console
      this.isTable = true;
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
