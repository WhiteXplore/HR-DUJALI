<template>
  <div
    class="bg-white py-2 rounded-t-lg flex justify-between items-center px-6 shadow relative"
  >
    <!-- Left Section: Title -->
    <div class="text-green-900 font-semibold text-[16px] tracking-wide">
      Human Resource Management Information System
    </div>

    <!-- Center Section: Current Date & Time -->
    <div class="absolute left-1/2 transform -translate-x-1/2 text-center">
      <div class="text-[14px]">{{ formattedDate }}</div>
      <div class="text-[14px]">{{ formattedTime }}</div>
    </div>

    <!-- Right Section: User Info, Profile, and Search -->
    <div class="flex gap-4 items-center text-right">
      <!-- Search Input -->
      <transition name="slide-left">
        <div v-if="searchActive" class="flex flex-col items-end gap-2 relative">
          <div class="flex items-center gap-2">
            <input
              ref="searchInput"
              v-model="searchQuery"
              @focus="showResults = true"
              @input="showResults = true"
              @blur="hideResults"
              type="text"
              placeholder="Search module..."
              class="border border-gray-300 rounded-xl p-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <!-- Circle Close Icon -->
            <button
              @click="toggleSearch"
              class="text-gray-500 p-2 rounded-full hover:bg-blue-800 hover:text-white transition-colors duration-300 ease-in-out"
            >
              <icon :name="'circle-close'" />
            </button>
          </div>

          <!-- Search Results Dropdown -->
          <ul
            v-if="searchActive && filteredModules.length"
            class="absolute top-full mt-4 right-0 left-0 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow w-[350px] max-h-60 overflow-auto"
          >
            <li
              v-for="module in filteredModules"
              :key="module.name"
              class="px-4 py-2 rounded-md hover:bg-blue-100 cursor-pointer flex items-center gap-2 group transition-colors duration-300"
              @mousedown="handleModuleClick(module.route)"
            >
              <!-- Bind icon -->
              <icon
                :name="module.icon || 'general'"
                class="p-2 rounded-full group-hover:bg-blue-800 group-hover:text-white transition-colors duration-300"
              />
              <span>{{ module.name }}</span>
            </li>
          </ul>
        </div>
      </transition>
      <div class="flex gap-2">
        <div class="flex gap-2">
          <!-- Search Icon -->
          <button
            v-if="!searchActive"
            @click="toggleSearch"
            class="flex items-center gap-2 px-2 py-1 rounded-xl border hover:text-blue-900 hover:border-blue-800 transition-colors duration-300 ease-in-out"
          >
            <icon :name="'search-bar'" class="text-gray-500" />
          </button>

          <!-- Profile Picture -->
          <div
            ref="profileIcon"
            class="text-[14px] cursor-pointer hover:border-green-600 border-2 rounded-full z-20"
            @click="toggleOpenProfile"
          >
            <img
              src="../../../assets/img/users.png"
              alt="Profile Picture"
              class="w-9 h-9 rounded-full object-cover"
            />
          </div>
        </div>
        <!-- User Info -->
        <div class="text-left">
          <h1 class="text-[14px] font-semibold">
            {{ user.last_name }}, {{ user.first_name || "Guest" }}
          </h1>
          <h2 class="text-[12px]">{{ user.role || "No Role" }}</h2>
        </div>

        <!-- Profile Dropdown -->
        <div
          class="absolute top-[70px] right-[20px] z-50"
          ref="profileDropdown"
          v-if="isOpenProfile"
          @mouseleave="isOpenProfile = false"
        >
          <ProfileSetting />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import ProfileSetting from "./profile-setting.vue";
import icon from "@/assets/icon.vue";

export default {
  name: "TopBarPage",
  components: { ProfileSetting, icon },
  data() {
    return {
      isOpenProfile: false,
      user: {},
      searchActive: false,
    };
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref("");
    const showResults = ref(false);

    const modules = [
      {
        name: "Employment Profile",
        route: "/employement-records",
        icon: "group-people",
      },
      {
        name: "Service Records",
        route: "/service-of-records",
        icon: "group-people",
      },
      {
        name: "Attendacne Records",
        route: "/attendance-records",
        icon: "group-people",
      },
      {
        name: "Certificate of Employment",
        route: "/certificate-of-employment",
        icon: "certificate",
      },
      {
        name: "Trainings",
        route: "/available-trainings",
        icon: "trainings", // example icon
      },
      {
        name: "Promotion",
        route: "/promotion-page",
        icon: "promotions", // example icon
      },
    ];
    const filteredModules = computed(() => {
      if (!searchQuery.value) return modules; // show all when empty
      return modules.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
      );
    });

    const goToRoute = (route) => {
      router.push(route);
      searchQuery.value = "";
      showResults.value = false;
    };

    const hideResults = () => {
      setTimeout(() => {
        showResults.value = false;
      }, 200); // delay to allow @mousedown on list
    };

    return {
      searchQuery,
      showResults,
      filteredModules,
      goToRoute,
      hideResults,
    };
  },
  computed: {
    formattedDate() {
      const date = new Date();
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
        weekday: "long",
      });
    },
    formattedTime() {
      const date = new Date();
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    },
  },
  mounted() {
    this.fetchUser();
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    handleModuleClick(route) {
      this.$router.push(route); // navigate
      this.searchQuery = ""; // clear search input
      this.showResults = false; // hide dropdown
      this.searchActive = false; // close search bar
    },
    toggleOpenProfile() {
      this.isOpenProfile = !this.isOpenProfile;
    },
    handleClickOutside(event) {
      const dropdown = this.$refs.profileDropdown;
      const icon = this.$refs.profileIcon;

      if (
        icon &&
        !icon.contains(event.target) &&
        (!dropdown || !dropdown.contains(event.target))
      ) {
        this.isOpenProfile = false;
      }
    },
    toggleSearch() {
      this.searchActive = !this.searchActive;
      if (this.searchActive) {
        this.$nextTick(() => {
          this.$refs.searchInput.focus(); // Focus the input
        });
      } else {
        this.searchQuery = "";
        this.showResults = false;
      }
    },

    async fetchUser() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/auth/me",
          {
            withCredentials: true,
          },
        );

        if (response.data) {
          this.user = response.data;
          console.log("Authenticated User:", this.user);
        } else {
          this.$router.push("/");
          location.reload();
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped></style>
