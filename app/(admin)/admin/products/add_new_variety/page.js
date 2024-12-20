'use client'
import { useEffect, useState } from 'react'
import { ref, onValue, remove } from 'firebase/database' // Import remove for deletion
import { realtimeDb } from '@/app/(backend)/lib/firebase' // Firebase config
import { CiEdit } from 'react-icons/ci'
import { RiDeleteBin2Line } from 'react-icons/ri'
import style from '../../AdminPageGloble.module.css'
import styles from './newvariety.module.css'
import NewVarietyForm from './NewVarietyForm'

const AddNewVarietyPage = () => {
  const [variety, setVariety] = useState([])
  const [currentId, setCurrentId] = useState(null) // Track current edit
  const [currentVariety, setCurrentVariety] = useState('')

  // Fetch product Variety from Firebase when the component mounts
  useEffect(() => {
    const varietyRef = ref(realtimeDb, 'products_Variety/')
    onValue(varietyRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const VarietyArray = Object.keys(data).map((key, index) => ({
          id: key,
          sn: index + 1,
          name: data[key].name, // Change 'variety' to 'name' to match how you save it
        }))
        setVariety(VarietyArray)
      } else {
        setVariety([])
      }
    })
  }, [])

  // Handle delete
  const handleDeleteClick = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this Variety?')
    if (confirmed) {
      try {
        const productRef = ref(realtimeDb, `products_Variety/${id}`)
        await remove(productRef)
        alert('Product Variety deleted successfully!')
      } catch (error) {
        console.error('Error deleting product Variety:', error)
        alert('Failed to delete product Variety.')
      }
    }
  }

  // Handle edit
  const handleEditClick = (item) => {
    setCurrentId(item.id)
    setCurrentVariety(item.name)
  }

  // Clear the form after editing
  const clearEdit = () => {
    setCurrentId(null)
    setCurrentVariety('')
  }

  return (
    <div className={style.main}>
      <div className={styles.variety_container}>
        <div className={styles.variety_form}>
          <NewVarietyForm
            currentVariety={currentVariety}
            currentId={currentId}
            onEdit={clearEdit}
          />
        </div>

        <div className={styles.varietyList}>
          <div className={styles.header}>
            <h3>Variety</h3>
          </div>
          <div className={styles.title}>
            <h4 className={styles.SN}>SN</h4>
            <h4 className={styles.variety}>Variety</h4>
            <h4 className={styles.Action}>Action</h4>
          </div>

          <div className={styles.dataContainer}>
            {variety.length > 0 ? (
              variety.map((item) => (
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
              <p>No Variety available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddNewVarietyPage
