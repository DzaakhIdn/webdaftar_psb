"use client";

import { useAuth } from "@/auth/hooks/use-auth";
import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";
import { useToast } from "@/components/providers/toast-provider";

// ----------------------------------------------------------------------

interface SignOutButtonProps {
  onClose?: () => void;
  sx?: SxProps<Theme>;
}

export function SignOutButton({
  onClose,
  sx,
  ...other
}: SignOutButtonProps & Omit<ButtonProps, "onClick">) {
  const { logout, loading } = useAuth();
  const { showSuccess, showError } = useToast();
  const handleLogout = async () => {
    try {
      await logout();
      showSuccess("Logout berhasil!");
    } catch (error) {
      showError("Logout gagal!");
      console.error(error);
    } finally {
      onClose?.();
    }
  };

  return (
    <Button
      fullWidth
      variant="outlined"
      size="large"
      color="error"
      onClick={handleLogout}
      disabled={loading}
      sx={sx}
      {...other}
    >
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
