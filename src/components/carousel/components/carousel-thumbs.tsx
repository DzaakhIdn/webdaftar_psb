import { Children, isValidElement } from "react";
import { mergeClasses } from "minimal-shared/utils";

import { styled } from "@mui/material/styles";

import { carouselClasses } from "../classes";
import { CarouselSlide } from "./carousel-slide";

// ----------------------------------------------------------------------

export interface CarouselThumbsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sx?: any;
  options?: { axis?: "x" | "y"; slideSpacing?: string };
  slotProps?: { slide?: any; container?: any; disableMask?: boolean };
  className?: string;
}

export function CarouselThumbs({
  sx,
  options,
  children,
  slotProps,
  className,
  ...other
}: CarouselThumbsProps) {
  const axis = options?.axis ?? "x";
  const slideSpacing = options?.slideSpacing ?? "12px";

  const renderChildren = () =>
    Children.map(children, (child) => {
      if (isValidElement(child)) {
        const reactChild = child as any;

        return (
          <CarouselSlide
            key={reactChild.key}
            options={{ ...options, slideSpacing }}
            sx={slotProps?.slide}
          >
            {child}
          </CarouselSlide>
        );
      }
      return null;
    });

  return (
    <ThumbsRoot
      axis={axis}
      enableMask={!slotProps?.disableMask}
      className={mergeClasses([carouselClasses.thumbs.root, className])}
      sx={sx}
      {...other}
    >
      <ThumbsContainer
        axis={axis}
        slideSpacing={slideSpacing}
        className={carouselClasses.thumbs.container}
        sx={slotProps?.container}
      >
        {renderChildren()}
      </ThumbsContainer>
    </ThumbsRoot>
  );
}

// ----------------------------------------------------------------------

const ThumbsRoot = styled("div", {
  shouldForwardProp: (prop) =>
    !["axis", "enableMask", "sx"].includes(prop as string),
})(({ enableMask, theme }) => {
  const maskBg = `${theme.vars.palette.background.paper} 20%, transparent 100%)`;

  return {
    flexShrink: 0,
    margin: "auto",
    maxWidth: "100%",
    overflow: "hidden",
    position: "relative",
    variants: [
      {
        props: { axis: "x" },
        style: {
          maxWidth: "100%",
          padding: theme.spacing(0.5),
          ...(enableMask && {
            "&::before, &::after": {
              top: 0,
              zIndex: 9,
              width: 40,
              content: '""',
              height: "100%",
              position: "absolute",
            },
            "&::before": {
              left: -8,
              background: `linear-gradient(to right, ${maskBg}`,
            },
            "&::after": {
              right: -8,
              background: `linear-gradient(to left, ${maskBg}`,
            },
          }),
        },
      },
      {
        props: { axis: "y" },
        style: {
          height: "100%",
          maxHeight: "100%",
          padding: theme.spacing(0.5),
          ...(enableMask && {
            "&::before, &::after": {
              left: 0,
              zIndex: 9,
              height: 40,
              content: '""',
              width: "100%",
              position: "absolute",
            },
            "&::before": {
              top: -8,
              background: `linear-gradient(to bottom, ${maskBg}`,
            },
            "&::after": {
              bottom: -8,
              background: `linear-gradient(to top, ${maskBg}`,
            },
          }),
        },
      },
    ],
  } as const;
});

const ThumbsContainer = styled("ul", {
  shouldForwardProp: (prop) =>
    !["axis", "slideSpacing", "sx"].includes(prop as string),
})(({ slideSpacing }) => ({
  display: "flex",
  backfaceVisibility: "hidden",
  variants: [
    {
      props: { axis: "x" },
      style: {
        touchAction: "pan-y pinch-zoom",
        marginLeft: `calc(${slideSpacing} * -1)`,
      },
    },
    {
      props: { axis: "y" },
      style: {
        height: "100%",
        flexDirection: "column",
        touchAction: "pan-x pinch-zoom",
        marginTop: `calc(${slideSpacing} * -1)`,
      },
    },
  ],
}));
