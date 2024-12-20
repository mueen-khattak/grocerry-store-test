// app/(admin)/admin/page.js
import style from '../AdminPageGloble.module.css'
import { getServerSession } from 'next-auth/next'
import { handler } from '@/app/(backend)/api/auth/[...nextauth]/route' // Correct import for authOptions

export default async function AdminPage() {
  const session = await getServerSession(handler) // Use authOptions here

  // If no session is found, you can either redirect to the login page or show an error message
  if (!session) {
    return <div>You must be logged in to view this page.</div> // Optionally redirect
  }

  return (
    <div className={style.main}>
      <h1>Admin Dashboard</h1>
      <p>{session.user.email}</p>
      {/* Admin-specific content goes here */}
    </div>
  )
}
