'use client'

import { useEffect, useState } from 'react'
import { ref, onValue } from 'firebase/database'
import { realtimeDb } from '@/app/(backend)/lib/firebase'
import ReturnData from './ReturnData'
import Orders from './My_Orders'
import ReplacedCompleted from './ReplacedCompleted' // New component
import style from '../UserGloblePage.module.css'
import styles from './return.module.css'
import DashboardLayout from '../UserComponents/DashboardLayout'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'


const Returns = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Wait until the session status is resolved
    if (!session) {
      router.push('/login') // Redirect to login page
    }
  }, [session, status, router])


  const [activeComponent, setActiveComponent] = useState('orders') // State to manage active component
  const [sharedOrderIds, setSharedOrderIds] = useState([]) // Shared state for order IDs

  useEffect(() => {
    const fetchReturnOrders = () => {
      const returnRef = ref(realtimeDb, 'returns')
      onValue(returnRef, (snapshot) => {
        if (snapshot.exists()) {
          const returnData = snapshot.val()
          const orderIds = Object.values(returnData).map(
            (entry) => entry.orderId
          )
          setSharedOrderIds(orderIds) // Pass the order IDs to the parent component
        } else {
          setSharedOrderIds([]) // Pass an empty array if no data exists
        }
      })
    }

    fetchReturnOrders()
  }, [])

  return (
    <>
      <DashboardLayout />
      <div className={style.main}>
        <div className={styles.container}>
          <div className={styles.buttonContainer}>
            <button
              onClick={() => setActiveComponent('orders')}
              className={`${styles.button} ${
                activeComponent === 'orders' ? styles.active : ''
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveComponent('requests')}
              className={`${styles.button} ${
                activeComponent === 'requests' ? styles.active : ''
              }`}
            >
              Request&apos;s
            </button>
            <button
              onClick={() => setActiveComponent('replaced')}
              className={`${styles.button} ${
                activeComponent === 'replaced' ? styles.active : ''
              }`}
            >
              Replaced Completed
            </button>
          </div>

          {/* Conditionally render the components based on the state */}
          {activeComponent === 'orders' && (
            <Orders sharedOrderIds={sharedOrderIds} />
          )}
          {activeComponent === 'requests' && <ReturnData />}
          {activeComponent === 'replaced' && <ReplacedCompleted />}
        </div>
      </div>
    </>
  )
}

export default Returns
