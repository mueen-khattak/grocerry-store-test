// 'use client'
// import { useEffect, useState } from 'react'
// import { ref, get } from 'firebase/database'
// import { realtimeDb } from '@/app/(backend)/lib/firebase' // Adjust the import path based on your project structure

// const CredentialsPage = () => {
//   const [credentials, setCredentials] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchCredentials = async () => {
//       try {
//         const usersRef = ref(realtimeDb, 'users')
//         const snapshot = await get(usersRef)

//         if (snapshot.exists()) {
//           // Convert the snapshot to an array of user objects
//           const usersData = snapshot.val()
//           console.log('realtimeDb', usersData)
//           const usersArray = Object.keys(usersData).map((key) => ({
//             id: key,
//             ...usersData[key],
//           }))
//           setCredentials(usersArray)
//         } else {
//           setError('No users found.')
//         }
//       } catch (err) {
//         console.error('Error fetching credentials:', err)
//         setError('Failed to fetch credentials.')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchCredentials()
//   }, [])

//   if (loading) {
//     return <p>Loading...</p>
//   }

//   if (error) {
//     return <p>{error}</p>
//   }

//   return (
//     <div>
//       <h1>User Credentials</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Email</th>
//             <th>Password</th>
//             <th>Role</th>
//           </tr>
//         </thead>
//         <tbody>
//           {credentials.map((user) => (
//             <tr key={user.id}>
//               <td>{user.email}</td>
//               <td>{user.password}</td>
//               <td>{user.role}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// export default CredentialsPage



"use client"; // Necessary for Next.js in client-side rendering

import { useEffect, useState } from "react";
import { auth } from "../lib/firebase"; // Adjust the import path to your firebase.js file
import { onAuthStateChanged } from "firebase/auth";

const AuthStatus = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // User is logged in
      } else {
        setUser(null); // User is logged out
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <p>User is logged in: {user.email}</p>
      ) : (
        <p>No user is logged in.</p>
      )}
    </div>
  );
};

export default AuthStatus;
