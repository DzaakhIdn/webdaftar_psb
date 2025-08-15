'use client';

import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';

// import { allLangs } from 'src/locales';
// import { _contacts, _notifications } from 'src/_mock';

// import { Logo } from 'src/components/logo';
import { useSettingsContext } from '@/components/settings';
import { useMockedUser } from '@/auth/use-mocked-user';

import { NavMobile } from './nav-mobile';
import { VerticalDivider } from './content';
import { NavVertical } from './nav-vertical';
import { layoutClasses } from '../core/classes';
import { NavHorizontal } from './nav-horizontal';
import { _account } from '../nav-config-account';
import { MainSection } from '../core/main-section';
// import { Searchbar } from '../components/searchbar';
// import { _workspaces } from '../nav-config-workspace';
import { MenuButton } from '@/components/menu-button';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { AccountDrawer } from '@/components/account-drawer';
// import { SettingsButton } from '../components/settings-button';
// import { LanguagePopover } from '../components/language-popover';
// import { ContactsPopover } from '../components/contacts-popover';
// import { WorkspacesPopover } from '../components/workspaces-popover';
import { navData as dashboardNavData } from '../nav-config-dashboard';
import { dashboardLayoutVars, dashboardNavColorVars } from './css-vars';
// import { NotificationsDrawer } from '../components/notifications-drawer';

// ------------------------------------------------------
// Type Definitions
// ------------------------------------------------------

interface NavItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  roles?: string[];
  allowedRoles?: string[];
  caption?: string;
}

interface NavSection {
  subheader: string;
  items: NavItem[];
}

interface DashboardLayoutProps {
  sx?: SxProps<Theme> | SxProps<Theme>[];
  cssVars?: Record<string, string | number>;
  children?: React.ReactNode;
  slotProps?: {
    header?: Partial<React.ComponentProps<typeof HeaderSection>>;
    main?: Partial<React.ComponentProps<typeof MainSection>>;
    nav?: {
      data?: NavSection[];
    };
  };
  layoutQuery?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// ------------------------------------------------------

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
}: DashboardLayoutProps) {
  const theme = useTheme();
  const { user } = useMockedUser();
  const settings = useSettingsContext();

  const navVars = dashboardNavColorVars(theme, settings.state.navColor, settings.state.navLayout);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const navData = slotProps?.nav?.data ?? dashboardNavData;

  const isNavMini = settings.state.navLayout === 'mini';
  const isNavHorizontal = settings.state.navLayout === 'horizontal';
  const isNavVertical = isNavMini || settings.state.navLayout === 'vertical';

  const canDisplayItemByRole = (allowedRoles?: string[]) =>
    !allowedRoles?.includes(user?.role ?? '');

  const renderHeader = () => {
    const headerSlotProps = {
      container: {
        maxWidth: false,
        sx: {
          ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
          ...(isNavHorizontal && {
            bgcolor: 'var(--layout-nav-bg)',
            height: { [layoutQuery]: 'var(--layout-nav-horizontal-height)' },
            [`& .${iconButtonClasses.root}`]: {
              color: 'var(--layout-nav-text-secondary-color)',
            },
          }),
        },
      },
    };

    const headerSlots = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      // bottomArea: isNavHorizontal ? (
      //   <NavHorizontal
      //     data={navData}
      //     layoutQuery={layoutQuery}
      //     cssVars={navVars.section}
      //     checkPermissions={canDisplayItemByRole}
      //   />
      // ) : null,
      leftArea: (
        <>
          <MenuButton
            onClick={onOpen}
            sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
          />
          <NavMobile
            data={navData}
            open={open}
            onClose={onClose}
            cssVars={navVars.section}
            checkPermissions={canDisplayItemByRole}
          />
          {/* {isNavHorizontal && (
            <>
              <Box
              sx={{
                display: 'none',
                width: 40,
                height: 40,
                bgcolor: 'primary.main',
                borderRadius: 1,
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                [theme.breakpoints.up(layoutQuery)]: { 
                display: 'flex'
                },
              }}
              >
              LOGO
              </Box>
              <VerticalDivider
              sx={{ [theme.breakpoints.up(layoutQuery)]: { display: 'flex' } }}
              />
            </>
          )} */}
        </>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
          <AccountDrawer data={_account} />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        disableElevation={isNavVertical}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderSidebar = () => (
    <NavVertical
      data={navData}
      isNavMini={isNavMini}
      layoutQuery={layoutQuery}
      cssVars={navVars.section}
      checkPermissions={canDisplayItemByRole}
      onToggleNav={() =>
        settings.setField(
          'navLayout',
          settings.state.navLayout === 'vertical' ? 'mini' : 'vertical'
        )
      }
    />
  );

  const renderFooter = () => null;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      headerSection={renderHeader()}
      sidebarSection={isNavHorizontal ? null : renderSidebar()}
      footerSection={renderFooter()}
      cssVars={{ ...dashboardLayoutVars(theme), ...navVars.layout, ...cssVars }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              pl: isNavMini
                ? 'var(--layout-nav-mini-width)'
                : 'var(--layout-nav-vertical-width)',
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
            },
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}
