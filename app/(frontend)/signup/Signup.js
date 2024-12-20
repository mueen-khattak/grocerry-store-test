'use client'

import { useState } from 'react'
import bcrypt from 'bcryptjs'
import { realtimeDb, storage } from '@/app/(backend)/lib/firebase'
import { ref as dbRef, set, get, query, orderByChild, equalTo} from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL} from 'firebase/storage'
import styles from './signup.module.css'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import CryptoJS from 'crypto-js'
import ButtonLoading from '../../loading/ButtonLoading'
import Link from 'next/link'

export default function Signup() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [image, setImage] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isConfirmationSent, setIsConfirmationSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const isPasswordStrong = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return strongPasswordRegex.test(password)
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords don't match.")
      return
    }

    if (!isPasswordStrong(password)) {
      alert(
        'Password must be at least 8 characters long and include uppercase, lowercase, a number, and special character.'
      )
      return
    }

    setLoading(true)

    try {
      // Check if email already exists in the database
      const emailQuery = query(
        dbRef(realtimeDb, 'users'),
        orderByChild('email'),
        equalTo(email)
      )
      const emailSnapshot = await get(emailQuery)

      if (emailSnapshot.exists()) {
        const existingUser = Object.values(emailSnapshot.val())[0]

        if (existingUser.isConfirmed) {
          alert('This email is already registered. Please try another email.')
          setLoading(false)
          return // Exit the function
        }
      }

      // Proceed with signup if email does not exist or is not confirmed
      const userId = new Date().getTime()
      let imageUrl = ''

      if (image) {
        const storageRefPath = storageRef(
          storage,
          `users/${userId}/profile-image`
        )
        const uploadResult = await uploadBytes(storageRefPath, image)
        imageUrl = await getDownloadURL(uploadResult.ref)
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const userData = {
        name,
        email,
        password: hashedPassword,
        phone,
        profileImage: imageUrl,
        createdAt: new Date().toISOString(),
        isConfirmed: false,
        lastPasswordChange: new Date().toISOString(),
        role:'Customer'
      }

      await set(dbRef(realtimeDb, 'users/' + userId), userData)

      // Encrypt user data with crypto-js to generate a token
      const tokenData = {
        userId,
        email,
        password,
        expiry: Date.now() + 5 * 60 * 1000,
      }
      const token = CryptoJS.AES.encrypt(
        JSON.stringify(tokenData),
        'your-secret-key'
      ).toString()
      console.log('Token data for encryption:', tokenData)
      console.log('Encrypted token:', token)

      // Send confirmation email with encrypted token link
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          subject: 'Confirm Your Email',
          message:
            'Please confirm your email by clicking on the link provided.',
          link: `${
            window.location.origin
          }/confirm_email?token=${encodeURIComponent(token)}`, // Encode the token
        }),
      })
        .then(() => {
          setIsConfirmationSent(true)
          setLoading(false)
        })
        .catch((emailError) => {
          console.error('Error sending confirmation email:', emailError)
          alert('Failed to send confirmation email. Please try again.')
          setLoading(false)
        })
    } catch (error) {
      console.error('Error signing up:', error)
      alert('Error signing up: ' + error.message)
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
      <div className={styles.authContainer}>
        {isConfirmationSent ? (
          <div>
            <h2>Confirmation Sent</h2>
            <p>
              Please check your email and click on the confirmation link to
              activate your account. Please note, the link will expire in 5
              minutes, so be sure to click it before then. Do not share this
              link with others.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignup}>
            <h2>Signup</h2>
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 8 characters with uppercase, lowercase, number, and special character"
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
                required
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
            <label>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="0123-4567890"
            />
            <label>Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button type="submit" disabled={loading}>
              {loading ? <ButtonLoading /> : 'Signup'}
            </button>
            <div className={styles.signUpLink}>
        <p>Already have an account? <Link legacyBehavior prefetch={true} href="/login"><a>Login</a></Link></p>
      </div>
          </form>
        )}
      </div>
    </>
  )
}
