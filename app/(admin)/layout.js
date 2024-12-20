// app/admin/layout.js
import AdminLayout from "./AdminLayout"
import styles from "./AdminLayout.module.css"


export default function Layout({ children }) {
  return (
    <div className="admin-panel">
      <main className={styles.admin_content}>
        <AdminLayout />
        <div className={styles.adminchildern}>
        {children}
        </div>
        </main>
     </div>
  );
}
