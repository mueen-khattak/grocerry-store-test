'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import style from '@/app/(frontend)/UserGloblePage.module.css'
import styles from './wishlist.module.css'
import { TbXboxXFilled } from 'react-icons/tb'
import { useWishlist } from '../context/WishlistContext' // Import the context
import { useCart } from '../context/CartContext' // Import Cart context
import DashboardLayout from '../UserComponents/DashboardLayout'
import Link from 'next/link'
import { IoCartOutline } from 'react-icons/io5'

const WishList = () => {
  const { wishlistItems, removeFromWishlist, toggleShowMore, wishlistCount } =
    useWishlist() // Use context
  const { addToCart } = useCart() // Use Cart context

  const [selectedWeight, setSelectedWeight] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleAddToCart = (item) => {
    setSelectedProduct(item)
    setSelectedWeight(1)
    setIsModalOpen(true)
  }
  console.log('selectedProduct', selectedProduct)

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

  return (
    <>
      <DashboardLayout />
      <div className={style.main}>
        <div className={styles.title}>
          <h2>My Wishlist ({wishlistCount})</h2> {/* Display wishlist count */}
        </div>
        <div className={styles.shoppingCart}>
          <div className={styles.cartItems}>
            {wishlistItems.length > 0 ? (
              wishlistItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.imagebox}>
                    <Image
                      src={item.frontImageUrl}
                      alt={item.productName}
                      width={940}
                      height={900}
                      className={styles.productImage}
                      priority
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.namebox}>
                      <Link legacyBehavior prefetch={true} href={`/product_details?id=${item.id}`}>
                      <a>
                        <h4>
                          {item.productName} <span>- {item.nameVariety}</span>
                        </h4>
                        </a>
                      </Link>
                      <div className={styles.totalpricebox}>
                        <p>
                          ({item.weight}){item.price} Rs
                        </p>
                      </div>
                      <div className={styles.removebtnbox}>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className={styles.addToCartButton}
                        >
                          <IoCartOutline size="25" />
                        </button>
                        <button
                          className={styles.removebtn}
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <TbXboxXFilled color="red" size={'27px'} />
                        </button>
                      </div>
                    </div>

                    {item.showMore && (
                      <div className={styles.show_more_info}>
                        <p>Price per 1 Kg: {item.price}</p>
                        <p>Brand: {item.brand}</p>
                        <p>Category: {item.category}</p>
                        <p>Variety: {item.nameVariety}</p>
                        <p>Stock Available: {item.stockAvailability}</p>
                        <p>Description: {item.description}</p>
                        <div className={styles.moreImages}>
                          {item.moreImagesUrls &&
                          item.moreImagesUrls.length > 0 ? (
                            item.moreImagesUrls.map((url, idx) => (
                              <Image
                                key={idx}
                                src={url}
                                alt={`${item.productName} image ${idx + 1}`}
                                width={50}
                                height={50}
                                className={styles.moreImage}
                                priority
                              />
                            ))
                          ) : (
                            <p>No additional images available.</p>
                          )}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => toggleShowMore(item.id)}
                      className={styles.showMoreButton}
                    >
                      {item.showMore ? 'Show Less Info' : 'Show More Info'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Your wishlist is empty.</p>
            )}
          </div>
        </div>
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
    </>
  )
}

export default WishList
