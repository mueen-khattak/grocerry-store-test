'use client' // Indicate this is a client component
import Cart from './Cart'
import { Suspense } from 'react'

const CartClient = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Cart />
    </Suspense>
  )
}

export default CartClient
