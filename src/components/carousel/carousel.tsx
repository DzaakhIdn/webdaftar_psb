import { Children, isValidElement, ReactElement, ReactNode } from "react";
import { mergeClasses } from "minimal-shared/utils";
import type { EmblaViewportRefType } from "embla-carousel-react";

import { styled, SxProps, Theme } from "@mui/material/styles";

import { carouselClasses } from "./classes";
import { CarouselSlide } from "./components/carousel-slide";

// ----------------------------------------------------------------------

interface CarouselOptions {
  axis?: "x" | "y";
  slideSpacing?: string;
  parallax?: boolean;
  slidesToShow?: number | string;
  direction?: "ltr" | "rtl";
}

interface CarouselSlotProps {
  container?: SxProps<Theme>;
  slide?: SxProps<Theme>;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  sx?: SxProps<Theme>;
  carousel: {
    mainRef: EmblaViewportRefType;
    options?: CarouselOptions;
    pluginNames?: string[];
  };
  slotProps?: CarouselSlotProps;
  className?: string;
  children?: ReactNode;
}

interface StyledCarouselRootProps {
  axis?: "x" | "y";
}

interface StyledCarouselContainerProps {
  axis?: "x" | "y";
  slideSpacing?: string;
}

const CarouselRoot = styled("div", {
  shouldForwardProp: (prop) => !["axis", "sx"].includes(prop as string),
})<StyledCarouselRootProps>(({ axis }) => ({
  margin: "auto",
  maxWidth: "100%",
  overflow: "hidden",
  position: "relative",
  ...(axis === "y" && { height: "100%" }),
}));

const CarouselContainer = styled("ul", {
  shouldForwardProp: (prop) =>
    !["axis", "slideSpacing", "sx"].includes(prop as string),
})<StyledCarouselContainerProps>(({ axis, slideSpacing }) => ({
  display: "flex",
  backfaceVisibility: "hidden",
  ...(axis === "x" && {
    touchAction: "pan-y pinch-zoom",
    marginLeft: `calc(${slideSpacing} * -1)`,
  }),
  ...(axis === "y" && {
    height: "100%",
    flexDirection: "column" as const,
    touchAction: "pan-x pinch-zoom",
    marginTop: `calc(${slideSpacing} * -1)`,
  }),
}));

export function Carousel({
  sx,
  carousel,
  children,
  slotProps,
  className,
  ...other
}: CarouselProps) {
  const { mainRef, options } = carousel;

  const axis = options?.axis ?? "x";
  const slideSpacing = options?.slideSpacing ?? "0px";

  const renderChildren = () =>
    Children.map(children, (child) => {
      if (isValidElement(child)) {
        const reactChild = child as ReactElement;

        return (
          <CarouselSlide
            key={reactChild.key}
            options={carousel.options}
            sx={slotProps?.slide}
          >
            {child}
          </CarouselSlide>
        );
      }
      return null;
    });

  return (
    <CarouselRoot
      sx={sx}
      ref={mainRef}
      axis={axis}
      className={mergeClasses([carouselClasses.root, className])}
      {...other}
    >
      <CarouselContainer
        axis={axis}
        slideSpacing={slideSpacing}
        className={carouselClasses.container}
        sx={[
          (theme: Theme) => ({
            ...(carousel.pluginNames?.includes("autoHeight") && {
              alignItems: "flex-start",
              transition: theme.transitions.create(["height"], {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
            }),
          }),
          ...(Array.isArray(slotProps?.container)
            ? slotProps?.container ?? []
            : [slotProps?.container]),
        ]}
      >
        {renderChildren()}
      </CarouselContainer>
    </CarouselRoot>
  );
}
