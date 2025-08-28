"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoutButton } from "@/components/logout-button";
import { useAuth } from "@/auth/hooks/use-check-auth";
import { useToast } from "@/components/providers/toast-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

function AuthAlertDemo() {
  const { login, isLoading } = useAuth();
  const { showSuccess, showError, showWarning, showInfo, dismissAll } =
    useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      showError("Username dan password harus diisi");
      return;
    }

    await login({ username, password });
  };

  const testAlerts = () => {
    showSuccess("Ini adalah alert success!");
    setTimeout(() => showError("Ini adalah alert error!"), 1000);
    setTimeout(() => showWarning("Ini adalah alert warning!"), 2000);
    setTimeout(() => showInfo("Ini adalah alert info!"), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Auth & Alert System Demo
          </h1>
          <p className="text-gray-600 mb-4">
            Test login functionality dan animated alert system
          </p>

          {/* Quick Alert Test Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Button
              onClick={() => showSuccess("✅ Alert berhasil ditampilkan!")}
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Test Success Alert
            </Button>
            <Button
              onClick={() => showError("❌ Ini adalah error alert!")}
              size="sm"
              variant="destructive"
            >
              Test Error Alert
            </Button>
            <Button
              onClick={() => showWarning("⚠️ Peringatan penting!")}
              size="sm"
              className="bg-amber-500 hover:bg-amber-600"
            >
              Test Warning Alert
            </Button>
            <Button
              onClick={() => showInfo("ℹ️ Informasi berguna!")}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
            >
              Test Info Alert
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle>Login Test</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="mt-4 pt-4 border-t">
                <LogoutButton className="w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Alert Tests */}
          <Card>
            <CardHeader>
              <CardTitle>Alert System Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => showSuccess("Success alert!")}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Success
                </Button>
                <Button
                  onClick={() => showError("Error alert!")}
                  variant="destructive"
                >
                  Error
                </Button>
                <Button
                  onClick={() => showWarning("Warning alert!")}
                  className="bg-yellow-500 hover:bg-yellow-600"
                >
                  Warning
                </Button>
                <Button
                  onClick={() => showInfo("Info alert!")}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Info
                </Button>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={testAlerts}
                  variant="outline"
                  className="w-full"
                >
                  Test Multiple Alerts
                </Button>
                <Button
                  onClick={dismissAll}
                  variant="outline"
                  className="w-full"
                >
                  Clear All Toasts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Info */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Login:</strong> POST /api/login
              </div>
              <div>
                <strong>Logout:</strong> POST /api/logout
              </div>
              <div>
                <strong>Register:</strong> POST /api/register
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ToastProvider>
      <AuthAlertDemo />
    </ToastProvider>
  );
}
