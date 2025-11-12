<template>
  <div class="">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-md font-semibold text-gray-800">Employee Status</h1>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search employee..."
        class="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-xs"
      />
    </div>
    <!-- Header with Search and Show Entries -->
    <div
      class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4"
    >
      <div class="flex items-center gap-2 text-gray-700 text-sm">
        Show
        <select
          v-model.number="itemsPerPage"
          class="px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
        </select>
        entries
      </div>
    </div>

    <!-- Table Container -->
    <div class="overflow-auto rounded-lg shadow bg-white h-[35vh] w-full">
      <table class="w-full table-fixed text-sm text-gray-700">
        <thead class="bg-blue-800 text-white sticky top-0 shadow-sm z-10">
          <tr>
            <th class="px-4 py-3 text-left font-medium tracking-wide">
              Full Name
            </th>
            <th class="px-4 py-3 text-center font-medium tracking-wide">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(employee, index) in paginatedEmployees"
            :key="index"
            class="text-sm text-gray-700 border-b hover:bg-gray-50"
          >
            <td class="py-2 px-4">
              <div class="flex items-center gap-3">
                <icon
                  :name="getGenderIcon(employee.gender)"
                  class="p-1.5 rounded-full text-white bg-blue-800"
                />
                <span class="font-medium truncate">
                  {{ employee.last_name }}, {{ employee.first_name }}
                </span>
              </div>
            </td>
            <td class="px-4 py-2">
              <span
                class="px-2 py-1 text-xs font-semibold rounded-full border"
                :class="{
                  'bg-green-100 text-green-700 border-green-300':
                    employee.status === 'Active',
                  'bg-red-100 text-red-700 border-red-300':
                    employee.status === 'InActive',
                  'bg-yellow-100 text-yellow-700 border-yellow-300':
                    employee.status === 'On Leave',
                  'bg-gray-100 text-gray-500 border-gray-300':
                    employee.status === 'N/A',
                }"
              >
                {{ employee.status }}
              </span>
            </td>
          </tr>
          <tr v-if="paginatedEmployees.length === 0">
            <td colspan="2" class="text-center py-6 text-gray-500">
              No matching employees found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-between items-center mt-4 text-sm text-gray-600">
      <div>
        Showing
        {{
          paginatedEmployees.length ? (currentPage - 1) * itemsPerPage + 1 : 0
        }}
        to
        {{ Math.min(currentPage * itemsPerPage, filteredData.length) }}
        of {{ filteredData.length }} entries
      </div>
    </div>

    <!-- Pagination Buttons -->
    <div
      v-if="totalPages > 1"
      class="mt-4 flex justify-center items-center space-x-2"
    >
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        Prev
      </button>
      <button
        v-for="page in pageNumbers"
        :key="page"
        @click="changePage(page)"
        :class="[
          'px-3 py-1 rounded border',
          page === currentPage
            ? 'bg-blue-500 text-white'
            : 'bg-white hover:bg-gray-100',
        ]"
      >
        {{ page }}
      </button>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import icon from "@/assets/icon.vue";
export default {
  name: "EmployeeStatus",
  components: {
    icon,
  },
  data() {
    return {
      data_employee_profile: [],
      data_service_records: [],
      currentPage: 1,
      itemsPerPage: 10, // default items per page
      searchQuery: "",
    };
  },

  computed: {
    enrichedEmployees() {
      return this.data_employee_profile.map((employee) => {
        const recordWrapper = this.data_service_records.find(
          (r) => r.employee_id === employee.employee_id
        );

        const records = recordWrapper?.serviceRecords || [];
        const sorted = records.sort(
          (a, b) =>
            new Date(b.period_to || b.period_from) -
            new Date(a.period_to || a.period_from)
        );
        const latest = sorted[0] || {};
        const joinRecord = sorted[sorted.length - 1] || {};

        return {
          ...employee,
          designation: latest.roa_designation || "N/A",
          status: employee.employment_status || "N/A",
          joinDate: joinRecord.period_from || "N/A",
        };
      });
    },

    filteredData() {
      if (!this.searchQuery) return this.enrichedEmployees;
      const query = this.searchQuery.toLowerCase();
      return this.enrichedEmployees.filter((employee) => {
        const fullName = `${employee.last_name}, ${employee.first_name} ${
          employee.middle_name || ""
        }`.toLowerCase();
        return fullName.includes(query);
      });
    },

    paginatedEmployees() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredData.slice(start, start + this.itemsPerPage);
    },

    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },

    pageNumbers() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    },
  },

  watch: {
    itemsPerPage() {
      this.currentPage = 1; // reset page when items per page changes
    },
  },

  methods: {
    getGenderIcon(gender) {
      switch (gender?.trim()?.toLowerCase()) {
        case "male":
        case "m":
          return "male"; // replace with your actual icon name
        case "female":
        case "f":
          return "female"; // replace with your actual icon name
        default:
          return "unknown-icon"; // fallback icon
      }
    },

    formatDate(date) {
      if (!date || date === "N/A") return "N/A";
      const d = new Date(date);
      if (isNaN(d)) return "Invalid Date";
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    async fetchData() {
      try {
        const [employeeRes, serviceRes] = await Promise.all([
          axios.get(process.env.VUE_APP_API_BASE_URL + "/upload/get-all"),
          axios.get(
            process.env.VUE_APP_API_BASE_URL + "/service-of-records/get-all"
          ),
        ]);
        this.data_employee_profile = employeeRes.data;
        this.data_service_records = serviceRes.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load employee data");
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
