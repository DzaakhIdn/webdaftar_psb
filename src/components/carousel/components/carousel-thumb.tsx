import { mergeClasses } from "minimal-shared/utils";

import { styled } from "@mui/material/styles";
import ButtonBase, { ButtonBaseProps } from "@mui/material/ButtonBase";

import { carouselClasses } from "../classes";

// ----------------------------------------------------------------------

export interface CarouselThumbProps extends ButtonBaseProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sx?: any;
  src: string;
  index: number;
  selected?: boolean;
  className?: string;
}

export function CarouselThumb({
  sx,
  src,
  index,
  selected,
  className,
  ...other
}: CarouselThumbProps) {
  return (
    <ThumbRoot
      selected={selected}
      className={mergeClasses([carouselClasses.thumbs.item, className])}
      sx={sx}
      {...other}
    >
      <img
        alt={`carousel-thumb-${index}`}
        src={src}
        className={carouselClasses.thumbs.image}
      />
    </ThumbRoot>
  );
}

// ----------------------------------------------------------------------

interface ThumbRootProps extends ButtonBaseProps {
  selected?: boolean;
}

const ThumbRoot = styled(ButtonBase, {
  shouldForwardProp: (prop) => !["selected", "sx"].includes(prop as string),
})<ThumbRootProps>(({ theme }) => ({
  width: 64,
  height: 64,
  opacity: 0.48,
  flexShrink: 0,
  cursor: "pointer",
  borderRadius:
    (typeof theme.shape.borderRadius === "number"
      ? theme.shape.borderRadius
      : 4) * 1.25,
  transition: theme.transitions.create(["opacity", "box-shadow"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.short,
  }),
  [`& .${carouselClasses.thumbs.image}`]: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "inherit",
  },
  variants: [
    {
      props: { selected: true },
      style: {
        opacity: 1,
        boxShadow: `0 0 0 2px ${theme.vars.palette.primary.main}`,
      },
    },
  ],
}));
