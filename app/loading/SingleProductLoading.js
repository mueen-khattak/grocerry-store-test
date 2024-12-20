
// components/Loading.js
import styles from './singleproductloading.module.css';

export default function SingleProductLoading() {
  return (
    <>
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
    </>
  );
}
