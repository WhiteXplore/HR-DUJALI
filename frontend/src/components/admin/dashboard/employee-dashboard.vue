<template>
  <div
    v-if="userLoaded"
    class="px-4 py-3 h-[90vh] text-gray-700 rounded-xl overflow-auto"
  >
    <!-- Header -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4"
    >
      <div class="text-left text-xl font-semibold">
        <p>Welcome back, {{ user.first_name }} 👋!</p>
        <p class="text-sm text-gray-500 font-normal">
          Here's what's happening today
        </p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div
      class="grid gap-5 w-full"
      :class="
        isEmployee
          ? 'grid-cols-1 lg:grid-cols-[2fr,1fr]'
          : 'grid-cols-1 lg:grid-cols-[1fr,550px]'
      "
    >
      <!-- LEFT COLUMN -->
      <div class="flex flex-col gap-4">
        <!-- Cards (ADMIN ONLY) -->
        <div
          v-if="!isEmployee"
          class="rounded-2xl w-full h-[155px] overflow-hidden"
        >
          <Cards />
        </div>

        <!-- Calendar -->
        <div
          class="bg-white rounded-2xl border p-6 max-h-[80vh] overflow-y-auto"
          :class="isEmployee ? 'flex-1' : ''"
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-700">Calendar</h2>
            <div class="flex gap-2">
              <button
                @click="prevMonth"
                class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"
              >
                <icon name="arrow-left" /> Prev
              </button>
              <button
                @click="nextMonth"
                class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-1"
              >
                Next <icon name="arrow-right" />
              </button>
            </div>
          </div>

          <div class="text-lg font-semibold text-gray-700 mb-2">
            {{ monthYear }}
          </div>

          <!-- Weekdays -->
          <div
            class="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 border-b pb-2"
          >
            <div v-for="day in weekDays" :key="day">{{ day }}</div>
          </div>

          <!-- Days -->
          <div class="grid grid-cols-7 gap-2 pt-2">
            <div
              v-for="(date, index) in calendarDays"
              :key="index"
              class="aspect-square rounded-xl cursor-pointer relative p-2 text-right"
              :class="{
                'bg-[#34699A] text-white font-bold': isToday(date),
                'text-gray-400': date.month() !== currentMonth.month(),
                'hover:bg-blue-100': date.month() === currentMonth.month(),
              }"
              @click="selectDate(date)"
            >
              {{ date.date() }}
              <div
                v-if="hasEvent(date)"
                class="absolute inset-x-1 bottom-1 flex flex-col gap-1"
              >
                <div
                  v-for="event in getEventsByDate(date)"
                  :key="event.title + event.date"
                  @click.stop="openEventDetails(event)"
                  class="bg-[#34699A] text-white text-xs px-2 py-0.5 rounded truncate"
                >
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="flex flex-col gap-4">
        <!-- Announcements -->
        <div
          class="bg-white rounded-2xl border p-6 overflow-y-auto"
          :class="isEmployee ? 'h-[80vh]' : 'h-[45vh]'"
        >
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <h2 class="text-xl font-semibold text-gray-700">Announcements</h2>
            <icon name="3dots" />
          </div>

          <template
            v-if="
              todaysEvents.length || upcomingEvents.length || pastEvents.length
            "
          >
            <!-- Today -->
            <div v-if="todaysEvents.length">
              <h3 class="text-sm font-bold text-gray-600 mb-2">Today</h3>
              <div
                v-for="(event, idx) in todaysEvents"
                :key="'today-' + idx"
                class="bg-green-50 border border-green-200 rounded-xl p-4 mb-3 cursor-pointer hover:bg-green-100"
                @click="openEventDetails(event)"
              >
                <p class="text-xs text-gray-500">
                  {{ formatDate(event.date) }}
                </p>
                <p class="text-sm font-medium text-gray-800">
                  {{ event.title }}
                </p>
              </div>
            </div>

            <!-- Upcoming -->
            <div v-if="upcomingEvents.length">
              <h3 class="text-sm font-bold text-gray-600 mt-4 mb-2">
                Upcoming
              </h3>
              <div
                v-for="(event, idx) in upcomingEvents"
                :key="'upcoming-' + idx"
                class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3 cursor-pointer hover:bg-blue-100"
                @click="openEventDetails(event)"
              >
                <p class="text-xs text-gray-500">
                  {{ formatDate(event.date) }}
                </p>
                <p class="text-sm font-medium text-gray-800">
                  {{ event.title }}
                </p>
              </div>
            </div>

            <!-- Past -->
            <div v-if="pastEvents.length">
              <h3 class="text-sm font-bold text-gray-600 mt-4 mb-2">
                Completed
              </h3>
              <div
                v-for="(event, idx) in pastEvents"
                :key="'past-' + idx"
                class="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3 cursor-pointer hover:bg-gray-100"
                @click="openEventDetails(event)"
              >
                <p class="text-xs text-gray-500">
                  {{ formatDate(event.date) }}
                </p>
                <p class="text-sm font-medium text-gray-800">
                  {{ event.title }}
                </p>
              </div>
            </div>
          </template>

          <p v-else class="text-sm text-gray-500">No announcements to show.</p>
        </div>

        <!-- Employee Status (ADMIN ONLY) -->
        <div v-if="!isEmployee" class="bg-white rounded-2xl p-4 border">
          <EmployeeStatus />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="h-[90vh] flex items-center justify-center text-gray-400">
    Loading dashboard…
  </div>
</template>

<script>
import Cards from "./content/cards.vue";

import EmployeeStatus from "./content/employee-status.vue";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "vue3-toastify";

export default {
  name: "EmployeeDashboard",
  components: { Cards, EmployeeStatus },
  data() {
    return {
      user: {},
      searchQuery: "",
      showResults: false,
      selectedDate: dayjs(),
      showEventModal: false,
      newEventTitle: "",
      selectedEvent: null,
      currentMonth: dayjs(),
      userLoaded: false,
      events: [],
      modules: [
        { name: "Employment Records", route: "/employement-records" },
        { name: "Service of Records", route: "/service-of-records" },
        {
          name: "Certificate of Employment",
          route: "/certificate-of-employment",
        },
        { name: "Seminar Eligibility", route: "/seminar-page" },
        { name: "Promotion", route: "/promotion-page" },
      ],
      weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    };
  },
  computed: {
    isEmployee() {
      // adjust this depending on your API response
      // common values: role, user_type, account_type
      return this.user?.role === "Employee";
    },

    filteredModules() {
      if (!this.searchQuery) return [];
      return this.modules.filter((module) =>
        module.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
      );
    },

    monthYear() {
      return this.currentMonth.format("MMMM YYYY");
    },
    calendarDays() {
      const startOfMonth = this.currentMonth.startOf("month");
      const endOfMonth = this.currentMonth.endOf("month");
      const startDay = startOfMonth.day();
      const totalDays = endOfMonth.date();
      const days = [];

      for (let i = 0; i < startDay; i++) {
        days.push(startOfMonth.subtract(startDay - i, "day"));
      }

      for (let i = 1; i <= totalDays; i++) {
        days.push(
          dayjs(
            `${this.currentMonth.format("YYYY-MM")}-${String(i).padStart(
              2,
              "0",
            )}`,
          ),
        );
      }

      while (days.length < 42) {
        days.push(days[days.length - 1].add(1, "day"));
      }

      return days;
    },
    formattedEventDate() {
      return this.selectedEvent
        ? dayjs(this.selectedEvent.date).format("MMMM D, YYYY")
        : "";
    },
    todaysEvents() {
      return this.events.filter((e) => dayjs(e.date).isSame(dayjs(), "day"));
    },
    upcomingEvents() {
      return this.events
        .filter((e) => dayjs(e.date).isAfter(dayjs(), "day"))
        .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
    },
    pastEvents() {
      return this.events
        .filter((e) => dayjs(e.date).isBefore(dayjs(), "day"))
        .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)));
    },
  },
  methods: {
    goToRoute(route) {
      this.$router.push(route);
      this.searchQuery = "";
      this.showResults = false;
    },
    hideResults() {
      setTimeout(() => {
        this.showResults = false;
      }, 200);
    },
    formatDate(date) {
      return dayjs(date).format("MMM D, YYYY");
    },
    prevMonth() {
      this.currentMonth = this.currentMonth.subtract(1, "month");
    },
    nextMonth() {
      this.currentMonth = this.currentMonth.add(1, "month");
    },
    isToday(date) {
      return date.isSame(dayjs(), "day");
    },
    hasEvent(date) {
      return this.events.some((e) => dayjs(e.date).isSame(date, "day"));
    },
    getEventsByDate(date) {
      return this.events.filter((e) => dayjs(e.date).isSame(date, "day"));
    },
    selectDate(date) {
      this.selectedDate = date;
      this.newEventTitle = "";
      this.showEventModal = true;
    },
    addEvent() {
      if (!this.newEventTitle.trim()) return;
      this.events.push({
        title: this.newEventTitle,
        date: this.selectedDate.format("YYYY-MM-DD"),
      });
      this.showEventModal = false;
      this.newEventTitle = "";
      toast.success("Event added successfully!");
    },
    cancelEvent() {
      this.showEventModal = false;
      this.newEventTitle = "";
    },
    openEventDetails(event) {
      this.selectedEvent = { ...event };
    },
    closeEventModal() {
      this.selectedEvent = null;
    },
    saveEvent() {
      const index = this.events.findIndex(
        (e) => e.date === this.selectedEvent.date,
      );
      if (index !== -1) {
        this.events[index].title = this.selectedEvent.title;
        toast.success("Event edited successfully!");
      }
      this.selectedEvent = null;
    },
    deleteEvent() {
      this.events = this.events.filter(
        (e) =>
          !(
            e.date === this.selectedEvent.date &&
            e.title === this.selectedEvent.title
          ),
      );
      this.selectedEvent = null;
      toast.success("Event deleted successfully!");
    },
    async fetchUser() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/auth/me",
          { withCredentials: true },
        );

        if (response.data) {
          this.user = response.data;
          this.userLoaded = true; // 👈 IMPORTANT
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
  mounted() {
    this.fetchUser();
  },
};
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow-x: hidden;
}
</style>
