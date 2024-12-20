'use client'

import { useSearchParams, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { realtimeDb } from '@/app/(backend)/lib/firebase'
import { ref, get } from 'firebase/database'
import Image from 'next/image'
import styles from './ProductDetails.module.css'
import { useWishlist } from '@/app/(frontend)/context/WishlistContext'
import { useCart } from '@/app/(frontend)/context/CartContext'
import ButtonLoading from '@/app/loading/ButtonLoading'
import Reviews from '../Reviews'
import { FaMinus } from 'react-icons/fa'
import { IoCartOutline } from 'react-icons/io5'
import { FaRegHeart } from 'react-icons/fa'
import Product_Details_Loading from '../../../loading/Product_Details_Loading'
import Related from '../Related'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import Link from 'next/link'

export default function ProductDetails() {

 
  const params = useParams();
  const productId = params.id;
  console.log('productId',productId)


  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true) // Loading state for full page loader
  const [wishlistButtonLoading, setWishlistButtonLoading] = useState(false)
  const [cartButtonLoading, setCartButtonLoading] = useState(false)
  const [currentImage, setCurrentImage] = useState('')
  const [moreImagesUrls, setMoreImagesUrls] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedWeight, setSelectedWeight] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0) // Scroll to top on component mount
  }, [])

  const { addToWishlist } = useWishlist()
  const {
    addToCart: addItemToCart,
    cartItems,
    removeFromCart,
    incrementWeight,
    decrementWeight,
  } = useCart()

  const calculatePriceForWeight = (weight, pricePerKg) => {
    const validWeight = parseFloat(weight)
    const validPricePerKg = parseFloat(pricePerKg)
    return isNaN(validWeight) || isNaN(validPricePerKg)
      ? 0
      : (validWeight * validPricePerKg).toFixed(2)
  }

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        const productRef = ref(realtimeDb, `products/${productId}`)
        try {
          const snapshot = await get(productRef)
          if (snapshot.exists()) {
            setProduct(snapshot.val())
            setCurrentImage(snapshot.val().frontImageUrl)
            setMoreImagesUrls(snapshot.val().moreImagesUrls)
          } else {
            console.log('No data available')
          }
        } catch (error) {
          console.error('Error fetching product:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchProduct()
    }
  }, [productId])

  const handleImageClick = (imageUrl) => setCurrentImage(imageUrl)

  const handleAddToCartClick = () => setIsModalOpen(true)

  const handleAddToCartConfirm = () => {
    setCartButtonLoading(true)
    const cartItem = {
      ...product,
      weight: selectedWeight,
      price: product.price,
      id: productId,
    }
    const existingItem = cartItems.find((item) => item.id === productId)
    if (existingItem) removeFromCart(existingItem.id)
    addItemToCart(cartItem)
    setCartButtonLoading(false)
    alert(`${product.productName} has been added to your cart.`)
    setIsModalOpen(false)
  }

  const handleAddToWishlist = () => {
    setWishlistButtonLoading(true)
    const wishlistItem = { ...product, id: productId }
    addToWishlist(wishlistItem)
    // alert(`${product.productName} has been added to your wishlist.`);
    setWishlistButtonLoading(false)
  }

  const handleWeightChange = (increment) => {
    increment
      ? incrementWeight(productId)
      : selectedWeight > 1 && decrementWeight(productId)
    setSelectedWeight((prev) => (increment ? prev + 1 : Math.max(1, prev - 1)))
  }

  if (loading) {
    return <Product_Details_Loading />
  }

  if (!product) {
    return <p>Product not found</p>
  }

  const existingItem = cartItems.find((item) => item.id === productId)
  const displayedWeight = existingItem ? existingItem.weight : selectedWeight
  const displayedPrice = calculatePriceForWeight(displayedWeight, product.price)

  return (
    <>
      {loading ? (
        <Product_Details_Loading />
      ) : (
        <>
          <Navbar />
          <div className={styles.links}>
            <Link legacyBehavior href={'/'}><a >Home</a></Link>  |
            <a>
              Product_Details for &quot;{product.productName}{' '}
              <FaMinus size={'10px'} /> {product.nameVariety}&quot;
            </a>
          </div>
          <div className={styles.productDetails}>
            <div className={styles.left}>
              <div className={styles.frontimageContainer}>
                <Image
                  src={currentImage || product.frontImageUrl}
                  alt={product.productName}
                  width={1000}
                  height={1000}
                  className={styles.productImage}
                  layout="responsive" // Ensures the image adjusts responsively
                  objectFit="contain" // Ensures the image fits within the container without distortion
                  priority // Loads the image with high priority
                />
              </div>

              <div className={styles.moreimageContainer}>
                {product.moreImagesUrls && product.moreImagesUrls.length > 0 ? (
                  product.moreImagesUrls.map((imageUrl, index) => (
                    <div key={index} className={styles.moreimages}>
                      <Image
                        src={imageUrl}
                        alt={`${product.productName} - Additional Image ${
                          index + 1
                        }`}
                        width={900}
                        height={900}
                        objectFit="contain"
                        quality={100}
                        className={styles.moreImage}
                        onClick={() => handleImageClick(imageUrl)}
                      />
                    </div>
                  ))
                ) : (
                  <p></p>
                )}
              </div>
            </div>
            <div className={styles.right}>
              <p className={styles.category}>{product.category}</p>

              <div className={styles.righttop}>
                <h1>
                  {product.productName} <FaMinus size={'15px'} />{' '}
                  {product.nameVariety}
                </h1>
              </div>
              <h1 className={styles.h1}>
                Rs.{product.price}({product.weight})
              </h1>

              <p className={styles.description}>
                &quot;{product.description}&quot;
              </p>

              <div className={styles.buttonbox}>
                {wishlistButtonLoading ? (
                  <button className={styles.ButtonLoading}>
                    <ButtonLoading />
                  </button>
                ) : (
                  <button
                    className={styles.Button}
                    onClick={handleAddToWishlist}
                  >
                    <FaRegHeart size="20" />
                    <p>Add To Wishlist</p>
                  </button>
                )}
                {cartButtonLoading ? (
                  <button className={styles.ButtonLoading}>
                    <ButtonLoading />
                  </button>
                ) : (
                  <button
                    className={styles.Button2}
                    onClick={handleAddToCartClick}
                  >
                    <IoCartOutline size="24" />
                    <p>Add To Cart</p>
                  </button>
                )}
              </div>
            </div>

            {isModalOpen && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <h2>Confirm Your Selection</h2>
                  <p>Product: {product.productName}</p>
                  <div className={styles.modalField}>
                    <p>Weight:</p>
                    <button onClick={() => handleWeightChange(false)}>-</button>
                    <span>{displayedWeight} kg</span>
                    <button onClick={() => handleWeightChange(true)}>+</button>
                  </div>
                  <p>Total Price: {displayedPrice} PKR</p>
                  {cartButtonLoading ? (
                    <ButtonLoading />
                  ) : (
                    <button onClick={handleAddToCartConfirm}>Confirm</button>
                  )}
                  <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <div className={styles.Reviews}>
        <Reviews productId={productId} />
      </div>
      <div>
        <Related category={product.category} />
      </div>
      <div>
        <Footer />
      </div>
    </>
  )
}
