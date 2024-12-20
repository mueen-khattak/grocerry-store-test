// 'use client'
// import { useEffect, useState } from 'react'
// import { getDatabase, ref, get, set } from 'firebase/database'
// import { app } from '../lib/firebase'
// import { useSession } from 'next-auth/react'
// import styles from './CheckoutPage.module.css'
// import Image from 'next/image'
// import Link from 'next/link'
// import { IoIosArrowRoundBack } from "react-icons/io";


// function CheckoutPage() {
//   const { data: session, status } = useSession()
//   const db = getDatabase(app)
//   const [userData, setUserData] = useState(null)
//   const [cartItems, setCartItems] = useState([])
//   const [address, setAddress] = useState({
//     street: '',
//     city: '',
//     state: '',
//     zipCode: '',
//   })
//   const [totalAmount, setTotalAmount] = useState(0)
//   const [totalItems, setTotalItems] = useState(0)

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (session?.user?.email) {
//         const usersRef = ref(db, 'users')
//         const snapshot = await get(usersRef)

//         if (snapshot.exists()) {
//           const usersData = snapshot.val()
//           const foundUser = Object.values(usersData).find(
//             (user) => user.email === session.user.email
//           )
//           if (foundUser) {
//             setUserData(foundUser)
//           } else {
//             console.error('User not found with this email.')
//           }
//         } else {
//           console.error('No data available in the users node.')
//         }
//       }
//     }

//     const fetchCartItems = () => {
//       const savedCartItems = localStorage.getItem('cart')
//       if (savedCartItems) {
//         const parsedCartItems = JSON.parse(savedCartItems)
//         if (Array.isArray(parsedCartItems)) {
//           setCartItems(parsedCartItems)
//         } else {
//           console.warn(
//             'Expected cartItems to be an array, but received:',
//             parsedCartItems
//           )
//           setCartItems([])
//         }
//       } else {
//         console.warn('No cart items found in localStorage.')
//         setCartItems([])
//       }
//     }

//     const fetchCheckoutDetails = () => {
//       const checkoutDetails = localStorage.getItem('checkoutDetails')
//       console.log(checkoutDetails)
//       if (checkoutDetails) {
//         const parsedCheckoutDetails = JSON.parse(checkoutDetails)
//         setTotalAmount(parsedCheckoutDetails.totalPrice) // Set total amount from checkoutDetails
//         setTotalItems(parsedCheckoutDetails.totalItems) // If totalItems is also in checkoutDetails
//       } else {
//         console.warn('No checkout details found in localStorage.')
//       }
//     }

//     if (status === 'authenticated') {
//       fetchUserData()
//     }
//     fetchCartItems()
//     fetchCheckoutDetails() // Fetch total amount and total items
//   }, [db, session, status])

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target
//     setAddress((prevAddress) => ({
//       ...prevAddress,
//       [name]: value,
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!userData) {
//       alert('User data is missing. Please check your login status.')
//       return
//     }

//     if (
//       !address.street ||
//       !address.city ||
//       !address.state ||
//       !address.zipCode
//     ) {
//       alert('Please fill in all delivery address fields.')
//       return
//     }

//     const orderDetails = {
//       user: {
//         name: userData.name || '',
//         email: userData.email || '',
//         phone: userData.phone || '',
//       },
//       cartItems,
//       deliveryAddress: {
//         street: address.street || '',
//         city: address.city || '',
//         state: address.state || '',
//         zipCode: address.zipCode || '',
//       },
//       totalAmount,
//       orderDate: new Date().toISOString(),
//     }

//     try {
//       const orderRef = ref(db, 'orders/' + Date.now())
//       await set(orderRef, orderDetails)
//       console.log('Order saved successfully:', orderDetails)
//       localStorage.removeItem('cart')
//       localStorage.removeItem('checkoutDetails') // Optional: Clear checkoutDetails after placing order
//       setCartItems([])
//       alert('Order placed successfully!')
//     } catch (error) {
//       console.error('Error saving order:', error)
//     }
//   }
//   console.log(cartItems)
//   return (
//     <div className={styles.container}>
//       <div className={styles.cartItems}>
//         <Link href={'/'}>
//         <IoIosArrowRoundBack size={30} />
//         go back 
//         </Link>
//         {/* <h2 className={styles.sectionTitle}>Cart Items</h2> */}
//         <p className={styles.totalamount}>{totalAmount} Rs</p>
//         <div className={styles.clartbox}>
//           {cartItems.length > 0 ? (
//             cartItems.map((item) => (
//               <div key={item.id} className={styles.cartitems}>
               
//                 <div className={styles.name}>
//                 <Image
//                   width={60}
//                   height={60}
//                   src={item.frontImageUrl}
//                   className={styles.img}
//                 />
//                 <div>
//                   <p>
//                     <strong> {item.productName}</strong>
//                   </p>
//                   <span> ({item.weight} kg)</span>
//                 </div>
               
//                 </div>

//                 <div className={styles.totalpricebox}>
//                   <p className={styles.totalprice}>
//                     <strong>
//                       {' '}
//                       {(parseFloat(item.price) * item.weight).toFixed(2)} Rs
//                     </strong>
//                   </p>
//                   <span>
//                     (1 Kg :{' '}
//                     {typeof item.price === 'number'
//                       ? item.price.toFixed(2)
//                       : parseFloat(item.price).toFixed(2)}{' '}
//                     Rs)
//                   </span>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>Your cart is empty.</p>
//           )}
//         </div>

//         <div className={styles.totalbox}>
//        <div className={styles.total}>
//         <p>Total Items</p>
//         <p>{totalItems}</p>
//         </div>
//        <div className={styles.total}>
//         <p>Total Amount</p>
//         <p> {totalAmount}Rs</p>
//         </div>
//         </div>
//       </div>

//       {/* Delivery Address Form */}
//       <form className={styles.addressForm} onSubmit={handleSubmit}>
//         <h2 className={styles.sectionTitle}>User Details</h2>
//         {userData && (
//           <div className={styles.userDetails}>
//             <p>
//               <strong>Name:</strong> {userData.name}
//             </p>
//             <p>
//               <strong>Email:</strong> {userData.email}
//             </p>
//             <p>
//               <strong>Phone:</strong> {userData.phone}
//             </p>
//           </div>
//         )}
//         <h2 className={styles.sectionTitle}>Delivery Address</h2>
//         <div>
//           <label htmlFor="street">House no & Street:</label>
//           <input
//             type="text"
//             id="street"
//             name="street"
//             value={address.street}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="city">City:</label>
//           <input
//             type="text"
//             id="city"
//             name="city"
//             value={address.city}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="state">State:</label>
//           <input
//             type="text"
//             id="state"
//             name="state"
//             value={address.state}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="zipCode">Zip Code:</label>
//           <input
//             type="text"
//             id="zipCode"
//             name="zipCode"
//             value={address.zipCode}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <button type="submit">Checkout</button>
//       </form>
//     </div>
//   )
// }

// export default CheckoutPage

// "use client"
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation';
// import { getDatabase, ref, get, set } from 'firebase/database'
// import { app } from '../lib/firebase'
// import { useSession } from 'next-auth/react'
// import styles from './CheckoutPage.module.css'
// import Image from 'next/image'
// import Link from 'next/link'
// import { IoIosArrowRoundBack } from "react-icons/io";

// function CheckoutPage() {
//  const router = useRouter();
//   const { data: session, status } = useSession()
//   const db = getDatabase(app)
//   const [userData, setUserData] = useState(null)
//   const [cartItems, setCartItems] = useState([])
//   const [address, setAddress] = useState({
//     houseNo: '',
//     street: '',
//     sector: '',
//     city: '',
//     phone: '',
//   })
//   const [totalAmount, setTotalAmount] = useState(0)
//   const [totalItems, setTotalItems] = useState(0)

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (session?.user?.email) {
//         const usersRef = ref(db, 'users')
//         const snapshot = await get(usersRef)

//         if (snapshot.exists()) {
//           const usersData = snapshot.val()
//           const foundUser = Object.values(usersData).find(
//             (user) => user.email === session.user.email
//           )
//           if (foundUser) {
//             setUserData(foundUser)
//           } else {
//             console.error('User not found with this email.')
//           }
//         } else {
//           console.error('No data available in the users node.')
//         }
//       }
//     }

//     const fetchCartItems = () => {
//       const savedCartItems = localStorage.getItem('cart')
//       if (savedCartItems) {
//         const parsedCartItems = JSON.parse(savedCartItems)
//         if (Array.isArray(parsedCartItems)) {
//           setCartItems(parsedCartItems)
//         } else {
//           console.warn(
//             'Expected cartItems to be an array, but received:',
//             parsedCartItems
//           )
//           setCartItems([])
//         }
//       } else {
//         console.warn('No cart items found in localStorage.')
//         setCartItems([])
//       }
//     }

//     const fetchCheckoutDetails = () => {
//       const checkoutDetails = localStorage.getItem('checkoutDetails')
//       console.log(checkoutDetails)
//       if (checkoutDetails) {
//         const parsedCheckoutDetails = JSON.parse(checkoutDetails)
//         setTotalAmount(parsedCheckoutDetails.totalPrice) // Set total amount from checkoutDetails
//         setTotalItems(parsedCheckoutDetails.totalItems) // If totalItems is also in checkoutDetails
//       } else {
//         console.warn('No checkout details found in localStorage.')
//       }
//     }

//     if (status === 'authenticated') {
//       fetchUserData()
//     }
//     fetchCartItems()
//     fetchCheckoutDetails() // Fetch total amount and total items
//   }, [db, session, status])

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target
//     setAddress((prevAddress) => ({
//       ...prevAddress,
//       [name]: value,
//     }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (!userData) {
//       alert('User data is missing. Please check your login status.')
//       return
//     }

//     if (
//       !address.houseNo ||
//       !address.street ||
//       !address.sector ||
//       !address.city ||
//       !address.phone
//     ) {
//       alert('Please fill in all delivery address fields.')
//       return
//     }

//     const orderDetails = {
//       user: {
//         name: userData.name || '',
//         email: userData.email || '',
//         phone: userData.phone || '',
//       },
//       cartItems,
//       deliveryAddress: {
//         houseNo: address.houseNo || '',
//         street: address.street || '',
//         sector: address.sector || '',
//         city: address.city || '',
//         phone: address.phone || '',
//       },
//       totalAmount,
//       status:'Order Placed',
//       orderDate: new Date().toISOString(),
//     }

//     try {
//       const orderRef = ref(db, 'orders/' + Date.now())
//       await set(orderRef, orderDetails)
//       console.log('Order saved successfully:', orderDetails)
//       localStorage.removeItem('cart')
//       localStorage.removeItem('checkoutDetails') // Optional: Clear checkoutDetails after placing order
//       setCartItems([])
//       router.push('/checkout_success'); // navigate to success page

//       // alert('Order placed successfully!')
//     } catch (error) {
//       console.error('Error saving order:', error)
//     }
//   }
//   console.log(cartItems)
//   return (
//     <div className={styles.container}>
//       <div className={styles.cartItems}>
//         <Link href={'/'}>
//         <IoIosArrowRoundBack size={30} />
//         go back 
//         </Link>
//         <p className={styles.totalamount}>{totalAmount} Rs</p>
//         <div className={styles.cartbox}>
//           {cartItems.length > 0 ? (
//             cartItems.map((item) => (
//               <div key={item.id} className={styles.cartitems}>
               
//                 <div className={styles.name}>
//                 <Image
//                   width={60}
//                   height={60}
//                   src={item.frontImageUrl}
//                   className={styles.img}
//                 />
//                 <div>
//                   <p>
//                     <strong> {item.productName}</strong>
//                   </p>
//                   <span> ({item.weight} kg)</span>
//                 </div>
//                 </div>

//                 <div className={styles.totalpricebox}>
//                   <p className={styles.totalprice}>
//                     <strong>
//                       {' '}{(parseFloat(item.price) * item.weight).toFixed(2)} Rs
//                     </strong>
//                   </p>
//                   <span>
//                     (1 Kg :{' '}
//                     {typeof item.price === 'number'
//                       ? item.price.toFixed(2)
//                       : parseFloat(item.price).toFixed(2)}{' '}
//                     Rs)
//                   </span>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>Your cart is empty.</p>
//           )}
//         </div>

//         <div className={styles.totalbox}>
//        <div className={styles.total}>
//         <p>Total Items</p>
//         <p>{totalItems}</p>
//         </div>
//        <div className={styles.total}>
//         <p>Total Amount</p>
//         <p> {totalAmount}Rs</p>
//         </div>
//         </div>
//       </div>

//       {/* Delivery Address Form */}
//       <form className={styles.addressForm} onSubmit={handleSubmit}>
//         <p className={styles.sectionTitle}>User Details</p>
//         {userData && (
//           <div className={styles.userDetails}>
//             <p>
//               Userid<span>{userData.id}</span>
//             </p>
//             <p>
//               Name<span>{userData.name}</span>
//             </p>
//             <p>
//             Email <span>{userData.email}</span>
//             </p>
//             <p>
//               Phone <span>{userData.phone}</span>
//             </p>
//           </div>
//         )}
//         <p className={styles.sectionTitle}>Delivery Address</p>
//         <div>
//           <label htmlFor="houseNo">House No</label>
//           <input
//             type="text"
//             id="houseNo"
//             name="houseNo"
//             value={address.houseNo}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="street">Street</label>
//           <input
//             type="text"
//             id="street"
//             name="street"
//             value={address.street}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="sector">Sector</label>
//           <input
//             type="text"
//             id="sector"
//             name="sector"
//             value={address.sector}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="city">City</label>
//           <input
//             type="text"
//             id="city"
//             name="city"
//             value={address.city}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="phone">Phone No</label>
//           <input
//             type="text"
//             id="phone"
//             name="phone"
//             value={address.phone}
//             onChange={handleAddressChange}
//             required
//           />
//         </div>
//         <button type="submit">Checkout</button>
//       </form>
//     </div>
//   )
// }

// export default CheckoutPage




"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { getDatabase, ref, get, set } from 'firebase/database'
import { app } from '../lib/firebase'
import { useSession } from 'next-auth/react'
import styles from './CheckoutPage.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { IoIosArrowRoundBack } from "react-icons/io";

function CheckoutPage() {
 const router = useRouter();
  const { data: session, status } = useSession()
  const db = getDatabase(app)
  const [userData, setUserData] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [address, setAddress] = useState({
    houseNo: '',
    street: '',
    sector: '',
    city: '',
    phone: '',
  })
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
    
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const foundUser = Object.entries(usersData).find(
            ([key, user]) => user.email === session.user.email
          );
    
          if (foundUser) {
            const [userId, userDetails] = foundUser; // Destructure to get userId and userDetails
            setUserData({ id: userId, ...userDetails }); // Combine userId with userDetails
          } else {
            console.error('User not found with this email.');
          }
        } else {
          console.error('No data available in the users node.');
        }
      }
    };
    

    const fetchCartItems = () => {
      const savedCartItems = localStorage.getItem('cart')
      if (savedCartItems) {
        const parsedCartItems = JSON.parse(savedCartItems)
        if (Array.isArray(parsedCartItems)) {
          setCartItems(parsedCartItems)
        } else {
          console.warn(
            'Expected cartItems to be an array, but received:',
            parsedCartItems
          )
          setCartItems([])
        }
      } else {
        console.warn('No cart items found in localStorage.')
        setCartItems([])
      }
    }

    const fetchCheckoutDetails = () => {
      const checkoutDetails = localStorage.getItem('checkoutDetails')
      if (checkoutDetails) {
        const parsedCheckoutDetails = JSON.parse(checkoutDetails)
        setTotalAmount(parsedCheckoutDetails.totalPrice) // Set total amount from checkoutDetails
        setTotalItems(parsedCheckoutDetails.totalItems) // If totalItems is also in checkoutDetails
      } else {
        console.warn('No checkout details found in localStorage.')
      }
    }

    if (status === 'authenticated') {
      fetchUserData()
    }
    fetchCartItems()
    fetchCheckoutDetails() // Fetch total amount and total items
  }, [db, session, status])

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!userData) {
      alert('User data is missing. Please check your login status.');
      return;
    }
  
    if (
      !address.houseNo ||
      !address.street ||
      !address.sector ||
      !address.city ||
      !address.phone
    ) {
      alert('Please fill in all delivery address fields.');
      return;
    }
  
    const orderDetails = {
      user: {
        id: userData.id, // Ensure userId is included
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        profileImage: userData.profileImage || "", // Add profile image

      },
      cartItems,
      deliveryAddress: {
        houseNo: address.houseNo || '',
        street: address.street || '',
        sector: address.sector || '',
        city: address.city || '',
        phone: address.phone || '',
      },
      totalAmount,
      status: 'Order Placed',
      orderDate: new Date().toString(),
    };
  
    try {
      const orderRef = ref(db, 'orders/' + Date.now());
      await set(orderRef, orderDetails);
      console.log('Order saved successfully:', orderDetails);
      localStorage.removeItem('cart');
      localStorage.removeItem('checkoutDetails'); // Optional: Clear checkoutDetails after placing order
      setCartItems([]);
      router.push('/checkout_success'); // Navigate to success page
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };
  

  console.log(cartItems)
  return (
    <div className={styles.container}>
      <div className={styles.cartItems}>
        <Link href={'/'}>
        <IoIosArrowRoundBack size={30} />
        go back 
        </Link>
        <p className={styles.totalamount}>{totalAmount} Rs</p>
        <div className={styles.cartbox}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className={styles.cartitems}>
                <div className={styles.name}>
                <Image
                  src={item.frontImageUrl}
                  alt='img'
                  width={60}
                  height={60}
                  className={styles.img}
                />
                <div>
                  <p>
                    <strong> {item.productName}</strong>
                  </p>
                  <span> ({item.weight} kg)</span>
                </div>
                </div>

                <div className={styles.totalpricebox}>
                  <p className={styles.totalprice}>
                    <strong>
                      {' '}{(parseFloat(item.price) * item.weight).toFixed(2)} Rs
                    </strong>
                  </p>
                  <span>
                    (1 Kg :{' '}
                    {typeof item.price === 'number'
                      ? item.price.toFixed(2)
                      : parseFloat(item.price).toFixed(2)}{' '}
                    Rs)
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        <div className={styles.totalbox}>
       <div className={styles.total}>
        <p>Total Items</p>
        <p>{totalItems}</p>
        </div>
       <div className={styles.total}>
        <p>Total Amount</p>
        <p> {totalAmount}Rs</p>
        </div>
        </div>
      </div>

      {/* Delivery Address Form */}
      <form className={styles.addressForm} onSubmit={handleSubmit}>
        <p className={styles.sectionTitle}>User Details</p>
        {userData && (
          <div className={styles.userDetails}>
            <p>
              Userid<span>{userData.id}</span>
            </p>
            <p>
              Name<span>{userData.name}</span>
            </p>
            <p>
            Email <span>{userData.email}</span>
            </p>
            <p>
              Phone <span>{userData.phone}</span>
            </p>
          </div>
        )}
        <p className={styles.sectionTitle}>Delivery Address</p>
        <div>
          <label htmlFor="houseNo">House No</label>
          <input
            type="text"
            id="houseNo"
            name="houseNo"
            value={address.houseNo}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div>
          <label htmlFor="street">Street</label>
          <input
            type="text"
            id="street"
            name="street"
            value={address.street}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div>
          <label htmlFor="sector">Sector</label>
          <input
            type="text"
            id="sector"
            name="sector"
            value={address.sector}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={address.city}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Phone No</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={address.phone}
            onChange={handleAddressChange}
            required
          />
        </div>
        <button type="submit">Checkout</button>
      </form>
    </div>
  )
}

export default CheckoutPage
