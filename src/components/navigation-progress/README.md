# Navigation Progress Components

Komponen loading indicator yang muncul di bagian atas halaman saat navigasi antar halaman, mirip dengan yang ada di YouTube, GitHub, dan aplikasi modern lainnya.

## 🚀 Fitur Utama

- **Automatic Detection**: Otomatis mendeteksi perubahan route menggunakan Next.js hooks
- **Multiple Styles**: Solid, gradient, glow, dan pulse effects
- **Customizable**: Warna, tinggi, dan posisi yang dapat disesuaikan
- **Smooth Animations**: Menggunakan Framer Motion untuk animasi yang halus
- **Performance Optimized**: Cleanup yang proper dan efficient re-renders

## 📦 Komponen yang Tersedia

### 1. TopLoadingBar
Loading bar di bagian atas halaman dengan berbagai style options.

```tsx
import { TopLoadingBar } from '@/components/navigation-progress';

// Basic usage
<TopLoadingBar />

// With custom options
<TopLoadingBar 
  height={4} 
  color="primary" 
  style="glow" 
/>
```

**Props:**
- `height?: number` - Tinggi loading bar (default: 3px)
- `color?: "primary" | "secondary" | "success" | "warning" | "error"` - Warna tema
- `style?: "solid" | "gradient" | "glow" | "pulse"` - Style visual

### 2. SimpleNavigationProgress
Loading progress sederhana menggunakan Material-UI LinearProgress.

```tsx
import { SimpleNavigationProgress } from '@/components/navigation-progress';

<SimpleNavigationProgress height={2} color="primary" />
```

**Props:**
- `height?: number` - Tinggi progress bar
- `color?: string` - Warna tema

### 3. NavigationProgress
Loading progress dengan animasi shimmer dan kontrol penuh.

```tsx
import { NavigationProgress } from '@/components/navigation-progress';

<NavigationProgress 
  height={3}
  color="primary"
  position="fixed"
  zIndex={9999}
/>
```

**Props:**
- `height?: number` - Tinggi loading bar
- `color?: string` - Warna tema
- `position?: "fixed" | "absolute" | "sticky"` - Posisi CSS
- `zIndex?: number` - Z-index untuk layering

## 🎨 Style Options

### Solid
```tsx
<TopLoadingBar style="solid" color="primary" />
```
Loading bar dengan warna solid tanpa efek tambahan.

### Gradient
```tsx
<TopLoadingBar style="gradient" color="primary" />
```
Loading bar dengan gradient dari warna utama ke warna terang.

### Glow
```tsx
<TopLoadingBar style="glow" color="primary" />
```
Loading bar dengan efek glow/shadow yang menarik.

### Pulse
```tsx
<TopLoadingBar style="pulse" color="primary" />
```
Loading bar dengan efek pulse/berkedip.

## 🔧 Implementation

### Layout Level (Recommended)
Tambahkan di root layout untuk coverage seluruh aplikasi:

```tsx
// app/dashboard/layout.tsx
import { TopLoadingBar } from '@/components/navigation-progress';

export default function DashboardLayout({ children }) {
  return (
    <html>
      <body>
        <TopLoadingBar height={3} color="primary" style="glow" />
        <YourAppContent>
          {children}
        </YourAppContent>
      </body>
    </html>
  );
}
```

### Component Level
Untuk kontrol yang lebih spesifik:

```tsx
import { TopLoadingBar } from '@/components/navigation-progress';

function MyApp() {
  return (
    <>
      <TopLoadingBar height={4} color="success" style="gradient" />
      <MainContent />
    </>
  );
}
```

## ⚙️ How It Works

1. **Route Detection**: Menggunakan `usePathname()` dan `useSearchParams()` dari Next.js
2. **Progress Simulation**: Simulasi progress yang realistis dengan timing yang natural
3. **Animation**: Smooth enter/exit animations menggunakan Framer Motion
4. **Cleanup**: Proper cleanup untuk mencegah memory leaks

```tsx
// Simplified implementation
useEffect(() => {
  setIsLoading(true);
  setProgress(0);

  // Quick initial progress
  const initialTimer = setTimeout(() => setProgress(30), 50);
  
  // Gradual progress
  const progressTimer = setInterval(() => {
    setProgress(prev => prev >= 85 ? prev : prev + Math.random() * 10);
  }, 150);

  // Complete
  const completeTimer = setTimeout(() => {
    setProgress(100);
    setTimeout(() => setIsLoading(false), 150);
  }, 500 + Math.random() * 300);

  return () => {
    clearTimeout(initialTimer);
    clearInterval(progressTimer);
    clearTimeout(completeTimer);
  };
}, [pathname, searchParams]);
```

## 🎯 Best Practices

1. **Single Instance**: Gunakan hanya satu navigation progress per aplikasi
2. **Layout Level**: Tempatkan di layout level untuk coverage maksimal
3. **Consistent Styling**: Gunakan warna dan style yang konsisten dengan design system
4. **Performance**: Hindari multiple instances yang berjalan bersamaan

## 🔄 Migration from Other Solutions

### From nprogress
```tsx
// Before (nprogress)
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// After (our solution)
import { TopLoadingBar } from '@/components/navigation-progress';

// Just add to layout
<TopLoadingBar height={3} color="primary" style="glow" />
```

### From custom loading
```tsx
// Before (custom implementation)
const [loading, setLoading] = useState(false);

useEffect(() => {
  const handleStart = () => setLoading(true);
  const handleComplete = () => setLoading(false);
  
  router.events.on('routeChangeStart', handleStart);
  router.events.on('routeChangeComplete', handleComplete);
  
  return () => {
    router.events.off('routeChangeStart', handleStart);
    router.events.off('routeChangeComplete', handleComplete);
  };
}, []);

// After (our solution)
<TopLoadingBar /> // That's it!
```

## 📱 Demo

Lihat implementasi lengkap di `/dashboard/navigation-loading-demo` untuk:
- Interactive controls untuk testing berbagai options
- Live preview dengan berbagai style
- Contoh implementasi di berbagai scenarios

## 🛠️ Troubleshooting

**Loading tidak muncul:**
- Pastikan komponen ditempatkan di level yang tepat
- Check z-index conflicts
- Verify Next.js hooks working properly

**Performance issues:**
- Gunakan hanya satu instance
- Pastikan cleanup berjalan dengan baik
- Avoid complex animations pada mobile

**Styling issues:**
- Check theme colors tersedia
- Verify CSS-in-JS support
- Test pada berbagai browsers
