<template>
  <div class="relative w-full min-h-screen font-poppins flex flex-col">
    <!-- Background Image -->
    <img
      src="../../assets/img/hr-bg.png"
      alt="Background"
      class="absolute inset-0 object-cover w-full h-full z-0 opacity-95"
    />
    <!-- Overlay -->
    <div class="absolute inset-0 bg-gray-900 opacity-40 z-10"></div>

    <!-- Form Container -->
    <div class="flex items-center justify-center min-h-screen relative z-20">
      <div
        class="w-[43vw] h-auto bg-white rounded-xl shadow-lg flex overflow-hidden p-2"
      >
        <!-- Left Panel -->
        <div
          class="hidden md:flex w-1/2 bg-blue-900 rounded-l-lg shadow-inner items-center justify-center p-8 flex-col text-center space-y-4"
        >
          <img
            src="../../assets/img/hr-illustrator.png"
            alt=""
            class="w-[250px]"
          />
          <h2 class="text-white text-3xl font-bold">Welcome!</h2>
          <p class="text-blue-100 text-base max-w-sm">
            {{
              showLogin
                ? "Access your HR dashboard , manage employee records, and stay connected with important updates."
                : "Register your account to access Human Resource tools and information."
            }}
          </p>
        </div>

        <!-- Right Panel -->
        <div
          class="w-full md:w-1/2 bg-white text-gray-900 flex items-start justify-center px-5 py-10"
        >
          <div class="w-full max-w-[400px] space-y-6">
            <!-- Logo and Title -->
            <div class="flex flex-col items-center">
              <img
                src="../../assets/img/dujali-logo.png"
                alt="Logo"
                class="w-[90px] mb-2"
              />
              <h1 class="text-center text-lg font-bold leading-tight">
                Municipality of Braulio E. Dujali<br />
                Human Resource Management System
              </h1>
            </div>

            <!-- Login or Register Form -->
            <form
              @submit.prevent="showLogin ? login() : register()"
              class="space-y-7 text-left"
            >
              <!-- Login Form -->
              <div v-if="showLogin" class="space-y-5 text-left">
                <div class="space-y-1">
                  <label class="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    v-model="email"
                    placeholder="example@mail.com"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                </div>

                <div class="space-y-1">
                  <label class="block text-sm font-medium">Password</label>
                  <div class="relative">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      v-model="password"
                      placeholder="Enter password"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      @click="togglePassword"
                      class="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500"
                    >
                      <icon :name="showPassword ? 'eye-open' : 'eye-close'" />
                    </button>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="text-red-500 text-sm">
                  {{ errorMessage }}
                </div>

                <button
                  type="submit"
                  class="w-full py-3 px-4 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-800 transition"
                >
                  Login
                </button>
              </div>

              <!-- Registration Step 1 -->
              <div
                v-if="!showLogin && registrationStep === 1"
                class="space-y-5 text-left"
              >
                <div class="space-y-1">
                  <label class="block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    v-model="fullName"
                    placeholder="Your full name"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                </div>

                <div class="space-y-1">
                  <label class="block text-sm font-medium">Position</label>
                  <select
                    v-model="position"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  >
                    <option value="" disabled>Select position</option>
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label class="block text-sm font-medium">Office</label>
                  <select
                    v-model="office"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  >
                    <option value="" disabled>Select office</option>
                    <option value="Human Resource">Human Resource</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>

                <button
                  type="button"
                  class="w-full py-3 px-4 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-800 transition"
                  @click="goToStep(2)"
                >
                  Next
                </button>
              </div>

              <!-- Registration Step 2 -->
              <div
                v-if="!showLogin && registrationStep === 2"
                class="space-y-5 text-left"
              >
                <div class="space-y-1">
                  <label class="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    v-model="email"
                    placeholder="example@mail.com"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                    required
                  />
                </div>

                <div class="space-y-1">
                  <label class="block text-sm font-medium">Password</label>
                  <div class="relative">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      v-model="password"
                      placeholder="Enter password"
                      class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      @click="togglePassword"
                      class="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500"
                    >
                      <icon :name="showPassword ? 'eye-open' : 'eye-close'" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  class="w-full py-3 px-4 bg-blue-900 text-white font-semibold rounded-md hover:bg-blue-800 transition"
                  @click="register"
                >
                  Register
                </button>

                <button
                  type="button"
                  class="text-blue-900 underline mt-2 text-sm"
                  @click="goToStep(1)"
                >
                  Back
                </button>
              </div>

              <!-- Toggle Form -->
              <!-- <div class="text-sm text-center">
                <span>
                  {{
                    showLogin
                      ? "Don't have an account?"
                      : "Already have an account?"
                  }}
                </span>
                <button
                  type="button"
                  @click="toggleForm"
                  class="text-blue-900 font-bold underline ml-1"
                >
                  {{ showLogin ? "Register here!" : "Login here!" }}
                </button>
              </div> -->
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import icon from "@/assets/icon.vue";

export default {
  name: "LoginRegisterPage",
  components: {
    icon,
  },
  data() {
    return {
      email: "",
      password: "",
      fullName: "",
      position: "",
      office: "",
      showPassword: false,
      errorMessage: "",
      showLogin: true,
      registrationStep: 1,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    goToStep(step) {
      this.registrationStep = step;
      this.errorMessage = "";
    },
    toggleForm() {
      this.showLogin = !this.showLogin;
      this.registrationStep = 1;
      this.errorMessage = "";
    },
    async login() {
      try {
        const response = await axios.post(
          process.env.VUE_APP_API_BASE_URL + "/auth/login",
          {
            email: this.email,
            password: this.password,
          },
          { withCredentials: true }
        );
        const role = response.data.role;
        localStorage.setItem("role", role);

        if (role === "Admin") {
          this.$router.push("/dashboard");
        } else if (role === "Student") {
          this.$router.push("/student-dashboard");
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || "Login failed.";
      }
    },
    async register() {
      try {
        const names = this.fullName.trim().split(" ");
        const firstName = names[0] || "";
        const lastName = names.slice(1).join(" ") || "";

        await axios.post(
          process.env.VUE_APP_API_BASE_URL + "/auth/register",
          {
            email: this.email,
            password: this.password,
            first_name: firstName,
            last_name: lastName,
            position: this.position,
            office: this.office,
          },
          { withCredentials: true }
        );

        toast.success("Registration successful! You may now log in.");
        this.showLogin = true;
        this.registrationStep = 1;
        this.errorMessage = "";
        this.email = "";
        this.password = "";
        this.fullName = "";
        this.position = "";
        this.office = "";
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "Registration failed.";
      }
    },
  },
};
</script>

<style scoped></style>
