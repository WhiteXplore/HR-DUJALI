<template>
  <div v-if="isTable">
    <div class="text-sm flex justify-between">
      <div class="text-[13px] text-text mt-4 font-regular">
        Pages / Employee Profiles
      </div>
      <div class="flex gap-2">
        <div
          @click="toggleUploadDataAttendance"
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-blue-900 text-white hover:text-blue-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-blue-900 hover:shadow-lg transition-all duration-300"
        >
          <icon :name="'download'"></icon>
          <button>Upload</button>
        </div>
        <div
          @click="toggleAddEmployee"
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-green-500 text-white hover:text-green-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-green-900 hover:shadow-lg transition-all duration-300"
        >
          <icon :name="'add-account'"></icon>
          <button>Add Employee</button>
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
                  <th class="px-2 py-3 text-left border-b">Employment ID</th>
                  <th class="px-2 py-3 text-left border-b">Full Name</th>
                  <th class="px-2 py-3 text-left border-b">
                    Employement Status
                  </th>
                  <th class="px-2 py-3 text-left border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(data_employee_profile, index) in paginatedData"
                  :key="data_employee_profile.first_table_id"
                  :class="{ 'bg-blue-50 border-b': (index + 1) % 2 === 0 }"
                >
                  <td class="px-2 py-1 border-b">{{ startIndex + index }}</td>

                  <td class="px-2 py-1 border-b text-left">
                    {{ data_employee_profile.employee_id }}
                  </td>
                  <td class="px-2 py-1 border-b text-left">
                    {{ data_employee_profile.first_name }}
                    {{ data_employee_profile.middle_name }}
                    {{ data_employee_profile.last_name }}
                  </td>

                  <td class="px-10 py-1 border-b text-left">
                    <span
                      class="px-2 py-1 text-xs font-semibold rounded-full border"
                      :class="{
                        'bg-green-100 text-green-700 border-green-300':
                          data_employee_profile.employment_status === 'Active',
                        'bg-red-100 text-red-700 border-red-300':
                          data_employee_profile.employment_status ===
                          'InActive',
                        'bg-yellow-100 text-yellow-700 border-yellow-300':
                          data_employee_profile.employment_status ===
                          'On Leave',
                      }"
                    >
                      {{ data_employee_profile.employment_status }}
                    </span>
                  </td>

                  <td class="px-2 py-2 border-b">
                    <div class="flex gap-1">
                      <router-link
                        to="/employement-records/view-employee-profile"
                        class="p-2 py-1 h-8 border-2 border-blue-200 hover:bg-blue-300 text-blue-700 rounded-lg flex gap-1"
                        @click="toggleViewOpen(data_employee_profile)"
                      >
                        <icon name="eye" />View
                      </router-link>

                      <button
                        class="p-2 py-1 h-8 border-2 border-green-200 hover:bg-green-300 text-green-700 rounded-lg flex gap-1"
                        @click="toggleEdit(data_employee_profile)"
                      >
                        <icon name="edit" /> Edit
                      </button>

                      <button
                        class="p-2 py-1 h-8 border-2 border-red-200 hover:bg-red-300 text-red-700 rounded-lg flex gap-1"
                        @click="toggleDelete(data_employee_profile)"
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
  <div v-if="isAddEmployee">
    <addEmployeeProfile
      @close="closeView"
      @refresh-employees="fetchEmployeeRecords"
    />
  </div>

  <div v-if="isUploadData">
    <uploadEmployeeProfile
      @close="closeView"
      @refresh-employees="fetchEmployeeRecords"
    />
  </div>

  <viewEmployeeProfile
    v-if="isEmployeeVisible"
    :employeeId="selectedEmployeeRecord?.first_table_id"
    @back-to-table-employee="handleBackToTable"
  />

  <editEmployeeProfile
    v-if="isEditEmployee"
    :employeeId="selectedEmployeeRecord?.first_table_id"
    @back-to-table-employee="handleBackToTable"
    @close="closeView"
    @refresh="fetchEmployeeRecords"
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
import addEmployeeProfile from "../modals/add-employee-profile.vue";
import viewEmployeeProfile from "../modals/view-employee-profile.vue";
import editEmployeeProfile from "../modals/edit-employee-profile.vue";
import uploadEmployeeProfile from "../modals/upload-employee-profile.vue";
import icon from "@/assets/icon.vue";
import axios from "axios";
import { toast } from "vue3-toastify";
export default {
  name: "TableServiceOfRecords",
  components: {
    addEmployeeProfile,
    icon,
    viewEmployeeProfile,
    editEmployeeProfile,
    uploadEmployeeProfile,
  },
  data() {
    return {
      data_employee_profile: [], // Initialize this as an empty array
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
      isAddEmployee: false,
      selectedEmployeeRecord: null, // Store selected service record data
      showCancellationModal: false,
      isEmployeeVisible: false,
      isTable: true,
      isEditEmployee: false,
      showDeleteModal: false,
      isUploadData: false,
      recordToDelete: null,
    };
  },
  computed: {
    filteredData() {
      if (!this.data_employee_profile) return [];
      if (!this.searchQuery.trim()) return this.data_employee_profile;
      const query = this.searchQuery.toLowerCase();
      return this.data_employee_profile.filter(
        (item) =>
          item.student_id?.toLowerCase().includes(query) ||
          item.first_name?.toLowerCase().includes(query) ||
          item.last_name?.toLowerCase().includes(query) ||
          item.program_course?.toLowerCase().includes(query)
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
    toggleUploadDataAttendance() {
      this.isUploadData = !this.isUploadData;
    },

    handleBackToTable() {
      this.isEmployeeVisible = false;
      this.isTable = true;
      this.isAddEmployee = false;
      this.selectedServiceRecord = null;
      this.isEditEmployee = false;
    },
    fetchEmployeeRecords() {
      axios
        .get("http://localhost:8000/upload/get-all")
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
          `http://localhost:8000/upload/delete-record/${this.recordToDelete.first_table_id}`
        )
        .then((response) => {
          console.log("Record deleted:", response.data);
          this.showDeleteModal = false;
          toast.success("Record deleted successfully!", { autoClose: 2000 });

          // Refresh data
          this.fetchEmployeeRecords();
          this.$emit("refresh-employees");
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
      this.isAddEmployee = false;
      this.isEditEmployee = false;
      this.isUploadData = false;
    },
    toggleAddEmployee() {
      this.isAddEmployee = !this.isAddEmployee;
    },
    toggleViewOpen(employeeRecord) {
      // Set the selected service record to show in viewemployeeRecords
      this.selectedEmployeeRecord = employeeRecord;
      this.isEmployeeVisible = true;
      console.log("Selected Employee ID:", employeeRecord.first_table_id); // Log the service_id to console
      this.isTable = false;
    },
    toggleEdit(employeeRecord) {
      this.selectedEmployeeRecord = employeeRecord;
      this.isEditEmployee = !this.isEditEmployee;
      console.log("Selected Employee ID:", employeeRecord.first_table_id);
      this.isTable = true;
    },
  },

  mounted() {
    this.fetchEmployeeRecords();
  },
};
</script>

<style lang=""></style>
