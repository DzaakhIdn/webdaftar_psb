import { mergeClasses } from "minimal-shared/utils";

import { useTheme, type SxProps, type Theme } from "@mui/material/styles";

import { NavList } from "./nav-list";
import { Nav, NavUl, NavLi } from "../components";
import { navSectionClasses, navSectionCssVars } from "../styles";

// ----------------------------------------------------------------------

interface NavItemData {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
  caption?: string;
  disabled?: boolean;
  children?: NavItemData[];
  roles?: string[];
  allowedRoles?: string[];
}

interface NavSection {
  subheader?: string;
  items: NavItemData[];
}

interface NavSectionMiniProps {
  sx?: SxProps<Theme>;
  data?: NavSection[];
  render?: {
    navIcon?: Record<string, React.ReactNode>;
    navInfo?: (value: unknown) => Record<string, React.ReactElement>;
  };
  className?: string;
  slotProps?: {
    rootItem?: {
      sx?: SxProps<Theme>;
      icon?: SxProps<Theme>;
      texts?: SxProps<Theme>;
      title?: SxProps<Theme>;
      caption?: SxProps<Theme>;
      info?: SxProps<Theme>;
      arrow?: SxProps<Theme>;
    };
    subItem?: {
      sx?: SxProps<Theme>;
      icon?: SxProps<Theme>;
      texts?: SxProps<Theme>;
      title?: SxProps<Theme>;
      caption?: SxProps<Theme>;
      info?: SxProps<Theme>;
      arrow?: SxProps<Theme>;
    };
    dropdown?: {
      paper?: SxProps<Theme>;
    };
  };
  checkPermissions?: (roles: string[] | undefined) => boolean;
  enabledRootRedirect?: boolean;
  cssVars?: Record<string, string | number>;
  [key: string]: unknown;
}

export function NavSectionMini({
  sx,
  data,
  render,
  className,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
  cssVars: overridesVars,
  ...other
}: NavSectionMiniProps) {
  const theme = useTheme();

  const cssVars = { ...navSectionCssVars.mini(theme), ...overridesVars };

  return (
    <Nav
      className={mergeClasses([navSectionClasses.mini, className])}
      sx={[{ ...cssVars }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <NavUl sx={{ flex: "1 1 auto", gap: "var(--nav-item-gap)" }}>
        {data?.map((group, index) => (
          <Group
            key={group.subheader ?? group.items?.[0]?.title ?? `group-${index}`}
            render={render}
            cssVars={cssVars}
            items={group.items || []}
            slotProps={slotProps}
            checkPermissions={checkPermissions}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </Nav>
  );
}

// ----------------------------------------------------------------------

interface GroupProps {
  items: NavItemData[];
  render?: {
    navIcon?: Record<string, React.ReactNode>;
    navInfo?: (value: unknown) => Record<string, React.ReactElement>;
  };
  cssVars?: Record<string, string | number>;
  slotProps?: {
    rootItem?: {
      sx?: SxProps<Theme>;
      icon?: SxProps<Theme>;
      texts?: SxProps<Theme>;
      title?: SxProps<Theme>;
      caption?: SxProps<Theme>;
      info?: SxProps<Theme>;
      arrow?: SxProps<Theme>;
    };
    subItem?: {
      sx?: SxProps<Theme>;
      icon?: SxProps<Theme>;
      texts?: SxProps<Theme>;
      title?: SxProps<Theme>;
      caption?: SxProps<Theme>;
      info?: SxProps<Theme>;
      arrow?: SxProps<Theme>;
    };
    dropdown?: {
      paper?: SxProps<Theme>;
    };
  };
  checkPermissions?: (roles: string[] | undefined) => boolean;
  enabledRootRedirect?: boolean;
}

function Group({
  items,
  render,
  cssVars,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: GroupProps) {
  return (
    <NavLi>
      <NavUl sx={{ gap: "var(--nav-item-gap)" }}>
        {items.map((list) => (
          <NavList
            key={list.title}
            depth={1}
            data={list}
            render={render}
            cssVars={cssVars}
            slotProps={slotProps}
            checkPermissions={checkPermissions}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </NavLi>
  );
}
