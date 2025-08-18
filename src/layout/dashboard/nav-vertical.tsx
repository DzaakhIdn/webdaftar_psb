/* eslint-disable @typescript-eslint/no-explicit-any */
import { varAlpha, mergeClasses } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import { Breakpoint, styled, SxProps } from "@mui/material/styles";

// import { Logo } from 'src/components/logo';
import { Scrollbar } from "@/components/scrollbar";
import { NavSectionVertical } from "@/components/nav-section";

import { layoutClasses } from "../core/classes";
// import { NavUpgrade } from '../components/nav-upgrade';
import { NavToggleButton } from "../components/nav-toggle-button";

// ----------------------------------------------------------------------

interface NavItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  [key: string]: any;
}

interface navSection {
  subheader?: string;
  items: NavItem[];
}

interface NavVerticalProps {
  sx?: SxProps;
  data: navSection[] | NavItem[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  cssVars?: Record<string, string | number>;
  className?: string;
  onToggleNav?: () => void;
  checkPermissions?: (roles: string[] | undefined) => boolean;
  layoutQuery: Breakpoint;
  [key: string]: any;
}

export function NavVertical({
  sx,
  data,
  slots,
  cssVars,
  className,
  onToggleNav,
  checkPermissions,
  layoutQuery,
  ...other
}: NavVerticalProps) {
  const sections: navSection[] =
    Array.isArray(data) && "title" in (data[0] || {})
      ? [{ items: data as NavItem[] }] // kalau NavItem[] → bungkus
      : (data as navSection[]);

  return (
    <NavRoot
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
        onClick={onToggleNav}
        sx={[
          (theme) => ({
            display: "none",
            [theme.breakpoints.up(layoutQuery)]: { display: "inline-flex" },
          }),
        ]}
      />
      <>
        {slots?.topArea ?? <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}></Box>}

        <Scrollbar fillContent>
          <NavSectionVertical
            data={sections}
            cssVars={cssVars}
            checkPermissions={checkPermissions}
            sx={{ px: 2, flex: "1 1 auto" }}
          />
        </Scrollbar>
      </>
    </NavRoot>
  );
}

// ----------------------------------------------------------------------

interface NavRootProps {
  layoutQuery?: Breakpoint;
}

const NavRoot = styled("div", {
  shouldForwardProp: (prop) =>
    !["layoutQuery", "sx"].includes(prop as string),
})<NavRootProps>(({ layoutQuery = "md", theme }) => ({
  top: 0,
  left: 0,
  height: "100%",
  display: "none",
  position: "fixed",
  flexDirection: "column",
  zIndex: "var(--layout-nav-zIndex)",
  backgroundColor: "var(--layout-nav-bg)",
  width: "var(--layout-nav-vertical-width)",
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
