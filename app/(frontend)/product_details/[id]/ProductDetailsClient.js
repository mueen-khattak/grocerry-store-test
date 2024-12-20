"use client"

import { Suspense } from 'react';
import Productdetails from './Productdetails';

const ProductDetailClient = () => {
  return (
    <div>
      
      <Suspense fallback={<div>Loading Cart...</div>}>
        <Productdetails />
      </Suspense>
    </div>
  );
}

export default ProductDetailClient;
