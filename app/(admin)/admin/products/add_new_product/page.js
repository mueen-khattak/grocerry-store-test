import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

// Dynamically import the client-side component (it will only be rendered on the client)
const AddNewProduct = dynamic(() => import('./AddNewProduct'), { ssr: false });

export default function AddNewProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddNewProduct />
    </Suspense>
  );
}
