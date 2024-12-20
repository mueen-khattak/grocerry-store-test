"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { realtimeDb } from "@/app/(backend)/lib/firebase";
import styles from "./Related.module.css";
import Image from "next/image";
import { LiaStarSolid } from "react-icons/lia";
import Link from "next/link";

const Related = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (!category) return; // Ensure a category is selected

    // References for products and orders
    const productsRef = ref(realtimeDb, "products");
    const ordersRef = ref(realtimeDb, "orders");

    // Fetch products and calculate ratings
    const unsubscribeProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        // Filter products by category
        const filteredProducts = Object.entries(data)
          .filter(([_, product]) => product.category === category)
          .map(([id, product]) => ({ ...product, id })); // Include product ID

        // Fetch and calculate average ratings
        onValue(ordersRef, (ordersSnapshot) => {
          if (ordersSnapshot.exists()) {
            const ordersData = ordersSnapshot.val();

            const productRatings = {};

            // Calculate product ratings from orders
            Object.keys(ordersData).forEach((orderKey) => {
              const order = ordersData[orderKey];
              const cartItems = order.cartItems || [];

              cartItems.forEach((item) => {
                const { id, reviews } = item;
                const reviewRating = reviews?.stars || null;

                if (reviewRating !== null) {
                  if (!productRatings[id]) {
                    productRatings[id] = { totalRating: 0, reviewCount: 0 };
                  }

                  productRatings[id].totalRating += reviewRating;
                  productRatings[id].reviewCount += 1;
                }
              });
            });

            const averageRatings = Object.keys(productRatings).reduce((acc, productId) => {
              const { totalRating, reviewCount } = productRatings[productId];
              acc[productId] = {
                averageRating: (totalRating / reviewCount).toFixed(1),
                totalReviews: reviewCount,
              };
              return acc;
            }, {});

            // Merge ratings into filtered products
            const updatedProducts = filteredProducts.map((product) => ({
              ...product,
              ...averageRatings[product.id], // Add ratings if available
            }));

            setProducts(updatedProducts);
          } else {
            // No orders found, set products without ratings
            setProducts(filteredProducts);
          }
          setLoading(false); // Data loaded
        });
      } else {
        setLoading(false); // No data found
      }
    });

    return () => unsubscribeProducts(); // Clean up subscriptions
  }, [category]);

  return (
    <div className={styles.related_container}>
      {loading ? (
        <div className={styles.loading}>Loading Related Products...</div> // Show loading state
      ) : (
        <>
          <h2>Related Products</h2>
          <div className={styles.product_grid}>
            {products.length > 0 ? (
              products.map((product) => (
                <div className={styles.product_card} key={product.id}>
                  <Link legacyBehavior href={`/product_details/${product.id}`}>
                  <a>
                    <Image
                      width={1000}
                      height={1000}
                      src={product.frontImageUrl || "/placeholder.jpg"}
                      alt={product.productName}
                      className={styles.product_image}
                    />
                    <p className={styles.product_title}>{product.productName}</p>
                    <p className={styles.product_title2}>{product.nameVariety}</p>
                    <p className={styles.product_price}>
                      (Rs.{product.price}/- {product.weight})
                    </p>
                    <div className={styles.reviews}>
                      <LiaStarSolid size="17px" />
                      {product.averageRating || "No reviews"} ({product.totalReviews || 0} Reviews)
                    </div>
                    </a>
                  </Link>
                </div>
              ))
            ) : (
              <p>No related products found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Related;
