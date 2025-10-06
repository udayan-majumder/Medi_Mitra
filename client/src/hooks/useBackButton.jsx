"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export const useBackButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only handle back button on native platforms
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const handleBackButton = async () => {
      
      // Define the navigation hierarchy and fallback routes
      const navigationMap = {
        // Auth routes
        "/auth/login": "/auth/login", // Stay on login
        "/auth/register": "/auth/login", // Go back to login from register
        
        // Patient routes
        "/patient/home": "/patient/home", // Stay on home
        "/patient/symptom-checker": "/patient/home",
        "/patient/pharmacy": "/patient/home",
        "/patient/pharmacy/[pharmaid]": "/patient/pharmacy",
        "/patient/profile": "/patient/home",
        "/patient/consultdoctor": "/patient/home",
        "/patient/prescription": "/patient/home",
        
        // Doctor routes
        "/doctor/home": "/doctor/home", // Stay on home
        
        // Pharmacy routes
        "/pharmacy/home": "/pharmacy/home", // Stay on home
        "/pharmacy/inventory": "/pharmacy/home",
        "/pharmacy/addinventory": "/pharmacy/home",
      };

      // Handle dynamic routes (like [pharmaid])
      let currentRoute = pathname;
      if (pathname.includes("/patient/pharmacy/") && pathname !== "/patient/pharmacy") {
        currentRoute = "/patient/pharmacy/[pharmaid]";
      }

      const targetRoute = navigationMap[currentRoute];
      
      if (targetRoute && targetRoute !== pathname) {
        // Navigate to the target route
        console.log("Navigating from", pathname, "to", targetRoute);
        router.push(targetRoute);
      } else {
        // If we're already at the root of a section or no mapping exists,
        // we can either stay on the current page or handle special cases
        
        // Special handling for different user types
        if (pathname.startsWith("/patient/")) {
          router.push("/patient/home");
        } else if (pathname.startsWith("/doctor/")) {
          router.push("/doctor/home");
        } else if (pathname.startsWith("/pharmacy/")) {
          router.push("/pharmacy/home");
        } else {
          // For any other route, go to the main page
          router.push("/");
        }
      }
    };

    // Add the back button listener
    App.addListener("backButton", handleBackButton);

    // Cleanup listener on unmount
    return () => {
      App.removeAllListeners("backButton");
    };
  }, [router, pathname]);
};
