'use client';

import { useState, useEffect } from 'react';
import {  ref, onValue } from 'firebase/database';
import { realtimeDb } from "@/app/(backend)/lib/firebase";
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from './Reviews.module.css';
import Image from 'next/image';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [popupImages, setPopupImages] = useState([]);
  const [avatarPopup, setAvatarPopup] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const ordersRef = ref(realtimeDb, 'orders');

    // Listen for real-time updates
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        let matchingReviews = [];
        Object.values(data).forEach(order => {
          if (order.cartItems) {
            order.cartItems.forEach(item => {
              if (item.id === productId && item.reviews) {
                matchingReviews = [...matchingReviews, item.reviews];
                if (!profile && order.user) {
                  setProfile(order.user);
                }
              }
            });
          }
        });
        setReviews(matchingReviews.flat());
      } else {
        console.warn("No data found in Firebase.");
        setReviews([]);
      }

      setIsLoading(false);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, [productId, profile]);

  const renderStars = (stars) => (
    <>
      {[...Array(5)].map((_, index) => (
        index < stars ? <FaStar key={index} color="rgb(42, 212, 0) " /> : <FaRegStar key={index} color="rgb(42, 212, 0) " />
      ))}
    </>
  );

  const handleImageClick = (images) => {
    setPopupImages(images);
  };

  const handleAvatarClick = (avatar) => {
    setAvatarPopup(avatar);
  };

  const closePopup = () => {
    setPopupImages([]);
    setAvatarPopup(null);
  };

  return (
    <div className={styles.reviews_container}>
      <h2 className={styles.title}>Product Reviews</h2>
      <div className={styles.reviewbox}>
        {isLoading ? (
          <p>Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className={styles.review}>
              <div className={styles.starsbox}>
                <div className={styles.stars}>
                  {renderStars(review.stars || 0)}
                </div>
                <p className={styles.date}>{review.date}</p>
              </div>
              <div className={styles.user_info}>
                <div
                  className={styles.avatar}
                  onClick={() =>
                    profile && profile.profileImage
                      ? handleAvatarClick(profile.profileImage)
                      : null
                  }
                >
                  {profile && profile.profileImage ? (
                    <Image
                      src={profile.profileImage}
                      alt={`${review.reviewer} Avatar`}
                      width={55}
                      height={40}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <span className={styles.avatarLetter}>
                      {review.reviewer[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className={styles.user_name}>{review.reviewer}</h3>
              </div>
              <p className={styles.review_text}>
                &quot;{review.text || "No Review Text"}&quot;
              </p>
              <div className={styles.image}>
                {review.images &&
                  review.images.map((image, idx) => (
                    <Image
                      key={idx}
                      src={image}
                      alt={`Review Image ${idx + 1}`}
                      width={110}
                      height={70}
                      className={styles.review_image}
                      onClick={() => handleImageClick(review.images)}
                    />
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p>No reviews available for this product.</p>
        )}
      </div>

      {/* Popup for Images */}
      {popupImages.length > 0 && (
        <div className={styles.popup_overlay} onClick={closePopup}>
          <div
            className={styles.popup_modal}
            onClick={(e) => e.stopPropagation()}
          >
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
            >
              {popupImages.map((image, idx) => (
                <SwiperSlide key={idx}>
                  <Image
                    src={image}
                    alt={`Popup Image ${idx + 1}`}
                    width={900}
                    height={600}
                    className={styles.popup_image}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <button className={styles.close_btn} onClick={closePopup}>
              <IoIosCloseCircleOutline size={30} color="red" />
            </button>
          </div>
        </div>
      )}

      {/* Popup for Avatar */}
      {avatarPopup && (
        <div className={styles.popup_overlay} onClick={closePopup}>
          <div
            className={styles.popup_modal}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={avatarPopup}
              alt="Avatar Popup"
              width={500}
              height={300}
              className={styles.popup_image}
            />
            <button className={styles.close_btn} onClick={closePopup}>
              <IoIosCloseCircleOutline size={30} color="red" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
