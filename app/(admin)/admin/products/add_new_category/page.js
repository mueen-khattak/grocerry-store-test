'use client'
import { useEffect, useState } from 'react'
import {
  readDataFromRealtimeDB,
  deleteDataFromRealtimeDB,
} from '@/app/(backend)/lib/firebaseUtils' // Ensure you have a delete function
import Image from 'next/image'
import style from '../../AdminPageGloble.module.css'
import styles from './categories.module.css'
import AddCategoryForm from './CategoryForm'
import { CiEdit } from 'react-icons/ci'
import { RiDeleteBin2Line } from 'react-icons/ri'

const CategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  const fetchCategories = async () => {
    try {
      const data = await readDataFromRealtimeDB('categories/')
      if (data) {
        const categoriesArray = Object.keys(data).map((key, index) => ({
          id: key,
          sn: index + 1,
          name: data[key].name,
          img: data[key].imageUrl,
        }))
        setCategories(categoriesArray)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleEditClick = (category) => {
    setSelectedCategory(category)
  }

  const handleDeleteClick = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteDataFromRealtimeDB(`categories/${id}`) // Delete category
        fetchCategories() // Refresh categories from Firebase
        alert('Category deleted successfully!')
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Failed to delete category. Please try again.')
      }
    }
  }

  const handleCategoryUpdated = (updatedCategory) => {
    if (updatedCategory) {
      // If updatedCategory exists, refetch categories to reflect changes
      fetchCategories()
    } else {
      // If no updated category is passed (indicating a new category), we can simply refetch
      fetchCategories()
    }
    setSelectedCategory(null) // Clear selected category after update
  }

  return (
    <div className={style.main}>
      <div className={styles.categories_container}>
        <div className={styles.categories_form}>
          <AddCategoryForm
            selectedCategory={selectedCategory}
            onCategoryUpdated={handleCategoryUpdated}
          />
        </div>

        <div className={styles.categoriesList}>
          <div className={styles.header}>
            <h3>Categories</h3>
          </div>
          <div className={styles.title}>
            <h4 className={styles.SN}>SN</h4>
            <h4 className={styles.Image}>Image</h4>
            <h4 className={styles.Name}>Name</h4>
            <h4 className={styles.Action}>Action</h4>
          </div>

          <div className={styles.dataContainer}>
            {categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.id} className={styles.data}>
                  <p className={styles.SN}>{category.sn}</p>
                  <div className={styles.Image}>
                    <Image
                      src={category.img}
                      alt={category.name}
                      width={70}
                      height={50}
                    />
                  </div>
                  <p className={styles.Name}>{category.name}</p>
                  <div className={styles.Action}>
                    <span onClick={() => handleEditClick(category)}>
                      <CiEdit size={25} />
                    </span>
                    <span onClick={() => handleDeleteClick(category.id)}>
                      <RiDeleteBin2Line size={25} color="red" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No categories available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage
