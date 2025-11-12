<template>
  <div v-if="isTable">
    <!-- Header -->
    <div class="text-sm flex justify-between">
      <div class="text-[13px] text-text mt-4 font-regular">
        Pages / User Management
      </div>
      <div class="flex gap-2">
        <div
          @click="toggleAddUsers"
          class="cursor-pointer flex gap-2 items-center tracking-wider bg-blue-900 text-white hover:text-blue-700 p-3 py-2 rounded-md hover:bg-blue-300 hover:shadow-lg"
        >
          <icon name="add-account" />
          <button>Add User</button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="text-[14px] bg-white rounded-xl mt-4 p-2 border">
      <!-- Controls -->
      <div class="flex justify-between items-center mb-2">
        <div class="flex items-center gap-2">
          <select
            v-model="itemsPerPage"
            @change="changePage(1)"
            class="px-2 py-1 border rounded-md"
          >
            <option v-for="n in [5, 10, 15, 20]" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
          <span>Per page</span>
        </div>

        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          @input="changePage(1)"
          class="px-3 py-2 border rounded-md w-[300px]"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto max-h-[550px] rounded-t-lg">
        <table
          class="min-w-full table-fixed border-collapse text-[13px] text-text"
        >
          <thead class="sticky top-0 z-10">
            <tr>
              <th class="w-[50px] px-5 py-3 text-center border-b">ID</th>
              <th class="px-2 py-3 text-left border-b">Full Name</th>
              <th class="px-2 py-3 text-left border-b">Email</th>
              <th class="px-2 py-3 text-left border-b">Role</th>
              <th class="px-2 py-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in paginatedData"
              :key="user.id"
              :class="{ 'bg-blue-50 border-b': (index + 1) % 2 === 0 }"
            >
              <td class="px-2 py-1 border-b text-center">
                {{ startIndex + index }}
              </td>
              <td class="px-2 py-1 border-b text-left">
                {{ user.first_name }} {{ user.last_name }}
              </td>
              <td class="px-2 py-1 border-b text-left">{{ user.email }}</td>
              <td class="px-2 py-1 border-b text-left">{{ user.role }}</td>
              <td class="px-2 py-1 border-b text-left">
                <div class="flex gap-1">
                  <button
                    class="p-2 py-1 h-8 border-2 border-green-200 hover:bg-green-300 text-green-700 rounded-lg flex gap-1"
                    @click="toggleEdit(user)"
                  >
                    <icon name="edit" /> Edit
                  </button>
                  <button
                    class="p-2 py-1 h-8 border-2 border-red-200 hover:bg-red-300 text-red-700 rounded-lg flex gap-1"
                    @click="toggleDelete(user)"
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

      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <div class="text-gray-700">
          Showing {{ startIndex }} to {{ endIndex }} of
          {{ filteredData.length }} entries
        </div>
        <div class="flex items-center">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 bg-gray-300 rounded-l-md"
          >
            &lt;
          </button>
          <button
            v-for="page in pageNumbers"
            :key="page"
            @click="changePage(page)"
            :class="
              currentPage === page
                ? 'bg-blue-900 text-white'
                : 'bg-gray-200 text-gray-700'
            "
            class="px-3 py-1 mx-1 rounded-md"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 bg-gray-300 rounded-r-md"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add/Edit Modals -->
  <div v-if="isAddSR">
    <AddUsers :user="selectedUser" @close="closeView" @refresh="fetchUsers" />
  </div>
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
import AddUsers from "../modals/add-users.vue";
import icon from "@/assets/icon.vue";
import axios from "axios";
import { toast } from "vue3-toastify";

export default {
  name: "TableUserManagement",
  components: { AddUsers, icon },
  data() {
    return {
      users: [],
      currentPage: 1,
      itemsPerPage: 10,
      searchQuery: "",
      isAddSR: false,
      showDeleteModal: false,
      recordToDelete: null,
      isTable: true,
      selectedUser: null,
    };
  },
  computed: {
    filteredData() {
      if (!this.searchQuery.trim()) return this.users;
      const query = this.searchQuery.toLowerCase();
      return this.users.filter(
        (user) =>
          user.first_name.toLowerCase().includes(query) ||
          user.last_name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
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
      return this.filteredData.length
        ? (this.currentPage - 1) * this.itemsPerPage + 1
        : 0;
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
    fetchUsers() {
      axios
        .get(process.env.VUE_APP_API_BASE_URL + "/user")
        .then((res) => (this.users = res.data))
        .catch((err) => console.error("Failed to fetch users:", err));
    },
    changePage(page) {
      if (page < 1) page = 1;
      if (page > this.totalPages) page = this.totalPages;
      this.currentPage = page;
    },
    toggleAddUsers() {
      this.isAddSR = !this.isAddSR;
    },
    toggleEdit(user) {
      this.selectedUser = user;
      this.isAddSR = true;
      this.isTable = true;
    },
    toggleDelete(user) {
      this.recordToDelete = user;
      this.showDeleteModal = true;
    },
    confirmDelete() {
      if (!this.recordToDelete) return;
      axios
        .delete(
          process.env.VUE_APP_API_BASE_URL + `/user/${this.recordToDelete.id}`
        )
        .then(() => {
          toast.success("User deleted successfully!", { autoClose: 2000 });
          this.showDeleteModal = false;
          this.fetchUsers();
        })
        .catch(() => {
          toast.error("Failed to delete user.");
          this.showDeleteModal = false;
        });
    },
    closeView() {
      this.isAddSR = false;
      this.isTable = true;
      this.selectedUser = null;
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>
