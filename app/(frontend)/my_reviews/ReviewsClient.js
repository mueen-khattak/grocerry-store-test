'use client' // Indicate this is a client component
import Reviews from './Reviews'
import { Suspense } from 'react'

const ReviewsClient = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Reviews />
    </Suspense>
  )
}

export default ReviewsClient
