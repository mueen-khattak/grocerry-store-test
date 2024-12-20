'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './cart.module.css'
import style from '../UserGloblePage.module.css'
import Link from 'next/link'
import { TbXboxXFilled } from 'react-icons/tb'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import DashboardLayout from '../UserComponents/DashboardLayout'

const Cart = () => {
  const {
    cartItems,
    totalItems,
    totalPrice,
    incrementWeight,
    decrementWeight,
    removeFromCart,
  } = useCart()

  const handleCheckout = () => {
    if (totalItems > 0) {
      alert('Proceeding to Checkout')
    } else {
      alert('Your cart is empty. Please add items to proceed.')
    }
  }

  return (
    <>
      <DashboardLayout />
      <div className={style.main}>
        <div className={styles.title}>
          <h2>My Shopping Cart ({totalItems})</h2>
        </div>
        <div className={styles.shoppingCart}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.imagebox}>
                  <Image
                    src={item.frontImageUrl}
                    alt={item.productName}
                    width={1000}
                    height={1000}
                    className={styles.productImage}
                    priority
                  />
                </div>
                <div className={styles.itemDetails}>
                  <div className={styles.removebtnbox}>
                    <button
                      className={styles.removebtn}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <TbXboxXFilled color="red" size={'27px'} />
                    </button>
                  </div>
                  <div className={styles.namebox}>
                    <Link href={`/product_details?id=${item.id}`}>
                      <h4>{item.productName}</h4>
                      <p>{item.nameVariety}</p>
                    </Link>
                    <div className={styles.weightbox}>
                      <div className={styles.weightboxbtn}>
                        <button
                          className={styles.weightButton}
                          onClick={() => decrementWeight(item.id)}
                        >
                          <FaMinusCircle size="23px" />
                        </button>
                        <span>{item.weight} Kg</span>
                        <button
                          className={styles.weightButton2}
                          onClick={() => incrementWeight(item.id)}
                        >
                          <FaPlusCircle size="23px" />
                        </button>
                      </div>
                      <div className={styles.totalpricebox}>
                        <p>
                          {(parseFloat(item.price) * item.weight).toFixed(2)} Rs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.checkout}>
            <h2>Order Summary</h2>
            <p>Total Items: {totalItems}</p>
            <p>Total Price: {totalPrice.toFixed(2)} Rs</p>
            <Link
              href={'/checkout'}
              className={styles.checkoutButton}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart
