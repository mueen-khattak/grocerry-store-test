'use client' // Ensure client-side rendering

import { useEffect, useState } from 'react'
import { ref, onValue, off } from 'firebase/database' // Import onValue and off from Firebase
import { realtimeDb } from '@/app/(backend)/lib/firebase' // Import Firebase db
import { useSearchParams } from 'next/navigation' // Import useSearchParams
import style from '../../AdminPageGloble.module.css'
import styles from './order.module.css'
import React from 'react'

const OrderPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams() // Initialize useSearchParams to access search parameters
  const userId = searchParams.get('userId') // Get userId from query params

  useEffect(() => {
    if (!userId) {
      console.log('No userId found in search params.')
      setLoading(false) // Set loading to false if no userId
      return
    }

    const ordersRef = ref(realtimeDb, 'orders') // Path to orders in Firebase

    const handleDataChange = (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        const ordersList = []

        console.log('Fetched orders data:', data) // Log the data

        // Filter orders by userId
        for (const orderKey in data) {
          const order = data[orderKey]
          if (order.user.id === userId) {
            // Check if the order belongs to the user
            ordersList.push({
              id: orderKey,
              ...order,
            })
          }
        }

        console.log('Filtered orders for userId:', userId, ordersList) // Log the filtered orders
        setOrders(ordersList)
      } else {
        console.log('No orders found in the database.')
        setOrders([]) // Set orders to empty if no data found
      }
      setLoading(false) // End loading state
    }

    console.log('Fetching orders for userId:', userId) // Log the userId
    onValue(ordersRef, handleDataChange) // Set up listener for real-time updates

    // Cleanup function to remove listener when component unmounts or userId changes
    return () => off(ordersRef, 'value', handleDataChange)
  }, [userId])

  if (loading) {
    return <div>Loading orders...</div>
  }

  const statusSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered']

  return (
    <div className={style.main}>
      <div className={styles.header}>
        <h3>Orders</h3>
      </div>
      <div className={styles.dataContainer}>
        {orders.length > 0 ? (
          orders.map((order, index) => {
            const currentStepIndex = statusSteps.indexOf(order.status) // Calculate the step index for each order

            return (
              <div key={order.id} className={styles.databox}>
                {/* Order Status Tracking Box */}
                <div className={styles.trackingContainer}>
                  {statusSteps.map((step, stepIndex) => (
                    <React.Fragment key={stepIndex}>
                      <div
                        className={`${styles.trackingStep} ${
                          stepIndex <= currentStepIndex ? styles.activeStep : ''
                        }`}
                      >
                        {step}
                      </div>
                      {stepIndex < statusSteps.length - 1 && (
                        <div
                          className={`${styles.stepConnector} ${
                            stepIndex < currentStepIndex
                              ? styles.activeConnector
                              : ''
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div className={styles.data}>
                  <div className={styles.SN}>
                    <h4>SN</h4>
                    <p>{index + 1}</p>
                  </div>
                  <div className={styles.Customer}>
                    <h4>Customer Details</h4>
                    <p>Name: {order.user.name}</p>
                    <p>Email: {order.user.email}</p>
                    <p>Phone: {order.user.phone}</p>
                  </div>
                  <div className={styles.Customer}>
                    <h4>Delivery Address</h4>
                    <p>
                      House No: {order.deliveryAddress.houseNo}, Street No:{' '}
                      {order.deliveryAddress.street}, Sector:{' '}
                      {order.deliveryAddress.sector}, City:{' '}
                      {order.deliveryAddress.city}
                    </p>
                  </div>
                  <div className={styles.Total_Price}>
                    <h4>Total Price</h4>
                    <p>{order.totalAmount} Rs</p>
                  </div>
                  <div className={styles.Payment_Mode}>
                    <h4>Payment Mode</h4>
                    <p>{order.paymentMode || 'N/A'}</p>
                  </div>
                  <div className={styles.Status}>
                    <h4>Status</h4>
                    <p>{order.status || 'Pending'}</p>
                  </div>
                  <div className={styles.Action}>
                    <a
                      href={`/admin/order/order_details?orderId=${order.id}`}
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div>No orders found for the provided User ID.</div>
        )}
      </div>
    </div>
  )
}

export default OrderPage
