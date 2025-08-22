import { paths } from "@/routes/paths";

// import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

const ICONS = {
  dashboard: <Iconify icon="solar:home-angle-bold-duotone" />,
  overview: <Iconify icon="solar:chart-bold-duotone" />,
  registant: <Iconify icon="solar:users-group-rounded-bold-duotone" />,
  file: <Iconify icon="solar:file-check-bold-duotone" />,
  finance: <Iconify icon="custom:invoice-duotone" />,
  payments: <Iconify icon="solar:card-bold-duotone" />,
  invoices: <Iconify icon="solar:bill-list-bold-duotone" />,
  settings: <Iconify icon="solar:settings-bold-duotone" />,
  information: <Iconify icon="solar:info-circle-bold-duotone" />,
  admin: <Iconify icon="solar:shield-keyhole-bold-duotone" />,
  users: <Iconify icon="solar:user-plus-bold" />,
  notebook: <Iconify icon="solar:notebook-bold-duotone" />,
  inbox: <Iconify icon="solar:inbox-in-bold-duotone" />,
};

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: "Overview",
    items: [{ title: "App", path: "/", icon: ICONS.dashboard }],
  },
  {
    subheader: "Management",
    items: [
      {
        title: "Registrant",
        path: paths.dashboard.registant.root,
        icon: ICONS.registant,
        children: [
          { title: "List", path: paths.dashboard.registant.list },
          { title: "Files", path: paths.dashboard.registant.registanFile }, // List File Pendaftar
        ],
      },
      {
        title: "Finance",
        path: paths.dashboard.finance.root,
        icon: ICONS.finance,
        children: [
          { title: "Overview", path: paths.dashboard.finance.root },
          { title: "Payments", path: paths.dashboard.finance.payments },
          { title: "Invoices", path: paths.dashboard.finance.invoices },
          {
            title: "Payment Settings",
            path: paths.dashboard.finance.paymentSetting,
          },
        ],
      },
      {
        title: "Information",
        path: paths.dashboard.information.root,
        icon: ICONS.information,
        children: [
          { title: "Overview", path: paths.dashboard.information.root },
          { title: "Settings", path: paths.dashboard.information.settings },
        ],
      },
    ],
  },
  {
    subheader: "Administration",
    items: [
      {
        title: "Admin",
        path: paths.dashboard.admin.root,
        icon: ICONS.admin,
        children: [
          { title: "Overview", path: paths.dashboard.admin.root },
          { title: "Users", path: paths.dashboard.admin.users },
        ],
        allowedRoles: ["admin"],
        caption: "Only admin can see this item.",
      },
    ],
  },
];
