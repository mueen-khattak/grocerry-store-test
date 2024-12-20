'use client'
import { useEffect, useState } from 'react'
import { ref, onValue, remove } from 'firebase/database' // Import remove for deletion
import { realtimeDb } from '@/app/(backend)/lib/firebase' // Firebase config
import { CiEdit } from 'react-icons/ci'
import { RiDeleteBin2Line } from 'react-icons/ri'
import style from '../../AdminPageGloble.module.css'
import styles from './NameVariety.module.css'
import NameVarietyForm from './NameVarietyForm'

const NameVarietyPage = () => {
  const [namevariety, setNameVariety] = useState([])
  const [currentId, setCurrentId] = useState(null) // Track current edit
  const [currentNameVariety, setCurrentNameVariety] = useState('')

  // Fetch product Name Variety from Firebase when the component mounts
  useEffect(() => {
    const namevarietyRef = ref(realtimeDb, 'products_Name_Variety/')
    onValue(namevarietyRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const NameVarietyArray = Object.keys(data).map((key, index) => ({
          id: key,
          sn: index + 1,
          name: data[key].name, // Change 'variety' to 'name' to match how you save it
        }))
        setNameVariety(NameVarietyArray)
      } else {
        setNameVariety([])
      }
    })
  }, [])

  // Handle delete
  const handleDeleteClick = async (id) => {
    const confirmed = confirm(
      'Are you sure you want to delete this Name Variety?'
    )
    if (confirmed) {
      try {
        const productRef = ref(realtimeDb, `products_Name_Variety/${id}`)
        await remove(productRef)
        alert('Product Name Variety deleted successfully!')
      } catch (error) {
        console.error('Error deleting product Name Variety:', error)
        alert('Failed to delete product Name Variety.')
      }
    }
  }

  // Handle edit
  const handleEditClick = (item) => {
    setCurrentId(item.id)
    setCurrentNameVariety(item.name)
  }

  // Clear the form after editing
  const clearEdit = () => {
    setCurrentId(null)
    setCurrentNameVariety('')
  }

  return (
    <div className={style.main}>
      <div className={styles.variety_container}>
        <div className={styles.variety_form}>
          <NameVarietyForm
            currentNameVariety={currentNameVariety}
            currentId={currentId}
            onEdit={clearEdit}
          />
        </div>

        <div className={styles.varietyList}>
          <div className={styles.header}>
            <h3>Name Variety</h3>
          </div>
          <div className={styles.title}>
            <h4 className={styles.SN}>SN</h4>
            <h4 className={styles.variety}>Name Variety</h4>
            <h4 className={styles.Action}>Action</h4>
          </div>

          <div className={styles.dataContainer}>
            {namevariety.length > 0 ? (
              namevariety.map((item) => (
                <div key={item.id} className={styles.data}>
                  <p className={styles.SN}>{item.sn}</p>
                  <p className={styles.variety}>{item.name}</p>
                  <div className={styles.Action}>
                    <span onClick={() => handleEditClick(item)}>
                      <CiEdit size={25} />
                    </span>
                    <span onClick={() => handleDeleteClick(item.id)}>
                      <RiDeleteBin2Line size={25} color="red" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No Name Variety available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NameVarietyPage
