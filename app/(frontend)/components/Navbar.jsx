// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { CiSearch } from 'react-icons/ci'
// import styles from '@/app/(frontend)/components/ComponentsStyles/Navbar.module.css'
// import Sidebar from '@/app/(frontend)/sidebarcomponents/Sidebar'
// import { IoCartOutline } from 'react-icons/io5'
// import { FaRegHeart } from 'react-icons/fa'
// import { useCart } from '../context/CartContext'
// import { useWishlist } from '../context/WishlistContext'
// import Login_Account from '@/app/(frontend)/Login_Account'
// import Link from 'next/link'

// const Navbar = () => {
//   const [cartState, setCartState] = useState({ totalItems: 0, totalPrice: 0 })
//   const [wishlistCount, setWishlistCount] = useState(0)

//   const sidebarRef = useRef(null)
//   const { totalItems, totalPrice } = useCart()
//   const { wishlistCount: wishlistCountContext } = useWishlist()

//   useEffect(() => {
//     setCartState({ totalItems, totalPrice })
//     setWishlistCount(wishlistCountContext)
//   }, [totalItems, totalPrice, wishlistCountContext])

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen)
//   }

//   // Close sidebar when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//         setIsSidebarOpen(false)
//       }
//     }

//     if (isSidebarOpen) {
//       document.addEventListener('mousedown', handleClickOutside)
//     } else {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [isSidebarOpen])

//   return (
//     <div className={styles.container}>
//       <nav className={styles.navbar}>
//         <div className={styles.logo}>
//           <button onClick={toggleSidebar} className={styles.sidebarToggleBtn}>
//             ☰
//           </button>
//           <Link legacyBehavior href="/">
//             <a>Grocery Store</a>
//           </Link>
//         </div>

//         <div className={styles.search}>
//           <input type="text" placeholder="Search products..." />
//           <button className={styles.searchbtn}>
//             <CiSearch size={25} />
//           </button>
//         </div>

//         <div className={styles.linkscontainer}>
//           <div className={styles.linksbox}>
//             <Link legacyBehavior href={'/my_cart'}>
//               <a className={styles.links2}>
//                 <p className={styles.cartcount}>{cartState.totalItems}</p>
//                 <h1>{cartState.totalPrice.toFixed(2)} Rs</h1>
//                 <div className={styles.cartbox}>
//                   <IoCartOutline size="30" />
//                   <p>Cart</p>
//                 </div>
//               </a>
//             </Link>

//             <Link legacyBehavior href={'/my_wishlist'}>
//               <a className={styles.links}>
//                 <p className={styles.wishlistcount}>{wishlistCount}</p>
//                 <FaRegHeart size="27" />
//                 <p>Wishlist</p>
//               </a>
//             </Link>
//           </div>

//           <div className={styles.links}>
//             <Login_Account />
//           </div>
//         </div>
//       </nav>

//       {isSidebarOpen && (
//         <div className={styles.sidebarOverlay}>
//           <div ref={sidebarRef} className={styles.sidebar}>
//             <Sidebar />
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Navbar

'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CiSearch } from 'react-icons/ci'
import styles from '@/app/(frontend)/components/ComponentsStyles/Navbar.module.css'
import Sidebar from '@/app/(frontend)/sidebarcomponents/Sidebar'
import { IoCartOutline } from 'react-icons/io5'
import { FaRegHeart } from 'react-icons/fa'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import Login_Account from '@/app/(frontend)/Login_Account'
import Link from 'next/link'

const Navbar = () => {
  const [cartState, setCartState] = useState({ totalItems: 0, totalPrice: 0 })
  const [wishlistCount, setWishlistCount] = useState(0)

  const [searchInput, setSearchInput] = useState('')
  const sidebarRef = useRef(null)
  const { totalItems, totalPrice } = useCart()
  const { wishlistCount: wishlistCountContext } = useWishlist()
  const router = useRouter() // For navigation

  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''

  useEffect(() => {
    setCartState({ totalItems, totalPrice })
    setWishlistCount(wishlistCountContext)
  }, [totalItems, totalPrice, wishlistCountContext])

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false)
      }
    }

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSidebarOpen])

  useEffect(() => {
    setSearchInput(query) // Set the input value to the query when the component loads
  }, [query])

  // Handle search input change
  const handleInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <button onClick={toggleSidebar} className={styles.sidebarToggleBtn}>
            ☰
          </button>
          <Link legacyBehavior href="/">
            <a>Grocery Store</a>
          </Link>
        </div>

        <div className={styles.search}>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              name="search"
              className={styles.searchInput}
              placeholder= "Search products..." // Show query as placeholder or default text
              value={searchInput} // Controlled input value
              onChange={handleInputChange} // Update state on input change
            />
            <button type="submit" className={styles.searchbtn}>
              <CiSearch size={25} />
            </button>
          </form>
        </div>

        <div className={styles.linkscontainer}>
          <div className={styles.linksbox}>
            <Link legacyBehavior prefetch={true} href={'/my_cart'}>
              <a className={styles.links2}>
                <p className={styles.cartcount}>{cartState.totalItems}</p>
                <h1>{cartState.totalPrice.toFixed(2)} Rs</h1>
                <div className={styles.cartbox}>
                  <IoCartOutline size="30" />
                  <p>Cart</p>
                </div>
              </a>
            </Link>

            <Link legacyBehavior prefetch={true} href={'/my_wishlist'}>
              <a className={styles.links}>
                <p className={styles.wishlistcount}>{wishlistCount}</p>
                <FaRegHeart size="27" />
                <p>Wishlist</p>
              </a>
            </Link>
          </div>

          <div className={styles.links}>
            <Login_Account />
          </div>
        </div>
      </nav>

      {isSidebarOpen && (
        <div className={styles.sidebarOverlay}>
          <div ref={sidebarRef} className={styles.sidebar}>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
