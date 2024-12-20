'use client'

import { useSession, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { realtimeDb } from '@/app/(backend)/lib/firebase'
import { ref, onValue, update } from 'firebase/database'
import styles from './myreviews.module.css'
import style from '../UserGloblePage.module.css'
import DashboardLayout from '../UserComponents/DashboardLayout'
import Image from 'next/image'
import { FaStar, FaRegStar } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


const Reviews = () => {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState([])
  const [editingReview, setEditingReview] = useState(null)
  const [reviewText, setReviewText] = useState('')
  const [reviewStars, setReviewStars] = useState(0)
  const [reviewImages, setReviewImages] = useState([])
  const [userImage, setUserImage] = useState(null)

  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Wait until the session status is resolved
    if (!session) {
      router.push('/login') // Redirect to login page
    }
  }, [session, status, router])




  useEffect(() => {
    const fetchUserImage = async () => {
      if (session?.user?.email) {
        const userRef = ref(
          realtimeDb,
          `users/${session.user.email.replace('.', '_')}`
        )
        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserImage(snapshot.val()?.profileImage || null)
          }
        })
      }
    }

    const listenToOrders = async () => {
      const activeSession = await getSession()
    

      const ordersRef = ref(realtimeDb, 'orders')
      onValue(ordersRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          const ordersArray = Object.entries(data)
            .filter(
              ([_, order]) => order.user?.email === activeSession.user.email
            )
            .map(([id, order]) => ({ ...order, id }))
          setOrders(ordersArray)
        } else {
          setOrders([])
        }
      })
    }

    fetchUserImage()
    listenToOrders()
  }, [session])

  const handleReviewUpdate = async (orderId, itemId) => {
    if (!reviewText.trim() || reviewStars < 1 || reviewStars > 5) return

    try {
      const orderIndex = orders.findIndex((order) => order.id === orderId)
      if (orderIndex === -1) return

      const itemIndex = orders[orderIndex].cartItems.findIndex(
        (item) => item.id === itemId
      )
      if (itemIndex === -1) return

      const currentDate = new Date().toLocaleDateString('en-GB')

      const updatedReview = {
        text: reviewText,
        stars: reviewStars,
        images: reviewImages,
        reviewer: session.user.username,
        reviewerImage: userImage,
        date: currentDate,
      }

      const updates = {
        [`orders/${orderId}/cartItems/${itemIndex}/reviews`]: updatedReview,
      }
      await update(ref(realtimeDb), updates)

      // Hide popup on successful update
      setEditingReview(null)
      setReviewText('')
      setReviewStars(0)
      setReviewImages([])
      alert('Review saved successfully!')
    } catch (error) {
      console.error('Error updating review:', error)
      alert('Failed to save the review. Please try again.')
    }
  }

  const handleEditClick = (orderId, itemId, existingReview) => {
    setEditingReview({ orderId, itemId })
    setReviewText(existingReview?.text || '')
    setReviewStars(existingReview?.stars || 0)
    setReviewImages(existingReview?.images || [])
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (reviewImages.length + files.length > 4) {
      alert('You can upload a maximum of 4 images.')
      return
    }

    const newImages = []
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        newImages.push(reader.result)
        if (newImages.length === files.length) {
          setReviewImages((prevImages) => [...prevImages, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setReviewImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

 
  return (
    <>
      <DashboardLayout />
      <div className={style.main}>
        <div className={styles.ordersContainer}>
          <div className={styles.title}>My Reviews</div>
          {orders.length > 0 ? (
            <div className={styles.ordersList}>
              {orders.map((order, index) => (
                <div key={index} className={styles.orderCard}>
                  <p className={styles.orderdate}>{order.orderDate}</p>
                  <div className={styles.Action}>
                    <div>
                      <h3>Order Id</h3>
                      <p className={styles.orderid}>{order.id}</p>
                    </div>
                    <Link href={`/my_orders/order_details?orderId=${order.id}`}>
                      View Order Details
                    </Link>
                  </div>
                  <h3>Items</h3>
                  <ul>
                    {order.cartItems.map((item, idx) => (
                      <div className={styles.reviewbox} key={idx}>
                        <p className={styles.productname}>
                          {item.productName} - {item.variety} - {item.weight}Kg
                        </p>
                        <div className={styles.reviewDetails}>
                          {item.reviews && (
                            <>
                              {item.reviews.reviewerImage && (
                                <Image
                                  src={item.reviews.reviewerImage}
                                  alt="Reviewer Profile"
                                  width={50}
                                  height={50}
                                  className={styles.reviewerImage}
                                />
                              )}
                              <p className={styles.date}>
                                {item.reviews?.date}
                              </p>
                              <div className={styles.reviewStars}>
                                {[...Array(5)].map((_, index) =>
                                  index < (item.reviews?.stars || 0) ? (
                                    <FaStar
                                      key={index}
                                      color="rgb(42, 212, 0) "
                                      size={15}
                                    />
                                  ) : (
                                    <FaRegStar
                                      key={index}
                                      color="rgb(42, 212, 0) "
                                      size={15}
                                    />
                                  )
                                )}
                              </div>
                              <p className={styles.reviewText}>
                                &quot;{item.reviews?.text || 'No review yet'}
                                &quot;
                              </p>
                              {item.reviews?.images?.map((image, i) => (
                                <Image
                                  key={i}
                                  src={image}
                                  alt={`Review Image ${i + 1}`}
                                  width={100}
                                  height={70}
                                  className={styles.reviewImage}
                                />
                              ))}
                            </>
                          )}
                        </div>
                        <button
                          className={styles.writeReviewBtn}
                          onClick={() =>
                            handleEditClick(order.id, item.id, item.reviews)
                          }
                        >
                          {item.reviews ? 'Edit Review' : 'Write Review'}
                        </button>
                      </div>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noOrders}>No orders available.</p>
          )}
        </div>
      </div>
      {editingReview && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupModal}>
            <h3>Write/Edit Review</h3>
            <div className={styles.starRating}>
              {[...Array(5)].map((_, index) =>
                index < reviewStars ? (
                  <FaStar
                    key={index}
                    color="rgb(42, 212, 0) "
                    size={24}
                    onClick={() => setReviewStars(index + 1)}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <FaRegStar
                    key={index}
                    color="rgb(42, 212, 0) "
                    size={24}
                    onClick={() => setReviewStars(index + 1)}
                    style={{ cursor: 'pointer' }}
                  />
                )
              )}
            </div>
            <textarea
              className={styles.reviewInput}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
            ></textarea>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className={styles.imageinput}
            />
            <div className={styles.imagePreviewContainer}>
              {reviewImages.map((image, index) => (
                <div key={index} className={styles.imagePreview}>
                  <Image
                    width={100}
                    height={70}
                    src={image}
                    alt={`Review Image ${index + 1}`}
                    className={styles.reviewImage}
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className={styles.removeImageBtn}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() =>
                handleReviewUpdate(editingReview.orderId, editingReview.itemId)
              }
              className={styles.saveReviewBtn}
            >
              Save Review
            </button>
            <button
              onClick={() => setEditingReview(null)}
              className={styles.cancelReviewBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Reviews
