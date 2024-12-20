"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
function LoadingCursor() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStartLoading = () => setIsLoading(true); // Show loading cursor
    const handleStopLoading = () => setIsLoading(false); // Revert cursor to normal

    // Start loading on route change
    handleStartLoading();

    // Stop loading after route change is complete
    const timer = setTimeout(handleStopLoading, 500); // Adjust duration for smooth transition

    return () => {
      clearTimeout(timer); // Cleanup timer
    };
  }, [pathname]);

  // Apply cursor styles dynamically
  useEffect(() => {
    if (isLoading) {
      document.body.style.cursor = "progress"; // Loading cursor
    } else {
      document.body.style.cursor = "default"; // Normal cursor
    }
    return () => {
      document.body.style.cursor = "default"; // Cleanup on unmount
    };
  }, [isLoading]);

  return null; // This component manages the cursor globally and renders nothing
}

export default LoadingCursor;
