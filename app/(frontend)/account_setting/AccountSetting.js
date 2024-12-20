'use client'

import { useSession } from 'next-auth/react' // Import NextAuth.js session hook
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { realtimeDb, storage } from '@/app/(backend)/lib/firebase'
import { ref as dbRef, update, get, query, orderByChild, equalTo} from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL} from 'firebase/storage'
import styles from './Accountsetting.module.css'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import ButtonLoading from '../../loading/ButtonLoading'
import style from '../UserGloblePage.module.css'

import DashboardLayout from '../UserComponents/DashboardLayout'
import Image from 'next/image'

export default function AccountSetting() {
  const router = useRouter()
  const { data: session, status } = useSession() // Get the user session

  const [role, setRole] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [image, setImage] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return // Wait until the session status is resolved
    if (!session) {
      router.push('/login') // Redirect to login page
    }
  }, [session, status, router])




  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const fetchUserDetails = async () => {
        const emailQuery = query(
          dbRef(realtimeDb, 'users'),
          orderByChild('email'),
          equalTo(session.user.email)
        )
        const snapshot = await get(emailQuery)

        if (snapshot.exists()) {
          const userData = Object.entries(snapshot.val())[0] // Retrieve user data and ID
          const [userId, user] = userData
          setRole(user.role || '')
          setName(user.name || '')
          setEmail(user.email || '')
          setPhone(user.phone || '')
          setImage(user.profileImage || '') // Set the profile image URL if available
          setLoading(false)
        }
      }

      fetchUserDetails()
    }
  }, [status, session])

  const isPasswordStrong = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strongPasswordRegex.test(password)
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    if (password && password !== confirmPassword) {
      alert("Passwords don't match.")
      return
    }

    if (password && !isPasswordStrong(password)) {
      alert(
        'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.'
      )
      return
    }

    setLoading(true)

    try {
      const emailQuery = query(
        dbRef(realtimeDb, 'users'),
        orderByChild('email'),
        equalTo(email)
      )
      const snapshot = await get(emailQuery)

      if (snapshot.exists()) {
        const userId = Object.keys(snapshot.val())[0] // Get the existing user ID

        // Upload profile image if selected
        let imageUrl = snapshot.val()[userId].profileImage || ''
        if (image) {
          const storageRefPath = storageRef(
            storage,
            `users/${userId}/profile-image`
          )
          const uploadResult = await uploadBytes(storageRefPath, image)
          imageUrl = await getDownloadURL(uploadResult.ref)
        }

        // Prepare updated data
        const updatedData = {
          name,
          phone,
          profileImage: imageUrl,
        }

        // Add password and lastPasswordChange only if a new password is provided
        if (password) {
          updatedData.password = await bcrypt.hash(password, 10)
          updatedData.lastPasswordChange = Date.now()
        }

        // Update user data
        await update(dbRef(realtimeDb, `users/${userId}`), updatedData)

        alert('Profile updated successfully.')
        setLoading(false)
      } else {
        alert('User not found.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile: ' + error.message)
      setLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <DashboardLayout />
      <div className={style.main}>
        <div className={styles.authContainer}>
          <form onSubmit={handleProfileUpdate}>
            <h2>Edit Profile</h2>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Email</label>
            <input type="email" value={email} disabled required />
            <label>
              Password (optional) &quot;Leave blank to keep current password
              &quot;
            </label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (optional)"
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaRegEyeSlash size="20px" />
                ) : (
                  <FaRegEye size="20px" />
                )}
              </button>
            </div>
            <label>Confirm Password</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <label>Profile Image</label>
            {image && (
              <div className={styles.imagePreview}>
                <Image
                  width={100}
                  height={100}
                  src={
                    typeof image === 'string'
                      ? image
                      : URL.createObjectURL(image)
                  }
                  alt="Profile"
                  className={styles.profileImage}
                />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          <div>
            <p>{role}</p>
          </div>
            <button type="submit" disabled={loading}>
              {loading ? <ButtonLoading /> : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
