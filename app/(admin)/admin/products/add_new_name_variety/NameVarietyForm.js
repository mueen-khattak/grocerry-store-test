'use client'
import { useState, useEffect } from 'react'
import { ref, push, update } from 'firebase/database' // Import update for editing
import { realtimeDb } from '@/app/(backend)/lib/firebase' // Firebase config
import styles from './NameVarietyForm.module.css'

export default function NameVarietyForm({
  currentNameVariety,
  currentId,
  onEdit,
}) {
  const [productNameVariety, setProductNameVariety] = useState(
    currentNameVariety || ''
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setProductNameVariety(currentNameVariety || '') // Update the form when editing
  }, [currentNameVariety])

  const handleNameVarietyChange = (e) => setProductNameVariety(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (currentId) {
        // Update existing product Variety in Firebase
        const productRef = ref(realtimeDb, `products_Name_Variety/${currentId}`) // Ensure the path is correct
        await update(productRef, { name: productNameVariety }) // Ensure the property matches how it's stored
        onEdit() // Clear form after editing
      } else {
        // Push new product Variety to Firebase
        const productRef = ref(realtimeDb, 'products_Name_Variety/')
        await push(productRef, { name: productNameVariety }) // Store with 'name' key
      }
      setProductNameVariety('')
      alert('Product Name Variety saved successfully!')
    } catch (error) {
      console.error('Error saving product Name Variety:', error)
      alert('Failed to save product Name Variety. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.form_container}>
      <h2>
        {currentId
          ? 'Edit Product Name Variety'
          : 'Add New Product Name Variety'}
      </h2>
      <form onSubmit={handleSubmit} className={styles.product_variety_form}>
        <label htmlFor="name">Product Name Variety</label>
        <input
          type="text"
          id="name"
          value={productNameVariety}
          onChange={handleNameVarietyChange}
          placeholder="Enter product Name Variety"
          required
        />
        <button
          type="submit"
          className={styles.submit_button}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Submitting...'
            : currentId
            ? 'Edit Product Name Variety'
            : 'Add Product Name Variety'}
        </button>
      </form>
    </div>
  )
}
