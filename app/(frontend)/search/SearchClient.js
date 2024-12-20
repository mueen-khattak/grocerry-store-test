'use client' // Indicate this is a client component
import Search from './Search'
import { Suspense } from 'react'

const SearchClient = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Search />
    </Suspense>
  )
}

export default SearchClient
