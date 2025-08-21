/* eslint-disable @typescript-eslint/no-explicit-any */
import { useBoolean } from "minimal-shared/hooks";
import { mergeClasses } from "minimal-shared/utils";

import { useTheme, SxProps, Theme } from "@mui/material/styles";

import { NavList } from "./nav-list";
import { Nav, NavUl, NavLi, NavSubheader, NavCollapse } from "../components";
import { navSectionClasses, navSectionCssVars } from "../styles";

// ----------------------------------------------------------------------

interface NavSectionVerticalProps {
  sx?: SxProps<Theme>;
  data?: any[];
  render?: any;
  className?: string;
  slotProps?: any;
  checkPermissions?: (roles: string[] | undefined) => boolean;
  enabledRootRedirect?: boolean;
  cssVars?: Record<string, string | number>;
  [key: string]: any;
}

export function NavSectionVertical({
  sx,
  data,
  render,
  className,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
  cssVars: overridesVars,
  ...other
}: NavSectionVerticalProps) {
  const theme = useTheme();

  const cssVars = { ...navSectionCssVars.vertical(theme), ...overridesVars };

  return (
    <Nav
      className={mergeClasses([navSectionClasses.vertical, className])}
      sx={[{ ...cssVars }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <NavUl sx={{ flex: "1 1 auto", gap: "var(--nav-item-gap)" }}>
        {data?.map((group: any, index: number) => (
          <Group
            key={group.subheader ?? group.items?.[0]?.title ?? `group-${index}`}
            subheader={group.subheader}
            items={group.items || []}
            render={render}
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
  items: any[];
  render?: any;
  subheader?: string;
  slotProps?: any;
  checkPermissions?: (roles: string[] | undefined) => boolean;
  enabledRootRedirect?: boolean;
}

function Group({
  items,
  render,
  subheader,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
}: GroupProps) {
  const groupOpen = useBoolean(true);

  const renderContent = () => (
    <NavUl sx={{ gap: "var(--nav-item-gap)" }}>
      {items.map((list: any) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={1}
          slotProps={slotProps}
          checkPermissions={checkPermissions}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );

  return (
    <NavLi>
      {subheader ? (
        <>
          <NavSubheader
            data-title={subheader}
            open={groupOpen.value}
            onClick={groupOpen.onToggle}
            sx={slotProps?.subheader}
          >
            {subheader}
          </NavSubheader>

          <NavCollapse in={groupOpen.value}>
            {renderContent()}
          </NavCollapse>
        </>
      ) : (
        renderContent()
      )}
    </NavLi>
  );
}
