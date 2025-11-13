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

      <!-- Logo & User -->
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
        <template v-for="section in sections" :key="section.name">
          <div v-if="isExpanded" class="text-md text-white mt-2 text-left">
            {{ section.name }}
          </div>

          <div v-for="item in section.items" :key="item.name" class="w-full">
            <!-- Single Link -->
            <router-link
              v-if="!item.children"
              :to="item.route"
              class="flex items-center w-full p-2 rounded-md transition-all duration-200"
              :class="[
                $route.path === item.route
                  ? 'bg-white text-green-700'
                  : 'text-white hover:bg-white hover:text-green-800',
                !isExpanded ? 'justify-center' : 'justify-start gap-5',
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
                    !isExpanded
                      ? 'justify-center w-full'
                      : 'justify-start gap-5',
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
                      $route.path.startsWith(sub.route)
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
        </template>
      </div>
    </div>

    <!-- Main Content -->
    <div
      :class="{ 'ml-16': !isExpanded, 'ml-64': isExpanded }"
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
  components: { icon, adminTopbar },
  data() {
    return {
      isExpanded: false,
      isDropdownOpen: null,
      user: {},
      sections: [
        {
          name: "Home",
          items: [
            { name: "Dashboard", icon: "dashboard", route: "/dashboard" },
          ],
        },
        {
          name: "Records",
          items: [
            {
              name: "Employee Records",
              icon: "users",
              route: "/employement-records",
              children: [
                { name: "Employee Profile", route: "/employement-records" },
                { name: "Service Record", route: "/service-of-records" },
                { name: "Attendance Record", route: "/attendance-records" },
              ],
            },
            {
              name: "Available Trainings",
              icon: "general",
              route: "/available-trainings",
            },
          ],
        },
        {
          name: "Utilities",
          items: [
            {
              name: "HR Templates",
              icon: "utilities",
              route: "/certificate-of-employment",
            },
          ],
        },
        {
          name: "Analysis",
          items: [
            {
              name: "Predictive Analysis",
              icon: "graph",
              route: "/predictive-analysis",
              children: [{ name: "Promotion", route: "/promotion-page" }],
            },
          ],
        },
        {
          name: "User Management",
          items: [
            {
              name: "Users List",
              icon: "general",
              route: "/user-management",
            },
          ],
        },
        {
          name: "Report",
          items: [
            {
              name: "Monthly Report",
              icon: "general",
              children: [
                { name: "Attendance", route: "/attendance-report" },
                {
                  name: "Client Feedback",
                  route: "/client-feedback-report",
                },
              ],
            },
          ],
        },
      ],
    };
  },
  created() {
    this.expandDropdownForCurrentRoute(this.$route.path);
    this.fetchUser();
  },
  watch: {
    "$route.path"(newPath) {
      this.expandDropdownForCurrentRoute(newPath);
    },
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded;
    },
    toggleDropdown(name) {
      this.isExpanded = true;
      this.isDropdownOpen = this.isDropdownOpen === name ? null : name;
    },
    expandDropdownForCurrentRoute(path) {
      for (const section of this.sections) {
        for (const item of section.items) {
          if (item.children) {
            if (
              item.children.some((child) => path.startsWith(child.route)) ||
              path.startsWith(item.route)
            ) {
              this.isExpanded = true;
              this.isDropdownOpen = item.name;
              return;
            }
          }
        }
      }
    },
    async fetchUser() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/auth/me",
          {
            withCredentials: true,
          }
        );
        if (response.data) this.user = response.data;
        else this.$router.push("/");
      } catch (err) {
        console.error(err);
        this.$router.push("/");
      }
    },
  },
};
</script>
