'use client'

import { useSession, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { realtimeDb, storage } from '@/app/(backend)/lib/firebase'
import { ref, onValue, push } from 'firebase/database'
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import styles from './My_orders.module.css'
import Image from 'next/image'
import Link from 'next/link'

const Orders = ({ sharedOrderIds }) => {
  const { data: session } = useSession()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState({})
  const [returnReasons, setReturnReasons] = useState({})
  const [images, setImages] = useState({})
  const [uploading, setUploading] = useState(false)
  const [timers, setTimers] = useState({})

  useEffect(() => {
    const listenToOrders = async () => {
      const activeSession = await getSession()
      if (!activeSession?.user?.email) {
        setLoading(false)
        return
      }

      const ordersRef = ref(realtimeDb, 'orders')
      onValue(ordersRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val()
          const ordersArray = Object.entries(data)
            .filter(
              ([_, order]) => order.user?.email === activeSession.user.email
            )
            .map(([id, order]) => ({ ...order, id }))

          // Filter out orders that are in sharedOrderIds
          const filteredOrders = ordersArray.filter(
            (order) => !sharedOrderIds.includes(order.id)
          )

          setOrders(filteredOrders)
        } else {
          setOrders([])
        }
        setLoading(false)
      })
    }

    listenToOrders()
  }, [session, sharedOrderIds])

  const handleReturnClick = (order) => {
    setSelectedOrder(order)
    setSelectedProducts({})
  }

  const toggleProductSelection = (product) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [product.productName]: !prev[product.productName] ? product : null,
    }))
  }

  const handleReasonChange = (productName, reason) => {
    setReturnReasons((prev) => ({ ...prev, [productName]: reason }))
  }

  const handleImageUpload = (productName, files) => {
    setImages((prev) => ({ ...prev, [productName]: Array.from(files) }))
  }

  const handleSendReturnData = () => {
    const selectedProductsArray =
      Object.values(selectedProducts).filter(Boolean)

    if (selectedProductsArray.length === 0) {
      alert('Please select at least one product.')
      return
    }

    setUploading(true)

    const uploadPromises = selectedProductsArray.map((product) => {
      const productImages = images[product.productName] || []
      const uploadImagePromises = productImages.map((image) => {
        const imageRef = storageRef(
          storage,
          `return-images/${Date.now()}-${image.name}`
        )
        const uploadTask = uploadBytesResumable(imageRef, image)

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => reject(error),
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => resolve(downloadURL))
                .catch((error) => reject(error))
            }
          )
        })
      })

      return Promise.all(uploadImagePromises).then((uploadedImageUrls) => ({
        productName: product.productName,
        variety: product.variety,
        reason: returnReasons[product.productName],
        images: uploadedImageUrls,
      }))
    })

    Promise.all(uploadPromises)
      .then((returnRequests) => {
        const returnRef = ref(realtimeDb, 'returns')

        // Get current date and time
        const currentDate = new Date()
        const formattedDate = currentDate.toISOString().split('T')[0] // YYYY-MM-DD
        const formattedTime = currentDate.toTimeString().split(' ')[0] // HH:MM:SS

        // Example Order ID - This can be retrieved dynamically if you have the data
        const orderId = selectedOrder?.id || `ORD-${Date.now()}`

        // Push the return data to Firebase
        push(returnRef, {
          userEmail: session?.user?.email,
          orderId, // Add order ID
          returnDate: formattedDate, // Add date
          returnTime: formattedTime, // Add time
          returnRequests,
          status: 'Requested',
        })
          .then(() => {
            alert('Return request submitted successfully.')
            setSelectedOrder(null)
            setSelectedProducts({})
            setReturnReasons({})
            setImages({})
          })
          .catch((error) => {
            console.error('Error submitting return:', error)
          })
          .finally(() => setUploading(false))
      })
      .catch((error) => {
        console.error('Error uploading images:', error)
        setUploading(false)
      })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const updatedTimers = { ...prevTimers }
        Object.keys(updatedTimers).forEach((id) => {
          if (updatedTimers[id] > 0) {
            updatedTimers[id] -= 1
          }
        })
        return updatedTimers
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (orders.length > 0) {
      const newTimers = {}
      orders.forEach((order) => {
        const orderTime = new Date(order.orderDate).getTime()
        const currentTime = Date.now()
        const remainingTime = Math.max(
          86400 - Math.floor((currentTime - orderTime) / 1000),
          0
        )
        newTimers[order.id] = remainingTime
      })
      setTimers(newTimers)
    }
  }, [orders])

  // const formatTime = (timestamp) => {
  //   const date = new Date(timestamp)
  //   return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   })}`
  // }
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // This enables AM/PM formatting
    })}`;
  };
  

  const formatTimer = (seconds) => {
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0')
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0')
    const secs = (seconds % 60).toString().padStart(2, '0')
    return `${hours}:${minutes}:${secs}`
  }

  if (loading) {
    return <p className={styles.loadingText}>Loading orders...</p>
  }

  return (
    <>
      <div className={styles.ordersContainer}>
        <div className={styles.title}>My Replace Request</div>
        {orders.length > 0 ? (
          <div className={styles.ordersList}>
            {orders.map((order, index) => (
              <div key={index} className={styles.orderCard}>
                <p className={styles.orderdate}>
                  Order Date: {formatTime(order.orderDate)}
                </p>
                <p className={styles.orderTimer}>
                  Replace Expire Time: {formatTimer(timers[order.id] || 0)}
                </p>{' '}
                <div className={styles.Action}>
                  <div>
                    <h4>Order Id</h4>
                    <p className={styles.orderid}>{order.id}</p>
                  </div>
                  <Link href={`/my_orders/order_details?orderId=${order.id}`}>
                    View Order Details
                  </Link>
                </div>
                <div className={styles.reviewbox}>
                  {order.cartItems.map((item, idx) => (
                    <div className={styles.orderproducts} key={idx}>
                      <p className={styles.productname}>
                        {item.productName} - {item.variety} - {item.weight}Kg
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  className={styles.ReturnBtn}
                  onClick={() => handleReturnClick(order)}
                >
                  Replace
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noOrders}>No orders available.</p>
        )}
      </div>

      {selectedOrder && (
        <div
          className={styles.returnPopupWrapper}
          onClick={(e) => {
            if (e.target.classList.contains(styles.returnPopupWrapper)) {
              setSelectedOrder(null) // Hide the popup when clicking outside
            }
          }}
        >
          <div className={styles.returnPopup}>
            <div className={styles.box}>
              {/* <h2>Replace Products from Order {selectedOrder.id}</h2> */}
              <div className={styles.noteBox}>
                <p>
                  Please review your entire order before submitting a return
                  request. You can only submit one return request for the whole
                  order. Ensure all products for return are selected before
                  proceeding.
                </p>
              </div>
              {selectedOrder.cartItems.map((item, idx) => (
                <div key={idx} className={styles.productSelection}>
                  <div className={styles.input}>
                    <input
                      type="checkbox"
                      id={`product-${idx}`}
                      checked={!!selectedProducts[item.productName]}
                      onChange={() => toggleProductSelection(item)}
                    />
                    <label htmlFor={`product-${idx}`}>
                      {item.productName} - {item.variety} - {item.weight}Kg
                    </label>
                  </div>
                  {selectedProducts[item.productName] && (
                    <div className={styles.returnDetails}>
                      <label>Reason for Replace</label>
                      <textarea
                        value={returnReasons[item.productName] || ''}
                        onChange={(e) =>
                          handleReasonChange(item.productName, e.target.value)
                        }
                      />
                      <label>Upload Images</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(item.productName, e.target.files)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}
              <button onClick={handleSendReturnData} disabled={uploading}>
                {uploading ? 'Submitting...' : 'Submit Replace Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Orders


