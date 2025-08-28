# Dashboard Loading Components

Komponen loading animation yang komprehensif untuk dashboard dengan berbagai varian dan fitur.

## 🚀 Fitur Utama

- **Multiple Variants**: Widget, Chart, Table, Card, dan Dashboard loading
- **Smooth Animations**: Menggunakan Framer Motion untuk animasi yang halus
- **Progress Indicators**: Loading dengan progress bar dan percentage
- **Realistic Timing**: Simulasi loading time yang realistis
- **Responsive Design**: Mendukung berbagai ukuran layar
- **TypeScript Support**: Fully typed untuk developer experience yang baik

## 📦 Komponen yang Tersedia

### 1. DashboardLoading
Komponen loading utama untuk halaman dashboard lengkap.

```tsx
import { DashboardLoading } from '@/components/loading';

// Basic usage
<DashboardLoading variant="overview" />

// Available variants
<DashboardLoading variant="overview" />  // Default dashboard layout
<DashboardLoading variant="table" />     // Table-focused layout
<DashboardLoading variant="form" />      // Form-focused layout
<DashboardLoading variant="minimal" />   // Minimal spinner
```

### 2. ComponentLoading
Loading untuk komponen individual dengan berbagai varian.

```tsx
import { ComponentLoading } from '@/components/loading';

<ComponentLoading variant="widget" height={120} />
<ComponentLoading variant="chart" height={300} />
<ComponentLoading variant="table" height={400} />
<ComponentLoading variant="card" height={200} />
```

### 3. AdvancedLoading
Loading dengan progress indicator dan animasi yang lebih detail.

```tsx
import { AdvancedLoading } from '@/components/loading';

<AdvancedLoading
  variant="widget"
  showProgress={true}
  progress={75}
  loadingText="Loading data..."
  height={200}
/>
```

### 4. Specific Loading Components
Komponen loading yang sudah dikonfigurasi untuk use case tertentu.

```tsx
import { 
  WidgetSummaryLoading,
  ChartLoading,
  TableLoading,
  CardLoading 
} from '@/components/loading';

<WidgetSummaryLoading />
<ChartLoading />
<TableLoading />
<CardLoading height={180} />
```

### 5. Higher-Order Components (HOC)
Wrapper untuk menambahkan loading state ke komponen existing.

```tsx
import { withLoading, withWidgetLoading } from '@/components/loading';

// Wrap existing component
const LoadingWidget = withWidgetLoading(MyWidget);
const LoadingChart = withChartLoading(MyChart);

// Usage
<LoadingWidget {...props} />
```

## 🎯 Penggunaan dengan Suspense

### Layout Level Loading
```tsx
// app/dashboard/layout.tsx
import { Suspense } from 'react';
import { DashboardLoadingFallback } from '@/components/loading';

export default function DashboardLayout({ children }) {
  return (
    <DashboardLayout>
      <Suspense fallback={<DashboardLoadingFallback />}>
        {children}
      </Suspense>
    </DashboardLayout>
  );
}
```

### Page Level Loading
```tsx
// app/dashboard/loading.tsx
import { DashboardLoadingFallback } from '@/components/loading';

export default function Loading() {
  return <DashboardLoadingFallback />;
}
```

### Component Level Loading
```tsx
import { Suspense } from 'react';
import { WidgetSummaryLoading } from '@/components/loading';

function MyDashboard() {
  return (
    <Suspense fallback={<WidgetSummaryLoading />}>
      <MyWidget />
    </Suspense>
  );
}
```

## 🔧 Realistic Loading Simulation

Gunakan hook `useLoadingSimulation` untuk simulasi loading yang realistis:

```tsx
import { useLoadingSimulation } from '@/hooks/use-loading-simulation';

function MyComponent() {
  const { isLoading, progress } = useLoadingSimulation({
    delay: 500,           // Delay sebelum loading dimulai
    minLoadingTime: 2000, // Minimum waktu loading
    autoStart: true       // Auto start saat component mount
  });

  if (isLoading) {
    return (
      <AdvancedLoading
        variant="widget"
        showProgress
        progress={progress}
        loadingText="Loading..."
      />
    );
  }

  return <ActualComponent />;
}
```

## 🎨 Customization

### Custom Styling
```tsx
<ComponentLoading
  variant="card"
  height={250}
  width="100%"
  sx={{ borderRadius: 3 }}
/>
```

### Custom Animation Timing
```tsx
// Komponen dengan timing berbeda
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};
```

## 📱 Demo Pages

Lihat implementasi lengkap di:
- `/dashboard/demo-loading` - Basic loading demos
- `/dashboard/realistic-loading` - Realistic loading simulation
- `/dashboard/advanced-loading` - Advanced loading with progress

## 🛠️ Best Practices

1. **Gunakan variant yang sesuai** dengan jenis konten yang akan dimuat
2. **Tambahkan delay** untuk menghindari flash loading pada konten yang cepat
3. **Gunakan progress indicator** untuk loading yang memakan waktu lama
4. **Stagger animations** untuk multiple components
5. **Consistent timing** across similar components

## 🔄 Migration Guide

Untuk menggunakan loading components di komponen existing:

```tsx
// Before
function MyWidget() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return <WidgetContent />;
}

// After
import { WidgetSummaryLoading } from '@/components/loading';

function MyWidget() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <WidgetSummaryLoading />;
  }
  
  return <WidgetContent />;
}
```
