'use client'

import { useEffect, useState } from 'react'
import { readDataFromRealtimeDB } from '@/app/(backend)/lib/firebaseUtils' // Import the utility function
import Image from 'next/image'
import styles from './sidebarcomponentsstyles/CategoryContainer.module.css'

const CategoryContainer = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await readDataFromRealtimeDB('categories/') // Use the utility function
        if (data) {
          // Convert data object into an array of categories
          const categoriesArray = Object.keys(data).map((key) => ({
            id: key,
            name: data[key].name,
            img: data[key].imageUrl, // Assuming imageUrl is stored in Firebase
          }))
          setCategories(categoriesArray)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className={styles.container}>
      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category.id} className={styles.categoryCard}>
            <Image
              width={100}
              height={100}
              src={category.img}
              alt={category.name}
              className={styles.categoryImage}
            />
            <p className={styles.categoryName}>{category.name}</p>
          </div>
        ))
      ) : (
        <p>No categories available</p>
      )}
    </div>
  )
}

export default CategoryContainer
