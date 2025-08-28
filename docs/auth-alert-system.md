# Auth & Alert System Documentation

## Overview

Sistem autentikasi dan alert yang terintegrasi dengan REST API dan animated alerts menggunakan GSAP.

## Features

✅ **REST API Authentication**: Login/logout dengan JWT tokens
✅ **Animated Alerts**: 4 tipe alert (success, error, warning, info) dengan animasi GSAP
✅ **Auto-hide**: Configurable auto-hide dengan delay
✅ **Multiple Alerts**: Support untuk menampilkan beberapa alert sekaligus
✅ **Global State**: Provider untuk state management global
✅ **TypeScript**: Full TypeScript support
✅ **Reusable Components**: Hook dan komponen yang reusable

## API Endpoints

### Login
```
POST /api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Response Success:**
```json
{
  "message": "Login success",
  "user": {
    "id": "user_id",
    "username": "admin",
    "nama_lengkap": "Administrator",
    "role": "admin"
  }
}
```

**Response Error:**
```json
{
  "error": "Invalid username or password"
}
```

### Logout
```
POST /api/logout
```

**Response:**
```json
{
  "message": "Logout berhasil"
}
```

### Register
```
POST /api/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "nama_lengkap": "New User"
}
```

## Usage

### 1. Setup AlertProvider

Wrap your app atau page dengan `AlertProvider`:

```tsx
import { AlertProvider } from "@/components/providers/alert-provider";

export default function Page() {
  return (
    <AlertProvider>
      <YourComponent />
    </AlertProvider>
  );
}
```

### 2. Using useAuth Hook

```tsx
import { useAuth } from "@/hooks/use-auth";

function LoginComponent() {
  const { login, logout, isLoading } = useAuth();

  const handleLogin = async () => {
    const success = await login({
      username: "admin",
      password: "password123"
    });
    
    if (success) {
      // Login berhasil, akan auto redirect
    }
  };

  const handleLogout = async () => {
    await logout(); // Will auto redirect to login page
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
      <button onClick={handleLogout} disabled={isLoading}>
        Logout
      </button>
    </div>
  );
}
```

### 3. Using Alert System

```tsx
import { useAlert } from "@/components/providers/alert-provider";

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo, clearAllAlerts } = useAlert();

  const handleSuccess = () => {
    showSuccess("Data berhasil disimpan!");
  };

  const handleError = () => {
    showError("Terjadi kesalahan saat menyimpan data");
  };

  const handleWarning = () => {
    showWarning("Peringatan: Data akan dihapus", {
      autoHide: false // Won't auto-hide
    });
  };

  const handleInfo = () => {
    showInfo("Informasi: Update tersedia", {
      autoHideDelay: 10000 // Hide after 10 seconds
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>
      <button onClick={handleInfo}>Show Info</button>
      <button onClick={clearAllAlerts}>Clear All</button>
    </div>
  );
}
```

### 4. Using LogoutButton Component

```tsx
import { LogoutButton } from "@/components/logout-button";

function Header() {
  return (
    <div className="header">
      <LogoutButton 
        variant="outline" 
        size="sm"
        showIcon={true}
      />
      
      {/* Custom content */}
      <LogoutButton variant="destructive">
        Sign Out
      </LogoutButton>
    </div>
  );
}
```

## Components

### useAuth Hook
- `login(data)`: Login dengan username/password
- `logout()`: Logout dan clear session
- `isLoading`: Loading state

### useAlert Hook
- `showSuccess(message, options?)`: Show success alert
- `showError(message, options?)`: Show error alert
- `showWarning(message, options?)`: Show warning alert
- `showInfo(message, options?)`: Show info alert
- `clearAllAlerts()`: Clear semua alerts

### LogoutButton Component
Props:
- `variant`: Button variant
- `size`: Button size
- `className`: Additional CSS classes
- `showIcon`: Show/hide logout icon
- `children`: Custom button content

## Demo

Untuk melihat demo lengkap, kunjungi:
```
/demo/auth-alert
```

## Environment Variables

Pastikan environment variables berikut sudah diset:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```
