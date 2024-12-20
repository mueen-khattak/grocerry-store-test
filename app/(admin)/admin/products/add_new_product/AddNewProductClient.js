import React, { Suspense } from 'react';
import AddNewProduct from './AddNewProduct';

export default function AddNewProductClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddNewProduct />
    </Suspense>
  );
}
