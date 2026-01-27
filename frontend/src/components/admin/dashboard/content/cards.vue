<template>
  <div class="grid grid-cols-3 gap-6">
    <div
      v-for="(card, index) in cards"
      :key="index"
      class="w-full h-[150px] rounded-2xl border transition-all duration-300 p-5 flex flex-col justify-between bg-white relative overflow-hidden cursor-pointer"
    >
      <!-- Background Accent Circle -->
      <div
        :class="card.bgColor"
        class="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
      ></div>

      <!-- Icon -->
      <div
        :class="[
          'w-14 h-14 flex justify-start items-center rounded-xl relative z-10',
          card.textColor,
        ]"
      >
        <icon :name="card.icon" class="" />
      </div>

      <!-- Card Content -->
      <div class="flex flex-col items-start relative z-10">
        <div class="text-2xl font-bold text-gray-800">{{ card.count }}</div>
        <div class="text-sm text-gray-500 mt-2 tracking-wider">
          {{ card.name }}
        </div>
      </div>

      <!-- Hover Effect Overlay -->
      <div
        class="absolute inset-0 rounded-2xl bg-gradient-to-r from-white via-white/70 to-white/30 opacity-0 hover:opacity-20 transition-opacity duration-300"
      ></div>
    </div>
  </div>
</template>

<script>
import icon from "../../../../assets/icon.vue";
import axios from "axios";

export default {
  name: "CardPages",
  components: { icon },
  data() {
    return {
      cards: [
        {
          name: "Employees",
          count: 0,
          icon: "employees",
          bgColor: "bg-green-400",
          textColor: "text-green-800",
        },
        {
          name: "Active Employees",
          count: 0,
          icon: "Active",
          bgColor: "bg-blue-400",
          textColor: "text-blue-800",
        },
        {
          name: "Inactive Employees",
          count: 0,
          icon: "Inactive",
          bgColor: "bg-red-400",
          textColor: "text-red-800",
        },
        // {
        //   name: "New Applicants",
        //   count: 0,
        //   icon: "users1",
        //   bgColor: "bg-yellow-400",
        //   textColor: "text-yellow-800",
        // },
      ],
    };
  },
  mounted() {
    this.getEmployeeCounts();
  },
  methods: {
    async getEmployeeCounts() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/upload/get-all",
        );
        const employees = response.data;

        const activeCount = employees.filter(
          (emp) => emp.employment_status === "Active",
        ).length;
        const inactiveCount = employees.filter(
          (emp) => emp.employment_status !== "Active",
        ).length;

        this.cards[0].count = employees.length;
        this.cards[1].count = activeCount;
        this.cards[2].count = inactiveCount;
        this.cards[3].count = employees.filter(
          (emp) => !emp.employment_status,
        ).length; // New Applicants
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    },
  },
};
</script>
