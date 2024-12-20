// components/Loading.js
import styles from './ButtonLoading.module.css';

export default function ButtonLoading() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
  );
}
