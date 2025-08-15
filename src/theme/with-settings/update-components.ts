// ----------------------------------------------------------------------

import { Theme } from "@mui/material/styles";
import { CSSObject } from "@mui/material/styles";

interface ExtendedTheme extends Theme {
  vars: Theme['vars'] & {
    customShadows?: {
      z1?: string;
      [key: string]: string | undefined;
    };
  };
}

interface StyleOverrideProps {
  theme: ExtendedTheme;
  ownerState?: Record<string, unknown>;
  [key: string]: unknown;
}

type SlotStyleFunction = (props: StyleOverrideProps) => CSSObject;
type SlotStyle = SlotStyleFunction | CSSObject | undefined | null;

function getSlotStyles(slot: SlotStyle, props: StyleOverrideProps): CSSObject {
  const slotStyles: CSSObject =
    typeof slot === "function" && props
      ? slot(props)
      : (slot as CSSObject) ?? {};

  return slotStyles;
}

// ----------------------------------------------------------------------

interface ComponentsConfig {
  MuiCard?: {
    styleOverrides?: {
      root?: SlotStyle;
    };
  };
  [key: string]: unknown;
}

interface SettingsState {
  contrast?: string;
  fontSize?: string | number;
  [key: string]: unknown;
}

export function updateComponentsWithSettings(
  components: ComponentsConfig,
  settingsState: SettingsState
) {
  const MuiCard = {
    styleOverrides: {
      root: (props: StyleOverrideProps) => {
        const { theme } = props;

        const rootStyles = getSlotStyles(
          components?.MuiCard?.styleOverrides?.root,
          props
        );

        return {
          ...rootStyles,
          ...(settingsState?.contrast === "hight" && {
            boxShadow: theme.vars.customShadows?.z1,
          }),
        };
      },
    },
  };

  const MuiCssBaseline = {
    styleOverrides: {
      html: {
        fontSize: settingsState?.fontSize,
      },
    },
  };

  return {
    components: {
      MuiCard,
      MuiCssBaseline,
    },
  };
}
