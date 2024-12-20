'use client'
import { useEffect, useState } from 'react'
import { ref, onValue } from 'firebase/database'
import { realtimeDb } from '@/app/(backend)/lib/firebase'
import Image from 'next/image'
import styles from './ComponentsStyles/Container.module.css'
import { IoCartOutline } from 'react-icons/io5'
import { FaRegHeart } from 'react-icons/fa'
import { useCart } from '@/app/(frontend)/context/CartContext'
import { useWishlist } from '@/app/(frontend)/context/WishlistContext'
import MainPageProductLoading from '../../loading/MainPageProductLoading'
import { LiaStarSolid } from 'react-icons/lia'
import Link from 'next/link'
import SingleProductLoading from '@/app/loading/SingleProductLoading'

const Container = () => {
  const [categories, setCategories] = useState({})
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedWeight, setSelectedWeight] = useState(1)
  const [showAllCategories, setShowAllCategories] = useState({}) // Track 'show all' for each category
  const [loadingProductId, setLoadingProductId] = useState(null) // Track loading state per product

  const handleLinkClick = (productId) => {
    setLoadingProductId(productId)
  }

  const { addToCart } = useCart()
  const { addToWishlist } = useWishlist()

  useEffect(() => {
    const dbRef = ref(realtimeDb, 'products')

    const unsubscribeProducts = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const productData = snapshot.val()
        const categorizedData = Object.keys(productData).reduce((acc, key) => {
          const product = productData[key]
          if (product.category) {
            if (!acc[product.category]) {
              acc[product.category] = []
            }
            acc[product.category].push({
              id: key,
              ...product,
            })
          }
          return acc
        }, {})
        setCategories(categorizedData)
      } else {
        console.log('No products available')
        setCategories({})
      }
      setLoading(false)
    })

    return () => unsubscribeProducts()
  }, [])

  useEffect(() => {
    const dbRef = ref(realtimeDb, 'orders')

    const unsubscribeOrders = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const ordersData = snapshot.val()

        // Process orders to calculate product ratings
        const productRatings = {}

        Object.keys(ordersData).forEach((orderKey) => {
          const order = ordersData[orderKey]
          const cartItems = order.cartItems || []

          cartItems.forEach((item) => {
            const { id, reviews } = item
            const reviewRating = reviews?.stars || null

            if (reviewRating !== null) {
              if (!productRatings[id]) {
                productRatings[id] = { totalRating: 0, reviewCount: 0 }
              }

              productRatings[id].totalRating += reviewRating
              productRatings[id].reviewCount += 1
            }
          })
        })

        const averageRatings = Object.keys(productRatings).reduce(
          (acc, productId) => {
            const { totalRating, reviewCount } = productRatings[productId]
            acc[productId] = {
              averageRating: (totalRating / reviewCount).toFixed(1),
              totalReviews: reviewCount,
            }
            return acc
          },
          {}
        )

        // Merge ratings into categories
        setCategories((prevCategories) => {
          const updatedCategories = { ...prevCategories }

          Object.keys(updatedCategories).forEach((category) => {
            updatedCategories[category] = updatedCategories[category].map(
              (product) => ({
                ...product,
                ...averageRatings[product.id],
              })
            )
          })

          return updatedCategories
        })
      } else {
        console.log('No orders available')
      }
    })

    return () => unsubscribeOrders()
  }, [])

  const handleAddToCart = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleAddToWishlist = (product) => {
    addToWishlist(product)
    alert(`${product.productName} has been added to your wishlist.`)
  }

  const handleWeightChange = (increment) => {
    setSelectedWeight((prev) => (increment ? prev + 1 : Math.max(1, prev - 1)))
  }

  const handleAddToCartConfirm = () => {
    if (selectedProduct) {
      addToCart({ ...selectedProduct, weight: selectedWeight })
      alert(`${selectedProduct.productName} has been added to your cart.`)
      setIsModalOpen(false)
    }
  }

  const toggleShowAll = (category) => {
    setShowAllCategories((prev) => ({
      ...prev,
      [category]: !prev[category], // Toggle the state for the specific category
    }))
  }

  return (
    <div className={styles.container}>
      {loading ? (
        <MainPageProductLoading />
      ) : (
        Object.keys(categories).map((category) => (
          <div key={category} className={styles.categorySection}>
            <div className={styles.title}>
              <h2>{category}</h2>
            </div>
            <div className={styles.In_container}>
              {categories[category]
                .slice(
                  0,
                  showAllCategories[category] ? categories[category].length : 4
                )
                .map((product) => (
                  <div key={product.id} className={styles.card}>
                    <Link
                      legacyBehavior
                      href={`/product_details/${product.id}`}
                      onClick={() => setIsNavigating(true)}

                    >
                      <a  onClick={() => handleLinkClick(product.id)}>
                      
                        <div className={styles.image_box}>
                          <Image
                            src={product.frontImageUrl}
                            alt={product.productName}
                            width={1000}
                            height={1000}
                            className={styles.image}
                            loading="lazy"
                          />
                        </div>

                        <div className={styles.info}>
                          <div className={styles.name}>
                            <h2>{product.price} Rs</h2>
                            <h4>({product.weight})</h4>
                          </div>
                          <h4>{product.productName}</h4>
                          <p>{product.nameVariety}</p>
                          <div className={styles.reviews}>
                            <LiaStarSolid size="17px" />
                            {product.averageRating || 'No reviews'} (
                            {product.totalReviews || 0} Reviews)
                          </div>
                        </div>
                        {loadingProductId === product.id && (
                            <div className={styles.loadingOverlay}>
                              <SingleProductLoading />
                            </div>
                          )}
                      </a>
                    </Link>
                
                    <div className={styles.buttonbox}>
                      <button onClick={() => handleAddToCart(product)}>
                        <IoCartOutline size="25" /> Cart
                      </button>
                      <button onClick={() => handleAddToWishlist(product)}>
                        <FaRegHeart size="20" /> Wishlist
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            <div className={styles.showmorebox}>
              <button onClick={() => toggleShowAll(category)}>
                {showAllCategories[category] ? 'Show Less' : 'Show More'}
              </button>
            </div>
          </div>
        ))
      )}

      {isModalOpen && selectedProduct && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Confirm Your Selection</h2>
            <p>Product: {selectedProduct.productName}</p>
            <div className={styles.modalField}>
              <p>Weight:</p>
              <button onClick={() => handleWeightChange(false)}>-</button>
              <span>{selectedWeight} kg</span>
              <button onClick={() => handleWeightChange(true)}>+</button>
            </div>
            <p>Total Price: {selectedProduct.price * selectedWeight} PKR</p>
            <button onClick={handleAddToCartConfirm}>Confirm</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Container
