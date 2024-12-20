'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ref, get, update } from 'firebase/database'
import { realtimeDb } from '@/app/(backend)/lib/firebase'
import Image from 'next/image'
import styles from './order_detail.module.css'
import style from '../../../UserGloblePage.module.css'
import DashboardLayout from '@/app/(frontend)/UserComponents/DashboardLayout'

function OrderDetail() {
  const params = useParams()
  const orderId = params.OrderId

  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderData = async () => {
      if (orderId) {
        try {
          setLoading(true)
          const orderRef = ref(realtimeDb, `orders/${orderId}`)
          const snapshot = await get(orderRef)
          if (snapshot.exists()) {
            setOrderData(snapshot.val())
          } else {
            console.error('Order not found')
          }
        } catch (error) {
          console.error('Error fetching order data:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchOrderData()
  }, [orderId])

  const statusSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  const currentStepIndex = statusSteps.indexOf(orderData?.status)

  const cancelOrder = async (id) => {
    try {
      // Reference the specific order in the Realtime Database
      const orderRef = ref(realtimeDb, `orders/${id}`);
      
      // Update the status to 'Cancelled'
      await update(orderRef, { status: 'Cancelled' });
      
      console.log(`Order ${id} has been cancelled successfully.`);
    } catch (error) {
      console.error(`Error cancelling order ${id}:`, error);
    }
  };


  return (
    <>
      <DashboardLayout />
      <div className={style.main}>
        {loading ? (
          // Show a spinner or loading message only for the order details fragment
          <div className={styles.loadingContainer}>
            <p>Loading order details...</p>
          </div>
        ) : (
          <>
            <p className={styles.title}>Order Details</p>

            {/* Order Status Tracking Box */}
            <div className={styles.trackingContainer}>
  {orderData.status === 'Cancelled' ? (
    <div className={`${styles.trackingStep} ${styles.cancelledStep}`}>
      Cancelled
    </div>
  ) : (
    statusSteps.map((step, index) => (
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
    ))
  )}
</div>


            {/* Order Info */}
            <div className={styles.container}>
              {/* Order Information */}
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
                  <div className={styles.Action}>
                    <button
                      className={styles.cancelbutton}
                      onClick={() => cancelOrder(orderId)}
                      disabled={orderData.status === 'Cancel Order'}
                    >
                      {orderData.status === 'Cancelled' ? 'Cancelled' : 'Cancel Order'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <p className={styles.sectionTitle}>Customer Details</p>
              <div className={styles.customerInfo}>
                <p>{orderData.user.name}</p>
                <p>{orderData.user.email}</p>
                <p>{orderData.user.phone}</p>
              </div>

              {/* Delivery Address */}
              <p className={styles.sectionTitle}>Delivery Address</p>
              <div className={styles.address}>
                <p>
                  House No. {orderData.deliveryAddress.houseNo}, Street:{' '}
                  {orderData.deliveryAddress.street}, Sector:{' '}
                  {orderData.deliveryAddress.sector}, City:{' '}
                  {orderData.deliveryAddress.city},
                </p>
                <p> Phone: {orderData.deliveryAddress.phone}</p>
              </div>

              {/* Cart Items */}
              <div className={styles.cartItems}>
                <p className={styles.sectionTitle}>Cart Items</p>
                {orderData.cartItems.map((item, index) => (
                  <div key={index} className={styles.cartItem}>
                    <div className={styles.imagebox}>
                      <Image
                        src={item.frontImageUrl}
                        alt={item.productName}
                        width={900}
                        height={900}
                        className={styles.productImage}
                      />
                    </div>
                    <div className={styles.itemDetails}>
                      <p>{item.category}</p>
                      <div className={styles.itemDetailbox}>
                        <h3>
                          {item.productName} - {item.nameVariety} - {item.weight}kg{' '}
                        </h3>
                        <div className={styles.pricebox}>
                          <h3>Total: {item.price * item.weight} Rs</h3>
                          <p>( Rs.{item.price} per kg )</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default OrderDetail
