'use client'
import { useEffect, useState } from 'react'
import { readDataFromRealtimeDB, deleteDataFromRealtimeDB } from '@/app/(backend)/lib/firebaseUtils' // Import delete function
import Image from 'next/image'
import style from '../../AdminPageGloble.module.css'
import styles from './brand.module.css'
import AddBrandForm from './BrandForm'
import { CiEdit } from 'react-icons/ci'
import { RiDeleteBin2Line } from 'react-icons/ri'

const BrandsPage = () => {
  const [brands, setBrands] = useState([])
  const [selectedBrand, setSelectedBrand] = useState(null) // State to hold the brand to edit

  // Function to fetch brands from the database
  const fetchBrands = async () => {
    try {
      const data = await readDataFromRealtimeDB('brands/')
      if (data) {
        const brandsArray = Object.keys(data).map((key, index) => ({
          id: key,
          sn: index + 1,
          name: data[key].name,
          img: data[key].imageUrl,
        }))
        setBrands(brandsArray)
      }
    } catch (error) {
      console.error('Error fetching Brands:', error)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const handleEditClick = (brand) => {
    setSelectedBrand(brand) // Set the selected brand for editing
  }

  const handleDeleteClick = async (brandId) => {
    if (confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteDataFromRealtimeDB(`brands/${brandId}`) // Call the delete function
        await fetchBrands() // Refresh brand list after deletion
        alert('Brand deleted successfully!')
      } catch (error) {
        console.error('Error deleting brand:', error)
        alert('Failed to delete brand. Please try again.')
      }
    }
  }

  return (
    <div className={style.main}>
      <div className={styles.brand_container}>
        <div className={styles.brand_form}>
          {/* Pass the selectedBrand and setBrands as props to AddBrandForm */}
          <AddBrandForm
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            fetchBrands={fetchBrands} // Pass the fetch function
          />
        </div>

        <div className={styles.brandList}>
          <div className={styles.header}>
            <h3>Brands</h3>
          </div>
          <div className={styles.title}>
            <h4 className={styles.SN}>SN</h4>
            <h4 className={styles.Image}>Image</h4>
            <h4 className={styles.Name}>Brand</h4>
            <h4 className={styles.Action}>Action</h4>
          </div>

          <div className={styles.dataContainer}>
            {brands.length > 0 ? (
              brands.map((brand) => (
                <div key={brand.id} className={styles.data}>
                  <p className={styles.SN}>{brand.sn}</p>
                  <div className={styles.Image}>
                    <Image
                      src={brand.img}
                      alt={brand.name}
                      width={70}
                      height={50}
                    />
                  </div>
                  <p className={styles.Name}>{brand.name}</p>
                  <div className={styles.Action}>
                    <span onClick={() => handleEditClick(brand)}>
                      <CiEdit size={25} />
                    </span>
                    <span onClick={() => handleDeleteClick(brand.id)}>
                      <RiDeleteBin2Line size={25} color="red" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No brands available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrandsPage
