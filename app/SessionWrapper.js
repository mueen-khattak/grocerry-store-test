// components/SessionWrapper.js
"use client"
import { SessionProvider } from "next-auth/react";





const SessionWrapperPage = ({ children }) => {
  return (
    <SessionProvider> {/* Prevent frequent refetching */}
 
        {children}
   
    </SessionProvider>
  );
};

export default SessionWrapperPage;
