'use client'; // Ensures this code runs on the client side

import ImageSlider from '@/app/(frontend)/components/ImageSlider';
import styles from '@/app/(frontend)/components/ComponentsStyles/page.module.css';
import Image from 'next/image';
import CategoryContainer from './components/CategoryContainer';
import Container from '@/app/(frontend)/components/Container';
import Footer from '@/app/(frontend)/components/Footer';

const PageClient = () => {
 
  return (
    <>
      <div className={styles.main_page}>
        <div className={styles.slider_container}>
          {/* <ImageSlider /> */}
        </div>
        <div className={styles.categories_box}>
          <CategoryContainer />
        </div>
        <div className={styles.ad_box}>
          <Image src={'/ad4.png'} alt={'ad'} width={250} height={200} />
          <h1>
            Deliver only in
            <br /> Rawalpindi and Islamabad
          </h1>
        </div>
        <div>
          <Container />
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default PageClient;
