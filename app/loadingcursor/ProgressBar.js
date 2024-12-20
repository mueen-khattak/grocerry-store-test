"use client"; // Ensure client-side rendering

import { useEffect } from "react";
import { usePathname } from "next/navigation"; // App Router navigation hook
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Import the default styles for NProgress

// Configure NProgress
NProgress.configure({ showSpinner: false, speed: 300 });

function ProgressBar() {
  const pathname = usePathname(); // Track the current route

  useEffect(() => {
    // Start the progress bar when the pathname changes
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done(); // Ensure it completes after a short delay for smoother UX
    }, 500); // Adjust delay as needed for a better user experience

    return () => {
      clearTimeout(timer); // Cleanup any pending timers
      NProgress.done(); // Complete the progress bar
    };
  }, [pathname]); // Run effect whenever the pathname changes

  return null; // This component only manages the progress bar
}

export default ProgressBar;
