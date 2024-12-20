'use client'

import { useState, useEffect, } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import style from '../../AdminPageGloble.module.css'
import styles from './AddProductForm.module.css'
import Link from 'next/link'
import { push, ref, onValue, set, update, remove } from 'firebase/database'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { realtimeDb, storage } from '@/app/(backend)/lib/firebase'
import Image from 'next/image'

const AddNewProduct = () => {
  const [productName, setProductName] = useState('')
  const [frontImage, setFrontImage] = useState(null)
  const [moreImages, setMoreImages] = useState([])
  const [existingFrontImage, setExistingFrontImage] = useState('')
  const [existingMoreImages, setExistingMoreImages] = useState([])
  const [variety, setVariety] = useState('')
  const [nameVariety, setNameVariety] = useState('') // New state for Name Varieties
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [weight, setWeight] = useState('')
  const [weightUnit, setWeightUnit] = useState('kg')
  const [price, setPrice] = useState('')
  const [stockAvailability, setStockAvailability] = useState('')
  const [color, setColor] = useState('')
  const [productNames, setProductNames] = useState([])
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [varieties, setVarieties] = useState([])
  const [nameVarieties, setNameVarieties] = useState([]) // New state for Name Varieties
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingProduct, setEditingProduct] = useState(false)
  const [reviews, setReviews] = useState('') // New state for reviews


  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('id') // Get the product ID from query params

  // Array of common colors
  const colors = [
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Black',
    'White',
    'Purple',
    'Orange',
    'Pink',
    'Brown',
    'Gray',
    'Cyan',
    'Magenta',
    'Maroon',
    'Navy',
    'Olive',
    'Lime',
    'Teal',
    'Silver',
    'Gold',
  ]

  useEffect(() => {
    if (productId) {
      const productRef = ref(realtimeDb, `products/${productId}`)
      onValue(productRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          setProductName(data.productName)
          setExistingFrontImage(data.frontImageUrl)
          setExistingMoreImages(data.moreImagesUrls || [])
          setVariety(data.variety)
          setNameVariety(data.nameVariety || '') // Set Name Variety if exists
          setBrand(data.brand)
          setCategory(data.category)
          setDescription(data.description)
          setWeight(data.weight.split(' ')[0])
          setWeightUnit(data.weight.split(' ')[1])
          setPrice(data.price.split(' ')[0])
          setStockAvailability(data.stockAvailability.split(' ')[0])
          setColor(data.color)
          setReviews(data.reviews || '') // Set reviews if exists, else default to empty array
          setEditingProduct(true)
        }
      })
    }
  }, [productId])

  // Fetching product names, brands, categories, varieties, and name varieties
  useEffect(() => {
    const productRef = ref(realtimeDb, 'products_name/')
    onValue(productRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const namesArray = Object.keys(data).map((key) => data[key].name)
        setProductNames(namesArray)
      } else {
        setProductNames([])
      }
    })
  }, [])

  useEffect(() => {
    const brandRef = ref(realtimeDb, 'brands/')
    onValue(brandRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const brandsArray = Object.keys(data).map((key) => data[key].name)
        setBrands(brandsArray)
      } else {
        setBrands([])
      }
    })
  }, [])

  useEffect(() => {
    const categoryRef = ref(realtimeDb, 'categories/')
    onValue(categoryRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const categoriesArray = Object.keys(data).map((key) => data[key].name)
        setCategories(categoriesArray)
      } else {
        setCategories([])
      }
    })
  }, [])

  useEffect(() => {
    const varietyRef = ref(realtimeDb, 'products_Variety/')
    onValue(varietyRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const varietiesArray = Object.keys(data).map((key) => data[key].name)
        setVarieties(varietiesArray)
      } else {
        setVarieties([])
      }
    })
  }, [])

  // New useEffect to fetch name varieties
  useEffect(() => {
    const nameVarietyRef = ref(realtimeDb, 'products_Name_Variety/') // Change this to your actual path for name varieties
    onValue(nameVarietyRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const nameVarietiesArray = Object.keys(data).map(
          (key) => data[key].name
        )
        setNameVarieties(nameVarietiesArray)
      } else {
        setNameVarieties([])
      }
    })
  }, [])

  const handleMoreImagesChange = (e) => {
    const files = Array.from(e.target.files)
    setMoreImages((prevImages) => [...prevImages, ...files])
  }

  const handleFrontImageChange = (e) => {
    setFrontImage(e.target.files[0])
  }

  const handleUploadImages = async (images) => {
    const urls = []
    for (const image of images) {
      const storageReference = storageRef(storage, `images/${image.name}`)
      await uploadBytes(storageReference, image)
      const url = await getDownloadURL(storageReference)
      urls.push(url)
    }
    return urls
  }

  const deleteImageFromFirebase = async (imageUrl) => {
    const imageRef = storageRef(storage, imageUrl) // Use the correct path
    await deleteObject(imageRef)
  }

  const handleDeleteImage = async (imageUrl, isFrontImage = false) => {
    try {
      await deleteImageFromFirebase(imageUrl) // Call the delete function

      if (isFrontImage) {
        setExistingFrontImage(null) // Clear the front image
      } else {
        setExistingMoreImages((prevImages) =>
          prevImages.filter((img) => img !== imageUrl)
        ) // Remove from existing images
      }

      alert('Image deleted successfully') // Notify user
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Failed to delete image.') // Notify user
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const uploadedMoreImages = await handleUploadImages(moreImages)
      const uploadedFrontImageUrl = frontImage
        ? await handleUploadImages([frontImage])
        : null

      const productData = {
        productName,
        frontImageUrl: uploadedFrontImageUrl
          ? uploadedFrontImageUrl[0]
          : existingFrontImage,
        moreImagesUrls: [...existingMoreImages, ...uploadedMoreImages],
        variety,
        nameVariety, // Include the new name variety in product data
        brand,
        category,
        description,
        weight: `${weight} ${weightUnit}`,
        price: `${price}`,
        stockAvailability: `${stockAvailability} kg`,
        color,
        reviews, // Include reviews in the product data

        
      }

      if (editingProduct) {
        const productRef = ref(realtimeDb, `products/${productId}`)
        await update(productRef, productData)
        window.alert('Product updated successfully!')
      } else {
        const productRef = push(ref(realtimeDb, 'products'))
        await set(productRef, productData)
        window.alert('Product added successfully!')
      }

      resetForm()
    } catch (error) {
      window.alert('Error: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setProductName('')
    setFrontImage(null)
    setMoreImages([])
    setVariety('')
    setNameVariety('') // Reset name variety
    setBrand('')
    setCategory('')
    setDescription('')
    setWeight('')
    setWeightUnit('kg')
    setPrice('')
    setStockAvailability('')
    setColor('')
    setEditingProduct(false)
    setExistingFrontImage('')
    setExistingMoreImages([])
  }

  return (
    <div className={style.main}>
      <form className={styles.add_product_form} onSubmit={handleSubmit}>
        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>

        {/* Product Name */}
        <label>
          <div className={styles.lable_top}>
            <p>Product Name</p>
            <div>
              <Link legacyBehavior prefetch={true}  href="/admin/products/add_new_product_name">
              <a>
                Add New Name
              </a>
              </Link>
            </div>
          </div>
          <select
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Product Name
            </option>
            {productNames.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <div className={styles.lable_top}>
            <p>Category</p>
            <Link legacyBehavior prefetch={true}  href="/admin/products/add_new_category">
            <a >
              Add New Category
            </a>
            </Link>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          <div className={styles.lable_top}>
            <p>Variety</p>
            <Link legacyBehavior prefetch={true} href="/admin/products/add_new_variety">
            <a >Add New Variety</a>
            </Link>
          </div>
          <select
            value={variety}
            onChange={(e) => setVariety(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Variety
            </option>
            {varieties.map((variety, index) => (
              <option key={index} value={variety}>
                {variety}
              </option>
            ))}
          </select>
        </label>

        {/* name variety */}
        <label>
          <div className={styles.lable_top}>
            <p>Name Variety</p>
            <div>
              <Link legacyBehavior prefetch={true} href="/admin/products/add_new_name_variety" >
              <a >
                Add New Name Variety
              </a>
              </Link>
            </div>
          </div>
          <select
            value={nameVariety}
            onChange={(e) => setNameVariety(e.target.value)}
            required
          >
            <option value="">Select Name Variety</option>
            {nameVarieties.map((nameVariety, index) => (
              <option key={index} value={nameVariety}>
                {nameVariety}
              </option>
            ))}
          </select>
        </label>

        {/* Front Image */}
        <label>
          Front Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFrontImageChange}
          />
        </label>

        {/* Preview Front Image */}
        {frontImage ? (
          <div className={styles.image_preview_container}>
            <h4>Front Image Preview</h4>
            <div className={styles.image_preview}>
              <Image
                width={100}
                height={100}
                src={URL.createObjectURL(frontImage)}
                alt="Front Preview"
              />
            </div>
          </div>
        ) : (
          existingFrontImage && (
            <div className={styles.image_preview_container}>
              <h4>Existing Front Image</h4>
              <div className={styles.image_preview}>
                <Image
                  width={100}
                  height={100}
                  src={existingFrontImage}
                  alt="Existing Front"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(existingFrontImage, true)}
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}

        {/* More Images */}
        <label>
          More Images
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleMoreImagesChange}
          />
        </label>

        {/* Preview More Images */}
        <div className={styles.more_images_preview}>
          <h4>More Images Preview</h4>
          {existingMoreImages.map((imageUrl, index) => (
            <div key={index} className={styles.image_preview}>
              <Image
                width={100}
                height={100}
                src={imageUrl}
                alt={`More Image ${index}`}
              />
              <button type="button" onClick={() => handleDeleteImage(imageUrl)}>
                Delete
              </button>
            </div>
          ))}
          {moreImages.map((image, index) => (
            <div key={index} className={styles.image_preview}>
              <Image
                width={100}
                height={100}
                src={URL.createObjectURL(image)}
                alt={`More Image ${index}`}
              />
            </div>
          ))}
        </div>

        {/* Other Fields */}

        <label>
          <div className={styles.lable_top}>
            <p>Brand</p>
            <a href="/admin/products/add_new_brand">Add New Brand</a>
          </div>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Brand
            </option>
            {brands.map((brand, index) => (
              <option key={index} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Weight
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
          <select
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value)}
          >
            <option value="kg">kg</option>
            <option value="g">g</option>
          </select>
        </label>
        <label>
          Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <label>
          Stock Availability
          <input
            type="number"
            value={stockAvailability}
            onChange={(e) => setStockAvailability(e.target.value)}
            required
          />
        </label>

        {/* Color */}
        <label>
          <div className={styles.color_label}>
            <p>Color</p>
            {/* Color Circle */}
            <div
              className={styles.color_circle}
              style={{ backgroundColor: color }}
            ></div>
          </div>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Color
            </option>
            {colors.map((color, index) => (
              <option key={index} value={color}>
                {color}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Submitting...'
            : editingProduct
            ? 'Update Product'
            : 'Add Product'}
        </button>
      </form>
    </div>
  )
}

export default AddNewProduct
