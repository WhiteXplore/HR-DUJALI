<template>
  <div class="p-6 text-gray-800 w-full min-h-screen bg-[#F4F6F8] rounded-t-xl">
    <!-- ================= HEADER ================= -->
    <h1 class="text-2xl font-bold text-left mb-1">Account Settings</h1>
    <p class="text-sm text-gray-500 mb-5 text-left">
      Manage your personal details and security preferences here.
    </p>

    <div
      class="flex flex-col justify-center items-center w-full gap-6 max-h-[80vh] overflow-auto"
    >
      <!-- ================= PROFILE CARD ================= -->
      <div
        class="w-full lg:w-[60%] bg-white border rounded-2xl p-5 space-y-6 mt-64"
      >
        <div
          class="w-full flex flex-col items-center bg-white border rounded-2xl p-4 relative"
        >
          <!-- PROFILE IMAGE -->
          <div class="relative w-32 h-32 mb-4">
            <img
              :src="previewImage || getProfileImage() || defaultImage"
              alt="Profile Picture"
              class="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
              :class="isEditingImage ? 'cursor-pointer border-green-500' : ''"
              @click="isEditingImage && triggerFileInput()"
            />

            <!-- Edit badge -->
            <div
              v-if="isEditingImage"
              class="absolute bottom-0 right-0 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow-md"
            >
              Edit
            </div>

            <!-- Hidden file input -->
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageUpload"
            />
          </div>

          <!-- NAME AND STATUS -->
          <div class="text-center mb-4">
            <p class="text-2xl font-bold text-gray-800">
              {{ user.first_name }} {{ user.last_name }}
            </p>
            <p
              class="text-xs font-semibold px-3 py-1 w-auto rounded-full text-white"
              :class="{
                'bg-green-500 w-auto': user.employment_status === 'Active',
                'bg-red-500': user.employment_status !== 'Active',
              }"
            >
              {{ user.employment_status || "No Status" }}
            </p>
          </div>

          <!-- ACTION BUTTONS -->
          <div class="flex gap-3 justify-end w-full text-sm">
            <!-- Edit / Cancel -->
            <button
              class="flex items-center gap-1 border border-green-600 text-green-600 px-3 py-2 rounded-xl hover:bg-green-50 transition"
              @click="toggleEditImage"
            >
              <icon :name="'edit'" />
              <span>{{ isEditingImage ? "Cancel" : "Edit" }}</span>
            </button>

            <!-- Save (only shows when image selected) -->
            <button
              v-if="selectedImage"
              class="flex items-center text-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-500 transition"
              @click="uploadImage"
            >
              <span>Save</span>
            </button>
          </div>
        </div>

        <!-- PERSONAL INFO -->
        <div class="text-left p-4">
          <h2 class="text-lg font-semibold mb-3">Personal Information</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- LEFT COLUMN -->
            <div class="space-y-3">
              <div>
                <label class="text-xs text-gray-500">First Name</label>
                <p class="font-medium">{{ user.first_name || "N/A" }}</p>
              </div>

              <div>
                <label class="text-xs text-gray-500">Birthdate</label>
                <p class="font-medium">{{ user.birthdate || "N/A" }}</p>
              </div>

              <div>
                <label class="text-xs text-gray-500">Email Address</label>
                <p class="font-medium">{{ user.email || "No Email" }}</p>
              </div>

              <div>
                <label class="text-xs text-gray-500">Mobile Number</label>
                <p class="font-medium">{{ user.mobile_number || "N/A" }}</p>
              </div>
            </div>

            <!-- RIGHT COLUMN -->
            <div class="space-y-3">
              <div>
                <label class="text-xs text-gray-500">Last Name</label>
                <p class="font-medium">{{ user.last_name || "N/A" }}</p>
              </div>

              <div>
                <label class="text-xs text-gray-500">Civil Status</label>
                <p class="font-medium">{{ user.civil_status || "N/A" }}</p>
              </div>

              <div>
                <label class="text-xs text-gray-500">Agency</label>
                <p class="font-medium">{{ user.agency || "N/A" }}</p>
              </div>

              <div>
                <label class="text-xs text-gray-500">Employee ID</label>
                <p class="font-medium">{{ user.employee_id || "N/A" }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= CHANGE PASSWORD ================= -->
      <div
        class="w-full lg:w-[60%] bg-white shadow-md rounded-2xl p-5 text-left"
      >
        <h2 class="text-lg font-semibold mb-4">Change Password</h2>

        <div class="space-y-4">
          <input
            type="password"
            v-model="passwordForm.old_password"
            placeholder="Old Password"
            class="w-full p-3 border border-gray-300 rounded-xl text-sm"
          />

          <input
            type="password"
            v-model="passwordForm.new_password"
            placeholder="New Password"
            class="w-full p-3 border border-gray-300 rounded-xl text-sm"
          />

          <input
            type="password"
            v-model="passwordForm.confirm_password"
            placeholder="Confirm Password"
            class="w-full p-3 border border-gray-300 rounded-xl text-sm"
          />

          <button
            @click="submitPassword"
            class="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl text-sm transition"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import axios from "axios";

export default {
  name: "ProfileContentPage",
  components: { icon },

  data() {
    return {
      user: {},
      isEditingImage: false,
      selectedImage: null,
      previewImage: null,
      defaultImage: require("@/assets/img/employee_picture.png"),

      passwordForm: {
        old_password: "",
        new_password: "",
        confirm_password: "",
      },
    };
  },

  methods: {
    toggleEditImage() {
      this.isEditingImage = !this.isEditingImage;
      if (!this.isEditingImage) {
        this.selectedImage = null;
        this.previewImage = null;
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.selectedImage = file;
      this.previewImage = URL.createObjectURL(file);
    },

    async uploadImage() {
      if (!this.selectedImage) return;

      try {
        const formData = new FormData();
        formData.append("image", this.selectedImage); // must match FileInterceptor('image')

        await axios.patch(
          `${process.env.VUE_APP_API_BASE_URL}/upload/upload-image/${this.user.first_table_id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          },
        );

        alert("Profile picture updated successfully!");
        this.isEditingImage = false;
        this.selectedImage = null;
        this.previewImage = null;

        // Refresh user data
        this.fetchUser();
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image.");
      }
    },

    async fetchUser() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/auth/me`,
          {
            withCredentials: true,
          },
        );

        if (!response.data) {
          this.$router.push("/");
          return;
        }

        this.user = response.data;

        if (this.user.employee_id) {
          await this.fetchEmployeeDetails(this.user.employee_id);
        }
      } catch (error) {
        console.error("Auth fetch failed:", error);
        this.$router.push("/");
      }
    },

    async fetchEmployeeDetails(employeeId) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/upload/employee/${employeeId}`,
          { withCredentials: true },
        );
        this.user = { ...this.user, ...response.data };
      } catch (error) {
        console.error("Employee fetch failed:", error);
      }
    },

    submitPassword() {
      if (
        this.passwordForm.new_password !== this.passwordForm.confirm_password
      ) {
        alert("Passwords do not match!");
        return;
      }

      // Call backend to update password
      axios
        .post(
          `${process.env.VUE_APP_API_BASE_URL}/auth/change-password`,
          this.passwordForm,
          { withCredentials: true },
        )
        .then(() => {
          alert("Password updated successfully!");
          this.passwordForm.old_password = "";
          this.passwordForm.new_password = "";
          this.passwordForm.confirm_password = "";
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to update password.");
        });
    },
    getProfileImage() {
      if (this.user.image_filename) {
        return `${process.env.VUE_APP_API_BASE_URL}/uploads/${this.user.image_filename}`;
      }
      return null;
    },
  },

  mounted() {
    this.fetchUser();
  },
};
</script>
