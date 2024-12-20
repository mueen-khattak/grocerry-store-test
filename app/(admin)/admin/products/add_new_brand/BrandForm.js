'use client'
import { useState, useEffect } from 'react'
import { ref, set } from 'firebase/database'
import { storage } from '@/app/(backend)/lib/firebase'
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage'
import { realtimeDb } from '@/app/(backend)/lib/firebase'
import styles from './BrandForm.module.css'
import Image from 'next/image'

export default function AddBrandForm({
  selectedBrand,
  setSelectedBrand,
  fetchBrands,
}) {
  const [brandName, setBrandName] = useState('')
  const [brandImage, setBrandImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form when a brand is selected for editing
  useEffect(() => {
    if (selectedBrand) {
      setBrandName(selectedBrand.name)
      setBrandImage(null) // Reset the image, as we might not have it in an editable form
    }
  }, [selectedBrand])

  const handleBrandChange = (e) => setBrandName(e.target.value)
  const handleImageChange = (e) => setBrandImage(e.target.files[0])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!brandName || (!brandImage && !selectedBrand?.img)) {
      alert('Please provide a brand name and an image.')
      return
    }

    setIsSubmitting(true)

    try {
      const brandId = selectedBrand
        ? selectedBrand.id
        : new Date().getTime().toString()

      let downloadURL = selectedBrand?.img

      if (brandImage) {
        const imageRef = storageRef(
          storage,
          `brands/${brandId}/${brandImage.name}`
        )
        const uploadTask = uploadBytesResumable(imageRef, brandImage) // Fixed: Changed to brandImage

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

      await set(ref(realtimeDb, 'brands/' + brandId), {
        name: brandName,
        imageUrl: downloadURL,
      })

      alert(
        selectedBrand
          ? 'Brand updated successfully!'
          : 'Brand added successfully!'
      )
      fetchBrands() // Call fetchBrands to refresh the list

      setBrandName('')
      setBrandImage(null)
      setSelectedBrand(null) // Reset selected brand after submission
      setIsSubmitting(false)
    } catch (error) {
      console.error('Error adding/updating brand:', error)
      alert('An error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.form_container}>
      <h2>{selectedBrand ? 'Edit Brand' : 'Add New Brand'}</h2>
      <form onSubmit={handleSubmit} className={styles.brand_form}>
        <label htmlFor="name">Brand Name:</label>
        <input
          type="text"
          id="name"
          value={brandName}
          onChange={handleBrandChange}
          placeholder="Enter brand name"
          required
        />

        <label htmlFor="image">Brand Image:</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />

        {selectedBrand && selectedBrand.img && !brandImage && (
          <div>
            <p>Current Image:</p>
            <Image src={selectedBrand.img} alt={selectedBrand.name} width={100}
            height={100} />
          </div>
        )}

        <button
          type="submit"
          className={styles.submit_button}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Submitting...'
            : selectedBrand
            ? 'Update Brand'
            : 'Add Brand'}
        </button>
      </form>
    </div>
  )
}
