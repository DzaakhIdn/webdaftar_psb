"use client";

import { paths } from "@/routes/paths";

import { DashboardContent } from "@/layout/dashboard";

import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { PaymentRequired } from "../payment-required";
import { PaymentUser } from "../payment-user";

export function PaymentView() {
  return (
    <DashboardContent
      maxWidth="xl"
      sx={{ pt: 3, borderTop: `solid 1px rgba(145, 158, 171, 0.12)` }}
    >
      <CustomBreadcrumbs
        heading="List Pembayaran"
        links={[
          { name: "Dashboard Registant", href: paths.registant.root },
          { name: "List Pembayaran" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <PaymentRequired />
      <PaymentUser />
    </DashboardContent>
  );
}
