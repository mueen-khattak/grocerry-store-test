'use client'

import { useEffect, useState } from 'react'
import { readDataFromRealtimeDB } from '@/app/(backend)/lib/firebaseUtils'
import Image from 'next/image'
import styles from './ComponentsStyles/CategoryContainer.module.css'
import CategoryLoading from '../../loading/CaregoryLoading'
import Link from 'next/link'

const CategoryContainer = () => {
  const [categories, setCategories] = useState([])
  const [isHovered, setIsHovered] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await readDataFromRealtimeDB('categories/')
        if (data) {
          const categoriesArray = Object.keys(data).map((key) => ({
            id: key,
            name: data[key].name,
            img: data[key].imageUrl,
          }))
          setCategories(categoriesArray)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className={styles.container}>
      <h2>Categories</h2>
      <div className={styles.In_container}>
        {loading ? (
          <CategoryLoading />
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className={styles.categoryCard}
            >
                <Link 
                  legacyBehavior
                  href={`/categories/${category.name.replace(/\s+/g, '-')}`}>
                <a>


              <Image
                width={400}
                height={200}
                src={category.img}
                alt={category.name}
                className={styles.categoryImage}
              />
              <p className={styles.categoryName}>{category.name}</p>
              </a>
              </Link>
            </div>
          ))
        )}

        <div
          className={`${styles.blurbox} ${
            isHovered ? styles.hoveredBlurbox : ''
          }`}
        ></div>
      </div>
    </div>
  )
}

export default CategoryContainer
