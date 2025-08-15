import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

interface ExtendedTheme extends Theme {
  vars: Theme['vars'] & {
    customShadows: {
      card: string;
      [key: string]: string;
    };
  };
}

const MuiCard = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme }: { theme: ExtendedTheme }) => ({
      position: 'relative' as const,
      boxShadow: theme.vars.customShadows.card,
      borderRadius: Number(theme.shape.borderRadius) * 2,
      zIndex: 0, // Fix Safari overflow: hidden with border radius
    }),
  },
};

// ----------------------------------------------------------------------

const MuiCardHeader = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: {
    titleTypographyProps: { variant: 'h6' as const },
    subheaderTypographyProps: { variant: 'body2' as const, marginTop: '4px' },
  },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: ({ theme }: { theme: Theme }) => ({ padding: theme.spacing(3, 3, 0) }) },
};

// ----------------------------------------------------------------------

const MuiCardContent = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: ({ theme }: { theme: Theme }) => ({ padding: theme.spacing(3) }) },
};

// ----------------------------------------------------------------------

export const card = { MuiCard, MuiCardHeader, MuiCardContent };
