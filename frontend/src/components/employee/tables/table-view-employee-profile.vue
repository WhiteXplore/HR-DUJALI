<template>
  <div>
    <div class="flex w-full items-start gap-5">
      <!-- Sidebar -->

      <!-- Right Section -->
      <div class="flex flex-col flex-1">
        <!-- Tabs -->
        <div class="flex justify-between items-center bg-white shadow-sm py-3">
          <div class="flex gap-5 text-gray-700 font-semibold text-[14px]">
            <div
              @click="toggleSection('personal')"
              :class="{
                'text-blue-500 hover:text-red-900 border-b-2 pb-1 border-blue-500':
                  activeSection === 'personal',
              }"
              class="cursor-pointer"
            >
              PERSONAL INFORMATION
            </div>
            <div
              @click="toggleSection('address')"
              :class="{
                'text-blue-500 hover:text-red-900 border-b-2 pb-1 border-blue-500':
                  activeSection === 'address',
              }"
              class="cursor-pointer"
            >
              ADDRESS
            </div>
            <div
              @click="toggleSection('education')"
              :class="{
                'text-blue-500 hover:text-red-900 border-b-2 pb-1 border-blue-500':
                  activeSection === 'education',
              }"
              class="cursor-pointer"
            >
              EDUCATIONAL BACKGROUND
            </div>
            <div
              @click="toggleSection('civil')"
              :class="{
                'text-blue-500 hover:text-red-900 border-b-2 pb-1 border-blue-500':
                  activeSection === 'civil',
              }"
              class="cursor-pointer"
            >
              CIVIL SERVICE ELIGIBILITY
            </div>
            <div
              @click="toggleSection('learning')"
              :class="{
                'text-blue-500 hover:text-red-900 border-b-2 pb-1 border-blue-500':
                  activeSection === 'learning',
              }"
              class="cursor-pointer"
            >
              LEARNING AND DEVELOPMENT
            </div>
            <div
              @click="toggleSection('others')"
              :class="{
                'text-blue-500 hover:text-red-900 border-b-2 pb-1 border-blue-500':
                  activeSection === 'others',
              }"
              class="cursor-pointer"
            >
              OTHER INFORMATION
            </div>
          </div>
          <!-- Back Button -->
          <div class="flex justify-start" @click="toggleEdit(matchingRecord)">
            <div
              class="cursor-pointer flex gap-2 items-center tracking-wider bg-green-500 text-white text-sm hover:text-green-700 p-3 py-2 rounded-xl hover:bg-white border hover:border-green-900 hover:shadow-lg transition-all duration-300"
            >
              Edit
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <!-- Personal Information  -->
        <div
          v-if="activeSection === 'personal'"
          class="overflow-y-auto max-h-[770px] text-left py-4"
        >
          <div v-if="matchingRecord" class="grid grid-cols-2 gap-6 mt-4">
            <div
              v-for="(persionLabel, key) in personalFields"
              :key="key"
              :class="{ 'col-span-2': key === 'agency' }"
            >
              <p class="text-gray-600 text-sm font-semibold">
                {{ persionLabel }}:
              </p>
              <p
                class="text-gray-900 text-[15px] mt-1 bg-gray-50 rounded-lg px-2 py-3 border border-gray-100"
              >
                {{ formatField(matchingRecord[key], key) }}
              </p>
            </div>
          </div>

          <div v-else class="text-center text-gray-500 mt-10">
            No data available! Please click
            <span class="text-blue-900 font-bold">"Edit Button"</span>.
          </div>
        </div>

        <!-- Address  -->
        <div
          v-if="activeSection === 'address'"
          class="overflow-y-auto max-h-[700px] space-y-6 text-left py-4"
        >
          <template v-if="matchingRecord">
            <!-- Residential Address -->
            <div>
              <h1 class="text-lg font-bold text-gray-600">
                Residential Address
              </h1>
              <div class="grid grid-cols-2 gap-6 mt-4">
                <div
                  v-for="(label, key) in addressResidentFields"
                  :key="key"
                  :class="{ 'col-span-2': key === 'zip_code' }"
                  class="flex flex-col"
                >
                  <p class="text-gray-600 text-sm font-semibold mb-1">
                    {{ label }}:
                  </p>
                  <p
                    class="text-gray-900 text-[15px] bg-gray-50 rounded-lg px-2 py-3 border border-gray-100"
                  >
                    {{ formatField(matchingRecord[key], key) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Permanent Address -->
            <div>
              <h1 class="text-lg font-bold text-gray-600">Permanent Address</h1>
              <div class="grid grid-cols-2 gap-6 mt-4">
                <div
                  v-for="(label, key) in addressPermanentFields"
                  :key="key"
                  :class="{ 'col-span-2': key === 'same_zip_code' }"
                  class="flex flex-col"
                >
                  <p class="text-gray-600 text-sm font-semibold mb-1">
                    {{ label }}:
                  </p>
                  <p
                    class="text-gray-900 text-[15px] bg-gray-50 rounded-lg px-2 py-3 border border-gray-100"
                  >
                    {{ formatField(matchingRecord[key], key) }}
                  </p>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div
              class="text-center text-gray-500 py-6 border rounded-lg bg-gray-50"
            >
              No data available! Please click
              <span class="text-blue-900 font-bold">"Edit Button"</span>.
            </div>
          </template>
        </div>

        <!-- Education  -->
        <div
          v-if="activeSection === 'education'"
          class="overflow-y-auto max-h-[700px] space-y-3 text-center mt-5"
        >
          <div v-if="matchingRecord" class="text-gray-900 w-full rounded-md">
            <div class="overflow-x-auto rounded-t-xl">
              <table class="min-w-full text-[14px] border border-gray-300">
                <thead class="bg-blue-500 text-white">
                  <tr>
                    <th class="border px-2 py-2" rowspan="2">LEVEL</th>
                    <th class="border px-2 py-2" rowspan="2">
                      NAME OF SCHOOL (Write in full)
                    </th>
                    <th class="border px-2 py-2" rowspan="2">
                      BASIC EDUCATION/DEGREE/COURSE
                    </th>
                    <th class="border px-2 py-2" colspan="2">PERIOD</th>
                    <th class="border px-2 py-2" rowspan="2">
                      HIGHEST LEVEL/UNIT HEADS (If not graduated)
                    </th>
                    <th class="border px-2 py-2" rowspan="2">YEAR GRADUATED</th>
                    <th class="border px-2 py-2" rowspan="2">
                      SCHOLARSHIP/ACADEMIC scholarship RECEIVED
                    </th>
                  </tr>
                  <tr>
                    <th class="border px-3 py-2">FROM</th>
                    <th class="border px-3 py-2">TO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(entry, index) in matchingRecord.secondTable"
                    :key="index"
                  >
                    <td class="border px-2 py-2">{{ entry.level }}</td>
                    <td class="border px-2 py-2">{{ entry.name_of_school }}</td>
                    <td class="border px-2 py-2">
                      {{ entry.basic_education }}
                    </td>
                    <td class="border px-2 py-2">{{ entry.educ_from }}</td>
                    <td class="border px-2 py-2">{{ entry.educ_to }}</td>
                    <td class="border px-2 py-2">{{ entry.highest_level }}</td>
                    <td class="border px-2 py-2">{{ entry.year_graduated }}</td>
                    <td class="border px-2 py-2">{{ entry.scholarship }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 mt-10">
            No data available! Please click
            <span class="text-blue-900 font-bold">"Edit Button"</span>.
          </div>
        </div>

        <!-- Civil Service  -->
        <div
          v-if="activeSection === 'civil'"
          class="overflow-y-auto max-h-[700px] space-y-3 text-center mt-5"
        >
          <div v-if="matchingRecord" class="text-gray-900 w-full rounded-md">
            <div class="overflow-x-auto rounded-t-xl">
              <table class="min-w-full text-[14px] border border-gray-300">
                <thead class="bg-blue-500 text-white">
                  <tr>
                    <th class="border px-2 py-2" rowspan="2">
                      CARREER SERVICE/ RA 1080 (BOARD/BAR) UNDER SPECIAL LAWS/
                      CES/ CSEE/ BARANGAY ELIGIBILITY/ DRIVERS LISCENNSE
                    </th>
                    <th class="border px-2 py-2" rowspan="2">
                      RATING (If Applicable)
                    </th>
                    <th class="border px-2 py-2" rowspan="2">
                      DATE OF EXAMINATION/ CONFERMENT
                    </th>
                    <th class="border px-2 py-2" rowspan="2">
                      PLACE OF EXAMINATION / CONDERMENT
                    </th>
                    <th class="border px-2 py-2" colspan="2">
                      LISCENSE (If applicable)
                    </th>
                  </tr>
                  <tr>
                    <th class="border px-3 py-2">Number</th>
                    <th class="border px-3 py-2">Date of Validity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(civil, index) in matchingRecord.fourthTable"
                    :key="index"
                  >
                    <td class="border px-2 py-2">{{ civil.career_service }}</td>
                    <td class="border px-2 py-2">{{ civil.rating }}</td>
                    <td class="border px-2 py-2">{{ civil.date_of_exam }}</td>
                    <td class="border px-2 py-2">{{ civil.place_of_exam }}</td>
                    <td class="border px-2 py-2">{{ civil.license_number }}</td>
                    <td class="border px-2 py-2">
                      {{ civil.license_validity }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 mt-10">
            No data available! Please click
            <span class="text-blue-900 font-bold">"Edit Button"</span>.
          </div>
        </div>

        <!-- Learning Development  -->
        <div
          v-if="activeSection === 'learning'"
          class="overflow-y-auto max-h-[700px] space-y-3 text-center mt-5"
        >
          <div v-if="matchingRecord" class="text-gray-900 w-full rounded-md">
            <div class="overflow-x-auto rounded-t-xl">
              <table class="min-w-full text-[14px] border border-gray-300">
                <thead class="bg-blue-500 text-white">
                  <tr>
                    <th class="border px-2 py-2" rowspan="2">
                      TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS PROGRAMS
                      (Write in full)
                    </th>
                    <th class="border px-2 py-2" colspan="2">
                      INCLUSIVE DATES OF ATTENDANCE (mm/dd/yyyy)
                    </th>
                    <th class="border px-2 py-2" rowspan="2">
                      NUMBER OF HOURS
                    </th>

                    <th class="border px-2 py-2" rowspan="2">
                      Type of LD (Mangerial/Supervisory/Technical/etc)
                    </th>
                    <th class="border px-2 py-2" rowspan="2">
                      CONDUCTED SPONSORED BY (Write in full)
                    </th>
                  </tr>
                  <tr>
                    <th class="border px-3 py-2">FROM</th>
                    <th class="border px-3 py-2">TO</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(learning, index) in sortedLearningRecords"
                    :key="index"
                  >
                    <td class="border px-2 py-2">
                      {{ learning.title_learning_development }}
                    </td>
                    <td class="border px-2 py-2">
                      {{ formatDate(learning.ld_from) }}
                    </td>
                    <td class="border px-2 py-2">
                      {{ formatDate(learning.ld_to) }}
                    </td>

                    <td class="border px-2 py-2">
                      {{ learning.ld_number_of_hours }}
                    </td>

                    <td class="border px-2 py-2">
                      {{ learning.type_of_ld }}
                    </td>

                    <td class="border px-2 py-2">
                      {{ learning.ld_conducted_sponsor }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 mt-10">
            No data available! Please click
            <span class="text-blue-900 font-bold">"Edit Button"</span>.
          </div>
        </div>

        <!-- Other Information  -->
        <div
          v-if="activeSection === 'others'"
          class="overflow-y-auto max-h-[700px] space-y-10 text-center mt-5"
        >
          <div v-if="matchingRecord" class="text-gray-900 w-full rounded-md">
            <div class="overflow-x-auto rounded-t-xl">
              <table class="min-w-full text-[14px] border border-gray-300">
                <thead class="bg-blue-500 text-white">
                  <tr>
                    <th class="border px-2 py-2" rowspan="2">
                      SPECIAL SKILSS AND HOBBIES
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(specialSkills, index) in matchingRecord.thirdTable"
                    :key="index"
                  >
                    <td class="border px-2 py-2">
                      {{ specialSkills.special_skills }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="matchingRecord" class="text-gray-900 w-full rounded-md">
            <div class="overflow-x-auto rounded-t-xl">
              <table class="min-w-full text-[14px] border border-gray-300">
                <thead class="bg-blue-500 text-white">
                  <tr>
                    <th class="border px-2 py-2" rowspan="2">
                      NON-ACADEMIC DISTINCTION / RECOGNITION (Write in full)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(nonAcademic, index) in matchingRecord.sixthTable"
                    :key="index"
                  >
                    <td class="border px-2 py-2">
                      {{ nonAcademic.non_academic }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="matchingRecord" class="text-gray-900 w-full rounded-md">
            <div class="overflow-x-auto rounded-t-xl">
              <table class="min-w-full text-[14px] border border-gray-300">
                <thead class="bg-blue-500 text-white">
                  <tr>
                    <th class="border px-2 py-2" rowspan="2">
                      MEMBERSHIP IN ASSOCIATION / ORGANIZATION (Write in full)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(memberships, index) in matchingRecord.seventhTable"
                    :key="index"
                  >
                    <td class="border px-2 py-2">
                      {{ memberships.membership }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 mt-10">
            No data available! Please click
            <span class="text-blue-900 font-bold">"Edit Button"</span>.
          </div>
        </div>
      </div>
    </div>
  </div>

  <editEmployeeProfile
    v-if="isEditEmployee"
    :employeeRecord="selectedEmployeeRecord"
    @close="closeEdit"
    @employee-updated="onEmployeeUpdated"
  />
</template>

<script>
import axios from "axios";
import editEmployeeProfile from "@/components/employee/modals/edit-employee-profile.vue";

export default {
  name: "ViewEmployeeProfilePage",
  components: {
    editEmployeeProfile,
  },

  data() {
    return {
      isEditEmployee: false,
      selectedEmployeeRecord: null,
      activeSection: "personal",
      matchingRecord: null,
      user: null,

      personalFields: {
        first_name: "First Name",
        middle_name: "Middle Name",
        last_name: "Last Name",
        suffix: "Suffix",
        birthdate: "Birthdate",
        place_of_birth: "Place of Birth",
        gender: "Gender",
        civil_status: "Civil Status",
        blood_type: "Blood Type",
        height: "Height",
        weight: "Weight",
        citizenship: "Citizenship",
        is_dual_citizenship: "Dual Citizenship",
        gsis_id: "GSIS ID",
        pagibig_id: "PAGIBIG ID",
        philhealth: "PhilHealth",
        sss_number: "SSS Number",
        tin_number: "TIN Number",
        telephone_number: "Telephone Number",
        mobile_number: "Mobile Number",
        agency: "Agency",
      },

      addressResidentFields: {
        house_number: "House No.",
        street: "Street",
        subdivision: "Subdivision",
        barangay: "Barangay",
        municipality: "Municipality",
        province: "Province",
        zip_code: "Zip",
      },

      addressPermanentFields: {
        same_house_number: "House No",
        same_street: "Street",
        same_subdivision: "Subdivision",
        same_barangay: "Barangay",
        same_municipality: "Municipality",
        same_province: "Province",
        same_zip_code: "Zip Code",
      },
    };
  },
  computed: {
    sortedLearningRecords() {
      if (!this.matchingRecord?.fifthTable) return [];

      return [...this.matchingRecord.fifthTable].sort((a, b) => {
        return new Date(b.ld_from) - new Date(a.ld_from);
      });
    },
  },
  methods: {
    toggleBack() {
      this.$emit("back-to-table-employee");
    },

    toggleSection(section) {
      this.activeSection = section;
    },

    async fetchUser() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/auth/me",
          { withCredentials: true },
        );

        if (response.data) {
          this.user = response.data;

          // Fetch linked employee records
          await this.fetchEmployeeRecords(this.user.employee_id);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },

    async fetchEmployeeRecords(employeeId) {
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + "/upload/get-all",
        );

        const allRecords = response.data || [];

        this.matchingRecord =
          allRecords.find((record) => record.employee_id === employeeId) ||
          null;
      } catch (error) {
        console.error("Error fetching employee records:", error);
      }
    },

    formatField(value, key) {
      if (!value) return "--";

      // Format birthdate
      if (key === "birthdate") return this.formatDate(value);

      // Dual citizenship
      if (key === "is_dual_citizenship") return value ? "Yes" : "No";

      // Format Pag-IBIG ID: 16-000071974-6
      if (key === "pagibig_id") {
        const val = String(value).replace(/\D/g, ""); // remove non-digits
        if (val.length === 12) {
          return `${val.slice(0, 2)}-${val.slice(2, 10)}-${val.slice(10)}`;
        }
        return val; // fallback
      }

      // Format SSS Number: 11-1111111-1
      if (key === "sss_number") {
        const val = String(value).replace(/\D/g, "");
        if (val.length === 10) {
          return `${val.slice(0, 2)}-${val.slice(2, 9)}-${val.slice(9)}`;
        }
        return val;
      }

      // Format GSIS ID: optional dash formatting if needed
      if (key === "gsis_id") return String(value);

      // Format PhilHealth: 12-345678901-2
      if (key === "philhealth") {
        const val = String(value).replace(/\D/g, "");
        if (val.length === 12) {
          return `${val.slice(0, 2)}-${val.slice(2, 10)}-${val.slice(10)}`;
        }
        return val;
      }

      // Format TIN: optional dash formatting
      if (key === "tin_number") return String(value);

      // Default: return as string
      return String(value);
    },
    formatDate(date) {
      if (!date) return "--";
      const d = new Date(date);
      return d.toLocaleDateString("en-US");
    },
    // 🔥 OPEN EDIT MODAL + SEND DATA
    toggleEdit(employeeRecord) {
      this.selectedEmployeeRecord = employeeRecord;
      this.isEditEmployee = true;
    },
    // 🔥 CLOSE EDIT MODAL
    closeEdit() {
      this.isEditEmployee = false;
      this.selectedEmployeeRecord = null;
    },

    onEmployeeUpdated() {
      if (this.user && this.user.employee_id) {
        this.fetchEmployeeRecords(this.user.employee_id); // ✅ reloads the table
      }
      this.isEditEmployee = false;
      this.selectedEmployeeRecord = null; // clear selected record
    },
  },

  mounted() {
    this.fetchUser();
  },
};
</script>

<style scoped>
/* Optional additional styles */
</style>
