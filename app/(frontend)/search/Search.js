'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ref, onValue } from 'firebase/database'
import { realtimeDb } from '@/app/(backend)/lib/firebase'
import styles from './search.module.css'
import Image from 'next/image'

const SearchPage = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const searchParams = useSearchParams()
  const query = searchParams.get('query')?.toLowerCase() || ''

  useEffect(() => {
    const productsRef = ref(realtimeDb, 'products')
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const productsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }))
        setProducts(productsArray)
      } else {
        setProducts([])
      }
    })
  }, [])

  useEffect(() => {
    if (query) {
      const results = products.filter((product) =>
        product.productName.toLowerCase().includes(query)
      )
      setFilteredProducts(results)
    } else {
      setFilteredProducts(products)
    }
  }, [query, products])

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Search Results</h1>
        <p>Showing results for &quot;{query}&quot;</p>
      </div>
      {filteredProducts.length > 0 ? (
        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <Image
              width={1000}
              height={1000}
                src={product.frontImageUrl}
                alt={product.productName}
                className={styles.productImage}
              />
              <div className={styles.productContent}>
                <p className={styles.category}>{product.category}</p>
                <h2>{product.productName}</h2>
                <p> {product.nameVariety}</p>
                <h4 className={styles.productPrice}>{product.price} Rs</h4>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>No products found.</p>
      )}
    </div>
  )
}

export default SearchPage
