// import kebabCase from "es-toolkit/compat/kebabCase";

const ROOTS = {
    DASHBOARD: "",
    ACCOUNT: "/account",

}

export const paths = {
    coomingSoon: "/coming-soon",
    maintenance: "/maintenance",
    page404: "/404",
    page500: "/500",


    auth:{
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
            registanFile: `${ROOTS.DASHBOARD}/registant/file`,
            // registanDetail: {
            // }
        },
        finance: {
            root: `${ROOTS.DASHBOARD}/finance`,
            payments: `${ROOTS.DASHBOARD}/finance/payments`,
            invoices: `${ROOTS.DASHBOARD}/finance/invoices`,
            paymentSetting: `${ROOTS.DASHBOARD}/finance/payment-setting`,
        },
        information: {
            root: `${ROOTS.DASHBOARD}/information`,
            settings: `${ROOTS.DASHBOARD}/information/settings`,
        },
        admin: {
            root: `${ROOTS.DASHBOARD}/admin`,
            users: `${ROOTS.DASHBOARD}/admin/users`,
        }
    }
}