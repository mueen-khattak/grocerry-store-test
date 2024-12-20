'use client';
import { CgProfile } from 'react-icons/cg';
import { useEffect, useState, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '@/app/(backend)/lib/firebase';
import { VscAccount } from 'react-icons/vsc';
import styles from './Login_Account.module.css';
import Link from 'next/link';

const Login_Account = () => {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const boxRef = useRef(null);
  const fetchedDataRef = useRef(false); // To prevent redundant fetching

  const handleSignOut = () => {
    signOut();
  };

  const handleImageClick = () => {
    setIsVisible(!isVisible);
  };

  const handleClickOutside = (event) => {
    if (boxRef.current && !boxRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email && !fetchedDataRef.current) {
        try {
          const usersRef = ref(realtimeDb, 'users');
          const snapshot = await get(usersRef);

          if (snapshot.exists()) {
            const usersData = snapshot.val();
            const foundUser = Object.values(usersData).find(
              (user) => user.email === session.user.email
            );

            if (foundUser) {
              setUserData(foundUser);

              if (
                session.user.lastPasswordChange &&
                session.user.lastPasswordChange !== foundUser.lastPasswordChange
              ) {
                handleSignOut();
              }
            } else {
              console.error('User not found with this email.');
            }
          } else {
            console.error('No data available in the users node.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
        fetchedDataRef.current = true; // Mark data as fetched
      }
    };

    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [session, status]);

  return (
    <>
      {status === 'authenticated' ? (
        <div className={styles.container} onClick={handleImageClick}>
          {userData?.profileImage ? (
            <Image
              src={userData.profileImage}
              width={100}
              height={100}
              className={styles.img}
              alt="User profile"
              loading="lazy"
            />
          ) : (
            <div className={styles.initials}>
              {userData?.name
                ? userData.name.charAt(0).toUpperCase()
                : session?.user?.name
                ? session.user.name.charAt(0).toUpperCase()
                : <CgProfile color="white" />}
            </div>
          )}

          {isVisible && (
            <div
              className={styles.box}
              ref={boxRef}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{userData?.role || session.user.role || 'User'}</h2>
              <div>
                {userData?.profileImage ? (
                  <Image
                    src={userData.profileImage}
                    width={900}
                    height={900}
                    className={styles.img2}
                    alt="User profile"
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.initials2}>
                    {userData?.name
                      ? userData.name.charAt(0).toUpperCase()
                      : session?.user?.name
                      ? session.user.name.charAt(0).toUpperCase()
                      : <CgProfile color="white" />}
                  </div>
                )}
              </div>
              <h1>{userData?.name || session.user.name}</h1>
              <p>{session.user.email}</p>
              <div className={styles.btns}>
                {userData?.role === 'admin' && (
                  <Link legacyBehavior href="/admin/dashboard">
                    <a>Admin Panel</a>
                  </Link>
                )}
                <a href="/my_orders">Dashboard</a>
                <Link legacyBehavior href="/account_setting">
                  <a>Account Settings</a>
                </Link>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.login}>
          <Link legacyBehavior href={'/login'}>
            <a className={styles.link}>
              <VscAccount size="25px" />
              <p>Login</p>
            </a>
          </Link>
        </div>
      )}
    </>
  );
};

export default Login_Account;
