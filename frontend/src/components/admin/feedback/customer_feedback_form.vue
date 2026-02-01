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
            <!-- <div
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
            </div> -->

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
            This Client Satisfaction Measurement (CSM) tracks the client
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
              type="text"
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
          <!-- <span
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
          </span> -->
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
        controlNo: "N/A",
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
      searchOfficeQuery: "",
      showOfficeDropdown: false,
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
        "Municipal Business Permit and Licensing Section (MBPLS)",
        "General Services Office",
        "Human Resource Office",
        "Internal Audit Services Unit",
        "Legislative Department",
        "Municipal Disaster Risk Reduction and Management Office (MDRRMO)",
        "Municipal Agriculture Office (MAO)",
        "Municipal Administrator’s Office (MAO)",
        "Municipal Assessor’s Office (MASSO)",
        "Municipal Engineering Office (MEO)",
        "Municipal Information Office (MIO)",
        "Municipal Social Welfare and Development Office (MSWDO)",
        "Municipal Treasury Office (MTO)",
        "Municipal Planning and Development Office (MPDO)",
        "Municipal Health Office (MHO)",
        "Municipal Environment and Natural Resources Office (MENRO)",
        "Municipal Economic Enterprise Development Office (MEEDO)",
        "Municipal Accounting Office",
        "Municipal Budget Office",
        "Municipal Civil Registrar’s Office",
        "Municipal Anti-Drug Abuse Council",
      ],

      servicesByOffice: {
        "Municipal Business Permit and Licensing Section (MBPLS)": [
          "Mayor’s Permit for Business - New Application",
          "Mayor’s Permit for Business Renewal",
          "Business Permit Schedule of Fees",
        ],

        "General Services Office": [
          "Issuance of Acknowledgement Receipt for Equipment for Newly Acquired Properties",
          "Vehicle, Tables and Chairs, and Gym Scheduling Management",
          "Acceptance and Inspection of Delivered Supplies, Materials, and Equipment",
        ],

        "Human Resource Office": [
          "Acceptance of Job Application",
          "Application for Leave of Absence",
          "Clearance from Money and Property Accountabilities",
          "Service Record",
        ],

        "Internal Audit Services Unit": [
          "Request for Investigation, Review and/or Audit",
          "Preparatory Review, Investigation, and/or Audit of Requests",
          "Review, Investigation, and/or Audit of Request",
        ],

        "Legislative Department": [
          "Provision of Authenticated Copy of Ordinances, Resolutions, and Legislative Documents",
          "Provision of Services on the Quasi-Judicial Body and Related Legislative Actions",
        ],

        "Municipal Disaster Risk Reduction and Management Office (MDRRMO)": [
          "Data Request",
          "MDRRMO 24/7 Hotline",
          "Provision of Weather Forecast upon Request",
          "Request for Interview",
          "Review of Barangay Contingency Plan",
          "Review of Barangay Disaster Risk Reduction and Management Plan",
        ],

        "Municipal Agriculture Office (MAO)": [
          "Dog Anti-rabies Vaccination",
          "Livestock Shipping Permit",
          "Rice Production Services",
          "Municipal Agriculture Certification",
        ],

        "Municipal Administrator’s Office (MAO)": [
          "Request for Burial Assistance (Console Program)",
          "Request for Municipal Vehicle (External Clients)",
          "Provision of Medical Cash Assistance (MCAP)",
        ],

        "Municipal Assessor’s Office (MASSO)": [
          "Assessor’s Certification",
          "Cancellation of Tax Declaration (Building, Machinery, Double Declaration)",
          "Certificate of Land Holding",
          "Certificate of Land with Improvement",
          "Certificate of Land with No Improvement",
          "Certificate of No Property and Land Holding",
          "Certified True Copy of Tax Declaration",
          "New Discovery / Assessment of Real Property",
        ],

        "Municipal Engineering Office (MEO)": [
          "Building, Electrical and Mechanical Permit",
          "Certificate of Final Inspection",
          "Certificate of Occupancy",
        ],

        "Municipal Information Office (MIO)": [
          "Information Desk Assistance",
          "Receiving of Lost and Found Items",
          "Returning of Lost and Found Items",
          "Providing Information through Social Media",
          "Conducting Press Conference / Media Statement",
          "Answering Queries via Facebook and Email",
        ],

        "Municipal Social Welfare and Development Office (MSWDO)": [
          "AICS Medical Assistance",
          "AICS Burial Assistance",
          "Certificate of Travel for Minor",
          "Solo Parent Identification",
          "PWD Identification Card Registration and Issuance",
          "Senior Citizen Identification Card Registration",
          "Preparation of Social Case Study Report",
          "Provision of Referrals",
        ],

        "Municipal Treasury Office (MTO)": [
          "Collection of Local Taxes, Fees and Charges",
          "Community Tax Certificate",
          "Motorized Tricycle Operator’s Permit (MTOP)",
          "Payment of Real Property Tax",
          "Releasing of Claims and Payroll",
          "Tax Clearance",
        ],

        "Municipal Planning and Development Office (MPDO)": [
          "Processing and Approval of Zoning Certifications",
          "Processing of Locational Clearances",
        ],

        "Municipal Health Office (MHO)": [
          "Health Certificate Issuance",
          "Pre-Natal Examination",
          "Signing and Review of Death Certificate",
          "Laboratory Services",
          "Immunization Services",
          "Medical Certificate Issuance",
          "Medico-Legal Certification Issuance",
          "Sanitary Permit Issuance",
          "Provision of Family Planning Methods",
        ],

        "Municipal Environment and Natural Resources Office (MENRO)": [
          "Issuance of MENRO Certification / Clearances",
          "Garbage Collection Services",
          "Request for Tree Planting and Seeding",
          "Wildlife Rescue and Release",
        ],

        "Municipal Economic Enterprise Development Office (MEEDO)": [
          "Market Stall Awarding",
          "Rental Collection – Public Market",
          "Renewal of Contract of Lease",
          "Night Market and Tabo-Tabo Operation",
          "Collection of Parking and Departure Fee",
          "Slaughtering Operation",
        ],

        "Municipal Accounting Office": [
          "Processing of Claims for Payment (Employees)",
          "Processing of Claims for Payment (Suppliers and Utilities)",
          "Issuance of Accountant’s Advice",
          "Processing and Remittance of Employee Contributions and Loans",
        ],

        "Municipal Budget Office": [
          "Preliminary Review of Barangay Budget",
          "Processing of Obligation Requests",
        ],

        "Municipal Civil Registrar’s Office": [
          "Registration of Certificate of Live Birth",
          "Registration of Acknowledgement / Admission of Paternity",
          "Issuance of Marriage License",
          "Registration of Marriage Certificate",
          "Registration of Death Certificate",
          "Registration of Court Decrees",
          "Application of Legitimation",
          "Application of Supplemental Report",
          "RA 9048 / RA 10172",
        ],

        "Municipal Anti-Drug Abuse Council": [
          "Rehabilitation Referral Services",
          "Monitoring and Reporting",
          "Information and Consultation",
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
      feedbackSentimentScore: null,
      feedbackSentimentStatus: null,
      commonCommentSentimentScore: null,
      commonCommentSentimentLabel: null,
    };
  },
  watch: {
    "form.feedback"(newText) {
      if (newText.trim()) {
        const result = this.analyzeSentiment(newText);

        let sentimentLabel = "Neutral";
        if (result.score > 3) sentimentLabel = "Positive";
        else if (result.score < 0) sentimentLabel = "Negative";

        this.sentimentResult = {
          score: result.score,
          sentiment: sentimentLabel,
        };

        this.feedbackSentimentScore = result.score;
        this.feedbackSentimentStatus = sentimentLabel;
      } else {
        this.sentimentResult = null;
        this.feedbackSentimentScore = null;
        this.feedbackSentimentStatus = null;
      }
    },

    // "form.commonComment"(newText) {
    //   if (newText) {
    //     const result = this.analyzeSentiment(newText);

    //     // Optional: you can also categorize commonComment sentiment
    //     let commentSentiment = "Neutral";
    //     if (result.score > 3) commentSentiment = "Positive";
    //     else if (result.score < 0) commentSentiment = "Negative";

    //     this.commonCommentSentimentScore = result.score;
    //     this.commonCommentSentimentLabel = commentSentiment; // optional if you want to display
    //   } else {
    //     this.commonCommentSentimentScore = null;
    //     this.commonCommentSentimentLabel = null;
    //   }
    // },
    "form.commonComment"(newText) {
      if (!newText) {
        this.commonCommentSentimentScore = null;
        this.commonCommentSentimentLabel = null;
        return;
      }

      // Determine the label first based on predefined lists
      if (this.commonComments.Positive.includes(newText)) {
        this.commonCommentSentimentLabel = "Positive";
      } else if (this.commonComments.Neutral.includes(newText)) {
        this.commonCommentSentimentLabel = "Neutral";
      } else if (this.commonComments.Negative.includes(newText)) {
        this.commonCommentSentimentLabel = "Negative";
      } else {
        this.commonCommentSentimentLabel = null; // fallback
      }

      // Now analyze sentiment to get a meaningful score
      const result = this.analyzeSentiment(newText);
      this.commonCommentSentimentScore = result.score;

      // Optional: If you want, override label if it's not predefined
      if (!this.commonCommentSentimentLabel) {
        this.commonCommentSentimentLabel =
          result.score > 3
            ? "Positive"
            : result.score < 0
            ? "Negative"
            : "Neutral";
      }
    },
  },

  computed: {
    finalSentimentScore() {
      const mainScore = this.commonCommentSentimentScore ?? 0;
      const additionalScore = this.feedbackSentimentScore ?? 0;
      return mainScore + additionalScore; // you could also use (mainScore + additionalScore)/2
    },
    finalSentimentStatus() {
      const score = this.finalSentimentScore;

      if (score > 5) return "Positive"; // threshold can be adjusted
      else if (score < 0) return "Negative";
      else return "Neutral";
    },
    filteredOffices() {
      if (!this.searchOfficeQuery) return this.offices;
      return this.offices.filter((office) =>
        office.toLowerCase().includes(this.searchOfficeQuery.toLowerCase()),
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
          // ======================
          // NEGATIVE (strong)
          // ======================

          unclear: -6,
          delay: -6,
          delays: -6,
          rude: -7,
          unhelpful: -6,
          frustrating: -7,
          slow: -5,
          waiting: -4,
          long: -3,
          disorganized: -6,
          poor: -5,
          bad: -5,
          worst: -7,
          disappointed: -6,
          faced: -5,
          lacked: -6,
          overwhelming: -6,

          // Phrase helpers
          unclear_information: -7,
          long_waiting: -6,

          // ======================
          // POSITIVE (strong)
          // ======================
          helpful: 4,
          smooth: 4,
          fast: 4,
          polite: 4,
          courteous: 4,
          clean: 3,
          comfortable: 3,
          proactive: 4,
          satisfactory: 4,
          convenient: 4,

          // ======================
          // NEUTRAL (true two)
          // ======================
          confusing: 2,
          adequate: 2,
          acceptable: 2,
          average: 2,
          expectations: 2,
          expectation: 2,
          documentation: 2,
          technical: 2,
          information: 2,
          experience: 2,
          service: 2,
          facilities: 2,
          process: 2,
          staff: 2,
          office: 2,

          // ======================
          // SOFT CONTEXT WORDS
          // ======================
          assistance: -2, // only mildly negative by itself
          behavior: -3, // neutral unless paired with rude
        },
      };

      return sentiment.analyze(text.toLowerCase(), options);
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

        // individual sentiments
        sentiment_status: this.commonCommentSentimentLabel || null,
        sentiment_score: this.commonCommentSentimentScore ?? 0,
        additional_sentiment_status: this.feedbackSentimentStatus || "Neutral",
        additional_sentiment_score: this.feedbackSentimentScore ?? 0,

        // ✅ final combined sentiment
        final_sentiment_status: this.finalSentimentStatus,
        final_sentiment_score: this.finalSentimentScore,

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
        .then(() => {
          toast.success("Feedback submitted successfully!");
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
        controlNo: "N/A",
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
