// pages/cartPage.js
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the Cart component and disable SSR (Server-Side Rendering)
const OrderDetail = dynamic(() => import('./OrderDetail'), { ssr: false });

const OrderDetailPage = () => {
  return (
    <div>      
      {/* Add Suspense to show a fallback loading indicator while the Cart component loads */}
      <Suspense fallback={<div>Loading Cart...</div>}>
        <OrderDetail />
      </Suspense>
    </div>
  );
}

export default OrderDetailPage;
