import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import { fDateTime } from '@/utils/format-time';

import { Label } from '@/components/label';
import { Image } from '@/components/image';
import { Iconify } from '@/components/iconify';
import { Carousel, useCarousel, CarouselArrowBasicButtons } from '@/components/carousel';
import { SxProps } from '@mui/material/styles';
import { Theme } from '@emotion/react';

// ----------------------------------------------------------------------

// Define the structure of a booking item based on the mock data
interface BookingItem {
  id: string;
  name: string;
  avatarUrl: string;
  bookedAt: Date | string;
  duration: string;
  guests: string;
  isHot: boolean;
  price: number;
  coverUrl: string;
}

interface BookingViewsProps {
  title: string;
  subheader: string;
  list: BookingItem[];
  sx?: SxProps<Theme>;
}

export function BookingNewest({ title, subheader, list, sx, ...other }: BookingViewsProps) {
  const carousel = useCarousel({
    align: 'start',
    slideSpacing: '24px',
    slidesToShow: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
    },
  });

  return (
    <Box sx={[{ py: 2 }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={<CarouselArrowBasicButtons {...carousel.arrows} />}
        sx={{ p: 0, mb: 3 }}
      />

      <Carousel carousel={carousel}>
        {list.map((item) => (
          <Item key={item.id} item={item} sx={{ height: 1 }} />
        ))}
      </Carousel>
    </Box>
  );
}

// ----------------------------------------------------------------------

interface ItemProps {
  item: BookingItem;
  sx?: SxProps<Theme>;
}

function Item({ item, sx, ...other }: ItemProps) {
  return (
    <Box
      sx={[
        {
          width: 1,
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.neutral',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          px: 2,
          pb: 1,
          gap: 2,
          pt: 2.5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar alt={item.name} src={item.avatarUrl} />
          <ListItemText
            primary={item.name}
            secondary={fDateTime({ date: item.bookedAt })}
            slotProps={{
              secondary: {
                sx: {
                  mt: 0.5,
                  typography: 'caption',
                  color: 'text.disabled',
                },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            rowGap: 1.5,
            columnGap: 2,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            typography: 'caption',
            color: 'text.secondary',
          }}
        >
          <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
            <Iconify width={16} icon="solar:calendar-date-bold" sx={{ flexShrink: 0 }} />
            {item.duration}
          </Box>

          <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
            <Iconify width={16} icon="solar:users-group-rounded-bold" sx={{ flexShrink: 0 }} />
            {item.guests} guests
          </Box>
        </Box>
      </Box>

      <Label variant="filled" sx={{ right: 16, zIndex: 9, bottom: 16, position: 'absolute' }}>
        {item.isHot && '🔥'} ${item.price}
      </Label>

      <Box sx={{ p: 1, position: 'relative' }}>
        <Image alt={item.coverUrl} src={item.coverUrl} ratio={1} sx={{ borderRadius: 1.5 }} />
      </Box>
    </Box>
  );
}
