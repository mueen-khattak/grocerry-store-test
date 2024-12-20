'use client'; // Mark the component as a client component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PreloadAllPages = () => {
  console.log('pageload')
  const router = useRouter();

  useEffect(() => {
    const pagesToPrefetch = ['/', '/my_cart', , '/my_wishlist', '/my_orders/order_details/',  '/product_details', '/my_orders', '/my_reviews', '/my_returns_&_cancellations', '/account_setting', '/categories/', '/categories'];


    // Prefetch each page on load
    pagesToPrefetch.forEach(page => {
      router.prefetch(page);
    });
  }, [router]);

  return null;
};
export default PreloadAllPages;

