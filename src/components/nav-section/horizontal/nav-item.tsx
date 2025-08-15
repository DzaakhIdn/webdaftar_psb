/* eslint-disable @typescript-eslint/no-explicit-any */
import { mergeClasses } from 'minimal-shared/utils';

import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase';

import { Iconify } from '../../iconify';
import { createNavItem } from '../utils';
import { navItemStyles, navSectionClasses } from '../styles';

// ----------------------------------------------------------------------

interface NavItemProps {
  path?: string;
  icon?: React.ReactElement;
  info?: React.ReactNode;
  title?: string;
  caption?: string;
  open?: boolean;
  active?: boolean;
  disabled?: boolean;
  depth?: number;
  render?: (props: any) => React.ReactNode;
  hasChild?: boolean;
  slotProps?: Record<string, any>;
  className?: string;
  externalLink?: boolean;
  enabledRootRedirect?: boolean;
  [key: string]: any;
}

export function NavItem({
  path,
  icon,
  info,
  title,
  caption,
  open = false,
  active = false,
  disabled = false,
  depth,
  render,
  hasChild,
  slotProps = {},
  className = '',
  externalLink,
  enabledRootRedirect,
  ...other
}: NavItemProps) {
  const navItem = createNavItem({
    path,
    icon,
    info,
    depth,
    render,
    hasChild,
    externalLink,
    enabledRootRedirect,
  });

  const ownerState = {
    open,
    active,
    disabled,
    variant: navItem.rootItem ? 'rootItem' : 'subItem' as 'rootItem' | 'subItem',
  };

  return (
    <ItemRoot
      aria-label={title ?? ''}
      {...ownerState}
      {...navItem.baseProps}
      className={mergeClasses([navSectionClasses.item.root, className], {
        [navSectionClasses.state.open]: open,
        [navSectionClasses.state.active]: active,
        [navSectionClasses.state.disabled]: disabled,
      })}
      sx={slotProps.sx}
      {...other}
    >
      {icon && (
        <ItemIcon {...ownerState} className={navSectionClasses.item.icon} sx={slotProps.icon}>
          {navItem.renderIcon}
        </ItemIcon>
      )}

      {title && (
        <ItemTitle {...ownerState} className={navSectionClasses.item.title} sx={slotProps.title}>
          {title}
        </ItemTitle>
      )}

      {caption && (
        <Tooltip title={caption} arrow>
          <ItemCaptionIcon
            {...ownerState}
            icon="eva:info-outline"
            className={navSectionClasses.item.caption}
            sx={slotProps.caption}
          />
        </Tooltip>
      )}

      {info && (
        <ItemInfo {...ownerState} className={navSectionClasses.item.info} sx={slotProps.info}>
          {navItem.renderInfo}
        </ItemInfo>
      )}

      {hasChild && (
        <ItemArrow
          {...ownerState}
          icon={navItem.subItem ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-downward-fill'}
          className={navSectionClasses.item.arrow}
          sx={slotProps.arrow}
        />
      )}
    </ItemRoot>
  );
}

// ----------------------------------------------------------------------

interface OwnerState {
  open?: boolean;
  active?: boolean;
  disabled?: boolean;
  variant?: 'rootItem' | 'subItem';
}

const shouldForwardProp = (prop: PropertyKey) =>
  !['open', 'active', 'disabled', 'variant', 'sx'].includes(prop as string);

/**
 * @slot root
 */
const ItemRoot = styled(ButtonBase, { shouldForwardProp })<ButtonBaseProps & OwnerState>(
  ({ active, open, disabled, variant, theme }) => {
    const rootItemStyles = {
      padding: 'var(--nav-item-root-padding)',
      minHeight: 'var(--nav-item-root-height)',
      ...(open && {
        color: 'var(--nav-item-root-open-color)',
        backgroundColor: 'var(--nav-item-root-open-bg)',
      }),
      ...(active && {
        color: 'var(--nav-item-root-active-color)',
        backgroundColor: 'var(--nav-item-root-active-bg)',
        '&:hover': { backgroundColor: 'var(--nav-item-root-active-hover-bg)' },
        ...theme.applyStyles?.('dark', {
          color: 'var(--nav-item-root-active-color-on-dark)',
        }),
      }),
    };

    const subItemStyles = {
      padding: 'var(--nav-item-sub-padding)',
      minHeight: 'var(--nav-item-sub-height)',
      color: theme.vars.palette.text.secondary,
      ...(open && {
        color: 'var(--nav-item-sub-open-color)',
        backgroundColor: 'var(--nav-item-sub-open-bg)',
      }),
      ...(active && {
        color: 'var(--nav-item-sub-active-color)',
        backgroundColor: 'var(--nav-item-sub-active-bg)',
      }),
    };

    return {
      width: '100%',
      flexShrink: 0,
      color: 'var(--nav-item-color)',
      borderRadius: 'var(--nav-item-radius)',
      '&:hover': { backgroundColor: 'var(--nav-item-hover-bg)' },
      ...(variant === 'rootItem' ? rootItemStyles : subItemStyles),
      ...(disabled ? navItemStyles.disabled : {}),
    };
  }
);

/**
 * @slot icon
 */
const ItemIcon = styled('span', { shouldForwardProp })<OwnerState>(({ variant }) => ({
  ...navItemStyles.icon,
  width: 'var(--nav-icon-size)',
  height: 'var(--nav-icon-size)',
  margin:
    variant === 'subItem'
      ? 'var(--nav-icon-sub-margin)'
      : 'var(--nav-icon-root-margin)',
}));

/**
 * @slot title
 */
const ItemTitle = styled('span', { shouldForwardProp })<OwnerState>(({ active, theme }) => ({
  ...navItemStyles.title(theme),
  ...theme.typography.body2,
  fontWeight: active
    ? theme.typography.fontWeightSemiBold
    : theme.typography.fontWeightMedium,
}));

/**
 * @slot caption icon
 */
const ItemCaptionIcon = styled(Iconify, { shouldForwardProp })<OwnerState>(({ variant, theme }) => ({
  ...navItemStyles.captionIcon,
  color: 'var(--nav-item-caption-color)',
  ...(variant === 'rootItem' && { marginLeft: theme.spacing(0.75) }),
}));

/**
 * @slot info
 */
const ItemInfo = styled('span', { shouldForwardProp })(() => ({
  ...navItemStyles.info,
}));

/**
 * @slot arrow
 */
const ItemArrow = styled(Iconify, { shouldForwardProp })<OwnerState>(({ variant, theme }) => ({
  ...navItemStyles.arrow(theme),
  ...(variant === 'subItem' && { marginRight: theme.spacing(-0.5) }),
}));
