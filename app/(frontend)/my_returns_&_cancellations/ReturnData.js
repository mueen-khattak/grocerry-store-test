// "use client";

// import { useEffect, useState } from "react";
// import { ref, get } from "firebase/database";
// import { realtimeDb } from "@/app/(backend)/lib/firebase"; // Import the realtimeDb instance
// import styles from "./ReturnData.module.css";

// const ReturnData = ({ onSendOrderIds }) => {
//   const [returnData, setReturnData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const returnRef = ref(realtimeDb, "returns"); // Reference to the "returns" node
//         const snapshot = await get(returnRef);
//         if (snapshot.exists()) {
//           const data = [];
//           snapshot.forEach((childSnapshot) => {
//             const returnItem = childSnapshot.val();
//             data.push({ id: childSnapshot.key, ...returnItem });
//           });
//           setReturnData(data);

//           // Extract order IDs and send them to the parent component
//           const orderIds = data.map((item) => item.orderId);
//           if (onSendOrderIds) {
//             onSendOrderIds(orderIds);
//           }
//         } else {
//           console.log("No data available");
//         }
//       } catch (error) {
//         console.error("Error fetching return data from Realtime DB: ", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [onSendOrderIds]);

//   if (loading) {
//     return <div className={styles.loader}>Loading...</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.heading}>Return Requests</h1>
//       {returnData.map((returnItem) => (
//         <div key={returnItem.id} className={styles.card}>
//           <p>
//             {returnItem.returnDate} - {returnItem.returnTime}
//           </p>
//           <h3>Order ID <br></br> {returnItem.orderId}</h3>
//           <p>{returnItem.status}</p>
//           {returnItem.returnRequests.map((request, index) => (
//             <div key={index} className={styles.request}>
//               <img
//                 src={request.images[0]}
//                 alt={request.productName}
//                 className={styles.image}
//               />
//               <p>
//                 {request.productName} - {request.variety}
//               </p>
//               <hr></hr>
//                 <p>
//                 <strong>Reason</strong> <br></br>"{request.reason}"
//               </p>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ReturnData;

'use client'

import React, { useEffect, useState } from 'react'
import { ref, get } from 'firebase/database'
import { realtimeDb } from '@/app/(backend)/lib/firebase'
import styles from './ReturnData.module.css'
import Image from 'next/image'

const ReturnData = ({ onSendOrderIds }) => {
  const [returnData, setReturnData] = useState([])
  const [loading, setLoading] = useState(true)

  const statusSteps = [
    'Requested',
    'Approved',
    'Processing',
    'On The Way',
    'Replaced',
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const returnRef = ref(realtimeDb, 'returns') // Reference to the "returns" node
        const snapshot = await get(returnRef)
        if (snapshot.exists()) {
          const data = []
          snapshot.forEach((childSnapshot) => {
            const returnItem = childSnapshot.val()
            data.push({ id: childSnapshot.key, ...returnItem })
          })
          setReturnData(data)

          // Extract order IDs and send them to the parent component
          const orderIds = data.map((item) => item.orderId)
          if (onSendOrderIds) {
            onSendOrderIds(orderIds)
          }
        } else {
          console.log('No data available')
        }
      } catch (error) {
        console.error('Error fetching return data from Realtime DB: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [onSendOrderIds])

  const formatTime = (time) => {
    const date = new Date(`1970-01-01T${time}Z`) // Create a date object from the time string (assuming time is in 24-hour format)

    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'

    // Convert to 12-hour format
    hours = hours % 12
    hours = hours ? hours : 12 // Handle 0 hours as 12 (midnight)
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

    return `${hours}:${formattedMinutes} ${ampm}`
  }

  if (loading) {
    return <div className={styles.loader}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Return Requests</h1>
      {returnData.map((returnItem) => {
        const currentStepIndex = statusSteps.indexOf(returnItem.status) // Determine the current step index

        return (
          <div key={returnItem.id} className={styles.card}>
            <p>
              {returnItem.returnDate} - {formatTime(returnItem.returnTime)}
            </p>

            <h3>
              Order ID <br /> {returnItem.orderId}
            </h3>

            {/* Display status steps */}
            <div className={styles.trackingContainer}>
              {statusSteps.map((step, stepIndex) => (
                <React.Fragment key={stepIndex}>
                  <div
                    className={`${styles.trackingStep} ${
                      stepIndex <= currentStepIndex ? styles.activeStep : ''
                    }`}
                  >
                    {step}
                  </div>
                  {stepIndex < statusSteps.length - 1 && (
                    <div
                      className={`${styles.stepConnector} ${
                        stepIndex < currentStepIndex
                          ? styles.activeConnector
                          : ''
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {returnItem.returnRequests.map((request, index) => (
              <div key={index} className={styles.request}>
                <Image
                  width={100}
                  height={100}
                  src={request.images[0]}
                  alt={request.productName}
                  className={styles.image}
                />
                <p>
                  {request.productName} - {request.variety}
                </p>
                <hr />
                <p>
                  <strong>Reason</strong> <br /> &quot;{request.reason}&quot;
                </p>
                {/* <hr /> */}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default ReturnData
