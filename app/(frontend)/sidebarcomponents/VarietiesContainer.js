'use client'

import { useEffect, useState } from 'react'
import { readDataFromRealtimeDB } from '@/app/(backend)/lib/firebaseUtils' // Import the utility function
import Image from 'next/image'
import styles from './sidebarcomponentsstyles/varietiesContainer.module.css'

const VarietiesContainer = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await readDataFromRealtimeDB('products_Variety/') // Use the utility function
        if (data) {
          // Convert data object into an array of categories
          const categoriesArray = Object.keys(data).map((key) => ({
            id: key,
            name: data[key].name,
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
          <div key={category.id} className={styles.varietiesCard}>
            <p className={styles.varietiesname}>{category.name}</p>
          </div>
        ))
      ) : (
        <p>No varieties available</p>
      )}
    </div>
  )
}

export default VarietiesContainer
