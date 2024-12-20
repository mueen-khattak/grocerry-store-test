'use client'
import { useEffect, useState } from 'react'
import { ref, onValue, remove } from 'firebase/database' // Import remove for deletion
import { realtimeDb } from '@/app/(backend)/lib/firebase' // Firebase config
import { CiEdit } from 'react-icons/ci'
import { RiDeleteBin2Line } from 'react-icons/ri'
import style from '../../AdminPageGloble.module.css'
import styles from './newname.module.css'
import NewNameForm from './NewNameForm'

const AddNewNamePage = () => {
  const [names, setNames] = useState([])
  const [currentId, setCurrentId] = useState(null) // Track current edit
  const [currentName, setCurrentName] = useState('')

  // Fetch product names from Firebase when the component mounts
  useEffect(() => {
    const namesRef = ref(realtimeDb, 'products_name/')
    onValue(namesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const namesArray = Object.keys(data).map((key, index) => ({
          id: key,
          sn: index + 1,
          name: data[key].name,
        }))
        setNames(namesArray)
      } else {
        setNames([])
      }
    })
  }, [])

  // Handle delete
  const handleDeleteClick = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this name?')
    if (confirmed) {
      try {
        const productRef = ref(realtimeDb, `products_name/${id}`)
        await remove(productRef)
        alert('Product name deleted successfully!')
      } catch (error) {
        console.error('Error deleting product name:', error)
        alert('Failed to delete product name.')
      }
    }
  }

  // Handle edit
  const handleEditClick = (item) => {
    setCurrentId(item.id)
    setCurrentName(item.name)
  }

  // Clear the form after editing
  const clearEdit = () => {
    setCurrentId(null)
    setCurrentName('')
  }

  return (
    <div className={style.main}>
      <div className={styles.name_container}>
        <div className={styles.name_form}>
          <NewNameForm
            currentName={currentName}
            currentId={currentId}
            onEdit={clearEdit}
          />
        </div>

        <div className={styles.nameList}>
          <div className={styles.header}>
            <h3>Names</h3>
          </div>
          <div className={styles.title}>
            <h4 className={styles.SN}>SN</h4>
            <h4 className={styles.Name}>Name</h4>
            <h4 className={styles.Action}>Action</h4>
          </div>

          <div className={styles.dataContainer}>
            {names.length > 0 ? (
              names.map((item) => (
                <div key={item.id} className={styles.data}>
                  <p className={styles.SN}>{item.sn}</p>
                  <p className={styles.Name}>{item.name}</p>
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
              <p>No names available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddNewNamePage
