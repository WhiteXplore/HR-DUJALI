<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-screen"
  >
    <div
      class="flex justify-center items-center w-full max-w-md bg-white p-4 rounded-xl shadow-lg"
    >
      <!-- Upload File Content -->
      <div class="flex flex-col w-full">
        <!-- Title -->
        <div class="flex justify-start">
          <h1 class="font-semibold text-lg text-gray-800">
            Upload Employee CSV
          </h1>
        </div>

        <!-- Drag & Drop File Upload -->
        <div
          class="flex justify-center items-center cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-8 w-full max-w-xl mx-auto mt-3"
          :class="{ 'bg-gray-100': dragging }"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
          @click="triggerFileInput"
        >
          <div class="text-center">
            <p v-if="!file" class="text-gray-600">
              <span class="text-green1">Upload a file</span> or drag and drop<br />
              CSV up to 10MB
            </p>
            <p v-else class="text-green-600">File uploaded: {{ file.name }}</p>
            <input
              type="file"
              class="hidden"
              ref="fileInput"
              @change="onFileChange"
              accept=".csv"
            />
          </div>
        </div>

        <!-- Reminders -->
        <div class="mt-3 text-[13px] flex justify-between text-left">
          <div>
            <p class="text-gray-600">Accepted Files: .csv</p>
            <p class="text-green-700">example.csv</p>
          </div>
        </div>

        <!-- Divider -->
        <div class="w-full h-[1px] rounded-md bg-gray-200 mt-4"></div>

        <!-- Buttons -->
        <div class="tracking-wide flex justify-end gap-2 mt-4">
          <button
            class="bg-red-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-red-800 hover:text-red-800 hover:shadow-md"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            class="bg-green-600 p-2 px-3 rounded-md text-white hover:bg-white border hover:border-green-800 hover:text-green-800 hover:shadow-md"
            @click="submitData"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Papa from "papaparse";
import axios from "axios";
import { toast } from "vue3-toastify";
// import saveus from "file-saver";
export default {
  name: "AddEmployeeProfile",
  data() {
    return {
      file: null,
      dragging: false,
      isOpen: true,
    };
  },
  methods: {
    onDragOver() {
      this.dragging = true;
    },
    onDragLeave() {
      this.dragging = false;
    },
    onDrop(event) {
      this.dragging = false;
      this.file = event.dataTransfer.files[0];
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    closeModal() {
      this.isOpen = false;
    },
    submitData() {
      if (!this.file) return;

      Papa.parse(this.file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed = results.data;
          const structured = this.structureData(parsed);
          console.log("Structured JSON:", structured);

          // Convert structured JSON to a Blob and save it locally
          // const jsonBlob = new Blob([JSON.stringify(structured, null, 2)], {
          //   type: "application/json",
          // });
          // saveus.saveAs(jsonBlob, "employee_profiles.json");

          // Then send to backend
          axios
            .post(
              process.env.VUE_APP_API_BASE_URL + "/upload/upload-data",
              structured,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            .then((response) => {
              toast.success("Employee profiles uploaded successfully!");
              this.$emit("refresh-employees");
              this.resetForm();
              if (response.status === 200) {
                setTimeout(() => {
                  this.closeModal();
                }, 1100);
              }
            })
            .catch((error) => {
              console.error(error);
              alert("Error submitting employee profiles.");
            });
        },
      });
    },
    resetForm() {
      this.file = null;
      this.dragging = false;
      this.isOpen = false;
      this.$refs.fileInput.value = null;
    },
    sanitize(value) {
      if (
        value === null ||
        value === undefined ||
        value.toString().trim() === ""
      ) {
        return "N/A";
      }
      return value;
    },
    formatBirthdate(dateStr) {
      if (!dateStr || typeof dateStr !== "string") return "N/A";
      const parts = dateStr.split("/"); // ["11", "15", "1991"]
      if (parts.length !== 3) return dateStr; // fallback if unexpected format
      const [month, day, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    structureData(rows) {
      const result = [];
      let currentEmployee = null;

      for (const row of rows) {
        const hasName =
          row["First Name"] || row["Middle Name"] || row["Last Name"];
        const special_skills = row["Special Skills"];
        const level = row["Level"];
        const career_service = row["Carrer Service/ RA 1080"];
        const title_learning_development =
          row["Title of Learning and Development"];
        const non_academic = row["Non-Academic Extinction"];
        const membership = row["Membership in association"];

        if (hasName) {
          if (currentEmployee) result.push(currentEmployee);

          currentEmployee = {
            first_name: this.sanitize(row["First Name"]),
            middle_name: this.sanitize(row["Middle Name"]),
            last_name: this.sanitize(row["Last Name"]),
            suffix: this.sanitize(row["Suffix"]),
            birthdate: this.formatBirthdate(
              this.sanitize(row["Date of Birth"])
            ),
            place_of_birth: this.sanitize(row["Place of Birth"]),
            gender: this.sanitize(row["Sex"]),
            civil_status: this.sanitize(row["Civil Status"]),
            height: this.sanitize(row["Height"]),
            weight: this.sanitize(row["Weight"]),
            blood_type: this.sanitize(row["Blood Type"]),
            citizenship: this.sanitize(row["Citizenship"]),
            is_dual_citizen: this.sanitize(row["Is Dual Citizen"]),
            gsis_id: this.sanitize(row["GSIS ID Number"]),
            pagibig_id: this.sanitize(row["PAG-IBIG ID Number"]),
            philhealth: this.sanitize(row["Philhealth"]),
            sss_number: this.sanitize(row["SSS number"]),
            tin_number: this.sanitize(row["TIN Number"]),
            telephone_number: this.sanitize(row["Telephone Number"]),
            mobile_number: this.sanitize(row["Mobile Number"]),
            agency: this.sanitize(row["Agency"]),

            house_number: this.sanitize(row["House Number"]),
            street: this.sanitize(row["Street"]),
            subdivision: this.sanitize(row["Subdivision/Village"]),
            barangay: this.sanitize(row["Barangay"]),
            municipality: this.sanitize(row["Municipalitty/City"]),
            province: this.sanitize(row["Province"]),
            zip_code: this.sanitize(row["Zip Code"]),

            same_house_number: this.sanitize(row["House Number"]),
            same_street: this.sanitize(row["Street"]),
            same_subdivision: this.sanitize(row["Subdivision/Village"]),
            same_barangay: this.sanitize(row["Barangay"]),
            same_municipality: this.sanitize(row["Municipalitty/City"]),
            same_province: this.sanitize(row["Province"]),
            same_zip_code: this.sanitize(row["Zip Code"]),

            specialSkillsRecords: [],
            educationalRecords: [],
            civilRecords: [],
            learningRecords: [],
            nonAcadRecords: [],
            membershipRecords: [],

            emloyment_status: null,
            employee_id: null,
          };
        } else if (currentEmployee) {
          if (special_skills) {
            currentEmployee.specialSkillsRecords.push({
              special_skills: this.sanitize(special_skills),
            });
          }
        }

        if (level && currentEmployee) {
          currentEmployee.educationalRecords.push({
            level: this.sanitize(level),
            name_of_school: this.sanitize(row["Name of School"]),
            basic_education: this.sanitize(
              row["Basic Education/Degree Course"]
            ),
            educ_from: this.sanitize(row["Educ From"]),
            educ_to: this.sanitize(row["Educ To"]),
            highest_level: this.sanitize(row["Highest Level / Units Earned"]),
            year_graduated: this.sanitize(row["Year Graduated"]),
            scholarship: this.sanitize(row["Scholarship/Academic"]),
          });
        }
        if (career_service && currentEmployee) {
          currentEmployee.civilRecords.push({
            career_service: this.sanitize(career_service),
            rating: this.sanitize(row["Rating"]),
            date_of_exam: this.sanitize(row["Date of Examination"]),
            place_of_exam: this.sanitize(row["Place of examination"]),
            license_number: this.sanitize(row["Number"]),
            license_validity: this.sanitize(row["Date of validity"]),
          });
        }
        if (title_learning_development && currentEmployee) {
          currentEmployee.learningRecords.push({
            title_learning_development: this.sanitize(
              title_learning_development
            ),
            ld_from: this.sanitize(row["Ld From"]),
            ld_to: this.sanitize(row["Ld To"]),
            ld_number_of_hours: this.sanitize(row["Ld Number of Hours"]),
            type_of_ld: this.sanitize(row["Type of LD"]),
            ld_conducted_sponsor: this.sanitize(row["Conducted Sponsored"]),
          });
        }
        if (non_academic && currentEmployee) {
          currentEmployee.nonAcadRecords.push({
            non_academic: this.sanitize(non_academic),
          });
        }
        if (membership && currentEmployee) {
          currentEmployee.membershipRecords.push({
            membership: this.sanitize(membership),
          });
        }
      }

      if (currentEmployee) result.push(currentEmployee);
      return result;
    },
  },
};
</script>
