'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Display a message if the "passwordChanged" parameter is present in the URL
    if (searchParams.get('passwordChanged') === 'true') {
      setInfoMessage('Your password has been changed. Please log in again with your new password.');
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result.error) {
      setError(result.error); // Display error if login fails
    } else {
      router.push('/'); // Redirect to the homepage on successful login
    }
  };

  return (
    <div className={styles.authContainer}>
      {infoMessage && <p className={styles.infoMessage}>{infoMessage}</p>}
      <form onSubmit={handleLogin} className={styles.authForm}>
        <h2>Login</h2>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Login</button>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>
      <div className={styles.signUpLink}>
        <p>Don&apos;t have an account? <Link legacyBehavior prefetch={true} href="/signup"><a>Sign Up</a></Link></p>
      </div>
    </div>
  );
}
