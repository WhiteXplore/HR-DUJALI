<template>
  <div
    v-if="isOpen"
    class="add-employee-profile p-6 flex flex-col items-center justify-start w-full min-h-screen text-center"
  >
    <div class="max-w-md w-full p-10 rounded-lg">
      <h1 class="text-xl font-bold mb-4">Upload Employee Data</h1>
      <div class="mb-2">
        <label
          for="csvUpload"
          class="block text-md font-medium text-gray-700 mb-1"
          >Upload CSV File:</label
        >
        <div class="flex items-center">
          <input
            type="file"
            id="csvUpload"
            accept=".csv"
            @change="handleFileUpload"
            class="block cursor-pointer w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            class="text-white px-3 py-1 rounded-md bg-blue-700"
            @click="submitData"
          >
            Submit
          </button>
        </div>
      </div>
    </div>

    <form @submit.prevent="submitData" class="space-y-4 mt-4">
      <table class="w-[80vw] table-auto border border-gray-300 text-sm">
        <thead class="bg-blue-100 text-left">
          <tr>
            <th class="border px-4 py-2">First Name</th>
            <th class="border px-4 py-2">Middle Name</th>
            <th class="border px-4 py-2">Last Name</th>
            <th class="border px-4 py-2">Birthdate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border px-4 py-2">
              <input
                v-model="form.first_name"
                placeholder="First Name"
                class="w-full input-style"
              />
            </td>
            <td class="border px-4 py-2">
              <input
                v-model="form.middle_name"
                placeholder="Middle Name"
                class="w-full input-style"
              />
            </td>
            <td class="border px-4 py-2">
              <input
                v-model="form.last_name"
                placeholder="Last Name"
                class="w-full input-style"
              />
            </td>
            <td class="border px-4 py-2">
              <input
                v-model="form.birthdate"
                type="date"
                class="w-full input-style"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>

<script>
import Papa from "papaparse";
import axios from "axios";
import { toRaw } from "vue";
import { toast } from "vue3-toastify";
export default {
  name: "AddEmployeeProfile",
  data() {
    return {
      isOpen: true,
      isSuccessfulAdd: false,
      persons: [],
      form: {
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix: "",
        birthdate: "",
        place_of_birth: "",
        gender: "",
        civil_status: "",
        blood_type: "",
        height: "",
        weight: "",
        is_dual_citizenship: "",
        citizenship: "",
        gsis_id: "",
        pagibig_id: "",
        philhealth: "",
        sss_number: "",
        tin_number: "",
        telephone_number: "",
        mobile_number: "",
        agency: "",
        educationalRecords: [],
        civilRecords: [],
        learningRecords: [],
        otherRecords: [],
        specialSkillsRecords: [],
        nonAcadRecords: [],
        membershipRecords: [],
        house_number: "",
        street: "",
        subdivision: "",
        barangay: "",
        municipality: "",
        province: "",
        zip_code: "",
        same_house_number: "",
        same_street: "",
        same_subdivision: "",
        same_barangay: "",
        same_municipality: "",
        same_province: "",
        same_zip_code: "",
      },
      validationErrors: [],
      showValidationModal: false,
    };
  },
  methods: {
    closeAdd() {
      this.isOpen = false;
      this.isSuccessfulAdd = false;
      this.$emit("close");
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!results.data || results.data.length === 0) {
            alert("CSV is empty or improperly formatted.");
            return;
          }

          // Map common employee fields from first row only
          this.mapCSVToFormCommonFields(results.data[0]);

          // Reset nested arrays before filling
          this.form.learningRecords = [];
          this.form.educationalRecords = [];
          this.form.civilRecords = [];
          this.form.specialSkillsRecords = [];
          this.form.nonAcadRecords = [];
          this.form.membershipRecords = [];

          results.data.forEach((row) => {
            // Educational Records
            if (row["Level"] && row["Name of School"]) {
              this.form.educationalRecords.push({
                level: row["Level"] || "",
                name_of_school: row["Name of School"] || "",
                basic_education: row["Basic Education/Degree Course"] || "",
                educ_from: row["Educ From"] || "",
                educ_to: row["Educ To"] || "",
                highest_level: row["Highest Level / Units Earned"] || "",
                year_graduated: row["Year Graduated"] || "",
                scholarship: row["Scholarship/Academic"] || "",
              });
            }

            // Civil Records (fixed typo: Career Service)
            if (row["Career Service/ RA 1080"]) {
              this.form.civilRecords.push({
                career_service: row["Career Service/ RA 1080"] || "",
                rating: row["Rating"] || "",
                date_of_exam: this.formatDate(row["Date of Examination"]) || "",
                place_of_exam: row["Place of examination"] || "",
                license_number: row["Number"] || "",
                license_validity: row["Date of validity"] || "",
              });
            }

            // Learning Records
            if (row["Title of Learning and Development"]) {
              this.form.learningRecords.push({
                title_learning_development:
                  row["Title of Learning and Development"] || "",
                ld_from: this.formatDate(row["Ld From"]) || "",
                ld_to: this.formatDate(row["Ld To"]) || "",
                ld_number_of_hours: row["Ld Number of Hours"] || "",
                type_of_ld: row["Type of LD"] || "", // fixed typo here (was typle_of_ld)
                ld_conducted_sponsor: row["Conducted Sponsored"] || "",
              });
            }

            // Special Skills Records (fixed typo: Special Skills)
            if (row["Special Skills"]) {
              this.form.specialSkillsRecords.push({
                special_skills: row["Special Skills"] || "",
              });
            }

            // Non-Academic Records
            if (row["Non-Academic Extinction"]) {
              this.form.nonAcadRecords.push({
                non_academic: row["Non-Academic Extinction"] || "",
              });
            }

            // Membership Records
            if (row["Membership in association"]) {
              this.form.membershipRecords.push({
                membership: row["Membership in association"] || "",
              });
            }
          });
        },
        error: (err) => {
          console.error("CSV Parsing error:", err);
          alert("Error parsing CSV file.");
        },
      });
    },

    mapCSVToFormCommonFields(csvData) {
      this.form.first_name = csvData["First Name"] || "";
      this.form.middle_name = csvData["Middle Name"] || "";
      this.form.last_name = csvData["Last Name"] || "";
      this.form.suffix = csvData["Suffix"] || "";
      this.form.birthdate = this.formatDate(csvData["Date of Birth"]) || "";
      this.form.place_of_birth = csvData["Place of Birth"] || "";
      this.form.gender = csvData["Sex"] || "";
      this.form.civil_status = csvData["Civil Status"] || "";
      this.form.height = csvData["Height"] || "";
      this.form.weight = csvData["Weight"] || "";
      this.form.blood_type = csvData["Blood Type"] || "";
      this.form.is_dual_citizenship = csvData["Is Dual Citizen"] || "";
      this.form.citizenship = csvData["Citizenship"] || "";
      this.form.gsis_id = csvData["GSIS ID Number"] || "";
      this.form.pagibig_id = csvData["PAG-IBIG ID Number"] || "";
      this.form.philhealth = csvData["Philhealth"] || "";
      this.form.sss_number = csvData["SSS number"] || "";
      this.form.tin_number = csvData["TIN Number"] || "";
      this.form.telephone_number = csvData["Telephone Number"] || "";
      this.form.mobile_number = csvData["Mobile Number"] || "";
      this.form.agency = csvData["Agency"] || "";
      this.form.house_number = csvData["House Number"] || "";
      this.form.street = csvData["Street"] || "";
      this.form.subdivision = csvData["Subdivision/Village"] || "";
      this.form.barangay = csvData["Barangay"] || "";
      this.form.municipality = csvData["Municipalitty/City"] || "";
      this.form.province = csvData["Province"] || "";
      this.form.zip_code = csvData["Zip Code"] || "";
      this.form.same_house_number = csvData["Same House Number"] || "";
      this.form.same_street = csvData["Same Street"] || "";
      this.form.same_subdivision = csvData["Same Subdivision/Villag"] || "";
      this.form.same_barangay = csvData["Same Barangay"] || "";
      this.form.same_municipality = csvData["Same Municipalitty/City"] || "";
      this.form.same_province = csvData["Same Province"] || "";
      this.form.same_zip_code = csvData["Same Zip Code"] || "";
    },

    formatDate(inputDate) {
      if (!inputDate) return "";
      // Support if inputDate is already yyyy-mm-dd
      if (/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) return inputDate;
      const date = new Date(inputDate);
      if (isNaN(date)) return "";
      const year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, "0");
      let day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    submitData() {
      if (this.validateForm()) {
        const formData = toRaw(this.form);

        Object.keys(formData).forEach((key) => {
          if (
            formData[key] === "" &&
            typeof formData[key] !== "boolean" &&
            !Array.isArray(formData[key])
          ) {
            formData[key] = "N/A";
          }
        });

        axios
          .post("http://localhost:8000/upload/add-data", formData, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            toast.success("Employee data added successfully!");
            this.isSuccessfulAdd = true;
            this.resetForm();
            if (response.status === 200) {
              // Delay closing so user sees the success message
              setTimeout(() => {
                this.closeAdd();
              }, 1100); // 2.5 seconds delay
            }
          })
          .catch((error) => {
            console.error(error);
            alert("Error submitting form.");
          });
      } else {
        this.showValidationModal = true;
      }
    },
    validateForm() {
      this.validationErrors = [];
      if (
        !this.form.first_name ||
        !this.form.last_name ||
        !this.form.birthdate
      ) {
        this.validationErrors.push(
          "Please fill in all required fields: First Name, Last Name, Birthdate."
        );
      }
      return this.validationErrors.length === 0;
    },

    closeValidationModal() {
      this.showValidationModal = false;
    },

    resetForm() {
      Object.keys(this.form).forEach((key) => {
        if (Array.isArray(this.form[key])) {
          this.form[key] = [];
        } else if (typeof this.form[key] === "boolean") {
          this.form[key] = false;
        } else {
          this.form[key] = "";
        }
      });
      this.validationErrors = [];
      this.showValidationModal = false;
      this.isSuccessfulAdd = false;
    },
  },
};
</script>

<style scoped>
.validation-errors {
  color: red;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 6px;
  width: 300px;
}
</style>
