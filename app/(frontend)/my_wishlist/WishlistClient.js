'use client' // Indicate this is a client component
import Wishlist from './Wishlist'
import { Suspense } from 'react'

const ReplaceClient = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Wishlist />
    </Suspense>
  )
}

export default ReplaceClient
