import { mergeClasses } from "minimal-shared/utils";

import { styled } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";

import { navSectionClasses } from "../styles";

// ----------------------------------------------------------------------

export const Nav = styled("nav")``;

// ----------------------------------------------------------------------

interface NavLiProps extends React.LiHTMLAttributes<HTMLLIElement> {
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export const NavLi = styled(
  (props: NavLiProps) => (
    <li
      {...props}
      className={mergeClasses([navSectionClasses.li, props.className])}
    />
  ),
  { shouldForwardProp: (prop: string) => !["disabled", "sx"].includes(prop) }
)(() => ({
  display: "inline-block",
  variants: [{ props: { disabled: true }, style: { cursor: "not-allowed" } }],
}));

// ----------------------------------------------------------------------

interface NavUlProps extends React.HTMLAttributes<HTMLUListElement> {
  sx?: SxProps<Theme>;
}

export const NavUl = styled((props: NavUlProps) => (
  <ul
    {...props}
    className={mergeClasses([navSectionClasses.ul, props.className])}
  />
))(() => ({ display: "flex", flexDirection: "column" }));
