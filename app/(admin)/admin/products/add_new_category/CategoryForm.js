'use client'
import { useState, useEffect } from 'react'
import { ref, set } from 'firebase/database'
import { storage } from '@/app/(backend)/lib/firebase'
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from 'firebase/storage'
import { realtimeDb } from '@/app/(backend)/lib/firebase'
import styles from './CategoryForm.module.css'
import Image from 'next/image'

export default function AddCategoryForm({
  selectedCategory,
  onCategoryUpdated,
}) {
  const [categoryName, setCategoryName] = useState('')
  const [categoryImage, setCategoryImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (selectedCategory) {
      setCategoryName(selectedCategory.name)
      setCategoryImage(null)
    } else {
      setCategoryName('')
      setCategoryImage(null)
    }
  }, [selectedCategory])

  const handleNameChange = (e) => setCategoryName(e.target.value)
  const handleImageChange = (e) => setCategoryImage(e.target.files[0])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!categoryName || (!categoryImage && !selectedCategory?.img)) {
      alert('Please provide a category name and an image.')
      return
    }

    setIsSubmitting(true)

    try {
      const categoryId = selectedCategory
        ? selectedCategory.id
        : new Date().getTime()
      let downloadURL = selectedCategory?.img

      if (categoryImage) {
        const imageRef = storageRef(
          storage,
          `categories/${categoryId}/${categoryImage.name}`
        )
        const uploadTask = uploadBytesResumable(imageRef, categoryImage)

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => {
              console.error('Image upload failed:', error)
              alert('Failed to upload image. Please try again.')
              reject(error)
            },
            async () => {
              downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              resolve()
            }
          )
        })
      }

      await set(ref(realtimeDb, 'categories/' + categoryId), {
        name: categoryName,
        imageUrl: downloadURL,
      })

      const updatedCategory = {
        id: categoryId,
        name: categoryName,
        img: downloadURL,
      }

      alert(
        selectedCategory
          ? 'Category updated successfully!'
          : 'Category added successfully!'
      )

      onCategoryUpdated(updatedCategory) // Notify parent of the updated category

      setCategoryName('')
      setCategoryImage(null)
      setIsSubmitting(false)
    } catch (error) {
      console.error('Error adding/updating category:', error)
      alert('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.form_container}>
      <h2>{selectedCategory ? 'Edit Category' : 'Add New Category'}</h2>
      <form onSubmit={handleSubmit} className={styles.category_form}>
        <label htmlFor="name">Category Name:</label>
        <input
          type="text"
          id="name"
          value={categoryName}
          onChange={handleNameChange}
          placeholder="Enter category name"
          required
        />

        <label htmlFor="image">Category Image:</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />

        {selectedCategory && selectedCategory.img && !categoryImage && (
          <div>
            <p>Current Image:</p>
            <Image
              src={selectedCategory.img}
              alt={selectedCategory.name}
              width={100}
              height={100}
            />
          </div>
        )}

        <button
          type="submit"
          className={styles.submit_button}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Submitting...'
            : selectedCategory
            ? 'Update Category'
            : 'Add Category'}
        </button>
      </form>
    </div>
  )
}
