<template>
  <div
    class="relative flex justify-center items-start min-h-screen p-4 sm:p-6 lg:p-10"
  >
    <!-- Background image -->
    <img
      src="../../../assets/img/hr-bg.png"
      alt="Background"
      class="absolute inset-0 object-cover w-full h-full z-0 opacity-95"
    />

    <!-- Content wrapper -->
    <div
      class="relative z-10 p-4 sm:p-6 bg-white w-full max-w-6xl rounded-lg shadow"
    >
      <div class="border p-4 sm:p-6 rounded-lg bg-white">
        <!-- Row 1 -->
        <div class="flex flex-col lg:flex-row justify-between gap-6 mb-6">
          <!-- Left Top Section -->
          <div class="flex-1 grid gap-4 text-left">
            <!-- Office -->
            <div
              class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 relative"
            >
              <label class="sm:w-28 text-sm font-medium text-gray-700"
                >Office</label
              >
              <input
                v-model="searchOfficeQuery"
                type="text"
                placeholder="Search office..."
                class="flex-1 border rounded-md p-2 text-sm w-full focus:outline-none"
                :class="
                  errors.office
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-gray-300'
                "
                @focus="showOfficeDropdown = true"
                required
              />

              <div
                v-if="showOfficeDropdown && filteredOffices.length"
                class="absolute sm:left-[7.2rem] sm:top-[2.8rem] left-0 top-full mt-1 w-full sm:w-[calc(100%-7.5rem)] bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto z-10"
                @mouseleave="showOfficeDropdown = false"
              >
                <div
                  v-for="(office, index) in filteredOffices"
                  :key="index"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  @mousedown="selectOffice(office)"
                >
                  {{ office }}
                </div>
              </div>
            </div>

            <!-- Control No. -->
            <div
              class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
            >
              <label class="sm:w-28 text-sm font-medium text-gray-700"
                >Control No.</label
              >
              <input
                v-model="form.controlNo"
                type="text"
                placeholder="Enter control no."
                class="flex-1 rounded-md p-2 text-sm w-full focus:outline-none border"
                :class="
                  errors.controlNo
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-gray-300'
                "
              />
            </div>

            <!-- Time of Visit -->
            <div
              class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
            >
              <label class="sm:w-28 text-sm font-medium text-gray-700"
                >Time of Visit</label
              >
              <input
                type="time"
                v-model="form.timeOfVisit"
                class="flex-1 rounded-md p-2 text-sm w-full focus:outline-none border"
                :class="
                  errors.timeOfVisit
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-gray-300'
                "
              />
            </div>
          </div>

          <!-- Center Top Section -->
          <div class="flex flex-col items-center justify-center flex-1">
            <img
              src="@/assets/img/dujali-logo.png"
              alt="Logo"
              class="h-20 w-20 sm:h-28 sm:w-28 mb-2"
            />
          </div>

          <!-- Right Top Section -->
          <div
            class="flex-1 border rounded-md uppercase flex items-center justify-center text-center p-2 break-words text-xs sm:text-sm"
          >
            Anti-red tape authority client satisfaction measurement form
          </div>
        </div>

        <!-- Row 2 -->
        <div>
          <h1 class="uppercase font-bold underline mb-2">
            Help us to serve you better !
          </h1>
        </div>
        <div>
          <p class="mb-6 text-justify">
            This Client Satisfaction Measurement (CSM) tracks the customer
            experience of government offices. Your feedback on your concluded
            transaction will help this Office provide a better service. Personal
            information shared will be kept confidential.
          </p>
        </div>

        <!-- Client Info -->
        <div class="grid grid-cols-1 space-y-4 gap-3 text-left">
          <!-- Client Type -->
          <div class="flex flex-col sm:flex-row sm:items-start gap-4">
            <label class="sm:w-32 text-sm font-medium text-gray-700">
              Client Type:
            </label>

            <div
              :class="
                errors.clientType ? 'border border-red-500 p-2 rounded-md' : ''
              "
              class="flex flex-col sm:flex-row flex-wrap gap-3"
            >
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="form.clientType"
                  value="Citizen"
                  class="form-radio"
                />
                <span class="ml-2 text-sm text-gray-700">Citizen</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="form.clientType"
                  value="Businessman"
                  class="form-radio"
                />
                <span class="ml-2 text-sm text-gray-700">Businessman</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="form.clientType"
                  value="Government Employee"
                  class="form-radio"
                />
                <span class="ml-2 text-sm text-gray-700"
                  >Government Employee</span
                >
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="form.clientType"
                  value="Company Employee"
                  class="form-radio"
                />
                <span class="ml-2 text-sm text-gray-700">Company Employee</span>
              </label>
            </div>
          </div>

          <!-- Sex -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <label class="sm:w-32 text-sm font-medium text-gray-700"
              >Sex:</label
            >
            <div
              class="flex flex-col sm:flex-row gap-3"
              :class="errors.sex ? 'border border-red-500 p-2 rounded-md' : ''"
            >
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="form.sex"
                  value="Male"
                  class="form-radio"
                />
                <span class="ml-2 text-sm text-gray-700">Male</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="form.sex"
                  value="Female"
                  class="form-radio"
                />
                <span class="ml-2 text-sm text-gray-700">Female</span>
              </label>
            </div>
          </div>

          <!-- Age -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <label class="sm:w-32 text-sm font-medium text-gray-700"
              >Age:</label
            >

            <input
              type="number"
              v-model="form.age"
              placeholder="Enter age"
              class="w-full sm:w-32 rounded-md p-2 text-sm focus:outline-none border"
              :class="
                errors.age
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-300'
              "
            />
          </div>
        </div>

        <!-- Service Availed & Residence -->
        <div class="grid grid-cols-1 text-left gap-4 mb-6 mt-4">
          <!-- Service Availed -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Service Availed
            </label>
            <select
              v-model="form.serviceAvailed"
              class="w-full rounded-md p-2 text-sm focus:outline-none border"
              :class="
                errors.serviceAvailed
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-300'
              "
            >
              <option disabled value="">-- Select a service --</option>
              <option
                v-for="(service, index) in availableServices"
                :key="index"
                :value="service"
              >
                {{ service }}
              </option>
            </select>
          </div>

          <!-- Residence -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Residence ( Municipality and Province Only ):
            </label>
            <input
              type="text"
              v-model="form.municipality"
              placeholder="Enter municipality"
              class="w-full border border-gray-300 rounded-md p-2 text-sm"
              :class="
                errors.municipality
                  ? 'border-red-500 ring-1 ring-red-500'
                  : 'border-gray-300'
              "
            />
          </div>
        </div>

        <!-- Dynamic Questions Section -->
        <div class="mb-6">
          <h2 class="text-sm text-justify mb-4">
            <span class="font-semibold">INSTRUCTIONS:</span> Please check
            <span class="font-semibold">/</span> mark on your answer to the
            Citizen's Charter (CC) questions.
          </h2>

          <div
            v-for="(question, index) in questions"
            :key="index"
            class="mb-6 p-2 rounded-md"
            :class="errors['answer' + index] ? 'border border-red-500' : ''"
          >
            <label
              class="block mb-2 text-sm text-left font-medium text-gray-700"
            >
              Q{{ index + 1 }}. {{ question.text }}
            </label>
            <div
              :class="[
                'ml-2 gap-2',
                index === 1 || index === 2
                  ? 'grid grid-cols-1 sm:grid-cols-2 gap-2'
                  : 'flex flex-col space-y-2',
              ]"
            >
              <label
                v-for="(choice, cIndex) in question.choices"
                :key="cIndex"
                class="flex items-start gap-2"
              >
                <input
                  type="radio"
                  :name="'q' + (index + 1)"
                  :value="choice.value"
                  v-model="form.answers[index]"
                  class="mt-1"
                />
                <span>{{ choice.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Likert Questions -->
        <div class="mb-6">
          <h2 class="text-sm text-justify mb-4">
            <span class="font-semibold">INSTRUCTIONS:</span> Please put a check
            <span class="font-semibold">CHECK /</span> on the column that best
            corresponds to your answer.
          </h2>

          <div
            class="overflow-x-auto"
            :class="
              Object.keys(errors).some((key) => key.startsWith('likert'))
                ? 'border border-red-500 rounded-md'
                : ''
            "
          >
            <table
              class="w-full border border-gray-300 text-sm text-center min-w-[800px] table-fixed"
            >
              <thead>
                <tr class="bg-gray-100">
                  <!-- Questions Column -->
                  <th
                    class="border border-gray-300 px-4 py-2 text-left w-[250px]"
                  >
                    Questions
                  </th>

                  <!-- Likert Choices -->
                  <th
                    v-for="choice in likertChoices"
                    :key="choice.value"
                    class="border border-gray-300 px-2 py-2 w-[120px] align-top"
                  >
                    <div
                      class="flex flex-col items-center justify-start text-center gap-2 h-full"
                    >
                      <icon :name="choice.icon" class="text-gray-700" />
                      <span class="text-xs font-bold mt-2">{{
                        choice.label
                      }}</span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="(question, index) in likertQuestions"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <!-- Question Text -->
                  <td class="border border-gray-300 px-4 py-2 text-left">
                    {{ question.text }}
                  </td>

                  <!-- Answer Options -->
                  <td
                    v-for="(choice, cIndex) in likertChoices"
                    :key="cIndex"
                    class="border border-gray-300 px-2 py-2 w-[120px] text-center"
                  >
                    <input
                      type="radio"
                      :name="'likert' + index"
                      :value="choice.value"
                      v-model="form.likertAnswers[index]"
                      class="cursor-pointer"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Optional Error Message -->
          <div
            v-if="Object.keys(errors).some((key) => key.startsWith('likert'))"
            class="text-red-500 text-sm mt-2"
          >
            Please answer all scale questions.
          </div>
        </div>
      </div>
      <!-- Open Feedback -->

      <!-- Predefined Common Comments -->
      <div class="mt-6">
        <label class="block text-sm text-left font-medium text-gray-700 mb-1">
          Select Comment:
        </label>
        <select
          v-model="form.commonComment"
          class="w-full rounded-md p-2 text-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 border"
          :class="
            errors.commonComment
              ? 'border-red-500 ring-1 ring-red-500'
              : 'border-gray-300'
          "
          @change="updateFeedbackFromCommonComment"
        >
          <option disabled value="">-- Select a comment --</option>

          <!-- Positive Comments -->
          <optgroup label="Positive">
            <option
              v-for="(comment, index) in commonComments.Positive"
              :key="'pos-' + index"
              :value="comment"
            >
              {{ comment }}
            </option>
          </optgroup>

          <!-- Neutral Comments -->
          <optgroup label="Neutral">
            <option
              v-for="(comment, index) in commonComments.Neutral"
              :key="'neu-' + index"
              :value="comment"
            >
              {{ comment }}
            </option>
          </optgroup>

          <!-- Negative Comments -->
          <optgroup label="Negative">
            <option
              v-for="(comment, index) in commonComments.Negative"
              :key="'neg-' + index"
              :value="comment"
            >
              {{ comment }}
            </option>
          </optgroup>
        </select>
      </div>

      <!-- Open Feedback -->
      <div class="mt-4">
        <label class="block text-sm text-left font-medium text-gray-700 mb-1">
          Additional Comments / Suggestions:
        </label>
        <textarea
          v-model="form.feedback"
          placeholder="Write your feedback here..."
          class="w-full border border-gray-300 rounded-md p-2 text-sm"
          rows="4"
        ></textarea>

        <!-- Live Sentiment Result -->
        <div v-if="sentimentResult" class="mt-2 text-sm">
          <span
            :class="{
              'text-green-600 font-semibold':
                sentimentResult.sentiment === 'Positive',
              'text-red-600 font-semibold':
                sentimentResult.sentiment === 'Negative',
              'text-gray-600 font-semibold':
                sentimentResult.sentiment === 'Neutral',
            }"
          >
            Sentiment: {{ sentimentResult.sentiment }} (Score:
            {{ sentimentResult.score }})
          </span>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-right mt-4">
        <button
          @click="submitForm"
          class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Sentiment from "sentiment";
import icon from "@/assets/icon.vue";
import { toast } from "vue3-toastify";
export default {
  name: "CustomerFeedbackForm",
  components: { icon },
  data() {
    return {
      form: {
        office: "",
        controlNo: "",
        timeOfVisit: "",
        clientType: "",
        sex: "",
        age: "",
        serviceAvailed: "",
        municipality: "",
        answers: [],
        likertAnswers: [],
        feedback: "",
        commonComment: "",
      },
      errors: {},

      // ✅ same data as before
      questions: [
        {
          text: "Which of the following best describes your awareness of a Citizen's Charter?",
          choices: [
            {
              value: "1",
              label:
                "1. I know what a Citizen's Charter is and I saw this office's Citizen's Charter.",
            },
            {
              value: "2",
              label:
                "2. I know what a Citizen's Charter is but I did NOT see this office's Citizen's Charter.",
            },
            {
              value: "3",
              label:
                "3. I learned of the Citizen's Charter only when I saw the office's Citizen's Charter.",
            },
            {
              value: "4",
              label:
                "4. I do not know what a Citizen's Charter is and I did NOT see one in this office.",
            },
          ],
        },
        {
          text: "What you say that the Citizen's Charter of this office was ...?",
          choices: [
            { value: "1", label: "1. Easy to see" },
            { value: "2", label: "2. Somewhat to see" },
            { value: "3", label: "3. Difficult to see" },
            { value: "4", label: "4. Not visible at all" },
            { value: "5", label: "5. N/A" },
          ],
        },
        {
          text: "How much did the Citizen's Charter help you in your transaction?",
          choices: [
            { value: "1", label: "1. Helped very much" },
            { value: "2", label: "2. Somewhat helped" },
            { value: "3", label: "3. Did not help" },
            { value: "4", label: "4. N/A" },
          ],
        },
      ],
      likertQuestions: [
        { text: "The staff were courteous and respectful." },
        { text: "The service was delivered in a timely manner." },
        { text: "The requirements and procedures were clear." },
        { text: "The facilities were clean and accessible." },
        { text: "Overall, I am satisfied with the service." },
      ],
      likertChoices: [
        { value: "1", label: "Strongly Disagree", icon: "strongly-disagree" },
        { value: "2", label: "Disagree", icon: "disagree" },
        { value: "3", label: "Neither Agree nor Disagree", icon: "neutral" },
        { value: "4", label: "Agree", icon: "agree" },
        { value: "5", label: "Strongly Agree", icon: "strongly-agree" },
        { value: "6", label: "N/A", icon: "na" },
      ],

      offices: [
        "Mayor's Office",
        "Municipal Treasurer’s Office",
        "Municipal Assessor’s Office",
        "Municipal Civil Registrar",
        "Municipal Health Office",
        "Municipal Agriculture Office",
        "Municipal Social Welfare and Development Office",
        "Municipal Engineering Office",
        "Municipal Planning and Development Office",
        "Municipal Budget Office",
        "Municipal Accountant’s Office",
      ],
      searchOfficeQuery: "",
      showOfficeDropdown: false,
      servicesByOffice: {
        "Mayor's Office": [
          "Issuance of Mayor’s Permit",
          "Barangay Certification Assistance",
          "Executive Order Requests",
        ],
        "Municipal Treasurer’s Office": [
          "Payment of Real Property Tax",
          "Payment of Business Tax",
          "Issuance of Official Receipts",
          "Assessment of Taxes and Fees",
        ],
        "Municipal Assessor’s Office": [
          "Issuance of Tax Declaration",
          "Assessment of Real Property",
          "Certification of Assessed Value",
        ],
        "Municipal Civil Registrar": [
          "Issuance of Birth Certificate",
          "Issuance of Marriage Certificate",
          "Issuance of Death Certificate",
          "Correction of Entries",
        ],
        "Municipal Health Office": [
          "Medical Consultation",
          "Issuance of Medical Certificate",
          "Vaccination Services",
          "Sanitation Permit",
        ],
        "Municipal Agriculture Office": [
          "Distribution of Seeds and Fertilizers",
          "Fisheries Assistance",
          "Livestock Vaccination",
          "Farmer Training Program",
        ],
        "Municipal Social Welfare and Development Office": [
          "Assistance to Individuals in Crisis Situation (AICS)",
          "Issuance of Certification for 4Ps",
          "Senior Citizen ID Processing",
          "Disaster Relief Assistance",
        ],
        "Municipal Engineering Office": [
          "Building Permit Application",
          "Occupancy Permit Application",
          "Infrastructure Project Inspection",
        ],
        "Municipal Planning and Development Office": [
          "Zoning Certification",
          "Barangay Development Plan Assistance",
          "Local Investment Plan Endorsement",
        ],
        "Municipal Budget Office": [
          "Issuance of Budget Certification",
          "Review of Barangay Budgets",
          "Preparation of Annual Budget",
        ],
        "Municipal Accountant’s Office": [
          "Issuance of Certification of No Pending Obligation",
          "Verification of Financial Statements",
          "Processing of Disbursement Vouchers",
        ],
      },
      commonComments: {
        Positive: [
          "Staff were very helpful",
          "Process was smooth and fast",
          "Office facilities were clean",
          "Waiting area was comfortable",
          "Forms and requirements were easy to understand",
          "Staff were polite and courteous",
          "Received assistance promptly",
          "Staff explained procedures clearly",
          "Service hours were convenient",
          "Staff were proactive in helping",
        ],
        Neutral: [
          "Transaction process was confusing",
          "Information was unclear",
          "Documentation process was straightforward",
          "Encountered long queues",
          "Encountered technical issues",
          "The process met my expectations",
          "Service delivery was average",
          "Staff performance was acceptable",
          "Facilities were adequate",
          "Overall experience was neither good nor bad",
        ],
        Negative: [
          "Faced delays in service",
          "Staff lacked knowledge about procedures",
          "Encountered rude behavior from staff",
          "Transaction was disorganized",
          "Instructions were unclear",
          "Waiting time was too long",
          "Paperwork was overwhelming",
          "Process was frustrating",
          "Did not receive proper assistance",
          "Overall service was poor",
        ],
      },
      sentimentResult: null,
    };
  },
  watch: {
    "form.feedback"(newText) {
      if (newText.trim()) {
        const result = this.analyzeSentiment(newText);
        this.sentimentResult = {
          score: result.score,
          sentiment:
            result.score > 0
              ? "Positive"
              : result.score < 0
              ? "Negative"
              : "Neutral",
        };
      } else {
        this.sentimentResult = null;
      }
    },
  },
  computed: {
    filteredOffices() {
      if (!this.searchOfficeQuery) return this.offices;
      return this.offices.filter((office) =>
        office.toLowerCase().includes(this.searchOfficeQuery.toLowerCase())
      );
    },
    availableServices() {
      return this.servicesByOffice[this.form.office] || [];
    },
    availableComments() {
      if (!this.sentimentResult) return [];
      return this.commonComments[this.sentimentResult.sentiment] || [];
    },
  },
  methods: {
    selectOffice(office) {
      this.form.office = office;
      this.searchOfficeQuery = office;
      this.showOfficeDropdown = false;
      this.form.serviceAvailed = "";
    },
    analyzeSentiment(text) {
      const sentiment = new Sentiment();
      const options = {
        extras: {
          confusing: -2,
          unclear: -1,
          delay: -2,
          rude: -3,
          unhelpful: -2,
          helpful: 2,
          smooth: 2,
          fast: 2,
          polite: 2,
          courteous: 2,
          clean: 1,
          comfortable: 1,
          proactive: 2,
          satisfactory: 2,
          convenient: 2,
        },
      };
      return sentiment.analyze(text.toLowerCase(), options);
    },
    updateFeedbackFromCommonComment() {
      console.log("Selected comment:", this.form.commonComment);
    },
    validateForm() {
      this.errors = {};

      if (!this.form.office) this.errors.office = "Office is required";
      if (!this.form.controlNo)
        this.errors.controlNo = "Control No. is required";
      if (!this.form.timeOfVisit)
        this.errors.timeOfVisit = "Time of visit is required";
      if (!this.form.clientType)
        this.errors.clientType = "Client type is required";
      if (!this.form.sex) this.errors.sex = "Sex is required";
      if (!this.form.age) this.errors.age = "Age is required";
      if (!this.form.serviceAvailed)
        this.errors.serviceAvailed = "Service Availed is required";
      if (!this.form.municipality)
        this.errors.municipality = "Municipality is required";

      this.questions.forEach((_, i) => {
        if (!this.form.answers[i]) {
          this.errors[`answer${i}`] = `Question ${i + 1} is required`;
        }
      });

      this.likertQuestions.forEach((_, i) => {
        if (!this.form.likertAnswers[i]) {
          this.errors[`likert${i}`] = `Likert Question ${i + 1} is required`;
        }
      });

      return Object.keys(this.errors).length === 0;
    },
    submitForm() {
      if (!this.validateForm()) {
        toast.error("Please fill out all required fields before submitting");
        return;
      }

      let finalFeedback = this.form.feedback.trim();
      if (this.form.commonComment) {
        finalFeedback = finalFeedback
          ? this.form.commonComment + ". " + finalFeedback
          : this.form.commonComment;
      }

      if (finalFeedback) {
        const result = this.analyzeSentiment(finalFeedback);
        this.sentimentResult = {
          score: result.score,
          sentiment:
            result.score > 0
              ? "Positive"
              : result.score < 0
              ? "Negative"
              : "Neutral",
        };
      }

      const payload = {
        office: this.form.office,
        controlNo: this.form.controlNo,
        timeOfVisit: this.form.timeOfVisit,
        clientType: this.form.clientType,
        sex: this.form.sex,
        age: this.form.age,
        serviceAvailed: this.form.serviceAvailed,
        municipality: this.form.municipality,
        feedback: finalFeedback,
        commonComment: this.form.commonComment || null,
        sentiment: this.sentimentResult?.sentiment || null,
        sentimentScore: this.sentimentResult?.score || 0,
        answers: this.form.answers.map((value, index) => ({
          question: this.questions[index].text,
          value,
        })),
        likertAnswers: this.form.likertAnswers.map((value, index) => ({
          question: this.likertQuestions[index].text,
          value,
        })),
      };

      console.log("Submitting payload:", payload);

      fetch(process.env.VUE_APP_API_BASE_URL + "/customer-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Server response:", data);
          alert("Feedback submitted successfully!");
          this.resetForm();
        })
        .catch((err) => {
          console.error("Error submitting feedback:", err);
          alert("Something went wrong. Please try again.");
        });
    },
    resetForm() {
      this.form = {
        office: "",
        controlNo: "",
        timeOfVisit: "",
        clientType: "",
        sex: "",
        age: "",
        serviceAvailed: "",
        municipality: "",
        answers: [],
        likertAnswers: [],
        feedback: "",
        commonComment: "",
      };
      this.searchOfficeQuery = "";
      this.sentimentResult = null;
      this.errors = {};
    },
  },
};
</script>

<style scoped>
/* Optional: extra styling */
</style>
