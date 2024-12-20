'use client'
import { useState, useEffect } from 'react'
import { ref, push, update } from 'firebase/database' // Import update for editing
import { realtimeDb } from '@/app/(backend)/lib/firebase' // Firebase config
import styles from './newvarietyform.module.css'

export default function NewVarietyForm({ currentVariety, currentId, onEdit }) {
  const [productVariety, setProductVariety] = useState(currentVariety || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setProductVariety(currentVariety || '') // Update the form when editing
  }, [currentVariety])

  const handleVarietyChange = (e) => setProductVariety(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (currentId) {
        // Update existing product Variety in Firebase
        const productRef = ref(realtimeDb, `products_Variety/${currentId}`) // Ensure the path is correct
        await update(productRef, { name: productVariety }) // Ensure the property matches how it's stored
        onEdit() // Clear form after editing
      } else {
        // Push new product Variety to Firebase
        const productRef = ref(realtimeDb, 'products_Variety/')
        await push(productRef, { name: productVariety }) // Store with 'name' key
      }
      setProductVariety('')
      alert('Product Variety saved successfully!')
    } catch (error) {
      console.error('Error saving product Variety:', error)
      alert('Failed to save product Variety. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.form_container}>
      <h2>{currentId ? 'Edit Product Variety' : 'Add New Product Variety'}</h2>
      <form onSubmit={handleSubmit} className={styles.product_variety_form}>
        <label htmlFor="name">Product Variety:</label>
        <input
          type="text"
          id="name"
          value={productVariety}
          onChange={handleVarietyChange}
          placeholder="Enter product Variety"
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
            ? 'Edit Product Variety'
            : 'Add Product Variety'}
        </button>
      </form>
    </div>
  )
}
