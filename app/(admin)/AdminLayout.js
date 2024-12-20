// pages/admin/index.js
'use client'

import { LuLayoutDashboard } from 'react-icons/lu'
import { MdProductionQuantityLimits } from 'react-icons/md'
import { IoCartOutline } from 'react-icons/io5'
import { GoCodeReview } from 'react-icons/go'
import { GrApps } from 'react-icons/gr'
import { MdOutlineAccountBox } from 'react-icons/md'
import { GrUserWorker } from 'react-icons/gr'
import { CiSettings } from 'react-icons/ci'
import { FiLogOut } from 'react-icons/fi'

import styles from './AdminLayout.module.css'
import Login_Account from '@/app/(frontend)/Login_Account'
import { signOut } from 'next-auth/react'

export default function AdminLayout() {
  const handleSignOut = () => {
    signOut()
  }

  return (
    <>
      <div className={styles.adminContainer}></div>

      <div className={styles.sidebar}>
        <h1>Grocery Store</h1>
        <div className={styles.navList}>
          <a href="/admin/dashboard">
            <span>
              <LuLayoutDashboard size={17} />
            </span>
            Dashboard
          </a>
          <a href="/admin/products">
            <span>
              <MdProductionQuantityLimits size={17} />
            </span>
            Products
          </a>
          <a href="/admin/order">
            <span>
              <IoCartOutline size={17} />
            </span>
            Orders
          </a>
          <a href="/admin/return">
            <span>
              <IoCartOutline size={17} />
            </span>
            Return
          </a>
          <a href="#">
            <span>
              <GoCodeReview size={17} />
            </span>
            Reviews
          </a>
          <a href="#">
            <span>
              <GrApps size={17} />
            </span>
            Banners/ads
          </a>
          <a href="/admin/customers">
            <span>
              <MdOutlineAccountBox size={17} />
            </span>
            Customers
          </a>
          <a href="/admin/accounts">
            <span>
              <GrUserWorker size={17} />
            </span>
            Accounts
          </a>
          <a href="#">
            <span>
              <CiSettings size={17} />
            </span>
            Setting
          </a>
        </div>
        <div className={styles.button}>
          <span>
            <FiLogOut size={17} />
          </span>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      </div>
      <div className={styles.blank}></div>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <div className={styles.top}>
          <p>alert</p>
          <Login_Account />
        </div>
      </header>
    </>
  )
}
