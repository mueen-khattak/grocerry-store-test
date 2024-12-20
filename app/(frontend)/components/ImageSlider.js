"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import styles from './ComponentsStyles/ImageSlider.module.css'; // Import the CSS module


const ImageSlider = () => {
  return (
    <div className={styles.sliderContainer}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} ${styles.customBullet}" data-index="${index}"></span>`;
          },
        }}
        onSlideChange={(swiper) => {
          const bullets = document.querySelectorAll(`.${styles.customBullet}`);
          bullets.forEach(bullet => {
            bullet.classList.remove(styles.active);
          });
          const activeBullet = bullets[swiper.activeIndex];
          if (activeBullet) {
            activeBullet.classList.add(styles.active);
          }
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        className={styles.swiper}
      >
        {['/banner1.webp', '/banner2.webp', '/banner3.webp', '/banner4.webp', '/banner5.webp', '/banner6.webp', '/banner7.webp'].map((src, index) => (
          <SwiperSlide key={index}>
            <div className={styles.imageWrapper}>
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                layout="fill"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
