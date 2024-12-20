// components/Loading.js
import Navbar from '../(frontend)/components/Navbar'
import DashboardLayout from '../(frontend)/UserComponents/DashboardLayout'
import styles from './PageLoading.module.css'
// import style from '../UserGloblePage.module.css'
export default function PageLoading() {
  return (
    <>
      <DashboardLayout />
      {/* <Navbar /> */}
      {/* <div className={style.main}> */}
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        {/* </div> */}
      </div>
    </>
  )
}
