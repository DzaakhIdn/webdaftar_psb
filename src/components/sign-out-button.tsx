"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "@/routes/hooks";
import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";

// import { useAuth0 } from '@auth0/auth0-react';
// import { CONFIG } from '@/global-config';
// import { signOut as jwtSignOut } from '@/auth/context/jwt/action';
// import { signOut as amplifySignOut } from '@/auth/context/amplify/action';
// import { signOut as supabaseSignOut } from '@/auth/context/supabase/action';
// import { signOut as firebaseSignOut } from '@/auth/context/firebase/action';

// ----------------------------------------------------------------------

// const signOut =
//   (CONFIG.auth.method === 'supabase' && supabaseSignOut) ||
//   (CONFIG.auth.method === 'firebase' && firebaseSignOut) ||
//   (CONFIG.auth.method === 'amplify' && amplifySignOut) ||
//   jwtSignOut;

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
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      // For now, just simulate logout since we're using mocked user
      onClose?.();
      toast.success("Logged out successfully!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Unable to logout!");
    }
  }, [onClose, router]);

  // const handleLogoutAuth0 = useCallback(async () => {
  //   try {
  //     await signOutAuth0();
  //     onClose?.();
  //     router.refresh();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Unable to logout!');
  //   }
  // }, [onClose, router, signOutAuth0]);

  return (
    <Button
      fullWidth
      variant="outlined"
      size="large"
      color="error"
      onClick={handleLogout}
      sx={sx}
      {...other}
    >
      Logout
    </Button>
  );
}
