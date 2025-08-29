"use client";

import { useState } from "react";
import { Box, Card, Tabs, Tab, Typography } from "@mui/material";
import { UserSelf } from "../user-self";
import { ParentForm } from "../parent-form";
import { AdressForm } from "../adress-form";
import { DashboardContent } from "@/layout/dashboard";

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
            Silahkan isi form pendaftaran
          </Typography>
          <Typography sx={{ mb: 3 }}>
            Harap isi data diri Anda dengan benar dan lengkap. Data yang telah
            Anda isi dapat diubah kapan saja
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="registration form tabs"
          >
            <Tab label="Data Diri" {...a11yProps(0)} />
            <Tab label="Data Orang Tua" {...a11yProps(1)} />
            <Tab label="Alamat" {...a11yProps(2)} />
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
