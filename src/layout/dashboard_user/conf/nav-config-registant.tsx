import { paths } from "@/routes/paths";

// import { Label } from "@/components/label";
import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

const ICONS = {
  dashboard: <Iconify icon="solar:home-angle-bold-duotone" />,
  biodata: <Iconify icon="solar:user-bold-duotone" />,
  files: <Iconify icon="solar:file-check-bold-duotone" />,
  payment: <Iconify icon="solar:card-bold-duotone" />,
};

// ----------------------------------------------------------------------

export const navData = [
  {
    subheader: "Overview",
    items: [{ title: "App", path: "/registant", icon: ICONS.dashboard }],
  },
  {
    subheader: "Informasi Pribadi",
    items: [
      {
        title: "Data Pribadi",
        path: paths.registant.biodata.form,
        icon: ICONS.biodata,
      },
      { title: "Files", path: paths.registant.biodata.file, icon: ICONS.files },
    ],
  },
  {
    subheader: "Pembayaran",
    items: [
      {
        title: "Pembayaran",
        path: paths.registant.finance.payment,
        icon: ICONS.payment,
      },
    ],
  },
];
