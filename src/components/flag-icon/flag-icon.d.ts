import type { SxProps, Theme } from '@mui/material/styles';

export interface FlagIconProps {
  code?: string;
  className?: string;
  sx?: SxProps<Theme>;
  [key: string]: any;
}

export function FlagIcon(props: FlagIconProps): JSX.Element | null;
