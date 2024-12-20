import localFont from 'next/font/local'
import './globals.css'
import SessionWrapperPage from './SessionWrapper'
import { CartProvider } from './(frontend)/context/CartContext'
import { WishlistProvider } from './(frontend)/context/WishlistContext'
import PreloadAllPages from '@/app/PreloadAllPages'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionWrapperPage>
          <WishlistProvider>
            <CartProvider>
            <PreloadAllPages />
              {children}
              </CartProvider>
          </WishlistProvider>
        </SessionWrapperPage>
      </body>
    </html>
  )
}
