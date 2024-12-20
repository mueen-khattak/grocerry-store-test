'use client' // Indicate this is a client component
import Signup from './Signup'
import { Suspense } from 'react'

const SearchClient = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Signup />
    </Suspense>
  )
}

export default SearchClient
