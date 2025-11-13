<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-xl shadow-lg w-[400px]">
      <!-- Header -->
      <div
        class="w-full p-5 py-3 bg-blue-900 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
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
        class="flex flex-col gap-3 text-left p-4"
      >
        <!-- First Name -->
        <div>
          <label class="text-sm font-medium">First Name</label>
          <input
            v-model="form.first_name"
            type="text"
            class="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <!-- Last Name -->
        <div>
          <label class="text-sm font-medium">Last Name</label>
          <input
            v-model="form.last_name"
            type="text"
            class="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <!-- Email -->
        <div>
          <label class="text-sm font-medium">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label class="text-sm font-medium">
            Password
            <span v-if="isEditMode" class="text-gray-500 text-xs">
              (Leave blank to keep current password)
            </span>
          </label>
          <input
            v-model="form.password"
            type="password"
            class="w-full px-3 py-2 border rounded-md"
            :required="!isEditMode"
            placeholder="Enter password"
          />
        </div>

        <!-- Role -->
        <div>
          <label class="text-sm font-medium">Role</label>
          <select
            v-model="form.role"
            class="w-full px-3 py-2 border rounded-md"
            required
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

export default {
  name: "AddEditUserPage",
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
        last_name: "",
        email: "",
        password: "", // added password
        role: "",
      },
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
          // Populate form for editing, but leave password blank
          this.form = {
            first_name: newVal.first_name || "",
            last_name: newVal.last_name || "",
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
    async submitForm() {
      try {
        let payload = { ...this.form };

        // If editing and password is empty, remove it
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
