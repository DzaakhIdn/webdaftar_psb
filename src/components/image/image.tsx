'use client';

import { useInView } from 'framer-motion';
import { mergeRefs, mergeClasses } from 'minimal-shared/utils';
import { useRef, useState, useCallback, startTransition, forwardRef } from 'react';

import { imageClasses } from './classes';
import { ImageImg, ImageRoot, ImageOverlay, ImagePlaceholder } from './styles';
import { SxProps } from '@mui/material/styles';
import { Theme } from '@emotion/react';
import type { UseInViewOptions } from 'framer-motion';

// ----------------------------------------------------------------------

const DEFAULT_DELAY = 0;
const DEFAULT_EFFECT = {
  style: 'blur',
  duration: 300,
  disabled: false,
};

interface ImageSlotProps {
  overlay?: React.HTMLAttributes<HTMLSpanElement>;
  placeholder?: React.HTMLAttributes<HTMLSpanElement>;
  img?: React.ImgHTMLAttributes<HTMLImageElement>;
}

interface ImageEffect {
  style?: string;
  duration?: number;
  disabled?: boolean;
}

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'ref'> {
  sx?: SxProps<Theme>;
  src: string;
  ratio?: number;
  onLoad?: () => void;
  effect?: ImageEffect;
  alt?: string;
  slotProps?: ImageSlotProps;
  className?: string;
  viewportOptions?: Omit<UseInViewOptions, 'root'> & { root?: React.RefObject<Element | null> };
  disablePlaceholder?: boolean;
  visibleByDefault?: boolean;
  delayTime?: number;
}

interface ImageRootProps extends React.HTMLAttributes<HTMLSpanElement> {
  effect?: ImageEffect;
  sx?: SxProps<Theme>;
  className?: string;
}

// Cast ImageRoot to include the effect prop and ref
const StyledImageRoot = ImageRoot as React.ComponentType<ImageRootProps & { ref?: React.Ref<HTMLSpanElement> }>;

export const Image = forwardRef<HTMLSpanElement, ImageProps>(({
  sx,
  src,
  ratio,
  onLoad,
  effect,
  alt = '',
  slotProps,
  className,
  viewportOptions,
  disablePlaceholder,
  visibleByDefault = false,
  delayTime = DEFAULT_DELAY,
  ...other
}, ref) => {
  const localRef = useRef<HTMLSpanElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const isInView = useInView(localRef, {
    once: true,
    ...viewportOptions,
  });

  const handleImageLoad = useCallback(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setIsLoaded(true);
        onLoad?.();
      });
    }, delayTime);

    return () => clearTimeout(timer);
  }, [delayTime, onLoad]);

  const finalEffect: ImageEffect = {
    ...DEFAULT_EFFECT,
    ...effect,
  };

  const shouldRenderImage = visibleByDefault || isInView;
  const showPlaceholder = !visibleByDefault && !isLoaded && !disablePlaceholder;

  const renderComponents = {
    overlay: () =>
      slotProps?.overlay && (
        <ImageOverlay className={imageClasses.overlay} {...slotProps.overlay} />
      ),
    placeholder: () =>
      showPlaceholder && (
        <ImagePlaceholder className={imageClasses.placeholder} {...slotProps?.placeholder} />
      ),
    image: () => (
      <ImageImg
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        className={imageClasses.img}
        {...slotProps?.img}
      />
    ),
  };

  return (
    <StyledImageRoot
      ref={mergeRefs([localRef, ref])}
      effect={visibleByDefault || finalEffect.disabled ? undefined : finalEffect}
      className={mergeClasses([imageClasses.root, className], {
        [imageClasses.state.loaded]: !visibleByDefault && isLoaded,
      })}
      sx={[
        {
          '--aspect-ratio': ratio,
          ...(!!ratio && { width: 1 }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {renderComponents.overlay()}
      {renderComponents.placeholder()}
      {shouldRenderImage && renderComponents.image()}
    </StyledImageRoot>
  );
});

Image.displayName = 'Image';
