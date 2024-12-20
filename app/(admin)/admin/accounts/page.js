'use client' // Ensure client-side rendering

import { useEffect, useState } from 'react'
import { ref, get } from 'firebase/database'
import { getDownloadURL, ref as storageRef } from 'firebase/storage' // Import Firebase Storage functions
import { realtimeDb, storage } from '@/app/(backend)/lib/firebase' // Import Firebase storage and db
import Image from 'next/image'
import style from '../AdminPageGloble.module.css'
import styles from './staff.module.css'
import { CiEdit } from 'react-icons/ci'

const StaffPage = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])

  // Fetch users from Firebase Realtime Database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = ref(realtimeDb, 'users') // Assuming 'users' is the node containing user data
        const snapshot = await get(usersRef)
        const usersData = snapshot.val()

        if (usersData) {
          console.log(usersData) // Inspect the fetched user data
          // Convert usersData object to an array and fetch images
          const usersArray = await Promise.all(
            Object.entries(usersData).map(async ([key, user]) => {
              user.id = key // Set user.id to the Firebase key
              // If the user has a profile image in storage, fetch the image URL
              if (user.profileImage) {
                const imageRef = storageRef(storage, user.profileImage) // Reference to the stored image path
                const imageUrl = await getDownloadURL(imageRef)
                user.imageUrl = imageUrl // Assign the fetched URL to the user object
              }
              return user
            })
          )
          setUsers(usersArray)
          setFilteredUsers(usersArray.filter((user) => user.role !== 'user')) // Show all users except role 'user'
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  // Filter function
  const filterUsers = (role) => {
    if (role === 'all') {
      setFilteredUsers(users.filter((user) => user.role !== 'user')) // Show all except role 'user'
    } else {
      const filtered = users.filter(
        (user) =>
          user.role !== 'user' && user.role.toLowerCase() === role.toLowerCase()
      )
      setFilteredUsers(filtered)
    }
  }

  return (
    <div className={style.main}>
      <div className={styles.header}>
        <h3>Accounts</h3>
        <button onClick={() => filterUsers('RequestSellerAccount')}>Request&apos;s For Seller Account</button>
        <button onClick={() => filterUsers('all')}>Show all accounts</button>
        <button onClick={() => filterUsers('Customer')}>Customer&apos;s</button>
        <button onClick={() => filterUsers('Seller')}>Seller&apos;s</button>
      </div>
      <div className={styles.title}>
        <h4 className={styles.SN}>SN</h4>
        <h4 className={styles.Image}>Image</h4>
        <h4 className={styles.Name}>Name</h4>
        <h4 className={styles.Email}>Email</h4>
        <h4 className={styles.Phone}>Phone</h4>
        <h4 className={styles.Role}>Role</h4>
      </div>

      <div className={styles.dataContainer}>
        {filteredUsers.map((user, index) => (
          <div className={styles.data} key={index}>
            <p className={styles.SN}>{index + 1}</p>
            <div className={styles.Image}>
              <Image
                src={user.imageUrl || '/default.jpg'} // Fallback to default image if none is provided
                alt={user.name || 'User'}
                width={70}
                height={40}
              />
            </div>
            <p className={styles.Name}>{user.name}</p>
            <p className={styles.Email}>{user.email}</p>
            <p className={styles.Phone}>{user.phone}</p>
            <p className={styles.Role}>{user.role}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StaffPage
