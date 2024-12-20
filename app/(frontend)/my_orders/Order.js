'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database'
import { realtimeDb } from '@/app/(backend)/lib/firebase'
import style from '../UserGloblePage.module.css'
import styles from './order.module.css'
import Link from 'next/link'
import React from 'react'
import DashboardLayout from '../UserComponents/DashboardLayout'


const Order = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
    const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([]) // State for filtered orders
  const [activeFilter, setActiveFilter] = useState('All Orders') // Track the active filter

  useEffect(() => {
    if (status === 'loading') return // Wait until the session status is resolved
    if (!session) {
      router.push('/login') // Redirect to login page
    }
  }, [session, status, router])


  useEffect(() => {
    if (!session?.user?.email) return // If no user email, don't fetch orders

    const ordersRef = ref(realtimeDb, 'orders')

    // Query to filter orders based on the user's email
    const ordersQuery = query(
      ordersRef,
      orderByChild('user/email'), // Use 'user/email' to filter by email
      equalTo(session.user.email) // Filter orders by the logged-in user's email
    )

    // Set up real-time listener
    const unsubscribe = onValue(
      ordersQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const ordersData = snapshot.val()
          const ordersList = Object.entries(ordersData).map(([key, value]) => ({
            id: key,
            ...value,
          }))
          setOrders(ordersList)
          setFilteredOrders(ordersList) // Initially show all orders
        } else {
          console.log('No orders found for this user.')
          setOrders([]) // Clear orders if no data found
          setFilteredOrders([]) // Clear filtered orders
        }
      },
      (error) => {
        console.error('Error fetching orders:', error)
      }
    )

    // Clean up listener on unmount
    return () => unsubscribe()
  }, [session]) // Dependency on session, so it refetches when the user changes

  // Filter orders based on the selected status
  const filterOrders = (status) => {
    setActiveFilter(status) // Set the active filter
    if (status === 'All Orders') {
      setFilteredOrders(orders)
    } else {
      const filtered = orders.filter((order) => order.status === status)
      setFilteredOrders(filtered)
    }
  }

  

  const statusSteps = ['Order Placed', 'On The Way', 'Delivered', 'Cancelled']

  return (
    <>
      <DashboardLayout />

      <div className={style.main}>
        <div className={styles.header}>
          <h3>Orders</h3>
          <div className={styles.filterbuttons}>
            <button
              className={activeFilter === 'All Orders' ? styles.active : ''}
              onClick={() => filterOrders('All Orders')}
            >
              All Orders
            </button>
            <button
              className={activeFilter === 'Order Placed' ? styles.active : ''}
              onClick={() => filterOrders('Order Placed')}
            >
              Order Placed
            </button>
            <button
              className={activeFilter === 'On The Way' ? styles.active : ''}
              onClick={() => filterOrders('On The Way')}
            >
              On The Way
            </button>
         
            <button
              className={activeFilter === 'Delivered' ? styles.active : ''}
              onClick={() => filterOrders('Delivered')}
            >
              Delivered
            </button>
            <button
              className={`${
                activeFilter === 'Cancelled' ? styles.active2 : ''
              } ${styles.canceledorders}`}
              onClick={() => filterOrders('Cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        <div className={styles.dataContainer}>
          {/* Show tracking steps if the active filter is not "All Orders" */}
          {activeFilter !== 'All Orders' && (
            <div className={styles.trackingContainer}>
              {/* If 'Cancelled' filter is active, show just "Cancelled" */}
              {activeFilter === 'Cancelled' ? (
                <div className={styles.canceledorderstag}>Cancelled Orders</div>
              ) : (
                statusSteps.map((step, stepIndex) => {
                  const currentStepIndex = statusSteps.indexOf(
                    filteredOrders[0]?.status
                  )
                  return (
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
                  )
                })
              )}
            </div>
          )}
          {/* Display a note when no orders match the filter */}
          {filteredOrders.length === 0 && (
            <div className={styles.no_orders}>
              No orders found for {activeFilter}.
            </div>
          )}

          {/* Render individual orders */}
          {filteredOrders.map((order, index) => {
            const currentStepIndex = statusSteps.indexOf(order.status)

            return (
              <div key={order.id} className={styles.databox}>
              <div className={styles.trackingContainer}>
  {/* Display steps for each order if 'All Orders' filter */}
  {activeFilter === 'All Orders' &&
    (order.status === 'Cancelled' ? ( // Use `order` instead of `orders` and correct the syntax
      <div className={`${styles.trackingStep} ${styles.canceledorderstag}`}>
        Cancelled
      </div>
    ) : (
      statusSteps.map((step, stepIndex) => {
        const currentStepIndex = statusSteps.indexOf(order.status); // Use order.status for the current order
        return (
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
                  stepIndex < currentStepIndex ? styles.activeConnector : ''
                }`}
              />
            )}
          </React.Fragment>
        );
      })
    ))}
</div>

                <div className={styles.data}>
                  <div className={styles.SN}>
                    <h4>SN</h4>
                    <p>{index + 1}</p>
                  </div>
                  <div className={styles.Customer}>
                    <h4>Address</h4>
                    <p>
                      house no. {order.deliveryAddress.houseNo}, street no.
                      {order.deliveryAddress.street}, sector{' '}
                      {order.deliveryAddress.sector},{' '}
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
                    <Link legacyBehavior  href={`/my_orders/order_details/${order.id}`}>
                     <a>
                       View Details
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Order
