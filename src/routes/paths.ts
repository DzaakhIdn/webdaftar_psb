const ROOTS = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  ACCOUNT: "/account",
  REGISTANT: "/registant",
  AUTH: "/auth",
};

const ROOTS_API = {
  DASHBOARD: "/api/dashboard",
  USER: "/api/user",
};

export const api = {
  logout: "/api/logout",
  dashboard: {
    login: `${ROOTS_API.DASHBOARD}/login`,
    register: `${ROOTS_API.DASHBOARD}/register`,
    jalur: `${ROOTS_API.DASHBOARD}/jalur`,
    deleteJalur: (id: string) => `${ROOTS_API.DASHBOARD}/del-jalur/${id}`,
    deleteRegistrant: (id: string) => `${ROOTS_API.DASHBOARD}/registrant/${id}`,
  },

  user: {
    login: `${ROOTS_API.USER}/login`,
    register: `${ROOTS_API.USER}/register`,
    me: `${ROOTS_API.USER}/me`,
    jalur: `${ROOTS_API.USER}/jalur`,
    jalurFinal: `${ROOTS_API.USER}/jalur-final`, // get current user data
  },
};

export const paths = {
  home: ROOTS.HOME,
  coomingSoon: "/coming-soon",
  maintenance: "/maintenance",
  page404: "/404",
  page500: "/500",
  unauthorized: "/unauthorized",

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
      fileWajib: `${ROOTS.DASHBOARD}/master/required-files`,
      jenjang: `${ROOTS.DASHBOARD}/master/jenjang`,
      profileSekolah: `${ROOTS.DASHBOARD}/master/profile-sekolah`,
    },
    template: `${ROOTS.DASHBOARD}/template-pesan`,

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
      listPayments: `${ROOTS.DASHBOARD}/finance/list-payments`,
    },
    information: {
      root: `${ROOTS.DASHBOARD}/pengumuman`,
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

  registant: {
    root: ROOTS.REGISTANT,
    register: `${ROOTS.REGISTANT}/register`,
    biodata: {
      form: `${ROOTS.REGISTANT}/biodata`,
      file: `${ROOTS.REGISTANT}/files-upload`,
    },
    finance: {
      payment: `${ROOTS.REGISTANT}/payment`,
    },
  },
};
