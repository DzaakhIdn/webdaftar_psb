"use client";

import { paths } from "@/routes/paths";

import { DashboardContent } from "@/layout/dashboard_user";

import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";

import { UserNewEditForm } from "../user-new-edit-form";

// ----------------------------------------------------------------------

export function UserEditView() {
  return (
    <DashboardContent sx={{ pt: 3, borderTop: `solid 1px rgba(145, 158, 171, 0.12)` }}>
      <CustomBreadcrumbs
        heading="Biodata"
        links={[
          { name: "Dashboard Registant", href: paths.registant.root },
          { name: "Biodata" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserNewEditForm />
    </DashboardContent>
  );
}
