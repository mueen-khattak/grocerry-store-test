'use client' // Indicate this is a client component
import Login from './Login'
import { Suspense } from 'react'

const LoginClient = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Login />
    </Suspense>
  )
}

export default LoginClient
