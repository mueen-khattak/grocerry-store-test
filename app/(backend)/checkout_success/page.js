"use client"

// components/SuccessPage.js
import Link from 'next/link'
import styles from './checkout_success.module.css'

const SuccessPage = () => {




  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Order Successful!</h1>
      <p className={styles.message}>
        Thank you for your purchase. Your order has been successfully placed!
      </p>
      <Link href={'/my_orders'} className={styles.homeButton}>
        see order details
      </Link>
      <Link href={'/'} className={styles.homeButton}>
        Back to more shopping
      </Link>
    </div>
  )
}

export default SuccessPage
