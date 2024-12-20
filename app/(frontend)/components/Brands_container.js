'use client'
import { useEffect, useState } from 'react'
import { ref, get, child } from 'firebase/database' // For Realtime Database
import { realtimeDb } from '@/app/(backend)/lib/firebase' // Assuming you are using Firebase Realtime Database instance
import Image from 'next/image'
import styles from './ComponentsStyles/Brands_container.module.css'

const Brands_container = () => {
  const [products, setProducts] = useState([])

  // Fetch fruits products from Firebase Realtime Database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const dbRef = ref(realtimeDb)
        const snapshot = await get(child(dbRef, 'products'))
        if (snapshot.exists()) {
          const data = snapshot.val()
          // Extract and map over products where the category is 'Fresh Fruits'
          const fetchedProducts = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((product) => product.category === 'brands')
          setProducts(fetchedProducts)
        } else {
          console.log('No data available')
        }
      } catch (error) {
        console.error('Error fetching fruit products:', error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <>
      <div className={styles.brand_container}>
        <div className={styles.title}>
          <h3>Brands</h3>
          <button>See More</button>
        </div>
        <div className={styles.brand_box}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <div className={styles.image_box}>
                <Image
                  src={product.frontImageUrl} // Use the product image URL
                  alt={product.productName}
                  width={260}
                  height={150}
                  className={styles.image}
                />
              </div>
              <div className={styles.info}>
                <h4 className={styles.name}>{product.productName}</h4>
                <p className={styles.price}>{product.price}</p>
                <p className={styles.stock}>
                  Stock: {product.stockAvailability}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Brands_container
