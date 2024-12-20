'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ref, get, update } from 'firebase/database' // Add update import
import { realtimeDb } from '@/app/(backend)/lib/firebase'
import Image from 'next/image'
import styles from './order_detail.module.css'
import style from '../../AdminPageGloble.module.css'

function OrderDetailPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    const fetchOrderData = async () => {
      if (orderId) {
        const orderRef = ref(realtimeDb, `orders/${orderId}`)
        const snapshot = await get(orderRef)
        if (snapshot.exists()) {
          setOrderData(snapshot.val())
        } else {
          console.error('Order not found')
        }
      }
    }

    fetchOrderData()
  }, [orderId])

  if (!orderData) return <p>Loading order details...</p>

  const statusSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered']
  const currentStepIndex = statusSteps.indexOf(orderData.status)

  // Handle status change
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    const orderRef = ref(realtimeDb, `orders/${orderId}`)

    try {
      await update(orderRef, { status: newStatus })
      setOrderData((prevData) => ({ ...prevData, status: newStatus }))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <div className={style.main}>
      <p className={styles.title}>Order Details</p>

      {/* Order Status Tracking Box */}
      <div className={styles.trackingContainer}>
        {statusSteps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className={`${styles.trackingStep} ${
                index <= currentStepIndex ? styles.activeStep : ''
              }`}
            >
              {step}
            </div>
            {index < statusSteps.length - 1 && (
              <div
                className={`${styles.stepConnector} ${
                  index < currentStepIndex ? styles.activeConnector : ''
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Order Info */}
      <div className={styles.container}>
        <div className={styles.orderInfo}>
          <div>
            <p>
              <strong>Order ID:</strong> {orderId}
            </p>
            <p>
              <strong>Order Date:</strong>{' '}
              {new Date(orderData.orderDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className={styles.total}>
              Total Amount: {orderData.totalAmount} Rs
            </p>
            <p>
              <strong>Status:</strong> {orderData.status}
            </p>
            {/* Order Status Dropdown */}
            <div className={styles.statusDropdown}>
              <label htmlFor="status">Update Status:</label>
              <select
                id="status"
                value={orderData.status}
                onChange={handleStatusChange}
              >
                {statusSteps.map((step) => (
                  <option key={step} value={step}>
                    {step}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.details}>
          {/* Customer Details */}
          <div className={styles.customerInfo}>
            <h6 className={styles.sectionTitle}>Customer Details</h6>
            <p>Name: {orderData.user.name}</p>
            <p>Email: {orderData.user.email}</p>
            <p>Phone: {orderData.user.phone}</p>
          </div>

          {/* Delivery Address */}
          <div className={styles.address}>
            <h6 className={styles.sectionTitle}>Delivery Address</h6>
            <p>House No. {orderData.deliveryAddress.houseNo},</p>
            <p>Street: {orderData.deliveryAddress.street},</p>
            <p>Sector: {orderData.deliveryAddress.sector},</p>
            <p>City: {orderData.deliveryAddress.city},</p>
            <p>Phone: {orderData.deliveryAddress.phone}</p>
          </div>
        </div>

        {/* Cart Items */}
        <div className={styles.cartItems}>
          <h6 className={styles.sectionTitle}>Cart Items</h6>
          {orderData.cartItems.map((item, index) => (
            <div key={index} className={styles.cartItem}>
              <Image
                src={item.frontImageUrl}
                alt={item.productName}
                width={100}
                height={100}
                className={styles.productImage}
              />
              <div className={styles.itemDetails}>
                <div className={styles.itemDetailstop}>
                  <div>
                    <p>{item.productName}</p>
                    <h4 className={styles.variety}>
                      <strong>Variety:</strong> {item.nameVariety}
                    </h4>
                  </div>
                  <p>Total: {(item.price * item.weight).toFixed(2)} Rs</p>
                </div>
                <p>
                  <strong>Weight:</strong> {item.weight} kg,
                  <strong>Price:</strong> {item.price} Rs per kg,
                  <strong>Brand:</strong> {item.brand},
                  <strong>Category:</strong> {item.category},
                  <strong>Variety:</strong> {item.nameVariety}
                </p>
                <div className={styles.moreImages}>
                  {item.moreImagesUrls?.map((url, idx) => (
                    <Image
                      key={idx}
                      src={url}
                      alt={`More image ${idx + 1}`}
                      width={60}
                      height={60}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
