// 'use client'; // Ensure this file runs on the client-side in Next.js

// import { getAuth, signOut } from "firebase/auth";

// // Function to handle user sign-out
// const logout = async () => {
//   const auth = getAuth();  // Get the Firebase Auth instance
//   try {
//     await signOut(auth);  // Sign out the user (asynchronously)
//     console.log('User logged out successfully');
//   } catch (error) {
//     console.error('Error logging out:', error);
//   }
// };

// // LogoutButton component that triggers the logout function
// const LogoutButton = () => {
//   return (
//     <button onClick={logout}>
//       Logout
//     </button>
//   );
// };

// export default LogoutButton;



import { signOut, useSession } from "next-auth/react"; 

const AuthComponent = () => {
  const { data: session } = useSession(); // Get session data

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div>
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
    </div>
  );
};

export default AuthComponent;
