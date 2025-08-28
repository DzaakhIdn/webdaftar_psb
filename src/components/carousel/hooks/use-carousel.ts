import { useMemo } from "react";
import useEmblaCarousel, {
  EmblaCarouselType,
  EmblaOptionsType,
  EmblaPluginType,
} from "embla-carousel-react";

import { useTheme } from "@mui/material/styles";

import { useThumbs } from "./use-thumbs";
import { useCarouselDots } from "./use-carousel-dots";
import { useParallax } from "./use-carousel-parallax";
import { useCarouselArrows } from "./use-carousel-arrows";
import { useCarouselProgress } from "./use-carousel-progress";
import { useCarouselAutoPlay } from "./use-carousel-auto-play";
import { useCarouselAutoScroll } from "./use-carousel-auto-scroll";

// ----------------------------------------------------------------------

export type CarouselReturn = ReturnType<typeof useCarousel>;

export const useCarousel = (
  options?: EmblaOptionsType & { thumbs?: any; parallax?: boolean },
  plugins?: EmblaPluginType[]
) => {
  const theme = useTheme();

  const [mainRef, mainApi] = useEmblaCarousel(
    { ...options, direction: theme.direction },
    plugins
  );

  const { disablePrev, disableNext, onClickPrev, onClickNext } =
    useCarouselArrows(mainApi);

  const pluginNames = plugins?.map((plugin) => plugin.name);

  const _dots = useCarouselDots(mainApi);

  const _autoplay = useCarouselAutoPlay(mainApi);

  const _autoScroll = useCarouselAutoScroll(mainApi);

  const _progress = useCarouselProgress(mainApi);

  const _thumbs = useThumbs(
    mainApi as EmblaCarouselType | undefined,
    options?.thumbs
  );

  useParallax(mainApi, options?.parallax);

  const controls = useMemo(() => {
    if (pluginNames?.includes("autoplay")) {
      return {
        onClickPrev: () => _autoplay.onClickAutoplay(onClickPrev),
        onClickNext: () => _autoplay.onClickAutoplay(onClickNext),
      } as const;
    }
    if (pluginNames?.includes("autoScroll")) {
      return {
        onClickPrev: () => _autoScroll.onClickAutoplay(onClickPrev),
        onClickNext: () => _autoScroll.onClickAutoplay(onClickNext),
      } as const;
    }
    return { onClickPrev, onClickNext } as const;
  }, [_autoScroll, _autoplay, onClickNext, onClickPrev, pluginNames]);

  const mergedOptions = {
    ...options,
    ...mainApi?.internalEngine().options,
  } as const;

  return {
    options: mergedOptions,
    pluginNames,
    mainRef,
    mainApi,
    // arrows
    arrows: {
      disablePrev,
      disableNext,
      onClickPrev: controls.onClickPrev,
      onClickNext: controls.onClickNext,
    },
    // dots
    dots: _dots,
    // thumbs
    thumbs: _thumbs,
    // progress
    progress: _progress,
    // autoplay
    autoplay: _autoplay,
    autoScroll: _autoScroll,
  } as const;
};
