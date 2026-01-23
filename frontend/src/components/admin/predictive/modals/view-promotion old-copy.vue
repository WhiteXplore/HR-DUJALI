<template>
  <div class="w-full flex items-center justify-between mb-2">
    <div class="text-[13px] text-text mt-4 font-regular">
      Pages / Promotion Eligibility
    </div>
    <div
      @click="toggleBack"
      class="cursor-pointer text-red-800 hover:text-white border-red-800 border px-2 py-1 text-sm rounded-md hover:bg-red-800"
    >
      Back
    </div>
  </div>
  <div
    class="w-full mx-auto bg-white rounded-lg space-y-4 h-[80vh] overflow-auto"
  >
    <!-- Loading animation -->
    <div v-if="loading" class="h-full flex items-center justify-center">
      <div class="flex flex-col items-center space-y-4">
        <div
          class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"
        ></div>
        <p class="text-gray-600 text-sm">
          Analyzing profile and generating recommendations...
        </p>
      </div>
    </div>

    <!-- Content when loaded -->
    <div v-if="!loading && employeeData" class="space-y-4">
      <!-- Header Section -->
      <div class="flex justify-between gap-2">
        <!-- Profile Card -->
        <div class="w-full h-[22vh] border rounded-lg text-[14px]">
          <div class="flex justify-start p-4">
            <div class="flex gap-5">
              <img
                src="../../../../assets/img/employee_picture.png"
                alt="Employee"
                class="w-[180px] bg-gray-100 rounded-md"
              />
              <div class="space-y-3">
                <div class="flex">
                  <p class="font-bold">Name:</p>
                  &nbsp;{{ employeeData.first_name }}
                  {{ employeeData.last_name }}
                </div>
                <div class="flex">
                  <p class="font-bold">Age:</p>
                  &nbsp;{{ employeeData.age }}
                </div>
                <div class="flex">
                  <p class="font-bold">Birthdate:</p>
                  &nbsp;{{ formattedBirthdate }}
                </div>

                <div class="flex">
                  <p class="font-bold">Place of Birth:</p>
                  &nbsp;{{ employeeData.birth_place }}
                </div>

                <div class="flex">
                  <p class="font-bold">Designation:</p>
                  &nbsp;{{ employeeData.present_designation }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommendation Card -->
        <div
          v-if="predictionData.eligible"
          class="w-full h-[22vh] border rounded-lg bg-blue-50 p-4"
        >
          <div class="flex justify-start">
            <h1 class="text-xl font-bold">Promotion Recommendation</h1>
          </div>
          <div class="mt-6 flex items-center justify-center gap-[460px]">
            <div class="text-left space-y-2">
              <h2 class="text-base">Recommended Promotion Title:</h2>
              <p class="text-blue-700 text-[19px] w-[300px]">
                <strong>{{ promotedTitle }}</strong>
              </p>
            </div>
            <div
              class="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white"
            >
              <icon :name="'promoted'" />
            </div>
          </div>
        </div>

        <!-- Not Eligible Card -->
        <div v-else class="w-full h-[22vh] border rounded-lg bg-red-50 p-4">
          <div class="flex justify-start">
            <h1 class="text-xl font-bold">Promotion Recommendation</h1>
          </div>
          <div class="mt-6 flex items-center justify-center gap-[390px]">
            <div class="text-left space-y-2">
              <h2 class="text-base">Recommended Promotion Title:</h2>
              <p class="text-red-700 text-[19px] w-[300px]">
                <strong>{{ employeeData.first_name }}</strong> is not eligible
                for promotion.
              </p>
            </div>
            <div
              class="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white"
            >
              <icon :name="'not-promoted'" />
            </div>
          </div>
        </div>
      </div>

      <!-- Description -->
      <p class="text-gray-600 text-justify">
        Through a thorough evaluation of {{ employeeData.first_name }}’s
        professional profile—including age, educational qualifications, work
        experience, current designation, commendations received, and total
        attendance hours—the system has determined their eligibility for
        promotion. This data-driven assessment ensures that only employees who
        meet the established standards for advancement are recommended,
        supporting both fairness and career progression within the organization.
      </p>

      <!-- Data Summary -->
      <div
        class="w-full h-[10vh] border rounded-lg flex items-center justify-between px-20 mb-6"
      >
        <div class="text-sm flex flex-col">
          <span class="font-semibold text-gray-700">Age:</span
          >{{ employeeData.age }}
        </div>
        <div class="text-sm flex flex-col">
          <span class="font-semibold text-gray-700">Education Level:</span
          >{{ employeeData.level }}
        </div>
        <div class="text-sm flex flex-col">
          <span class="font-semibold text-gray-700">Experience (Years):</span
          >{{ employeeData.total_years_experience }}
        </div>
        <div class="text-sm flex flex-col">
          <span class="font-semibold text-gray-700">Designation:</span
          >{{ employeeData.present_designation }}
        </div>
        <div class="text-sm flex flex-col">
          <span class="font-semibold text-gray-700">Commendation (Count):</span
          >{{ employeeData.total_count_of_learning_development }}
        </div>
        <div class="text-sm flex flex-col">
          <span class="font-semibold text-gray-700">Commendation Hours:</span
          >{{ employeeData.total_ld_hours_rendered }}
        </div>
        <div class="text-sm flex flex-col">
          <span class="font-semibold text-gray-700">Attendance Hours:</span
          >{{ employeeData.total_attendance_hours }}
        </div>
      </div>

      <!-- Criteria Cards -->
      <div>
        <h2 class="text-xl mt-5 font-semibold text-left">
          Promotion Eligibility Criteria
        </h2>
        <p class="text-sm text-left text-gray-600 mb-4">
          The following criteria outline the standards used to evaluate an
          employee's eligibility for promotion. Each requirement is assessed
          individually to ensure a fair and transparent recommendation process.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div
            v-for="(item, key) in criteria"
            :key="key"
            :class="[
              'bg-green-50 rounded-lg shadow-lg p-5 border-l-4',
              item.met ? 'border-green-500' : 'border-red-500',
            ]"
          >
            <div class="flex items-center space-x-2 mb-2">
              <div
                :class="[
                  'text-white rounded-full w-6 h-6 flex items-center justify-center',
                  item.met ? 'bg-green-500' : 'bg-red-500',
                ]"
              >
                {{ item.met ? "✅" : "❌" }}
              </div>
              <h3 class="font-semibold text-gray-800">{{ item.title }}</h3>
            </div>
            <p class="text-gray-600 mb-2 text-left ml-8">
              {{ item.description }}
            </p>
            <p
              :class="
                item.met
                  ? 'text-green-600 font-medium'
                  : 'text-red-600 font-medium'
              "
              class="text-left ml-8"
            >
              {{ item.met ? "Requirement met" : "Requirement not met" }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-row justify-end">
      <button
        class="px-2 py-3 bg-blue-800 rounded-lg mb-2 text-white flex items-center gap-2"
        @click="openPrintableModal"
      >
        <icon :name="'check'" />
        Download
      </button>
    </div>
    <PrintableModal
      :show="showModal"
      :employeeData="employeeData"
      :predictionData="predictionData"
      :criteria="criteria"
      @close="showModal = false"
    />
  </div>
</template>

<script>
import axios from "axios";
import icon from "@/assets/icon.vue";
import PrintableModal from "@/components/admin/predictive/modals/print-promotion.vue";
export default {
  name: "viewSeminar",
  components: { icon, PrintableModal },
  props: {
    selectedFirstName: String,
    selectedLastName: String,
  },
  data() {
    return {
      showModal: false,
      employeeData: null,
      predictionData: { eligible: 0 },
      ruleChecks: {},
      loading: false,
      criteria: {
        age: {
          title: "Age Requirement",
          description: "Must be at least 21 years old.",
          met: true,
        },
        educ: {
          title: "Education",
          description: "Must have completed secondary education or higher.",
          met: true,
        },
        exp: {
          title: "Work Experience",
          description: "Must have at least 5 years of work experience.",
          met: true,
        },
        designation: {
          title: "Designation",
          description: "Must hold an eligible designation.",
          met: true,
        },
        ldCount: {
          title: "Commendations",
          description: "Must have at least 3 commendations.",
          met: true,
        },
        ldHours: {
          title: "Commendation Hours",
          description: "Must have at least 30 commendation hours.",
          met: true,
        },
        attendance: {
          title: "Attendance Hours",
          description: "Must have at least 160 attendance hours.",
          met: true,
        },
      },
    };
  },
  computed: {
    promotedTitle() {
      const romanToNum = { I: 1, II: 2, III: 3 };
      const numToRoman = ["", "I", "II", "III", "IV", "V"];
      return (this.employeeData?.present_designation || "").replace(
        /\b(I{1,3})\b/g,
        (match) => numToRoman[(romanToNum[match] || 1) + 1] || "IV+"
      );
    },
    formattedBirthdate() {
      if (!this.employeeData?.birthdate) return "";
      const date = new Date(this.employeeData.birthdate);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("en-US", options); // e.g., December 27, 1986
    },
  },
  methods: {
    openPrintableModal() {
      this.showModal = true;
    },
    toggleBack() {
      this.employeeData = null;
      this.$emit("back-to-table-seminar");
    },
    async fetchPromotionData() {
      this.loading = true;
      try {
        const res = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/predictive/fetch-promotion"
        );
        const matched = res.data.find(
          (emp) =>
            emp.first_name === this.selectedFirstName &&
            emp.last_name === this.selectedLastName
        );
        const eligibleDesignations = [
          "Administrative Aide I (Utility Worker I)",
          "Accounting Clerk I",
          "Administrative Aide",
          "Administrative Aide I",
          "Administrative Aide I (Utility Worker I)",
          "Administrative Aide I SG 1 Step 1",
          "Administrative Aide II",
          "Administrative Aide II (Bookbinder I)",
          "Administrative Aide II (Messenger)",
          "Administrative Aide III",
          "Administrative Aide III (Clerk I)",
          "Administrative Aide III (Driver I)",
          "Administrative Aide III (Utility Worker II)",
          "Administrative Aide IV (Accounting Clerk I)",
          "Administrative Aide IV (Bookbinder II)",
          "Administrative Aide IV (Clerk III)",
          "Administrative Aide VI (Disbursing Officer I)",
          "Administrative Assistant I (Bookbinder III)",
          "Administrative Assistant I (Bookbinder IV)",
          "Administrative Assistant V",
          "Administrative Assistant V (Private Secretary I)",
          "Administrative Officer I (Supply Officer I)",
          "Administrative Officer II",
          "Administrative Officer II (Budget Officer I)",
          "Administrative Officer II (HRMO I)",
          "Administrative Officer II (Human Resource Management Officer I)",
          "Administrative Officer II (Management Audit Analyst I)",
          "Administrative Officer III (Records Officer II)",
          "Administrative Officer IV (Budget Officer II)",
          "Administrative Officer IV (Human Resource Management Officer II)",
          "Administrative Officer IV (Management and Audit Analyst I)",
          "Agricultural Technician",
          "Agricultural Technician I",
          "Agriculturist II",
          "Animal Keeper",
          "Assistant Nutritionist Dietitian",
          "Bookbinder",
          "Bookbinder I",
          "Budget Officer I",
          "Building Helper",
          "Building Inspector I",
          "CARP Technician",
          "Clerk",
          "Clerk I",
          "Clerk II",
          "Clerk III",
          "Community Affairs Assistant I",
          "Computer Operator",
          "Construction and Maintenance Man",
          "Disbursing Officer I",
          "District Coordinator",
          "Draftsman",
          "Draftsman I",
          "Driver/Personal Driver",
          "Engineering Aide",
          "Engineering Staff",
          "Environmental Management Specialist II",
          "Executive Assistant I",
          "Farm Foreman",
          "Heavy Equipment Operator",
          "Heavy Equipment Operator II",
          "Human Resource Management Officer I",
          "Institutional Officer",
          "Laborer",
          "Licensing Officer II",
          "Livestock Inspector I",
          "Local Assessment Operation Officer I",
          "Local Disaster Risk Reduction Management Officer II",
          "Local Legislative Staff Assistant I",
          "Local Legislative Staff Employee I",
          "Local Legislative Staff Employee II",
          "Local Treasury Operation Officer I",
          "Local Treasury Operation Officer II",
          "Meat Inspector I",
          "Medical Officer III",
          "Medical Officer IV",
          "Medical Technologist",
          "Medical Technologist II",
          "Messenger",
          "MGDH I (Municipal Budget Officer)",
          "MGDH I (Assistant Municipal Health Officer)",
          "MGDH I (General Services Officer)",
          "MGDH I (Municipal Accountant)",
          "MGDH I (Municipal Agriculturist)",
          "MGDH I (Municipal Assessor)",
          "MGDH I (Municipal Civil Registrar)",
          "MGDH I (Municipal Disaster Risk Reduction Management Officer V)",
          "MGDH I (Municipal Economic Enterprise Officer I)",
          "MGDH I (Municipal Engineer)",
          "MGDH I (Municipal Health Officer)",
          "MGDH I (Municipal Planning and Development Coordinator)",
          "MGDH I (Municipal Social Welfare Development Officer)",
          "MGDH I (Municipal Treasurer)",
          "Midwife",
          "Midwife I",
          "Midwife III",
          "Municipal Budget Officer",
          "Municipal Environment and Natural Resources Officer I",
          "Municipal Government Department Head I (Municipal Accountant)",
          "Municipal Health Officer",
          "Municipal Mayor",
          "Municipal Vice Mayor",
          "Nurse",
          "Nurse I",
          "Nursing Attendant",
          "Nursing Attendant I",
          "Nutrition Aide",
          "Private Secretary",
          "Private Secretary I",
          "Private Secretary II",
          "Project Development Officer II",
          "Project Officer",
          "Provincial Supervisor",
          "Radio Operator",
          "Registration Officer II",
          "Revenue Collection Clerk I",
          "Sangguniang Bayan Member",
          "Sangguniang Bayan Member (Sangguniang Kabataan Federation President)",
          "Sangguniang Bayan Member/ABC President",
          "Sangguniang Bayan Member/SKF President",
          "Sangguniang Kabataan Federation President",
          "Sanitary Inspector",
          "Sanitation Inspector II",
          "Sanitation Inspector V",
          "SB Member",
          "Secretary to the Sanggunian (MGDH I)",
          "Secretary to the Sanggunian",
          "Senior Administrative Assistant III (Private Secretary II)",
          "Social Welfare Aide",
          "Social Welfare Assistant",
          "Social Welfare Officer II",
          "Social Worker",
          "SP Member",
          "Stenographic Reporter IV",
          "Teacher I",
          "Technical Staff",
          "Watchman I",
          "Zoning Inspector I",
        ];

        if (matched) {
          this.employeeData = matched;
          const checks = {
            age: matched.age >= 21,
            educ: /college|tertiary|secondary/i.test(matched.level),
            exp: matched.total_years_experience >= 5,
            designation: eligibleDesignations.includes(
              matched.present_designation
            ),

            ldCount: matched.total_count_of_learning_development >= 3,
            ldHours: matched.total_ld_hours_rendered >= 30,
            attendance: matched.total_attendance_hours >= 160,
          };

          this.ruleChecks = checks;
          this.predictionData.eligible = Object.values(checks).every(Boolean);

          Object.entries(this.criteria).forEach(([key, value]) => {
            value.met = checks[key];
          });
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        // Show loading screen at least 2 seconds
        setTimeout(() => {
          this.loading = false;
        }, 2000);
      }
    },
  },
  mounted() {
    this.fetchPromotionData();
  },
};
</script>

<style scoped>
.loader {
  border-top-color: #1d4ed8; /* Tailwind's blue-700 */
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
