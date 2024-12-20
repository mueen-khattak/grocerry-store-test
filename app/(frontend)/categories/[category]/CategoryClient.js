"use client"
import Category from './Category';
import { Suspense } from 'react';

const CategoryClient = () => {
  return (
    <div>      
      {/* Add Suspense to show a fallback loading indicator while the Cart component loads */}
      <Suspense fallback={<div>Loading Cart...</div>}>
        <Category />
      </Suspense>
    </div>
  );
}

export default CategoryClient;
