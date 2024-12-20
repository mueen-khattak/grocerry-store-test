'use client' // Indicate this is a client component
import Retplace from './Retplace'
import { Suspense } from 'react'

const ReplaceClient = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Retplace />
    </Suspense>
  )
}

export default ReplaceClient
