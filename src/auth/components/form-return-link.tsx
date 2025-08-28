import Link from "@mui/material/Link";

import { RouterLink } from "@/routes/components";

import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

export function FormReturnLink({
  sx,
  href,
  label,
  icon,
  children,
  ...other
}: {
  sx?: any;
  href?: string;
  label?: string;
  icon?: any;
  children?: any;
}) {
  const renderContent = () => (
    <>
      {icon || <Iconify width={16} icon="eva:arrow-ios-back-fill" />}
      {label || "Return to sign in"}
      {children}
    </>
  );

  if (href) {
    return (
      <Link
        component={RouterLink}
        href={href}
        color="inherit"
        variant="subtitle2"
        sx={[
          {
            mt: 3,
            gap: 0.5,
            mx: "auto",
            alignItems: "center",
            display: "inline-flex",
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {renderContent()}
      </Link>
    );
  }

  return (
    <div
      style={{
        marginTop: 24, // mt: 3 equivalent
        gap: 4, // gap: 0.5 equivalent
        marginLeft: "auto",
        marginRight: "auto",
        alignItems: "center",
        display: "inline-flex",
        color: "inherit",
        fontSize: "0.875rem", // subtitle2 variant
        fontWeight: 600,
        lineHeight: 1.57,
        ...(sx && !Array.isArray(sx) ? sx : {}),
        ...(Array.isArray(sx) ? Object.assign({}, ...sx) : {}),
      }}
      {...other}
    >
      {renderContent()}
    </div>
  );
}
