"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Box, Card, Tabs, Tab, Typography } from "@mui/material";
import { UserSelf } from "../user-self";
import { ParentForm } from "../parent-form";
import { AdressForm } from "../adress-form";
import { DashboardContent } from "@/layout/dashboard";

// Dynamic import untuk menghindari hydration mismatch
const DynamicIconify = dynamic(
  () =>
    import("@/components/iconify").then((mod) => ({ default: mod.Iconify })),
  {
    ssr: false,
    loading: () => <Box sx={{ width: 24, height: 24 }} />,
  }
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`registration-tabpanel-${index}`}
      aria-labelledby={`registration-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `registration-tab-${index}`,
    "aria-controls": `registration-tabpanel-${index}`,
  };
}

export function FormRegView() {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <DashboardContent
      maxWidth="xl"
      sx={{
        borderTop: `solid 1px rgba(145, 158, 171, 0.12)`,
        pt: 3,
        mb: { xs: 3, md: 5 },
      }}
    >
      <Card sx={{ width: "100%", overflow: "hidden", p: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            Silahkan Lengkapi Form Pendaftaran
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Harap isi data diri Anda dengan benar dan lengkap. Data yang telah
            Anda isi dapat diubah kapan saja
          </Typography>
        </Box>

        <Box
          sx={{ borderBottom: 1, borderColor: "divider" }}
          suppressHydrationWarning
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="registration form tabs"
            variant="fullWidth"
            suppressHydrationWarning
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "primary.main",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
              "& .MuiTab-root": {
                minHeight: 72,
                fontWeight: 600,
                fontSize: "0.875rem",
                textTransform: "none",
                borderRadius: "12px 12px 0 0",
                margin: "0 4px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "action.hover",
                  transform: "translateY(-2px)",
                },
                "&.Mui-selected": {
                  color: "primary.main",
                  backgroundColor: "primary.lighter",
                  fontWeight: 700,
                },
                "& .MuiSvgIcon-root": {
                  fontSize: "1.5rem",
                  marginBottom: "4px",
                },
              },
            }}
          >
            <Tab
              label="Data Diri"
              {...a11yProps(0)}
              icon={<DynamicIconify icon="solar:user-id-duotone" />}
              iconPosition="top"
            />
            <Tab
              label="Data Orang Tua"
              {...a11yProps(1)}
              icon={
                <DynamicIconify icon="solar:users-group-two-rounded-duotone" />
              }
              iconPosition="top"
            />
            <Tab
              label="Alamat"
              {...a11yProps(2)}
              icon={<DynamicIconify icon="solar:map-point-duotone" />}
              iconPosition="top"
            />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <UserSelf />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ParentForm />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <AdressForm />
        </TabPanel>
      </Card>
    </DashboardContent>
  );
}
