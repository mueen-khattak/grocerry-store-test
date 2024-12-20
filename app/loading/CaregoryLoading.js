import styles from './CategoryLoading.module.css';

export default function CategoryLoading() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.box}>
        {[...Array(7)].map((_, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.textbox}>
              <div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
