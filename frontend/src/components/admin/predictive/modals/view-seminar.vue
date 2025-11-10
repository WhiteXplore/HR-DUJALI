<template>
  <div
    class="w-full mx-auto bg-white rounded-lg space-y-4 h-[85vh] overflow-auto"
  >
    <!-- 👇 Loading animation -->
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
    <div v-if="!loading && employeeData" class="space-y-4">
      <!-- Employee Name -->
      <div class="flex justify-between items-center">
        <h1 class="text-md text-left text-gray-800">
          <span class="font-bold">Employee's Name:</span>
          {{ employeeData.first_name }} {{ employeeData.middle_name || "" }}
          {{ employeeData.last_name }}
        </h1>
        <div
          @click="toggleBack"
          class="cursor-pointer text-red-800 hover:text-white border-red-800 border px-2 py-1 text-sm rounded-md hover:bg-red-800"
        >
          Back
        </div>
      </div>

      <div
        class="w-full h-[8vh] border rounded-lg flex items-center justify-between px-32"
      >
        <div class="text-sm flex flex-col">
          <span class="font-semibold text-gray-700">Age:</span>
          {{ employeeData.age }}
        </div>

        <div class="text-sm flex flex-col">
          <span class="font-semibold text-gray-700">Education Level:</span>
          {{ employeeData.level }}
        </div>
        <div class="text-sm flex flex-col">
          <span class="font-semibold text-gray-700">Experience (Years):</span>
          {{ employeeData.total_years_experience }}
        </div>
        <div class="text-sm flex flex-col">
          <span class="font-semibold text-gray-700">Designation:</span>
          {{ employeeData.present_designation }}
        </div>
      </div>

      <!-- Description -->
      <div>
        <p class="text-gray-600 text-justify">
          Utilizing a comprehensive evaluation of
          {{ employeeData.first_name }}’s current professional profile—including
          age, educational background, years of experience, and present
          designation—the system has intelligently identified a set of targeted
          seminars. These recommendations are designed to strengthen existing
          capabilities, bridge skill gaps, and support long-term career
          advancement.
        </p>
      </div>

      <div v-if="predictionData?.eligible === 1">
        <!-- Recommended Seminars -->
        <div>
          <div class="text-left">
            <div class="flex flex-col mb-2">
              <h2 class="text-lg font-semibold text-gray-700">
                Recommended Seminars
              </h2>
              <div class="w-5 h-1 rounded-full bg-blue-900"></div>
            </div>

            <p class="text-sm text-gray-600 mb-4">
              Based on the employee’s background and designation, the following
              seminars have been selected.
            </p>
          </div>

          <div
            class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-left border p-4 rounded-md"
            v-if="predictionData?.recommended_seminars?.length"
          >
            <div
              class="border rounded-lg p-4 shadow-sm"
              v-for="(seminar, index) in predictionData.recommended_seminars"
              :key="index"
            >
              <h3 class="font-bold text-gray-700">{{ seminar }}</h3>
              <p class="text-sm text-gray-600">
                {{
                  seminarDescriptions[seminar] || "Description not available."
                }}
              </p>
            </div>
          </div>
        </div>
        <!-- Model Features Used -->
        <div class="mt-4">
          <div class="text-left">
            <div class="flex flex-col mb-2">
              <h2 class="text-lg font-semibold text-gray-700">
                Model Features Used
              </h2>
              <div class="w-5 h-1 rounded-full bg-blue-900"></div>
            </div>

            <p class="text-sm text-gray-600 mb-4">
              The system considers the following key features from the
              employee’s profile to make informed seminar recommendations.
            </p>
          </div>

          <!-- Change flex-wrap to flex-nowrap and remove w-full -->
          <div class="flex flex-row flex-nowrap gap-4 overflow-x-auto">
            <div class="border border-gray-200 rounded-md p-4 min-w-[250px]">
              <h3 class="text-md font-semibold text-gray-800">1. Age</h3>
              <p class="text-sm text-gray-600 mt-1">
                <strong>Type:</strong> Numerical<br />
                <strong>Meaning:</strong> Employee's current age<br />
                <strong>Use:</strong> May indicate maturity or background
                experience.
              </p>
            </div>

            <div class="border border-gray-200 rounded-md p-4 min-w-[250px]">
              <h3 class="text-md font-semibold text-gray-800">
                2. Educational Attainment
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                <strong>Type:</strong> Categorical (encoded)<br />
                <strong>Values:</strong> Elementary, Secondary, Vocational,
                College<br />
                <strong>Use:</strong> Higher education may qualify for more
                technical seminars.
              </p>
            </div>

            <div class="border border-gray-200 rounded-md p-4 min-w-[250px]">
              <h3 class="text-md font-semibold text-gray-800">
                3. Total Years of Experience
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                <strong>Type:</strong> Numerical<br />
                <strong>Meaning:</strong> Years worked across all jobs<br />
                <strong>Use:</strong> More experience may lead to advanced
                seminar recommendations.
              </p>
            </div>

            <div class="border border-gray-200 rounded-md p-4 min-w-[250px]">
              <h3 class="text-md font-semibold text-gray-800">
                4. Present Designation
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                <strong>Type:</strong> Categorical (encoded)<br />
                <strong>Values:</strong> Clerk, Officer, Analyst, Manager and
                more.<br />
                <strong>Use:</strong> Some designations may be prioritized for
                leadership training.
              </p>
            </div>
          </div>

          <div
            class="border border-gray-200 rounded-md p-4 mt-4 w-full text-left bg-green-100 mb-4"
          >
            <h3 class="text-md font-semibold text-gray-800">
              RandomForest Classification Model
            </h3>
            <p class="text-sm text-gray-600 mt-1">
              The system employs a Random Forest classification algorithm to
              analyze key employee attributes—such as age, education level,
              years of experience, and current designation—to predict the most
              suitable seminars for each individual. This ensemble learning
              method constructs multiple decision trees during training and
              aggregates their predictions by majority vote, enhancing both
              accuracy and robustness.
            </p>
            <p class="text-sm text-gray-600 mt-1">
              The model achieves an accuracy of
              <span class="font-bold">95%</span> , with a precision of
              <span class="font-bold">95%</span> and recall of
              <span class="font-bold">97%</span> for predicting eligible
              employees, indicating a strong ability to correctly identify those
              who qualify for seminars while minimizing false positives and
              false negatives. By capturing complex, non-linear relationships
              between features, the model delivers more precise and personalized
              seminar recommendations, ensuring employees are matched with
              seminars that best fit their profiles and career development
              needs.
            </p>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          class="max-w-xl mx-auto bg-red-50 border border-red-300 rounded-lg p-6 shadow-md flex flex-col space-y-4"
        >
          <div class="flex items-center space-x-3">
            <!-- Warning Icon -->
            <svg
              class="w-7 h-7 text-red-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12" y2="17" />
            </svg>
            <h3 class="text-red-700 font-semibold text-xl">
              {{ employeeData.first_name }} is not eligible for seminars.
            </h3>
          </div>

          <p class="text-red-600 text-base leading-relaxed">
            The employee does not meet the following eligibility criteria:
          </p>

          <ul
            class="list-decimal list-inside text-red-700 text-sm space-y-2 ml-4"
          >
            <li>Must be at least 21 years old.</li>
            <li>Must have completed secondary education or higher.</li>
            <li>Must have at least 2 years of relevant work experience.</li>
            <li>
              Must hold a designation eligible for seminars (e.g., Officer,
              Analyst, Manager).
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "viewSeminar",
  props: {
    selectedFirstName: {
      type: String,
      default: "",
    },
    selectedLastName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      employeeData: null,
      predictionData: null,
      loading: false,
      seminarDescriptions: {},
    };
  },
  methods: {
    toggleBack() {
      this.employeeData = false;
      this.$emit("back-to-table-seminar");
    },
    async fetchPredictiveData() {
      if (!this.selectedFirstName || !this.selectedLastName) {
        this.employeeData = null;
        this.predictionData = null;
        return;
      }

      this.loading = true;

      try {
        const response = await axios.get(
          "http://localhost:8000/predictive/fetch-and-predict"
        );

        console.log("Full API response:", response.data);

        const employees = response.data.employees || [];
        const predictions = response.data.predictions || [];

        const employee = employees.find(
          (item) =>
            item.first_name
              .toLowerCase()
              .includes(this.selectedFirstName.toLowerCase()) &&
            item.last_name
              .toLowerCase()
              .includes(this.selectedLastName.toLowerCase())
        );

        console.log("Matched employee:", employee);

        if (!employee) {
          this.employeeData = null;
          this.predictionData = null;
        } else {
          this.employeeData = employee;

          const prediction = predictions.find(
            (pred) =>
              pred.employee?.first_name === employee.first_name &&
              pred.employee?.last_name === employee.last_name
          );

          console.log("Matched prediction:", prediction);

          this.predictionData = prediction || null;
        }
      } catch (error) {
        console.error("Error fetching predictive data:", error);
        this.employeeData = null;
        this.predictionData = null;
      }

      // Show loading screen at least 2 seconds
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
  },
  mounted() {
    this.fetchPredictiveData();
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
