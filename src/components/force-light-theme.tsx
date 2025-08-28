"use client";

import { useEffect } from "react";

/**
 * Component untuk memaksa light theme dan mencegah sistem deteksi tema
 */
export function ForceLightTheme() {
  useEffect(() => {
    // Force light mode di document
    const forceLight = () => {
      // Remove dark class dari html
      document.documentElement.classList.remove("dark");
      
      // Set color-scheme ke light
      document.documentElement.style.colorScheme = "light";
      
      // Set data attribute untuk Material-UI
      document.documentElement.setAttribute("data-mui-color-scheme", "light");
      
      // Override localStorage theme settings
      localStorage.setItem("theme-mode", "light");
      localStorage.setItem("mui-mode", "light");
      
      // Force body background
      document.body.style.backgroundColor = "rgb(255, 255, 255)";
      document.body.style.color = "rgb(33, 43, 54)";
    };

    // Apply immediately
    forceLight();

    // Watch for changes and reapply
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const target = mutation.target as HTMLElement;
          if (
            target === document.documentElement &&
            (mutation.attributeName === "class" ||
              mutation.attributeName === "data-mui-color-scheme")
          ) {
            // Reapply light mode if something tries to change it
            setTimeout(forceLight, 0);
          }
        }
      });
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-mui-color-scheme", "style"],
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
}
