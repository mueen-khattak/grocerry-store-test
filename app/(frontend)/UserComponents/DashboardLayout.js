'use client'

import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LuLayoutDashboard } from 'react-icons/lu'
import { MdProductionQuantityLimits } from 'react-icons/md'
import { IoCartOutline } from 'react-icons/io5'
import { GoCodeReview } from 'react-icons/go'
import styles from './ComponentsStyles/dashboardlayout.module.css'
import { useCart } from '@/app/(frontend)/context/CartContext'
import { useWishlist } from '@/app/(frontend)/context/WishlistContext'
import Link from 'next/link'
import { realtimeDb } from '@/app/(backend)/lib/firebase'
import { ref as dbRef, get, update, query, orderByChild, equalTo } from 'firebase/database'

export default function DashboardLayout() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { totalItems } = useCart()
  const { wishlistCount } = useWishlist()

  const isActive = (href) => pathname === href

  const handleRequestSellerAccount = async () => {
    try {
      if (!session?.user?.email) {
        alert('Please log in to request a seller account.')
        return
      }

      const email = session.user.email
      const userQuery = query(
        dbRef(realtimeDb, 'users'),
        orderByChild('email'),
        equalTo(email)
      )

      const userSnapshot = await get(userQuery)

      if (userSnapshot.exists()) {
        const userKey = Object.keys(userSnapshot.val())[0]
        const userRef = dbRef(realtimeDb, `users/${userKey}`)

        // Update the user record with seller request details
        await update(userRef, {
          forSellerAccountRequest: {
            requestedAt: new Date().toISOString(),
            status:'Pending',
          },
        })

        alert('Seller account request sent successfully.')
      } else {
        alert('User not found in the database.')
      }
    } catch (error) {
      console.error('Error requesting seller account:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <div className={styles.sidebar}>
        <div></div>
        <div className={styles.navList}>
        <button onClick={handleRequestSellerAccount}>
            Request For Seller Account
          </button>          <Link legacyBehavior prefetch={true} href="/my_cart">
            <a className={isActive('/my_cart') ? styles.activeLink : ''}>
              <span>
                <LuLayoutDashboard size={17} />
              </span>
              My Cart ({totalItems})
            </a>
          </Link>
          <Link legacyBehavior prefetch={true} href="/my_wishlist">
            <a className={isActive('/my_wishlist') ? styles.activeLink : ''}>
              <span>
                <LuLayoutDashboard size={17} />
              </span>
              My Wishlist ({wishlistCount})
            </a>
          </Link>
          <Link legacyBehavior href="/my_orders">
            <a className={isActive('/my_orders') ? styles.activeLink : ''}>
              <span>
                <LuLayoutDashboard size={17} />
              </span>
              My Orders
            </a>
          </Link>
          <Link legacyBehavior prefetch={true} href="/my_reviews">
            <a className={isActive('/my_reviews') ? styles.activeLink : ''}>
              <span>
                <MdProductionQuantityLimits size={17} />
              </span>
              My Reviews
            </a>
          </Link>
          <Link legacyBehavior prefetch={true} href="/my_returns_&_cancellations">
            <a
              className={
                isActive('/my_returns_&_cancellations') ? styles.activeLink : ''
              }
            >
              <span>
                <IoCartOutline size={17} />
              </span>
              <p>My Returns & Cancellations</p>
            </a>
          </Link>
          <Link legacyBehavior prefetch={true} href="/account_setting">
            <a
              className={isActive('/account_setting') ? styles.activeLink : ''}
            >
              <span>
                <GoCodeReview size={17} />
              </span>
              Account Settings
            </a>
          </Link>
        </div>
        <div></div>
      </div>
    </>
  )
}
