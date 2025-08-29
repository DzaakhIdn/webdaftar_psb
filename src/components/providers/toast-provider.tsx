"use client";

import React from "react";
import { ToastContainer, toast } from "react-toastify";

// Custom hook untuk toast notifications
export function useToast() {
  const showSuccess = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 7000, // Error messages stay longer
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showWarning = (message: string) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showInfo = (message: string) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message, {
      position: "top-right",
    });
  };

  const updateToast = (
    toastId: any,
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateToast,
    dismissAll,
  };
}

// Provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="toast-container"
        toastClassName="toast-item"
        progressClassName="toast-progress"
        style={{
          zIndex: 9999,
        }}
      />
    </>
  );
}

// Alias untuk backward compatibility
export const useAlert = useToast;
export const AlertProvider = ToastProvider;
