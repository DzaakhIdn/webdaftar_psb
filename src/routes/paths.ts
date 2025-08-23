// import kebabCase from "es-toolkit/compat/kebabCase";

const ROOTS = {
  DASHBOARD: "",
  ACCOUNT: "/account",
};

export const paths = {
  coomingSoon: "/coming-soon",
  maintenance: "/maintenance",
  page404: "/404",
  page500: "/500",

  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    resetPassword: "/reset-password",
    updatePassword: "/update-password",
  },

  dashboard: {
    root: ROOTS.DASHBOARD,
    overview: `${ROOTS.DASHBOARD}/overview`,

    registant: {
      root: `${ROOTS.DASHBOARD}/registant`,
      list: `${ROOTS.DASHBOARD}/registant/list`,
      registanFile: `${ROOTS.DASHBOARD}/registant/files`,
      // registanDetail: {
      // }
    },
    finance: {
      root: `${ROOTS.DASHBOARD}/finance`,
      overview: `${ROOTS.DASHBOARD}/finance/overview`,
      paymentRecipts: `${ROOTS.DASHBOARD}/finance/payment-recipts`,
      listPayments: `${ROOTS.DASHBOARD}/finance/list-payments`,
    },
    information: {
      root: `${ROOTS.DASHBOARD}/information`,
      settings: `${ROOTS.DASHBOARD}/information/settings`,
    },
    admin: {
      root: `${ROOTS.DASHBOARD}/admin`,
      users: `${ROOTS.DASHBOARD}/admin/users`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
    },
  },
};
