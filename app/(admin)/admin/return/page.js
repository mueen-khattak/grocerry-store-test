'use client';

import { useState, useEffect } from 'react';
import { realtimeDb } from '@/app/(backend)/lib/firebase';
import { ref, query, orderByChild, equalTo, onValue , set} from 'firebase/database';
import styles from './returnPage.module.css';
import style from '../AdminPageGloble.module.css';
import Image from 'next/image';

const ReturnPage = () => {
  const [returnData, setReturnData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedReturnData, setSelectedReturnData] = useState(null);

  // Fetch user data dynamically based on returnData
  useEffect(() => {
    const fetchUserData = () => {
      const userEmails = returnData.map((item) => item.userEmail).filter(Boolean);

      userEmails.forEach((userEmail) => {
        const userRef = query(
          ref(realtimeDb, 'users'),
          orderByChild('email'),
          equalTo(userEmail)
        );

        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const userArray = Object.entries(userData).map(([id, user]) => ({
              id,
              ...user,
            }));
            setUserData((prev) => [...prev, ...userArray]);
          }
        });
      });
    };

    if (returnData.length > 0) fetchUserData();
  }, [returnData]);

  // Fetch return data
  useEffect(() => {
    const fetchReturnData = () => {
      const returnRef = ref(realtimeDb, 'returns');
      onValue(returnRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const returnArray = Object.entries(data).map(([id, returnItem]) => ({
            id,
            ...returnItem,
          }));
          setReturnData(returnArray);
        }
        setLoading(false);
      });
    };

    fetchReturnData();
  }, []);

  const handleApprove = (returnId) => {
    const returnRef = ref(realtimeDb, `returns/${returnId}/status`);
    set(returnRef, "Approved")
      .then(() => {
        alert("Order approved successfully!");
        setSelectedUser(null);
        setSelectedReturnData(null);
      })
      .catch((error) => {
        console.error("Error approving the order:", error);
        alert("Failed to approve the order. Please try again.");
      });
  };
  

  // Function to handle modal toggle
  const handleInfoClick = (user, returnItem) => {
    setSelectedUser(user);
    setSelectedReturnData(returnItem);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setSelectedReturnData(null);
  };

  if (loading) {
    return <p className={styles.loadingText}>Loading return data...</p>;
  }

  return (
    <div className={style.main}>
      <div className={styles.returnPageContainer}>
        <h1>Return Data</h1>
        {userData.length > 0 ? (
          <table className={styles.userDetailsTable}>
            <thead>
              <tr>
                <th>Order ID / Date</th>
                <th>Profile Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {returnData.map((item, index) => {
                const user = userData.find((user) => user.email === item.userEmail);
                return (
                  <tr key={index}>
                    <td>
                      {item.returnDate} / {item.returnTime}
                      <br />
                      {item.orderId}
                    </td>
                    <td>
                      {user?.profileImage && (
                        <Image
                          src={user.profileImage}
                          alt="Profile Image"
                          width={50}
                          height={30}
                        />
                      )}
                    </td>
                    <td>{user?.name || 'N/A'}</td>
                    <td>{user?.email || 'N/A'}</td>
                    <td>{user?.phone || 'N/A'}</td>
                    <td>{item.status}</td>
                    <td>
                      <button onClick={() => handleInfoClick(user, item)}>
                        Info
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No user data available.</p>
        )}

{selectedUser && selectedReturnData && (
  <div className={styles.modal}>
    <div className={styles.modalContent}>
      <span className={styles.close} onClick={closeModal}>
        &times;
      </span>
      <h2>User Details</h2>
      {selectedUser.profileImage && (
        <Image
          src={selectedUser.profileImage}
          alt="Profile Image"
          width={100}
          height={70}
        />
      )}
      <p>
        <strong>Name:</strong> {selectedUser.name}
      </p>
      <p>
        <strong>Email:</strong> {selectedUser.email}
      </p>
      <p>
        <strong>Phone:</strong> {selectedUser.phone}
      </p>
      <p>
        <strong>Status:</strong> {selectedReturnData.status}
      </p>
      <h3>Return Requests</h3>
      {selectedReturnData.returnRequests && selectedReturnData.returnRequests.length > 0 ? (
        selectedReturnData.returnRequests.map((request, idx) => (
          <div key={idx} className={styles.returnRequest}>
            <p>
              <strong>Product:</strong> {request.productName} - {request.variety}
            </p>
            <p>
              <strong>Reason:</strong>
            </p>
            <p>&quot;{request.reason}&quot;</p>
            {request.images && request.images.length > 0 && (
              <div className={styles.returnImages}>
                {request.images.map((image, idx) => (
                  <Image
                    key={idx}
                    src={image}
                    width={100}
                    height={100}
                    alt={`Return image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No return requests available.</p>
      )}
      <div className={styles.modalActions}>
        <button
          className={styles.approveButton}
          onClick={() => handleApprove(selectedReturnData.id)}
        >
          Approve
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default ReturnPage;
