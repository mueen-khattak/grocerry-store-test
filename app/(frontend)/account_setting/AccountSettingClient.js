'use client' // Indicate this is a client component
import AccountSetting from './AccountSetting'
import { Suspense } from 'react'

const AccountSettingClient = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <AccountSetting />
    </Suspense>
  )
}

export default AccountSettingClient
