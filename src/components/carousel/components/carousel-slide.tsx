import { mergeClasses } from "minimal-shared/utils";

import { styled } from "@mui/material/styles";

import { getSlideSize } from "../utils";
import { carouselClasses } from "../classes";

// ----------------------------------------------------------------------

export interface CarouselSlideProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  sx?: any;
  options?: {
    axis?: "x" | "y";
    slideSpacing?: string;
    parallax?: boolean;
    slidesToShow?: any;
  };
  className?: string;
}

export function CarouselSlide({
  sx,
  options,
  children,
  className,
  ...other
}: CarouselSlideProps) {
  const slideSize = getSlideSize(options?.slidesToShow);

  return (
    <CarouselSlideRoot
      axis={options?.axis ?? "x"}
      slideSpacing={options?.slideSpacing}
      className={mergeClasses([carouselClasses.slide.root, className])}
      sx={[{ flex: slideSize }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      {options?.parallax ? (
        <div className={carouselClasses.slide.content}>
          <div className={carouselClasses.slide.parallax}>{children}</div>
        </div>
      ) : (
        children
      )}
    </CarouselSlideRoot>
  );
}

// ----------------------------------------------------------------------

const CarouselSlideRoot = styled("li", {
  shouldForwardProp: (prop) =>
    !["axis", "slideSpacing", "sx"].includes(prop as string),
})(({ slideSpacing }) => ({
  display: "block",
  position: "relative",
  [`& .${carouselClasses.slide.content}`]: {
    overflow: "hidden",
    position: "relative",
    borderRadius: "inherit",
  },
  variants: [
    { props: { axis: "x" }, style: { minWidth: 0, paddingLeft: slideSpacing } },
    { props: { axis: "y" }, style: { minHeight: 0, paddingTop: slideSpacing } },
  ],
}));
