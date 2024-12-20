"use client";

import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { realtimeDb } from "@/app/(backend)/lib/firebase";
import styles from "./ReplacedCompleted.module.css"; // Import the CSS file
import Image from "next/image";

const ReplacedCompleted = () => {
  const [replacedOrders, setReplacedOrders] = useState([]); // State to store filtered orders
  const [loading, setLoading] = useState(true); // Loading state
  
  const statusSteps = ["Requested", "Approved", "Processing", "On The Way", "Replaced"];


  useEffect(() => {
    // Fetch orders from the Firebase database
    const fetchOrders = async () => {
      try {
        const ordersRef = ref(realtimeDb, "returns"); // Path to the orders data
        const snapshot = await get(ordersRef);

        if (snapshot.exists()) {
          const orderData = snapshot.val();
          // Filter orders where the return status is "Replaced"
          const filteredOrders = Object.values(orderData).filter(
            (order) => order.status === "Replaced"
          );

          setReplacedOrders(filteredOrders); // Update state with filtered orders
        } else {
          setReplacedOrders([]); // No data available
        }
      } catch (error) {
        console.error("Error fetching orders: ", error);
        setReplacedOrders([]); // Set to empty if there's an error
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchOrders();
  }, []); // Empty dependency array to run effect only once

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
    return <div className={styles.any}>Loading...</div>; // Apply className here
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Return&apos;s Completed</h1>
      {replacedOrders.map((returnItem) => {
        const currentStepIndex = statusSteps.indexOf(returnItem.status); // Determine the current step index

        return (
          <div key={returnItem.id} className={styles.card}>
            <p>Return Date and Time</p>
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
                      stepIndex <= currentStepIndex ? styles.activeStep : ""
                    }`}
                  >
                    {step}
                  </div>
                  {stepIndex < statusSteps.length - 1 && (
                    <div
                      className={`${styles.stepConnector} ${
                        stepIndex < currentStepIndex ? styles.activeConnector : ""
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
        );
      })}
    </div>
  );
};

export default ReplacedCompleted;
