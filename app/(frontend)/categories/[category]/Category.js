'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { realtimeDb } from '@/app/(backend)/lib/firebase'; // Adjust based on your Firebase config file
import styles from '../CategoriesProductsPage.module.css';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [  categoryTitle,   setCategoryTitle] = useState([]);



  const { category } = useParams(); // Get the dynamic category from URL
  const router = useRouter();

  // Fetch categories from Firebase
  useEffect(() => {
    const categoriesRef = ref(realtimeDb, 'categories');
    onValue(categoriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setCategories(Object.values(data)); // Convert Firebase object to array
      } else {
        setCategories([]);
      }
    });
  }, []);

  // Fetch products based on the selected category
  useEffect(() => {
    if (category) {
      const categoryWithSpaces = category.replace(/-/g, ' '); // Replace dashes with spaces
      setCategoryTitle(categoryWithSpaces);
  
      const productsRef = ref(realtimeDb, 'products');
      onValue(productsRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const productsArray = Object.keys(data).map((key) => ({
            id: key, // The Firebase product ID (key)
            ...data[key], // The product data
          }));
  
          // Filter products by the selected category
          const filteredProducts = productsArray.filter(
            (product) => product.category === decodeURIComponent(categoryWithSpaces)
          );
          setProducts(filteredProducts);
        } else {
          setProducts([]);
        }
      });
    }
  }, [category]);
  

  // Handle category selection from the sidebar
  const handleCategoryClick = (categoryName) => {
    router.push(`/categories/${encodeURIComponent(categoryName)}`); // Navigate to the selected category's page
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h2>Categories</h2>
        <ul>
        {categories.map((category, index) => (
  <li key={index}>
    <Link legacyBehavior href={`/categories/${category.name.replace(/\s+/g, '-')}`}>
      <a
        className={decodeURIComponent(category.name) === category.name ? styles.active : ''}
        onClick={() => handleCategoryClick(category.name)}
      >
        {category.name}
      </a>
    </Link>
  </li>
))}

        </ul>
      </div>

      <div className={styles.productsContainer}>
        <h2>{categoryTitle || 'Select a Category'}</h2>
        <div className={styles.productsGrid}>
          {products.length > 0 ? (
            products.map((product, index) => (
              <div key={index} className={styles.productCard}>
                <Link 
                 legacyBehavior
                 href={`/product_details/${product.id}`}>
                <a>
                <Image width={1000}
                height={1000}
                 src={product.frontImageUrl} 
                 alt={product.productName} />
                <h3>{product.productName}</h3>
                <p>Price: {product.price} PKR</p>
                <p>Weight: {product.weight}</p>
                <p>Stock: {product.stockAvailability}</p>
                </a>
                </Link>
              </div>
            ))
          ) : (
            <p>No products available for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}
