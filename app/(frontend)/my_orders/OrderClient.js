'use client' // Indicate this is a client component
import Order from './Order'
import { Suspense } from 'react'

const OrderClient = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Order />
    </Suspense>
  )
}

export default OrderClient
