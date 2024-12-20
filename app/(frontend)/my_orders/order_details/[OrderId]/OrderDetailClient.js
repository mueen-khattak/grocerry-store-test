// pages/cartPage.js
import OrderDetail from './OrderDetail';
import { Suspense } from 'react';

const OrderDetailClient = () => {
  return (
    <div>      
      {/* Add Suspense to show a fallback loading indicator while the Cart component loads */}
      <Suspense fallback={<div>Loading Cart...</div>}>
        <OrderDetail />
      </Suspense>
    </div>
  );
}

export default OrderDetailClient;
