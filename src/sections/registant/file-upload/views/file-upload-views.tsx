"use client";

import { paths } from "@/routes/paths";

import { DashboardContent } from "@/layout/dashboard_user";

import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { FileUploadPage } from "../file-upload-page";

// ----------------------------------------------------------------------

export function FileUploadView() {
  return (
    <DashboardContent
      sx={{ pt: 3, borderTop: `solid 1px rgba(145, 158, 171, 0.12)` }}
    >
      <CustomBreadcrumbs
        heading="Upload File"
        links={[
          { name: "Dashboard Registant", href: paths.registant.root },
          { name: "Upload File" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <FileUploadPage />
    </DashboardContent>
  );
}
