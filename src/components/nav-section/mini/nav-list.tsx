import { useEffect, useCallback, useState } from "react";
import { usePopoverHover } from "minimal-shared/hooks";
import { isActiveLink, isExternalLink } from "minimal-shared/utils";

import { useTheme, SxProps, Theme } from "@mui/material/styles";

import { usePathname } from "@/routes/hooks";

import { NavItem } from "./nav-item";
import { navSectionClasses } from "../styles";
import { NavUl, NavLi, NavDropdown, NavDropdownPaper } from "../components";

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

export function NavList({
  data,
  depth,
  render,
  cssVars,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: NavListProps) {
  const theme = useTheme();

  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = mounted
    ? isActiveLink(pathname, data.path || "", !!data.children)
    : false;

  const {
    open,
    onOpen,
    onClose,
    anchorEl,
    elementRef: navItemRef,
  } = usePopoverHover();

  const isRtl = theme.direction === "rtl";
  const id = open ? `${data.title}-popover` : undefined;

  useEffect(() => {
    // If the pathname changes, close the menu
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = useCallback(() => {
    if (data.children) {
      onOpen();
    }
  }, [data.children, onOpen]);

  const renderNavItem = () => (
    <NavItem
      ref={navItemRef}
      aria-describedby={id}
      // slots
      path={data.path}
      icon={data.icon}
      info={data.info}
      title={data.title}
      caption={data.caption}
      // state
      active={isActive}
      open={open}
      disabled={data.disabled}
      // options
      depth={depth}
      render={render}
      hasChild={!!data.children}
      externalLink={isExternalLink(data.path || "")}
      enabledRootRedirect={enabledRootRedirect}
      // styles
      className=""
      slotProps={depth === 1 ? slotProps?.rootItem : slotProps?.subItem}
      // actions
      onMouseEnter={handleOpenMenu}
      onMouseLeave={onClose}
    />
  );

  const renderDropdown = () =>
    !!data.children && (
      <NavDropdown
        disableScrollLock
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: isRtl ? "left" : "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: isRtl ? "right" : "left",
        }}
        slotProps={{
          paper: {
            onMouseEnter: handleOpenMenu,
            onMouseLeave: onClose,
            className: navSectionClasses.dropdown.root,
          },
        }}
        sx={{ ...cssVars }}
      >
        <NavDropdownPaper
          className={navSectionClasses.dropdown.paper}
          sx={slotProps?.dropdown?.paper}
        >
          <NavSubList
            data={data.children}
            depth={depth}
            render={render}
            cssVars={cssVars}
            slotProps={slotProps}
            checkPermissions={checkPermissions}
            enabledRootRedirect={enabledRootRedirect}
          />
        </NavDropdownPaper>
      </NavDropdown>
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
    <NavLi disabled={data.disabled}>
      {renderNavItem()}
      {/*
       * TODO: Should be removed in MUI next.
       * Add `open` condition to disable transition effect on close.
       * https://github.com/mui/material-ui/issues/43106
       */}
      {open && renderDropdown()}
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
  cssVars?: Record<string, string | number>;
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
    dropdown?: {
      paper?: SxProps<Theme>;
    };
  };
  checkPermissions?: (roles: string[] | undefined) => boolean;
  enabledRootRedirect?: boolean;
}

function NavSubList({
  data,
  render,
  cssVars,
  depth = 0,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: NavSubListProps) {
  return (
    <NavUl sx={{ gap: 0.5 }}>
      {data.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={depth + 1}
          cssVars={cssVars}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );
}
