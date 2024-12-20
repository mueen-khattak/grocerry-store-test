"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react"; // Import NextAuth's signIn method
import { useRouter, useSearchParams } from "next/navigation"; // Correctly imported (useRouter for App Router)
import CryptoJS from "crypto-js"; // Import crypto-js for decoding and hashing
import styles from './conferm.module.css'

export default function ConfirmEmail() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const param = useSearchParams(); // Use for getting query params in App Router
  const token = param.get("token"); // Get token from query params

  useEffect(() => {
    if (!token) {
      setMessage("No token found in the URL.");
      return;
    }

    try {
      // Decrypt the token using CryptoJS
      const decryptedBytes = CryptoJS.AES.decrypt(token, "your-secret-key");
      const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

      if (decryptedData) {
        const tokenData = JSON.parse(decryptedData); // Parse the decrypted string into a JSON object
        confirmUserAccount(tokenData);
      } else {
        setMessage("Invalid token.");
      }
    } catch (err) {
      setMessage("Invalid or expired token.");
      console.error(err);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Run the useEffect only when token changes

  const confirmUserAccount = async (tokenData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/confirmEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tokenData), // Send decrypted token data to server
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.redirect) {
        // Extract email and password from the token data
        const { email, password } = tokenData;

        // Log in the user using NextAuth before redirecting
        const signInResponse = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        // Handle sign-in response
        if (signInResponse?.error) {
          setMessage("Sign-in failed: " + signInResponse.error);
        } else {
          setMessage("Successfully signed in!");

          // Delay the redirection to show the success message
          setTimeout(() => {
            router.push(data.redirect); // Redirect to the specified URL after successful login
          }, 2000);
        }
      }
    } catch (error) {
      setMessage("Error confirming email: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.box}>
      <h2>Email Confirmation</h2>
      <p>{message}</p>
      {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}
