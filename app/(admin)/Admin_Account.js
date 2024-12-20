import { signOut, useSession } from 'next-auth/react' // Import useSession from NextAuth
import Link from 'next/link'
import Image from 'next/image'
import { FaUser } from 'react-icons/fa' // Importing icons
import { useState, useRef, useEffect } from 'react' // Import useState, useRef, and useEffect
import { ref, get } from 'firebase/database' // Import Firebase Realtime Database functions
import { realtimeDb } from '@/app/(backend)/lib/firebase' // Import your Firebase Realtime Database config
import styles from './Admin_Account.module.css'

const Admin_Account = () => {
  const { data: session, status } = useSession() // Set to 1 minute or more // Get the session data and authentication status
  const [isVisible, setIsVisible] = useState(false) // State to control visibility
  const [userData, setUserData] = useState(null) // State to hold user data from Firebase
  const boxRef = useRef(null) // Create a ref for the box

  const handleSignOut = async () => {
    await signOut()
  }

  const handleImageClick = () => {
    setIsVisible(!isVisible) // Toggle visibility on click
  }

  const handleClickOutside = (event) => {
    // Check if the clicked element is outside the box
    if (boxRef.current && !boxRef.current.contains(event.target)) {
      setIsVisible(false) // Hide the box if the click is outside
    }
  }

  useEffect(() => {
    // Add click event listener to document
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, []) // Empty dependency array ensures this runs once

  // Fetch user data from Firebase Realtime Database by email
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        // Check if session has user email
        try {
          const usersRef = ref(realtimeDb, 'users') // Reference to all users
          const snapshot = await get(usersRef)

          if (snapshot.exists()) {
            const usersData = snapshot.val()
            // Find the user by email
            const foundUser = Object.values(usersData).find(
              (user) => user.email === session.user.email
            )
            if (foundUser) {
              setUserData(foundUser) // Set the user data if found
            } else {
              console.error('User not found with this email.')
            }
          } else {
            console.error('No data available in the users node.')
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }

    if (status === 'authenticated') {
      fetchUserData() // Fetch data only if user is authenticated
    }
  }, [session, status])

  return (
    <>
      <div className={styles.container} onClick={handleImageClick}>
        <Image
          src={userData?.profileImage || '/pillow.jpg'} // Use user's profile image from Firebase or default
          width={100}
          height={100}
          className={styles.img}
          alt="User profile"
        />
        {isVisible && (
          <div
            className={styles.box}
            ref={boxRef}
            onClick={(e) => e.stopPropagation()}
          >
            {' '}
            {/* Prevent click inside from closing the box */}
            <h2>{userData?.role || session.user.role}</h2>
            <div>
              <Image
                src={userData?.profileImage || '/pillow.jpg'} // Use the same profile image URL for the larger display
                width={300}
                height={100}
                className={styles.img2}
                alt="User profile"
              />
            </div>
            <h1>{userData?.name || session.user.name}</h1>
            <p>{session.user.email}</p>
            <div className={styles.btns}>
              {/* Conditionally render the Admin Panel link based on user role */}
              {userData?.role === 'admin' && (
                <Link href="/admin/dashboard">Admin Panel</Link>
              )}
              <Link href="/my_orders">Dashboard</Link>
              <Link href="#">Account Settings</Link>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Admin_Account
