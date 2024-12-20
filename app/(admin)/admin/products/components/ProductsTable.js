'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ref, onValue, remove } from 'firebase/database'
import style from '../../AdminPageGloble.module.css'
import styles from '../styles/product_table.module.css'
import { realtimeDb } from '@/app/(backend)/lib/firebase' // Ensure to import your firebase config
import { CiEdit } from 'react-icons/ci'
import { RiDeleteBin2Line } from 'react-icons/ri'

const ProductsTable = () => {
  const [products, setProducts] = useState([]) // State to hold product data

  // Fetch product data from Firebase when the component mounts
  useEffect(() => {
    const productsRef = ref(realtimeDb, 'products/') // Adjust to your actual database path
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const productsArray = Object.keys(data).map((key, index) => ({
          id: key,
          sn: index + 1,
          productName: data[key].productName,
          weight: data[key].weight,
          price: data[key].price,
          stockAvailability: data[key].stockAvailability,
          color: data[key].color,
          description: data[key].description,
          category: data[key].category,
          variety: data[key].variety,
          frontImageUrl: data[key].frontImageUrl, // Ensure your product object has imageUrl
        }))
        setProducts(productsArray)
      } else {
        setProducts([])
      }
    })
  }, [])

  // Function to handle product deletion
  const handleDelete = (id) => {
    const productRef = ref(realtimeDb, `products/${id}`)
    remove(productRef)
      .then(() => {
        console.log(`Product with ID ${id} deleted successfully`)
      })
      .catch((error) => {
        console.error('Error deleting product: ', error)
      })
  }

  return (
    <div className={style.main}>
      <div className={styles.header}>
        <h3>Products</h3>
        <a href="/admin/products/add_new_product">Add New Product</a>
      </div>
      <div className={styles.title}>
        <h4 className={styles.SN}>SN</h4>
        <h4 className={styles.Image}>Image</h4>
        <h4 className={styles.Title}>Product Name</h4>
        <h4 className={styles.Weight}>Weight</h4>
        <h4 className={styles.Price}>Price</h4>
        <h4 className={styles.Stock}>Stock</h4>
        <h4 className={styles.Status}>Status</h4>
        <h4 className={styles.Action}>Action</h4>
      </div>

      <div className={styles.dataContainer}>
        {products.map((product) => (
          <div className={styles.data} key={product.id}>
            <p className={styles.SN}>{product.sn}</p>
            <div className={styles.Image}>
              <Image
                src={product.frontImageUrl}
                alt={product.productName}
                width={70}
                height={60}
              />
            </div>
            <p className={styles.Title}>{product.productName}</p>
            <p className={styles.Weight}>{product.weight}</p>
            <p className={styles.Price}>{product.price}</p>
            <p className={styles.Stock}>{product.stockAvailability}</p>
            <p className={styles.Status}>{product.status}</p>
            <p className={styles.Action}>
              <a href={`/admin/products/add_new_product?id=${product.id}`}>
                <CiEdit size={25} />
              </a>
              <button onClick={() => handleDelete(product.id)}>
                <RiDeleteBin2Line size={25} color="red" />
              </button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductsTable
