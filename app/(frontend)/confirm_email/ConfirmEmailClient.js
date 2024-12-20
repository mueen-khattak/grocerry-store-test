'use client' // Indicate this is a client component
import ConfermEmail from './ConfermEmail'
import { Suspense } from 'react'

const AccountSettingClient = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <ConfermEmail />
    </Suspense>
  )
}

export default AccountSettingClient
