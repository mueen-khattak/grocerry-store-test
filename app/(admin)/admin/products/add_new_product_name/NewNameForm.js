'use client'
import { useState, useEffect } from 'react'
import { ref, push, update } from 'firebase/database' // Import update for editing
import { realtimeDb } from '@/app/(backend)/lib/firebase' // Firebase config
import styles from './newnameform.module.css'

export default function NewNameForm({ currentName, currentId, onEdit }) {
  const [productName, setProductName] = useState(currentName || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setProductName(currentName || '') // Update the form when editing
  }, [currentName])

  const handleNameChange = (e) => setProductName(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (currentId) {
        // Update existing product name in Firebase
        const productRef = ref(realtimeDb, `products_name/${currentId}`)
        await update(productRef, { name: productName })
        onEdit() // Clear form after editing
      } else {
        // Push new product name to Firebase
        const productRef = ref(realtimeDb, 'products_name/')
        await push(productRef, { name: productName })
      }
      setProductName('')
      alert('Product name saved successfully!')
    } catch (error) {
      console.error('Error saving product name:', error)
      alert('Failed to save product name. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.form_container}>
      <h2>{currentId ? 'Edit Product Name' : 'Add New Product Name'}</h2>
      <form onSubmit={handleSubmit} className={styles.product_name_form}>
        <label htmlFor="name">Product Name:</label>
        <input
          type="text"
          id="name"
          value={productName}
          onChange={handleNameChange}
          placeholder="Enter product name"
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
            ? 'Edit Product Name'
            : 'Add Product Name'}
        </button>
      </form>
    </div>
  )
}
