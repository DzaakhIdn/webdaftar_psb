import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';

import { ArrowButton, ArrowButtonProps } from './arrow-button';
import { carouselClasses } from '../classes';

// ----------------------------------------------------------------------

const BasicButtonsRoot = styled('div')(({ theme }) => ({
  gap: '4px',
  zIndex: 9,
  alignItems: 'center',
  display: 'inline-flex',
  color: theme.vars.palette.action.active,
}));

// ----------------------------------------------------------------------

export interface CarouselArrowButtonsBaseProps {
  sx?: any;
  options?: { axis?: 'x' | 'y'; direction?: 'ltr' | 'rtl' };
  slotProps?: {
    prevBtn?: Partial<ArrowButtonProps> & { sx?: any };
    nextBtn?: Partial<ArrowButtonProps> & { sx?: any };
  };
}

export interface CarouselArrowBasicButtonsProps extends CarouselArrowButtonsBaseProps {
  onClickPrev?: () => void;
  onClickNext?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  className?: string;
}

export function CarouselArrowBasicButtons({
  sx,
  options,
  slotProps,
  onClickPrev,
  onClickNext,
  disablePrev,
  disableNext,
  className,
  ...other
}: CarouselArrowBasicButtonsProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <BasicButtonsRoot
      className={mergeClasses([carouselClasses.arrows.root, className])}
      sx={sx}
      {...other}
    >
      <ArrowButton
        variant="prev"
        options={options}
        disabled={disablePrev}
        onClick={onClickPrev}
        svgIcon={slotProps?.prevBtn?.svgIcon}
        svgSize={slotProps?.prevBtn?.svgSize}
        sx={slotProps?.prevBtn?.sx}
      />

      <ArrowButton
        variant="next"
        options={options}
        disabled={disableNext}
        onClick={onClickNext}
        svgIcon={slotProps?.nextBtn?.svgIcon}
        svgSize={slotProps?.nextBtn?.svgSize}
        sx={slotProps?.nextBtn?.sx}
      />
    </BasicButtonsRoot>
  );
}

// ----------------------------------------------------------------------

export function CarouselArrowFloatButtons({
  sx,
  options,
  slotProps,
  onClickPrev,
  onClickNext,
  disablePrev,
  disableNext,
}: CarouselArrowBasicButtonsProps & React.HTMLAttributes<HTMLDivElement>) {
  const baseStyles = (theme: any) => ({
    zIndex: 9,
    top: '50%',
    borderRadius: 1.5,
    position: 'absolute',
    color: 'common.white',
    bgcolor: 'text.primary',
    '&:hover': { opacity: 0.8 },
    ...theme.applyStyles('dark', {
      color: 'grey.800',
    }),
  });

  return (
    <>
      <ArrowButton
        variant="prev"
        options={options}
        disabled={disablePrev}
        onClick={onClickPrev}
        svgIcon={slotProps?.prevBtn?.svgIcon}
        svgSize={slotProps?.prevBtn?.svgSize}
        sx={[
          (theme: any) => ({
            ...baseStyles(theme),
            left: 0,
            transform: 'translate(-50%, -50%)',
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
          ...(Array.isArray(slotProps?.prevBtn?.sx)
            ? (slotProps?.prevBtn?.sx ?? [])
            : [slotProps?.prevBtn?.sx]),
        ]}
      />

      <ArrowButton
        variant="next"
        options={options}
        disabled={disableNext}
        onClick={onClickNext}
        svgIcon={slotProps?.nextBtn?.svgIcon}
        svgSize={slotProps?.nextBtn?.svgSize}
        sx={[
          (theme: any) => ({
            ...baseStyles(theme),
            right: 0,
            transform: 'translate(50%, -50%)',
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
          ...(Array.isArray(slotProps?.nextBtn?.sx)
            ? (slotProps?.nextBtn?.sx ?? [])
            : [slotProps?.nextBtn?.sx]),
        ]}
      />
    </>
  );
}

// ----------------------------------------------------------------------

const NumberButtonsRoot = styled('div')(({ theme }) => ({
  gap: '2px',
  zIndex: 9,
  alignItems: 'center',
  display: 'inline-flex',
  padding: theme.spacing(0.5),
  color: theme.vars.palette.common.white,
  borderRadius: theme.shape.borderRadius * 1.25,
  backgroundColor: varAlpha(theme.vars.palette.grey['900Channel'], 0.48),
  [`& .${carouselClasses.arrows.label}`]: {
    ...theme.typography.subtitle2,
    margin: theme.spacing(0, 0.5),
  },
  [`& .${carouselClasses.arrows.prev}`]: {
    borderRadius: 'inherit',
    padding: theme.spacing(0.75),
  },
  [`& .${carouselClasses.arrows.next}`]: {
    borderRadius: 'inherit',
    padding: theme.spacing(0.75),
  },
}));

// ----------------------------------------------------------------------

export interface CarouselArrowNumberButtonsProps extends CarouselArrowButtonsBaseProps {
  totalSlides: number;
  className?: string;
  selectedIndex?: number;
  onClickPrev?: () => void;
  onClickNext?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
}

export function CarouselArrowNumberButtons({
  sx,
  options,
  slotProps,
  className,
  totalSlides,
  onClickPrev,
  onClickNext,
  disablePrev,
  disableNext,
  selectedIndex,
  ...other
}: CarouselArrowNumberButtonsProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <NumberButtonsRoot
      className={mergeClasses([carouselClasses.arrows.root, className])}
      sx={sx}
      {...other}
    >
      <ArrowButton
        variant="prev"
        options={options}
        disabled={disablePrev}
        onClick={onClickPrev}
        svgIcon={slotProps?.prevBtn?.svgIcon}
        svgSize={slotProps?.prevBtn?.svgSize ?? 16}
        sx={slotProps?.prevBtn?.sx}
      />

      <span className={carouselClasses.arrows.label}>
        {selectedIndex}/{totalSlides}
      </span>

      <ArrowButton
        variant="next"
        options={options}
        disabled={disableNext}
        onClick={onClickNext}
        svgIcon={slotProps?.nextBtn?.svgIcon}
        svgSize={slotProps?.nextBtn?.svgSize ?? 16}
        sx={slotProps?.nextBtn?.sx}
      />
    </NumberButtonsRoot>
  );
}

