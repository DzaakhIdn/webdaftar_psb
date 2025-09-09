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
  template: <Iconify icon="solar:chat-round-line-bold-duotone" />,
};

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: "Overview",
    items: [{ title: "App", path: "/dashboard", icon: ICONS.dashboard }],
  },
  {
    subheader: "Management",
    items: [
      {
        title: "Master Data",
        path: paths.dashboard.master.root,
        icon: ICONS.notebook,
        children: [
          { title: "List Jalur", path: paths.dashboard.master.listJalur },
          { title: "File Wajib", path: paths.dashboard.master.fileWajib },
          { title: "Jenjang", path: paths.dashboard.master.jenjang },
          {
            title: "Profile Sekolah",
            path: paths.dashboard.master.profileSekolah,
          },
        ],
      },
      {
        title: "Template Pesan",
        path: paths.dashboard.template,
        icon: ICONS.template,
      },
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
          { title: "Overview", path: paths.dashboard.finance.overview },
          {
            title: "List Payments",
            path: paths.dashboard.finance.listPayments,
          },
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
          { title: "Users", path: paths.dashboard.admin.users },
          { title: "Setting", path: paths.dashboard.admin.setting },
        ],
        allowedRoles: ["admin"],
        caption: "Only admin can see this item.",
      },
      {
        title: "Pengumuman",
        path: paths.dashboard.information.root,
        icon: ICONS.information,
      },
    ],
  },
];
