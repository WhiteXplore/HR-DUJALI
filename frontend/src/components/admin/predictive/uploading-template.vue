<template>
  <div class="p-4">
    <input
      type="file"
      accept=".csv, .tsv, .txt"
      @change="handleFileUpload"
      class="mb-4"
    />

    <table v-if="tableData.length" class="min-w-full border">
      <thead>
        <tr class="bg-gray-200">
          <th class="border px-4 py-2">First Name</th>
          <th class="border px-4 py-2">Last Name</th>
          <th class="border px-4 py-2">Contact Number</th>
          <th class="border px-4 py-2">Address</th>
          <th class="border px-4 py-2">Skills</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in tableData" :key="index">
          <td class="border px-4 py-2">{{ row["First Name"] }}</td>
          <td class="border px-4 py-2">{{ row["Last Name"] }}</td>
          <td class="border px-4 py-2">{{ row["Contact Number"] }}</td>
          <td class="border px-4 py-2">{{ row["Address"].join(", ") }}</td>
          <td class="border px-4 py-2">{{ row["Skills"].join(", ") }}</td>
        </tr>
      </tbody>
    </table>

    <!-- <button
        v-if="tableDataJson"
        @click="uploadJsonData"
        class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload Data to API
      </button> -->

    <!-- Success Alert -->
    <div
      v-if="showAlert"
      class="fixed top-0 left-0 right-0 p-4 bg-green-500 text-white text-center rounded-md shadow-lg"
    >
      <p>Data uploaded successfully!</p>
      <button
        @click="showAlert = false"
        class="absolute top-0 right-0 p-2 text-xl font-bold text-white"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UploadData",
  data() {
    return {
      tableData: [],
      tableDataJson: "",
      showAlert: false, // State to control alert visibility
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        this.parseData(content);
      };
      reader.readAsText(file);
    },

    parseData(data) {
      const lines = data.split(/\r?\n/).filter((line) => line.trim() !== "");
      if (lines.length < 2) {
        console.warn("No data lines found.");
        return;
      }

      const firstLine = lines[0];
      let delimiter = ",";
      if (firstLine.includes("\t")) {
        delimiter = "\t";
      }

      const headers = firstLine.split(delimiter).map((h) => h.trim());

      const rows = [];
      let currentPerson = null;

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(delimiter).map((c) => c.trim());

        const row = {};
        headers.forEach((header, idx) => {
          row[header] = cols[idx] || "";
        });

        const hasName =
          row["First Name"] || row["Last Name"] || row["Contact Number"];
        const hasAddressOrSkills = row["Address"] || row["Skills"];

        if (hasName) {
          currentPerson = {
            "First Name": row["First Name"],
            "Last Name": row["Last Name"],
            "Contact Number": row["Contact Number"],
            Address: row["Address"] ? [row["Address"]] : [],
            Skills: row["Skills"] ? [row["Skills"]] : [],
          };
          rows.push(currentPerson);
        } else if (currentPerson && hasAddressOrSkills) {
          if (row["Address"]) {
            currentPerson.Address.push(row["Address"]);
          }
          if (row["Skills"]) {
            currentPerson.Skills.push(row["Skills"]);
          }
        }
      }

      this.tableData = rows;
      this.tableDataJson = JSON.stringify(rows, null, 2);
      console.log("Parsed Data (JSON):", this.tableDataJson);

      // Automatically upload after parsing the data
      this.uploadJsonData();
    },

    uploadJsonData() {
      axios
        .post(
          "http://localhost:8000/upload/save-json-data",
          this.tableDataJson,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("Data saved successfully:", response.data);
          this.showAlert = true; // Show success alert
        })
        .catch((error) => {
          console.error("Error saving data:", error);
        });
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
th,
td {
  text-align: left;
}
</style>
