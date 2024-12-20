'use client'
import Image from 'next/image'
import style from '../AdminPageGloble.module.css'
import styles from './customers.module.css'
import { useEffect, useState } from 'react'
import { ref, get } from 'firebase/database'
import { realtimeDb } from '@/app/(backend)/lib/firebase' // Import Firebase Realtime Database
import { CiEdit } from 'react-icons/ci'

const Customerpage = () => {
  const [customers, setCustomers] = useState([])
  const [orderCustomers, setOrderCustomers] = useState([])
  const [showOrders, setShowOrders] = useState(false)

  useEffect(() => {
    const fetchCustomers = async () => {
      const customersRef = ref(realtimeDb, 'users')
      const snapshot = await get(customersRef)

      if (snapshot.exists()) {
        const data = snapshot.val()
        const filteredCustomers = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
            profileImage: data[key].profileImage || '/default-profile.jpg',
          }))
          .filter((customer) => customer.role !== 'hide')
        setCustomers(filteredCustomers)
      } else {
        console.log('No user data available')
      }
    }
    fetchCustomers()
  }, [])

  const fetchOrderCustomers = async () => {
    const ordersRef = ref(realtimeDb, 'orders')
    const snapshot = await get(ordersRef)

    if (snapshot.exists()) {
      const ordersData = snapshot.val()
      const uniqueUserIds = new Set()

      Object.values(ordersData).forEach((order) => {
        if (order.user && order.user.id) {
          uniqueUserIds.add(order.user.id)
        }
      })

      const uniqueCustomers = customers.filter((customer) =>
        uniqueUserIds.has(customer.id)
      )
      setOrderCustomers(uniqueCustomers)
      setShowOrders(true)
    } else {
      console.log('No orders available')
    }
  }

  return (
    <div className={style.main}>
      <div className={styles.header}>
        <h3>Users</h3>
        <button
          onClick={() => {
            setShowOrders(false)
            setOrderCustomers([])
          }}
        >
          All Users
        </button>
        <button onClick={fetchOrderCustomers}>Customers</button>
      </div>
      <div className={styles.title}>
        <h4 className={styles.SN}>SN</h4>
        <h4 className={styles.photo}>Photo</h4>
        <h4 className={styles.name}>Name</h4>
        <h4 className={styles.email}>Email</h4>
        <h4 className={styles.phone}>Phone</h4>
        <h4 className={styles.Action}>Action</h4>
      </div>

      <div className={styles.dataContainer}>
        {(showOrders ? orderCustomers : customers).map((customer, index) => (
          <div className={styles.data} key={customer.id}>
            <p className={styles.SN}>{index + 1}</p>
            <div className={styles.photo}>
              <Image
                src={customer.profileImage}
                alt={customer.name || 'Profile Image'}
                width={100}
                height={60}
                placeholder="blur"
                blurDataURL="/default-profile.jpg"
              />
            </div>
            <p className={styles.name}>{customer.name}</p>
            <p className={styles.email}>{customer.email}</p>
            <p className={styles.phone}>{customer.phone}</p>
            <p className={styles.Action}>
              <a
                href={`/admin/customers/customer_orders_details?userId=${customer.id}`}
              >
                <CiEdit /> Orders Details
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Customerpage
