import { useBoolean } from "minimal-shared/hooks";
import { useRef, useEffect, useCallback, useState } from "react";
import { isActiveLink, isExternalLink } from "minimal-shared/utils";

import { SxProps, Theme } from "@mui/material/styles";

import { usePathname } from "@/routes/hooks";

import { NavItem } from "./nav-item";
import { navSectionClasses } from "../styles";
import { NavUl, NavLi, NavCollapse } from "../components";

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

interface NavListProps {
  data: NavItemData;
  depth?: number;
  render?: {
    navIcon?: Record<string, React.ReactNode>;
    navInfo?: (value: unknown) => Record<string, React.ReactElement>;
  };
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
  };
  checkPermissions?: (roles: string[] | undefined) => boolean;
  enabledRootRedirect?: boolean;
}

export function NavList({
  data,
  depth,
  render,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: NavListProps) {
  const pathname = usePathname();
  const navItemRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = mounted
    ? isActiveLink(pathname, data.path || "", !!data.children)
    : false;

  const { value: open, onFalse: onClose, onToggle } = useBoolean(isActive);

  useEffect(() => {
    if (!isActive) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggleMenu = useCallback(() => {
    if (data.children) {
      onToggle();
    }
  }, [data.children, onToggle]);

  const renderNavItem = () => (
    <NavItem
      ref={navItemRef}
      // slots
      path={data.path}
      icon={data.icon}
      info={data.info}
      title={data.title}
      caption={data.caption}
      // state
      open={open}
      active={isActive}
      disabled={data.disabled}
      // options
      depth={depth}
      render={render}
      hasChild={!!data.children}
      externalLink={isExternalLink(data.path || "")}
      enabledRootRedirect={enabledRootRedirect}
      // styles
      slotProps={depth === 1 ? slotProps?.rootItem : slotProps?.subItem}
      // actions
      onClick={handleToggleMenu}
    />
  );

  const renderCollapse = () =>
    !!data.children && (
      <NavCollapse
        mountOnEnter
        unmountOnExit
        in={open}
        depth={depth}
        data-group={data.title}
      >
        <NavSubList
          data={data.children}
          render={render}
          depth={depth}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      </NavCollapse>
    );

  // Hidden item by role
  if (
    data.allowedRoles &&
    checkPermissions &&
    checkPermissions(data.allowedRoles)
  ) {
    return null;
  }

  return (
    <NavLi
      disabled={data.disabled}
      sx={{
        ...(!!data.children && {
          [`& .${navSectionClasses.li}`]: {
            "&:first-of-type": { mt: "var(--nav-item-gap)" },
          },
        }),
      }}
    >
      {renderNavItem()}
      {renderCollapse()}
    </NavLi>
  );
}

// ----------------------------------------------------------------------

interface NavSubListProps {
  data: NavItemData[];
  render?: {
    navIcon?: Record<string, React.ReactNode>;
    navInfo?: (value: unknown) => Record<string, React.ReactElement>;
  };
  depth?: number;
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
  };
  checkPermissions?: (roles: string[] | undefined) => boolean;
  enabledRootRedirect?: boolean;
}

function NavSubList({
  data,
  render,
  depth = 0,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: NavSubListProps) {
  return (
    <NavUl sx={{ gap: "var(--nav-item-gap)" }}>
      {data.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={depth + 1}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );
}
