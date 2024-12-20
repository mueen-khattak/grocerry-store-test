// import NextAuth from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { ref, get } from 'firebase/database' // Import `get` from firebase/database
// import { realtimeDb } from '@/app/(backend)/lib/firebase' // Adjust the path as necessary

// export const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: 'Firebase Realtime Database',
//       credentials: {
//         email: {
//           label: 'Email',
//           type: 'text',
//           placeholder: 'your.email@example.com',
//         },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         try {
//           console.log('Authorizing with credentials:', credentials)
//           const usersRef = ref(realtimeDb, 'users')
//           const snapshot = await get(usersRef)
//           const users = snapshot.val()

//           console.log('Users retrieved:', users)

//           // Handle email format in Firebase
//           const userEmail = credentials.email.replace('.', ',')
//           console.log('Searching for user with email key:', userEmail)

//           // Check if the user exists in the retrieved data
//           const user = Object.values(users).find(
//             (u) => u.email === credentials.email
//           )

//           console.log('User found:', user)

//           if (user && user.password === credentials.password) {
//             console.log('Authentication successful for user:', userEmail)
//             return {
//               email: user.email,
//               role: user.role || 'user',
//             }
//           } else {
//             console.warn('Invalid email or password')
//             throw new Error('Invalid email or password')
//           }
//         } catch (error) {
//           console.error('Error during authorization:', error)
//           throw new Error('Unable to authenticate')
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: '/login',
//     error: '/error',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role || 'user'
//       }
//       return token
//     },
//     async session({ session, token }) {
//       session.user.role = token.role
//       return session
//     },
//   },
//   session: {
//     strategy: 'jwt',
//     maxAge: 60 * 60, // 1 hour
//   },
// })

// export { handler as GET, handler as POST }


// import NextAuth from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { ref, get } from 'firebase/database'
// import { realtimeDb } from '@/app/(backend)/lib/firebase'
// import bcrypt from 'bcryptjs'

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'Firebase Realtime Database',
//       credentials: {
//         email: {
//           label: 'Email',
//           type: 'text',
//           placeholder: 'your.email@example.com',
//         },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         try {
//           console.log('Authorizing user with email:', credentials.email);

//           const usersRef = ref(realtimeDb, 'users');
//           const snapshot = await get(usersRef);

//           if (!snapshot.exists()) {
//             throw new Error('No users found in the database.');
//           }

//           const users = snapshot.val();
//           console.log('Users retrieved from Firebase:', users);

//           // Find the user with the matching email
//           const user = Object.values(users).find((u) => u.email === credentials.email);

//           if (user) {
//             console.log('User found in the database.');

//             // Compare the hashed password with the provided password
//             const isValid = await bcrypt.compare(credentials.password, user.password);

//             if (isValid) {
//               console.log('Password is valid. User authenticated.');
//               return {
//                 email: user.email,
//                 role: user.role || 'user',
//                 username: user.name || 'Guest', // Use the `name` field as the username
//                 lastPasswordChange: user.lastPasswordChange,
//               };
//             } else {
//               console.error('Password mismatch.');
//               throw new Error('Invalid email or password');
//             }
//           } else {
//             console.error('User not found in the database for email:', credentials.email);
//             throw new Error('User not found');
//           }
//         } catch (error) {
//           console.error('Error during authorization:', error.message);
//           throw new Error('Unable to authenticate. Please try again.');
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: '/login',
//     error: '/error',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.lastPasswordChange = user.lastPasswordChange;
//         token.username = user.username; // Add username from `name`
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user.lastPasswordChange = token.lastPasswordChange;
//       session.user.email = token.email || null;
//       session.user.username = token.username || 'Guest'; // Add username to session
//       session.expires = token.exp; // Ensure the expiration time is included
//       return session;
//     },
//   },
//   session: {
//     strategy: 'jwt',
//     maxAge: 60 * 60, // 1 hour
//   },
// }
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };


import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { ref, get } from 'firebase/database' // Import `get` from firebase/database
import { realtimeDb } from '@/app/(backend)/lib/firebase' // Adjust the path as necessary
import bcrypt from 'bcryptjs'


export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Firebase Realtime Database',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'your.email@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('Authorizing user with email:', credentials.email);

          const usersRef = ref(realtimeDb, 'users');
          const snapshot = await get(usersRef);

          if (!snapshot.exists()) {
            throw new Error('No users found in the database.');
          }

          const users = snapshot.val();
          console.log('Users retrieved from Firebase:', users);

          // Find the user with the matching email
          const user = Object.values(users).find((u) => u.email === credentials.email);

          if (user) {
            console.log('User found in the database.');

            // Compare the hashed password with the provided password
            const isValid = await bcrypt.compare(credentials.password, user.password);

            if (isValid) {
              console.log('Password is valid. User authenticated.');
              return {
                email: user.email,
                role: user.role || 'user',
                username: user.name || 'Guest', // Use the `name` field as the username
                lastPasswordChange: user.lastPasswordChange,
              };
            } else {
              console.error('Password mismatch.');
              throw new Error('Invalid email or password');
            }
          } else {
            console.error('User not found in the database for email:', credentials.email);
            throw new Error('User not found');
          }
        } catch (error) {
          console.error('Error during authorization:', error.message);
          throw new Error('Unable to authenticate. Please try again.');
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.lastPasswordChange = user.lastPasswordChange;
        token.username = user.username; // Add username from `name`
      }
      return token;
    },
    async session({ session, token }) {
      session.user.lastPasswordChange = token.lastPasswordChange;
      session.user.email = token.email || null;
      session.user.username = token.username || 'Guest'; // Add username to session
      session.expires = token.exp; // Ensure the expiration time is included
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour
  },
})

export { handler as GET, handler as POST }