import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import sidebar from "@/components/global/navigation/sidebar.vue";
// import templates from "../components/admin/reusable/templates.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/client-feedback-form",
    name: "client-feedback-form",
    component: () =>
      import("@/components/admin/feedback/customer_feedback_form.vue"),
  },
  {
    path: "/navigation",
    name: "navigation",
    component: sidebar,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () =>
          import("@/components/admin/dashboard/employee-dashboard.vue"),
      },
      // TODO ADMIN ROUTES
      {
        path: "/employement-records",
        name: "employee-profile",
        component: () =>
          import("@/components/admin/employee/employee-profile.vue"),
        children: [
          {
            path: "view-employee-profile",
            name: "view-employee-profile",
            component: () =>
              import(
                "@/components/admin/employee/modals/view-employee-profile.vue"
              ),
          },
        ],
      },
      {
        path: "/view-eligible-trainings",
        name: "view-eligible-trainings",
        component: () =>
          import(
            "@/components/admin/employee/modals/view-eligible-trainings.vue"
          ),
      },
      {
        path: "/view-eligible-for-promotion/:id",
        name: "view-eligible-for-promotion",
        component: () =>
          import(
            "@/components/admin/predictive/modals/view-eligible-for-promotion.vue"
          ),
        props: true,
      },

      {
        path: "/available-trainings",
        name: "available-trainings",
        component: () =>
          import("@/components/admin/employee/available-trainings.vue"),
      },
      {
        path: "/service-of-records",
        name: "service-of-records",
        component: () =>
          import("@/components/admin/employee/service-of-records.vue"),
        children: [
          {
            path: "view-service-records",
            name: "view-service-records",
            component: () =>
              import(
                "@/components/admin/employee/modals/view-service-records.vue"
              ),
          },
        ],
      },
      {
        path: "/certificate-of-employment",
        name: "certificate-of-employment",
        component: () =>
          import("@/components/admin/reusable/employment-certificates.vue"),
        children: [
          {
            path: "view-coe",
            name: "view-coe",
            component: () =>
              import("@/components/admin/reusable/modals/view-coe.vue"),
          },
        ],
      },
      {
        path: "/predictive-analysis",
        name: "predictive-analysiss",
        component: () => import("@/components/admin/predictive/predictive.vue"),
      },
      {
        path: "/promotion-page",
        name: "promotion-page",
        component: () => import("@/components/admin/predictive/promotion.vue"),
      },
      {
        path: "/seminar-page",
        name: "seminar-page",
        component: () => import("@/components/admin/predictive/seminar.vue"),
      },

      {
        path: "/profile-view",
        name: "profile-view",
        component: () =>
          import("@/components/global/navigation/profile/view-profile.vue"),
      },

      {
        path: "/upload-service-page",
        name: "upload-service-page",
        component: () =>
          import("@/components/admin/uploads/upload-service.vue"),
      },

      {
        path: "/view-seminar",
        name: "view-seminar",
        props: (route) => ({
          selectedFirstName: route.query.firstName || "",
          selectedLastName: route.query.lastName || "",
        }),
        component: () =>
          import("@/components/admin/predictive/modals/view-seminar.vue"),
      },

      {
        path: "/view-promotion",
        name: "view-promotion",
        props: (route) => ({
          selectedFirstName: route.query.firstName || "",
          selectedLastName: route.query.lastName || "",
        }),
        component: () =>
          import("@/components/admin/predictive/modals/view-promotion.vue"),
      },
      {
        path: "/attendance-records",
        name: "attendance-records",
        component: () =>
          import("@/components/admin/employee/attendance-record.vue"),
        children: [
          {
            path: "view-attendance-records:date",
            name: "view-attendance-records",
            component: () =>
              import(
                "@/components/admin/employee/modals/view-attendance-record.vue"
              ),
          },
        ],
      },
      {
        path: "/user-management",
        name: "user-management",
        component: () =>
          import("@/components/admin/employee/user-management.vue"),
        children: [],
      },
      {
        path: "/attendance-report",
        name: "attendance-report",
        component: () =>
          import("@/components/admin/employee/attendance-report.vue"),
        children: [],
      },
      {
        path: "/client-feedback-report",
        name: "client-feedback-report",
        component: () =>
          import("@/components/admin/employee/customer-feedback-form.vue"),
        children: [],
      },

      //TODO EMPLOYEE ROUTES
      {
        path: "/vw-employee-profile",
        name: "vw-employee-profile",
        component: () => import("@/components/employee/employee-profile.vue"),
        children: [],
      },
      {
        path: "/vw-service-of-records",
        name: "vw-service-of-records",
        component: () => import("@/components/employee/service-of-records.vue"),
        children: [],
      },
      {
        path: "/vw-attendance-records",
        name: "vw-attendance-records",
        component: () => import("@/components/employee/attendance-records.vue"),
        children: [],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
