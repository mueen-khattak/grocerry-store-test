
'use client'
import React, { useState } from 'react'
import CategoryContainer from './CategoryContainer'
import styles from './sidebarcomponentsstyles/sidebar.module.css'
import VarietiesContainer from './VarietiesContainer'


const Sidebar = () => {


  return (
    <div className={styles.container}>
      <div>
        <h3
          className={styles.dropdownHeader}
        >
          Categories
        </h3>
          <div className={styles.dropdownContent}>
            <CategoryContainer />
          </div>
      </div>

      <div>
        <h3
          className={styles.dropdownHeader}
        >
          Varieties
        </h3>
          <div className={styles.dropdownContent}>
            <VarietiesContainer />
          </div>
      </div>

      <div>
        <h3
          className={styles.dropdownHeader}
        >
          Brand
        </h3>
          <div className={styles.dropdownContent}>
          </div>
      </div>
    </div>
  )
}

export default Sidebar
