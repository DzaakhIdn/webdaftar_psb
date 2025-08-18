/* eslint-disable @typescript-eslint/no-explicit-any */
import { mergeClasses } from "minimal-shared/utils";

import Tooltip from "@mui/material/Tooltip";
import { styled, SxProps, Theme } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";

import { Iconify } from "../../iconify";
import { createNavItem } from "../utils";
import { navItemStyles, navSectionClasses } from "../styles";
// import Box from "@mui/material/Box";

// ----------------------------------------------------------------------

type NavItemProps = {
  path: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
  title?: string;
  caption?: string;
  open?: boolean;
  active?: boolean;
  disabled?: boolean;
  depth?: number;
  render?: React.ReactNode;
  hasChild?: boolean;
  slotProps?: {
    sx?: SxProps<Theme>;
    icon?: any;
    texts?: any;
    title?: any;
    caption?: any;
    info?: any;
    arrow?: any;
  };
  className?: string;
  externalLink?: boolean;
  enabledRootRedirect?: boolean;
  [key: string]: any;
};

export function NavItem({
  path,
  icon,
  info,
  title,
  caption,
  /********/
  open,
  active,
  disabled,
  /********/
  depth,
  render,
  hasChild,
  slotProps,
  className,
  externalLink,
  enabledRootRedirect,
  ...other
}: NavItemProps) {
  const navItem = createNavItem({
    path,
    icon: icon,
    info: info ? String(info) : undefined,
    depth,
    render:
      typeof render === "function"
        ? (render as {
            (): React.ReactNode;
            navIcon?: Record<string, React.ReactNode>;
            navInfo?: (value: any) => Record<string, React.ReactNode>;
          })
        : undefined,
    hasChild,
    externalLink,
    enabledRootRedirect,
  });

  const ownerState = {
    open,
    active,
    disabled,
    variant: navItem.rootItem ? "rootItem" : "subItem",
  };

  return (
    <ItemRoot
      aria-label={title}
      {...ownerState}
      {...navItem.baseProps}
      className={mergeClasses([navSectionClasses.item.root, className], {
        [navSectionClasses.state.open]: open,
        [navSectionClasses.state.active]: active,
        [navSectionClasses.state.disabled]: disabled,
      })}
      sx={slotProps?.sx}
      {...other}
    >
      {icon && (
        <ItemIcon
          {...ownerState}
          className={navSectionClasses.item.icon}
          sx={slotProps?.icon}
        >
          {navItem.renderIcon}
        </ItemIcon>
      )}

      {title && (
        <ItemTexts
          {...ownerState}
          className={navSectionClasses.item.texts}
          sx={slotProps?.texts}
        >
          <ItemTitle
            {...ownerState}
            className={navSectionClasses.item.title}
            sx={slotProps?.title}
          >
            {title}
          </ItemTitle>

          {caption && (
            <Tooltip title={caption} placement="top-start">
              <ItemCaptionText
                {...ownerState}
                className={navSectionClasses.item.caption}
                sx={slotProps?.caption}
              >
                {caption}
              </ItemCaptionText>
            </Tooltip>
          )}
        </ItemTexts>
      )}

      {info && (
        <ItemInfo
          {...ownerState}
          className={navSectionClasses.item.info}
          sx={slotProps?.info}
        >
          {navItem.renderInfo}
        </ItemInfo>
      )}

      {hasChild && (
        <ItemArrow
          {...ownerState}
          icon={
            open ? "eva:arrow-ios-downward-fill" : "eva:arrow-ios-forward-fill"
          }
          className={navSectionClasses.item.arrow}
          sx={slotProps?.arrow}
        />
      )}
    </ItemRoot>
  );
}

// ----------------------------------------------------------------------

const shouldForwardProp = (prop: string) =>
  !["open", "active", "disabled", "variant", "sx"].includes(prop);

interface ItemRootProps {
  active?: boolean;
  open?: boolean;
  variant?: "rootItem" | "subItem" | string;
}

/**
 * @slot root
 */
const ItemRoot = styled(ButtonBase, { shouldForwardProp })<ItemRootProps>(
  ({ active, open, theme }) => {
    const bulletSvg = `"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23efefef' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E"`;

    const bulletStyles = {
      left: 0,
      content: '""',
      position: "absolute",
      width: "var(--nav-bullet-size)",
      height: "var(--nav-bullet-size)",
      backgroundColor: "var(--nav-bullet-light-color)",
      mask: `url(${bulletSvg}) no-repeat 50% 50%/100% auto`,
      WebkitMask: `url(${bulletSvg}) no-repeat 50% 50%/100% auto`,
      transform:
        theme.direction === "rtl"
          ? "translate(calc(var(--nav-bullet-size) * 1), calc(var(--nav-bullet-size) * -0.4)) scaleX(-1)"
          : "translate(calc(var(--nav-bullet-size) * -1), calc(var(--nav-bullet-size) * -0.4))",
      ...theme.applyStyles("dark", {
        backgroundColor: "var(--nav-bullet-dark-color)",
      }),
    };

    const rootItemStyles = {
      minHeight: "var(--nav-item-root-height)",
      ...(open && {
        color: "var(--nav-item-root-open-color)",
        backgroundColor: "var(--nav-item-root-open-bg)",
      }),
      ...(active && {
        color: "var(--nav-item-root-active-color)",
        backgroundColor: "var(--nav-item-root-active-bg)",
        "&:hover": { backgroundColor: "var(--nav-item-root-active-hover-bg)" },
        ...theme.applyStyles("dark", {
          color: "var(--nav-item-root-active-color-on-dark)",
        }),
      }),
    };

    const subItemStyles = {
      minHeight: "var(--nav-item-sub-height)",
      "&::before": bulletStyles,
      ...(open && {
        color: "var(--nav-item-sub-open-color)",
        backgroundColor: "var(--nav-item-sub-open-bg)",
      }),
      ...(active && {
        color: "var(--nav-item-sub-active-color)",
        backgroundColor: "var(--nav-item-sub-active-bg)",
      }),
    };

    return {
      width: "100%",
      paddingTop: "var(--nav-item-pt)",
      paddingLeft: "var(--nav-item-pl)",
      paddingRight: "var(--nav-item-pr)",
      paddingBottom: "var(--nav-item-pb)",
      borderRadius: "var(--nav-item-radius)",
      color: "var(--nav-item-color)",
      "&:hover": { backgroundColor: "var(--nav-item-hover-bg)" },
      variants: [
        { props: { variant: "rootItem" }, style: rootItemStyles },
        { props: { variant: "subItem" }, style: subItemStyles },
        { props: { disabled: true }, style: navItemStyles.disabled },
      ],
    };
  }
);

/**
 * @slot icon
 */

const ItemIcon = styled("span", { shouldForwardProp })({
  ...navItemStyles.icon,
  width: "var(--nav-icon-size)",
  height: "var(--nav-icon-size)",
  margin: "var(--nav-icon-margin)",
});

const ItemTexts = styled("span")({
  ...navItemStyles.texts,
});

const ItemTitle = styled("span", { shouldForwardProp })<{ active?: boolean }>(
  ({ theme }) => ({
    ...navItemStyles.title(theme),
    ...theme.typography.body2,
    fontWeight: theme.typography.fontWeightMedium,
  })
);

const ItemCaptionText = styled("span", { shouldForwardProp })({
  ...navItemStyles.captionText,
  color: "var(--nav-item-caption-color)",
});

const ItemInfo = styled("span", { shouldForwardProp })({
  ...navItemStyles.info,
});

const ItemArrow = styled(Iconify, { shouldForwardProp })(({ theme }) => ({
  ...navItemStyles.arrow(theme),
}));
