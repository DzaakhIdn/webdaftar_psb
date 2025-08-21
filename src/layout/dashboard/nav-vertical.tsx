/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { varAlpha, mergeClasses } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import { Breakpoint, styled, SxProps, Theme } from "@mui/material/styles";

import { Logo } from "@/components/logo";
import { Scrollbar } from "@/components/scrollbar";
import { NavSectionVertical } from "@/components/nav-section";
import { NavSectionMini } from "@/components/nav-section/mini";

import { layoutClasses } from "../core/classes";
// import { NavUpgrade } from '../components/nav-upgrade';
import { NavToggleButton } from "../components/nav-toggle-button";

// ----------------------------------------------------------------------

interface NavItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  roles?: string[];
  allowedRoles?: string[];
  caption?: string;
}

interface NavSection {
  subheader?: string;
  items: NavItem[];
}

interface NavVerticalProps {
  sx?: SxProps<Theme>;
  data?: NavItem[] | NavSection[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  cssVars?: Record<string, string | number>;
  className?: string;
  isNavMini?: boolean;
  onToggleNav?: () => void;
  checkPermissions?: (roles: string[] | undefined) => boolean;
  layoutQuery?: Breakpoint;
}

type OtherProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof NavVerticalProps
>;

export function NavVertical({
  sx,
  data,
  slots,
  cssVars,
  className,
  isNavMini,
  onToggleNav,
  checkPermissions,
  layoutQuery = "md",
  ...other
}: NavVerticalProps & OtherProps) {
  const renderNavVertical = () => (
    <>
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          <Logo />
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical
          data={(data || []) as Array<{ subheader?: string; items: any[] }>}
          cssVars={cssVars}
          checkPermissions={checkPermissions}
          sx={{ px: 2, flex: "1 1 auto" }}
        />

        {slots?.bottomArea}
      </Scrollbar>
    </>
  );

  const renderNavMini = () => (
    <>
      {slots?.topArea ?? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2.5 }}>
          <Logo />
        </Box>
      )}

      <NavSectionMini
        data={
          (data || []) as Array<{
            subheader?: string;
            items: Array<{
              title: string;
              path?: string;
              icon?: React.ReactNode;
              info?: React.ReactNode;
              caption?: string;
              disabled?: boolean;
              children?: any[];
              allowedRoles?: string[];
            }>;
          }>
        }
        cssVars={cssVars}
        checkPermissions={checkPermissions}
        sx={[
          (theme) => ({
            ...theme.mixins.hideScrollY,
            pb: 2,
            px: 0.5,
            flex: "1 1 auto",
            overflowY: "auto",
          }),
        ]}
      />

      {slots?.bottomArea}
    </>
  );

  return (
    <NavRoot
      isNavMini={isNavMini}
      layoutQuery={layoutQuery}
      className={mergeClasses([
        layoutClasses.nav.root,
        layoutClasses.nav.vertical,
        className,
      ])}
      sx={sx}
      {...other}
    >
      <NavToggleButton
        isNavMini={isNavMini}
        onClick={onToggleNav}
        sx={[
          (theme) => ({
            display: "none",
            [theme.breakpoints.up(layoutQuery)]: { display: "inline-flex" },
          }),
        ]}
      />
      {isNavMini ? renderNavMini() : renderNavVertical()}
    </NavRoot>
  );
}

// ----------------------------------------------------------------------

interface NavRootProps {
  isNavMini?: boolean;
  layoutQuery?: Breakpoint;
}

const NavRoot = styled("div", {
  shouldForwardProp: (prop) =>
    !["isNavMini", "layoutQuery", "sx"].includes(prop as string),
})<NavRootProps>(({ isNavMini, layoutQuery = "md", theme }) => ({
  top: 0,
  left: 0,
  height: "100%",
  display: "none",
  position: "fixed",
  flexDirection: "column",
  zIndex: "var(--layout-nav-zIndex)",
  backgroundColor: "var(--layout-nav-bg)",
  width: isNavMini
    ? "var(--layout-nav-mini-width)"
    : "var(--layout-nav-vertical-width)",
  borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(
    theme.vars.palette.grey["500Channel"],
    0.12
  )})`,
  transition: theme.transitions.create(["width"], {
    easing: "var(--layout-transition-easing)",
    duration: "var(--layout-transition-duration)",
  }),
  [theme.breakpoints.up(layoutQuery)]: { display: "flex" },
}));
