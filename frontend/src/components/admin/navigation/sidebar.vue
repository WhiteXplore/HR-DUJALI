<template>
  <div class="bg-blue-900 w-screen h-screen font-poppins flex">
    <!-- Sidebar -->
    <div
      :class="{ 'w-16': !isExpanded, 'w-64': isExpanded }"
      class="h-full fixed left-0 top-0 bg-blue-900 text-white p-3 transition-all duration-300 ease-in-out"
    >
      <!-- Toggle Sidebar -->
      <div @click="toggleSidebar" class="justify-end flex">
        <icon
          :name="'burger'"
          class="cursor-pointer"
          :class="{ 'mr-3 mt-1': !isExpanded }"
        />
      </div>

      <!-- Logo and user info -->
      <div class="flex flex-col items-center justify-center w-full">
        <img
          src="../../../assets/img/dujali-logo.png"
          alt="Logo"
          :class="{ 'w-16 rounded-full': isExpanded, hidden: !isExpanded }"
        />
        <p
          :class="{
            'text-sm font-medium mt-2': isExpanded,
            hidden: !isExpanded,
          }"
        >
          Hi, {{ user.first_name }}
        </p>
        <p
          :class="{
            'text-[12px] font-medium': isExpanded,
            hidden: !isExpanded,
          }"
        >
          {{ user.position }}
        </p>
      </div>

      <div v-if="isExpanded" class="w-full h-0.5 bg-[#fbfbfb] mt-4"></div>

      <!-- Dynamic Menu -->
      <div class="flex flex-col mt-6 gap-2 tracking-wide text-[12px] w-full">
        <!-- Home Section -->
        <div v-if="isExpanded" class="text-md text-white mt-2 text-left">
          Home
        </div>
        <div v-for="item in homeItems" :key="item.name" class="w-full">
          <router-link
            v-if="!item.children"
            :to="item.route"
            @click="handleDashboardClick"
            class="flex items-center w-full gap-5 p-2 rounded-md transition-all duration-200"
            :class="[
              $route.path === item.route
                ? 'bg-white text-green-700'
                : 'text-white hover:bg-white hover:text-green-800',
              !isExpanded ? 'justify-center' : 'justify-start',
            ]"
          >
            <icon :name="item.icon" />
            <span v-show="isExpanded">{{ item.name }}</span>
          </router-link>
        </div>

        <!-- Records Section  -->
        <div v-if="isExpanded" class="text-md text-white text-left">
          Records
        </div>

        <div v-for="item in recordsItems" :key="item.name" class="w-full">
          <!-- Non-children router-link -->
          <router-link
            v-if="!item.children"
            :to="item.route"
            class="flex items-center w-full gap-5 p-2 rounded-md transition-all duration-200"
            :class="[
              $route.path.startsWith(item.route) // Match parent route for child paths
                ? 'bg-white text-green-700'
                : 'text-white hover:bg-white hover:text-green-800',
              !isExpanded ? 'justify-center' : 'justify-start',
            ]"
          >
            <icon :name="item.icon" />
            <span v-show="isExpanded">{{ item.name }}</span>
          </router-link>

          <!-- Collapsible Parent -->
          <div v-else>
            <div
              @click="toggleDropdown(item.name)"
              class="flex items-center justify-between w-full p-2 cursor-pointer transition-all duration-200"
              :class="[
                isDropdownOpen === item.name
                  ? `bg-white text-green-800 ${
                      !isExpanded ? 'rounded-md' : 'rounded-t-md'
                    }`
                  : 'text-white hover:bg-white hover:text-green-800 hover:rounded-md',
              ]"
            >
              <!-- Icon + Label -->
              <div
                :class="[
                  !isExpanded ? 'justify-center w-full' : 'justify-start gap-5',
                ]"
                class="flex items-center"
              >
                <icon :name="item.icon" />
                <span v-show="isExpanded">{{ item.name }}</span>
              </div>
              <!-- Arrow icon (only show when expanded) -->
              <icon
                name="arrow-down"
                v-show="isExpanded"
                class="transition-transform"
                :class="{ 'rotate-180': isDropdownOpen === item.name }"
              />
            </div>

            <!-- Dropdown children -->
            <transition name="slide">
              <div v-show="isDropdownOpen === item.name && isExpanded">
                <router-link
                  v-for="(sub, index) in item.children"
                  :key="sub.name"
                  :to="sub.route"
                  class="block w-full py-2 px-[60px] text-[11px] transition-all duration-200 text-left"
                  :class="[
                    $route.path.startsWith(sub.route) // This ensures the parent is active when on a child route
                      ? 'bg-blue-950 text-white'
                      : 'bg-white text-green-950 hover:bg-gray-200',
                    index === item.children.length - 1 ? 'rounded-b-md' : '',
                  ]"
                >
                  {{ sub.name }}
                </router-link>
              </div>
            </transition>
          </div>
        </div>

        <!-- Utilities Section -->
        <div v-if="isExpanded" class="text-md text-white text-left">
          Utilities
        </div>

        <div v-for="item in utilityItems" :key="item.name" class="w-full">
          <!-- Non-children router-link -->
          <router-link
            v-if="!item.children"
            :to="item.route"
            class="flex items-center w-full p-2 transition-all duration-200"
            :class="[
              $route.path === item.route
                ? `bg-white text-green-700 ${
                    !isExpanded ? 'rounded-md' : 'rounded-md'
                  }`
                : 'text-white hover:bg-white hover:text-green-800 hover:rounded-md',
              !isExpanded ? 'justify-center gap-0' : 'justify-start gap-5',
            ]"
          >
            <icon :name="item.icon" />
            <span v-show="isExpanded">{{ item.name }}</span>
          </router-link>

          <!-- Collapsible Parent -->
          <div v-else>
            <div
              @click="toggleDropdown(item.name)"
              class="flex items-center justify-between w-full p-2 cursor-pointer transition-all duration-200"
              :class="[
                isDropdownOpen === item.name
                  ? `bg-white text-green-800 ${
                      !isExpanded ? 'rounded-md' : 'rounded-t-md'
                    }`
                  : 'text-white hover:bg-white hover:text-green-800 hover:rounded-md',
              ]"
            >
              <div
                :class="[
                  !isExpanded ? 'justify-center w-full' : 'justify-start gap-5',
                ]"
                class="flex items-center"
              >
                <icon :name="item.icon" />
                <span v-show="isExpanded">{{ item.name }}</span>
              </div>
              <icon
                name="arrow-down"
                v-show="isExpanded"
                class="transition-transform"
                :class="{ 'rotate-180': isDropdownOpen === item.name }"
              />
            </div>

            <transition name="slide">
              <div v-show="isDropdownOpen === item.name && isExpanded">
                <router-link
                  v-for="(sub, index) in item.children"
                  :key="sub.name"
                  :to="sub.route"
                  class="block w-full py-2 px-[60px] text-[11px] transition-all duration-200 text-left"
                  :class="[
                    $route.path.startsWith(sub.route) // This ensures the parent is active when on a child route
                      ? 'bg-blue-950 text-white'
                      : 'bg-white text-green-950 hover:bg-gray-200',
                    index === item.children.length - 1 ? 'rounded-b-md' : '',
                  ]"
                >
                  {{ sub.name }}
                </router-link>
              </div>
            </transition>
          </div>
        </div>

        <!-- Predictive Analysis Section -->
        <div v-if="isExpanded" class="text-md text-white text-left">
          Analysis
        </div>

        <div v-for="item in predictiveItems" :key="item.name" class="w-full">
          <!-- Single router-link when no children -->
          <router-link
            v-if="!item.children"
            :to="item.route"
            class="flex items-center w-full p-2 transition-all duration-200"
            :class="[
              $route.path === item.route
                ? `bg-white text-green-700 rounded-md`
                : 'text-white hover:bg-white hover:text-green-800 hover:rounded-md',
              !isExpanded ? 'justify-center gap-0' : 'justify-start gap-5',
            ]"
          >
            <icon :name="item.icon" />
            <span v-show="isExpanded">{{ item.name }}</span>
          </router-link>

          <!-- Collapsible parent with children -->
          <div v-else>
            <div
              @click="toggleDropdown(item.name)"
              class="flex items-center justify-between w-full p-2 cursor-pointer transition-all duration-200"
              :class="[
                isDropdownOpen === item.name
                  ? `bg-white text-green-800 ${
                      !isExpanded ? 'rounded-md' : 'rounded-t-md'
                    }`
                  : 'text-white hover:bg-white hover:text-green-800 hover:rounded-md',
              ]"
            >
              <div
                class="flex items-center"
                :class="
                  !isExpanded ? 'justify-center w-full' : 'justify-start gap-5'
                "
              >
                <icon :name="item.icon" />
                <span v-show="isExpanded">{{ item.name }}</span>
              </div>
              <icon
                name="arrow-down"
                v-show="isExpanded"
                class="transition-transform"
                :class="{ 'rotate-180': isDropdownOpen === item.name }"
              />
            </div>

            <transition name="slide">
              <div v-show="isDropdownOpen === item.name && isExpanded">
                <router-link
                  v-for="(sub, index) in item.children"
                  :key="sub.name"
                  :to="sub.route"
                  class="block w-full py-2 px-[60px] text-[11px] transition-all duration-200 text-left"
                  :class="[
                    $route.path === sub.route
                      ? 'bg-blue-950 text-white'
                      : 'bg-white text-green-950 hover:bg-gray-200',
                    index === item.children.length - 1 ? 'rounded-b-md' : '',
                  ]"
                >
                  {{ sub.name }}
                </router-link>
              </div>
            </transition>
          </div>
        </div>

        <!-- Monthly Report Section -->
        <div v-if="isExpanded" class="text-md text-white text-left">Report</div>

        <div v-for="item in monthlyreportItems" :key="item.name" class="w-full">
          <!-- Single router-link when no children -->
          <router-link
            v-if="!item.children"
            :to="item.route"
            class="flex items-center w-full p-2 transition-all duration-200"
            :class="[
              $route.path === item.route
                ? `bg-white text-green-700 rounded-md`
                : 'text-white hover:bg-white hover:text-green-800 hover:rounded-md',
              !isExpanded ? 'justify-center gap-0' : 'justify-start gap-5',
            ]"
          >
            <icon :name="item.icon" />
            <span v-show="isExpanded">{{ item.name }}</span>
          </router-link>

          <!-- Collapsible parent with children -->
          <div v-else>
            <div
              @click="toggleDropdown(item.name)"
              class="flex items-center justify-between w-full p-2 cursor-pointer transition-all duration-200"
              :class="[
                isDropdownOpen === item.name
                  ? `bg-white text-green-800 ${
                      !isExpanded ? 'rounded-md' : 'rounded-t-md'
                    }`
                  : 'text-white hover:bg-white hover:text-green-800 hover:rounded-md',
              ]"
            >
              <div
                class="flex items-center"
                :class="
                  !isExpanded ? 'justify-center w-full' : 'justify-start gap-5'
                "
              >
                <icon :name="item.icon" />
                <span v-show="isExpanded">{{ item.name }}</span>
              </div>
              <icon
                name="arrow-down"
                v-show="isExpanded"
                class="transition-transform"
                :class="{ 'rotate-180': isDropdownOpen === item.name }"
              />
            </div>

            <transition name="slide">
              <div v-show="isDropdownOpen === item.name && isExpanded">
                <router-link
                  v-for="(sub, index) in item.children"
                  :key="sub.name"
                  :to="sub.route"
                  class="block w-full py-2 px-[60px] text-[11px] transition-all duration-200 text-left"
                  :class="[
                    $route.path === sub.route
                      ? 'bg-blue-950 text-white'
                      : 'bg-white text-green-950 hover:bg-gray-200',
                    index === item.children.length - 1 ? 'rounded-b-md' : '',
                  ]"
                >
                  {{ sub.name }}
                </router-link>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div
      :class="{
        'ml-16': !isExpanded,
        'ml-64': isExpanded,
      }"
      class="flex-grow transition-all pt-2 pb-0 min-h-screen rounded-t-lg overflow-hidden z-50"
    >
      <slot>
        <div class="bg-white w-full h-full rounded-t-lg shadow">
          <adminTopbar />
          <div class="p-2">
            <router-view></router-view>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import adminTopbar from "../../../components/admin/navigation/topbar.vue";
import axios from "axios";
export default {
  name: "AdminSidebar",
  components: {
    icon,
    adminTopbar,
  },
  data() {
    return {
      isExpanded: false,
      isDropdownOpen: null,
      user: {},
      // Define sections
      homeItems: [
        {
          name: "Dashboard",
          icon: "dashboard",
          route: "/dashboard",
        },
      ],
      recordsItems: [
        {
          name: "Employee Records",
          icon: "users",
          route: "/employement-records",
          children: [
            {
              name: "Employee Profile",
              route: "/employement-records",
            },
            {
              name: "Service Record",
              route: "/service-of-records",
            },
            {
              name: "Attendance Record",
              route: "/attendance-records",
            },
          ],
        },
        {
          name: "Available Trainings",
          icon: "users",
          route: "/employement-records",
          children: [
            {
              name: "Trainings",
              route: "/available-trainings",
            },
          ],
        },
      ],
      utilityItems: [
        {
          name: "HR Templates",
          icon: "utilities",
          route: "/certificate-of-employment",
          children: [
            {
              name: "COE",
              route: "/certificate-of-employment",
            },
          ],
        },
      ],
      predictiveItems: [
        {
          name: "Predictive Analysis",
          icon: "graph",
          route: "/predictive-analysis",
          children: [
            // {
            //   name: "Seminar Eligibility",
            //   route: "/seminar-page",
            // },
            {
              name: "Promotion",
              route: "/promotion-page",
            },
            // {
            //   name: "Uploaded Testing",
            //   route: "/predictive-analysis",
            // },
          ],
        },
      ],
      // userItems: [
      //   {
      //     name: "User Records",
      //     icon: "graph",
      //     // route: "/predictive-analysis",
      //     children: [
      //       {
      //         name: "Users",
      //         route: "/user-management",
      //       },
      //     ],
      //   },
      // ],

      monthlyreportItems: [
        {
          name: "Monthly Report",
          icon: "general",
          // route: "/predictive-analysis",
          children: [
            {
              name: "Attendance ",
              route: "/attendance-report",
            },
            {
              name: "Customer Feedback ",
              route: "/customer-feedback-report",
            },
          ],
        },
      ],

      // uploadingItems: [
      //   {
      //     name: "Uploading Data",
      //     icon: "utilities",
      //     route: "/predictive-analysis",
      //     children: [
      //       {
      //         name: "Upload Employee Pofiles",
      //         route: "/predictive-analysis",
      //       },
      //       {
      //         name: "Upload Service Record",
      //         route: "/upload-service-page",
      //       },
      //     ],
      //   },
      // ],
    };
  },
  watch: {
    "$route.path"(newPath) {
      this.expandDropdownForCurrentRoute(newPath);
    },
  },

  created() {
    this.expandDropdownForCurrentRoute(this.$route.path);
  },
  methods: {
    async refreshSeminarsView() {
      try {
        const response = await axios.post(
          "http://localhost:8000/predictive/refresh-seminar-view"
        );
        console.log(response.data.message);
      } catch (error) {
        console.error("Error refreshing attendance view:", error);
      }
    },
    async refreshSeminarView() {
      try {
        const response = await axios.post(
          "http://localhost:8000/attendance-record/refresh-seminar-view"
        );
        console.log(response.data.message);
      } catch (error) {
        console.error("Error refreshing attendance view:", error);
      }
    },
    // Refresh the normal attendance view
    async refreshAttendanceView() {
      try {
        const response = await axios.post(
          "http://localhost:8000/attendance-record/refresh-attendance-view"
        );
        console.log(response.data.message);
      } catch (error) {
        console.error("Error refreshing attendance view:", error);
      }
    },

    // Refresh the final attendance view
    async refreshFinalAttendanceView() {
      try {
        const response = await axios.post(
          "http://localhost:8000/attendance-record/refresh-attendance-final-view"
        );
        console.log(response.data.message);
      } catch (error) {
        console.error("Error refreshing final attendance view:", error);
      }
    },

    async refreshPromotionView() {
      try {
        const response = await axios.post(
          "http://localhost:8000/attendance-record/refresh-promotion-view"
        );
        console.log(response.data.message);
      } catch (error) {
        console.error("Error refreshing promotion view:", error);
      }
    },
    async fetchUser() {
      try {
        const response = await axios.get("http://localhost:8000/auth/me", {
          withCredentials: true,
        });

        if (response.data) {
          this.user = response.data;
          console.log("Sidebar Authenticated User:", this.user);
        } else {
          // If no user data is returned, redirect to home
          this.$router.push("/");
          location.reload();
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        this.$router.push("/"); // Redirect on error
      }
    },
    toggleSidebar() {
      this.isExpanded = !this.isExpanded;
    },
    toggleDropdown(name) {
      this.isExpanded = true;
      this.isDropdownOpen = this.isDropdownOpen === name ? null : name;
    },
    expandDropdownForCurrentRoute(path) {
      for (const item of [
        ...this.recordsItems,
        ...this.utilityItems,
        ...this.predictiveItems,
        // ...this.userItems,
        ...this.monthlyreportItems,
      ]) {
        if (item.children) {
          const match = item.children.find((child) =>
            path.startsWith(child.route)
          );
          if (match || path.startsWith(item.route)) {
            this.isExpanded = true;
            this.isDropdownOpen = item.name;
            break;
          }
        }
      }
    },
    handleDashboardClick() {
      this.isDropdownOpen = null;
      this.isExpanded = false;
    },
  },
  mounted() {
    this.fetchUser();
  },
};
</script>

<style scoped>
.transition-transform {
  transition: transform 0.1s ease;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.1s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
