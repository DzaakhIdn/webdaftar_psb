import { useState, useEffect, useCallback } from "react";
import type { EmblaCarouselType } from "embla-carousel-react";

// ----------------------------------------------------------------------

interface AutoplayPlugin {
  isPlaying(): boolean;
  play(): void;
  stop(): void;
  reset(): void;
  options: {
    stopOnInteraction: boolean;
  };
}

interface PluginsRegistry {
  autoplay?: AutoplayPlugin;
}

// ----------------------------------------------------------------------

export function useCarouselAutoPlay(mainApi?: EmblaCarouselType | null) {
  const [isPlaying, setIsPlaying] = useState(false);

  const onClickAutoplay = useCallback(
    (callback: () => void) => {
      const autoplay = (mainApi?.plugins() as PluginsRegistry)?.autoplay;
      if (!autoplay) return;

      const resetOrStop =
        autoplay.options.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop;

      resetOrStop();
      callback();
    },
    [mainApi]
  );

  const onTogglePlay = useCallback(() => {
    const autoplay = (mainApi?.plugins() as PluginsRegistry)?.autoplay;
    if (!autoplay) return;

    const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play;
    playOrStop();
  }, [mainApi]);

  useEffect(() => {
    const autoplay = (mainApi?.plugins() as PluginsRegistry)?.autoplay;
    if (!autoplay) return;

    setIsPlaying(autoplay.isPlaying());
    mainApi
      ?.on("autoplay:play", () => setIsPlaying(true))
      .on("autoplay:stop", () => setIsPlaying(false))
      .on("reInit", () => setIsPlaying(false));
  }, [mainApi]);

  return { isPlaying, onTogglePlay, onClickAutoplay } as const;
}
