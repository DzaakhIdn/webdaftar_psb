'use client';

import { mergeClasses } from 'minimal-shared/utils';

import { styled, type SxProps } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

import { layoutClasses } from './classes';
import { layoutSectionVars } from './css-vars';
import { Theme } from '@emotion/react';
import { JSX } from 'react';

// ----------------------------------------------------------------------

type LayoutSectionProps = {
  sx?: SxProps<Theme>;
  cssVars?: Record<string, string | number>;
  children?: React.ReactNode;
  footerSection?: JSX.Element | null;
  headerSection?: JSX.Element | null;
  sidebarSection?: JSX.Element | null;
  className?: string;
  [key: string]: unknown;
};

export function LayoutSection({
  sx,
  cssVars,
  children,
  footerSection,
  headerSection,
  sidebarSection,
  className,
  ...other
}: LayoutSectionProps) {
  const inputGlobalStyles = (
    <GlobalStyles styles={(theme) => ({ body: { ...layoutSectionVars(theme), ...cssVars } })} />
  );

  return (
    <>
      {inputGlobalStyles}

      <LayoutRoot
        id="root__layout"
        className={mergeClasses([layoutClasses.root, className])}
        sx={sx}
        {...other}
      >
        {sidebarSection ? (
          <>
            {sidebarSection}
            <LayoutSidebarContainer className={layoutClasses.sidebarContainer}>
              {headerSection}
              {children}
              {footerSection}
            </LayoutSidebarContainer>
          </>
        ) : (
          <>
            {headerSection}
            {children}
            {footerSection}
          </>
        )}
      </LayoutRoot>
    </>
  );
}

// ----------------------------------------------------------------------

const LayoutRoot = styled('div')``;

const LayoutSidebarContainer = styled('div')(() => ({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
}));
