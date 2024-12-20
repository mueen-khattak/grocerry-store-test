import styles from './Product_Details.module.css';

const Product_Details_Loading = () => {
  return (
    <div className={`${styles.main} ${styles.loaderContainer}`}>
      <div className={styles.left}>
        <div className={`${styles.mainimg} ${styles.pulse}`}></div>
        <div className={styles.moreimages}>
          {[...Array(5)].map((_, index) => (
            <div key={index} className={styles.fadeIn}></div>
          ))}
        </div>
      </div>
      <div className={`${styles.right} `}>
        <div className={`${styles.category} ${styles.moveRightLeft}`}></div>
        <div className={`${styles.title} ${styles.moveRightLeft}`}></div>
        <div className={`${styles.price} ${styles.moveRightLeft}`}></div>
        <div className={`${styles.description} ${styles.moveRightLeft}`}></div>
        <div className={styles.buttons}>
          <div className={`${styles.btn} ${styles.moveRightLeft}`}></div>
          <div className={`${styles.btn} ${styles.moveRightLeft}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Product_Details_Loading;
