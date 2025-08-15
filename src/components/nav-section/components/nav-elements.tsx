import { mergeClasses } from "minimal-shared/utils";

import { styled, SxProps, Theme } from "@mui/material/styles";

import { navSectionClasses } from "../styles";

// ----------------------------------------------------------------------

export const Nav = styled("nav")``;

// ----------------------------------------------------------------------

interface NavListProps {
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

interface NavUlProps extends React.HTMLAttributes<HTMLUListElement> {
  sx?: SxProps<Theme>;
  className?: string;
}

export const NavLi = styled(
  (props: NavListProps) => (
    <li
      {...props}
      className={mergeClasses([navSectionClasses.li, props.className])}
    />
  ),
  { shouldForwardProp: (prop) => !["disabled", "sx"].includes(prop as string) }
)<NavListProps>(() => ({
  display: "inline-block",
  variants: [{ props: { disabled: true }, style: { cursor: "not-allowed" } }],
}));

// ----------------------------------------------------------------------

export const NavUl = styled(
  (props: NavUlProps) => (
    <ul
      {...props}
      className={mergeClasses([navSectionClasses.ul, props.className])}
    />
  ),
  { shouldForwardProp: (prop) => prop !== "sx" } // blokir `sx` biar gak nyangkut ke DOM
)<NavUlProps>(() => ({
  display: "flex",
  flexDirection: "column",
}));
