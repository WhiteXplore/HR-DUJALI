<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-xl shadow-lg w-[30%]">
      <!-- Header -->
      <div
        class="w-full p-5 py-3 bg-blue-900 text-white rounded-t-xl flex justify-between items-center border-b shadow"
      >
        <div class="flex gap-1 items-center">
          <icon :name="'add-account'" />
          <h1 class="font-bold tracking-wide text-lg">
            {{ isEditMode ? "Edit User" : "Add User" }}
          </h1>
        </div>

        <icon
          :name="'circle-close3'"
          @click="closeModal"
          class="cursor-pointer"
        />
      </div>

      <!-- Form -->
      <form
        @submit.prevent="submitForm"
        class="flex flex-col gap-3 text-left p-4 text-[13px]"
      >
        <div class="flex gap-2 items-center">
          <!-- First Name -->
          <div class="w-full space-y-2">
            <label for="first_name" class="font-bold text-xs"
              >First Name:</label
            >
            <input
              v-model="form.first_name"
              type="text"
              id="first_name"
              required
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-sm text-gray-800"
              placeholder="Enter First Name"
            />
          </div>
          <!-- Middle Name  -->
          <div class="w-full space-y-2">
            <label for="middle_name" class="font-bold text-xs"
              >Middle Name</label
            >
            <input
              v-model="form.middle_name"
              type="text"
              required
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-sm text-gray-800"
              placeholder="Enter Middle Name"
            />
          </div>

          <!-- Last Name -->
          <div class="w-full space-y-2">
            <label class="font-bold text-xs">Last Name</label>
            <input
              v-model="form.last_name"
              type="text"
              required
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-sm text-gray-800"
              placeholder="Enter Last Name"
            />
          </div>
        </div>

        <div class="w-full space-y-2">
          <label for="employee_id" class="font-bold text-xs"
            >Employee ID:</label
          >
          <input
            v-model="form.employee_id"
            type="text"
            id="employee_id"
            required
            class="w-full border px-3 py-3 border-gray-600 rounded-md text-sm text-gray-800"
            placeholder="Enter  employee id"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="font-bold text-xs">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full border px-3 py-3 border-gray-600 rounded-md text-sm text-gray-800"
            placeholder="Enter Email"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="font-bold text-xs">
            Password
            <span v-if="isEditMode" class="text-gray-500 text-xs">
              (Leave blank to keep current password)
            </span>
          </label>

          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              :required="!isEditMode"
              class="w-full border px-3 py-3 border-gray-600 rounded-md text-sm text-gray-800 pr-10"
              placeholder="Enter Password"
            />

            <!-- Eye Icon -->
            <span
              class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
              @click="showPassword = !showPassword"
            >
              <icon :name="showPassword ? 'eye-open' : 'eye-close'" />
            </span>
          </div>

          <!-- Password Validation -->
          <p
            v-if="form.password.length > 0 && !validatePassword(form.password)"
            class="text-red-600 text-xs mt-1"
          >
            Password must be at least 8 characters long and include uppercase,
            lowercase, number, and special character.
          </p>
        </div>

        <!-- Role -->
        <div>
          <label class="font-bold text-xs">Role</label>
          <select
            v-model="form.role"
            required
            class="w-full border px-3 py-3 border-gray-600 rounded-md text-sm text-gray-800"
          >
            <option value="" disabled>Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-2 mt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700"
          >
            {{ isEditMode ? "Update" : "Add" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import icon from "@/assets/icon.vue";
export default {
  name: "AddEditUserPage",
  components: {
    icon,
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        first_name: "",
        middle_name: "",
        last_name: "",
        employee_id: "",
        email: "",
        password: "",
        role: "",
      },
      showPassword: false,
    };
  },
  computed: {
    isEditMode() {
      return !!this.user;
    },
  },
  watch: {
    user: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = {
            first_name: newVal.first_name || "",
            middle_name: newVal.middle_name || "",
            last_name: newVal.last_name || "",
            employee_id: newVal.employee_id || "",
            email: newVal.email || "",
            password: "",
            role: newVal.role || "",
          };
        }
      },
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },

    // 🔐 PASSWORD COMPLEXITY VALIDATION
    validatePassword(password) {
      const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      return strongPassword.test(password);
    },
    async submitForm() {
      try {
        // Validate password complexity (Add mode OR Edit but with new password)
        if (!this.isEditMode || (this.isEditMode && this.form.password)) {
          if (!this.validatePassword(this.form.password)) {
            toast.error(
              "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
            );
            return;
          }
        }

        let payload = { ...this.form };

        // For edit: remove password field if left empty
        if (this.isEditMode && !payload.password) {
          delete payload.password;
        }

        if (this.isEditMode) {
          await axios.put(
            `${process.env.VUE_APP_API_BASE_URL}/auth/user/${this.user.id}`,
            payload
          );
          toast.success("User updated successfully!");
        } else {
          await axios.post(
            `${process.env.VUE_APP_API_BASE_URL}/auth/register`,
            payload
          );
          toast.success("User added successfully!");
        }

        this.$emit("refresh");
        this.$emit("close");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to save user.");
        console.error(err);
      }
    },
  },
};
</script>
