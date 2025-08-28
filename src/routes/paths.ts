const ROOTS = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  ACCOUNT: "/account",
  REGISTANT: "/user",
  AUTH: "/auth",
};

export const paths = {
  home: ROOTS.HOME,
  coomingSoon: "/coming-soon",
  maintenance: "/maintenance",
  page404: "/404",
  page500: "/500",

  authDashboard: {
    root: ROOTS.AUTH,
    signIn: `${ROOTS.AUTH}/auth-dashboard/sign-in`,
    signUp: `${ROOTS.AUTH}/auth-dashboard/sign-up`,
  },

  authUser: {
    root: ROOTS.REGISTANT,
    signIn: `${ROOTS.REGISTANT}/auth-user/sign-in`,
    signUp: `${ROOTS.REGISTANT}/auth-user/sign-up`,
  },

  dashboard: {
    root: ROOTS.DASHBOARD,
    overview: `${ROOTS.DASHBOARD}/overview`,

    // Loading Demo Pages
    demoLoading: `${ROOTS.DASHBOARD}/demo-loading`,
    realisticLoading: `${ROOTS.DASHBOARD}/realistic-loading`,
    advancedLoading: `${ROOTS.DASHBOARD}/advanced-loading`,
    loadingComparison: `${ROOTS.DASHBOARD}/loading-comparison`,
    navigationLoadingDemo: `${ROOTS.DASHBOARD}/navigation-loading-demo`,

    master: {
      root: `${ROOTS.DASHBOARD}/master`,
      listJalur: `${ROOTS.DASHBOARD}/master/list-jalur`,
      jenjang: `${ROOTS.DASHBOARD}/master/jenjang`,
      profileSekolah: `${ROOTS.DASHBOARD}/master/profile-sekolah`,
    },

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
    },
    admin: {
      root: `${ROOTS.DASHBOARD}/admin`,
      users: `${ROOTS.DASHBOARD}/admin/users`,
      setting: `${ROOTS.DASHBOARD}/admin/setting`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
    },
  },
};
