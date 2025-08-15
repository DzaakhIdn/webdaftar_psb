import { JSX, useEffect } from "react";
import { mergeClasses } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import { usePathname } from "next/navigation";

import { Logo } from "@/components/logo";
import { Scrollbar } from "@/components/scrollbar";
import { NavSectionVertical } from "@/components/nav-section";

import { layoutClasses } from "../core/classes";
import { SxProps } from "@mui/material/styles";
import { Theme } from "@emotion/react";

// ----------------------------------------------------------------------

interface NavItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  roles?: string[];
  subheader?: string;
  items?: NavItem[];
}

interface NavMobileProps {
  sx?: SxProps<Theme>;
  data?: NavItem[];
  open?: boolean;
  slots?: {
    topArea?: JSX.Element;
    bottomArea?: JSX.Element;
  };
  onClose?: () => void;
  className?: string;
  checkPermissions?: (roles: string[] | undefined) => boolean;
  cssVars?: Record<string, string | number>;
}

type OtherProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof NavMobileProps
>;

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  className,
  checkPermissions,
  ...other
}: NavMobileProps & OtherProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (open && typeof onClose === "function") {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          className: mergeClasses([
            layoutClasses.nav.root,
            layoutClasses.nav.vertical,
            className,
          ]),
          sx: [
            {
              overflow: "unset",
              bgcolor: "var(--layout-nav-bg)",
              width: "var(--layout-nav-mobile-width)",
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ],
        },
      }}
    >
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          <Logo />
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical
          data={data ?? []}
          checkPermissions={checkPermissions}
          sx={{ px: 2, flex: "1 1 auto" }}
          {...other}
        />
      </Scrollbar>

      {slots?.bottomArea}
    </Drawer>
  );
}
