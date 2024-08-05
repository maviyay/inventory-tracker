'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Paper, Grid, IconButton, Select, InputLabel, FormControl, MenuItem} from '@mui/material'
import { AddCircle, Category, RemoveCircle } from '@mui/icons-material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  modal: {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  },

container: {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundImage: 'url("/path/to/your/background-image.jpg")', // Replace with your background image path
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  gap: 4,
  color: '#fff', // Change text color for better contrast
},

paper: {
  padding: 2,
  textAlign: 'center',
  backgroundColor: '#fefefe', // Light background color for readability
  color: '#333', // Darker text color for contrast
},
itemContainer: {
  maxHeight: '400px',
  overflowY: 'auto',
  padding: 2,
},
gridItem: {
  padding: 2,
  display: 'flex',
  justifyContent: 'space-evenly',
  alignItems: 'center',
},
button: {
  backgroundColor: '#007bff', // Primary color for buttons
  color: '#fff',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
},
cancelButton: {
  color: '#dc3545', // Secondary color for cancel button
  borderColor: '#dc3545',
  '&:hover': {
    borderColor: '#c82333',
  },
},
select: {
  backgroundColor: '#fff', // Ensure select background is white
},


}

export default function Home() {
  // We'll add our component logic here
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState('')
    const [itemQuantity, setItemQuantity] = useState('')
    const [itemCategory, setItemCategory] = useState('')
    const [searchName, setSearchName] = useState('')
    const [searchCategory, setSearchCategory] = useState('')

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, 'inventory'))
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach((doc) => {
          inventoryList.push({ name: doc.id, ...doc.data() })
        })
        setInventory(inventoryList)
      }
      
      useEffect(() => {
        updateInventory()
      }, [])

      const addItem = async (item, new_quantity, food_category) => {
        const docRef = doc(collection(firestore, 'inventory'), item)
        const docSnap = await getDoc(docRef)
        const newQuantity = parseInt(new_quantity, 10)
        const foodCategory = food_category
        if (docSnap.exists()) {
          const { quantity } = docSnap.data()
          const temp_quantity = parseInt(quantity, 10)
          await setDoc(docRef, { quantity: temp_quantity + newQuantity, category: foodCategory})
        } else {
          await setDoc(docRef, { quantity: newQuantity, category: foodCategory})
        }
        await updateInventory()
      }
      
      const removeItem = async (item, food_category) => {
        const docRef = doc(collection(firestore, 'inventory'), item)
        const docSnap = await getDoc(docRef)
        const foodCategory = food_category
        if (docSnap.exists()) {
          const { quantity } = docSnap.data()
          if (quantity === 1) {
            await deleteDoc(docRef)
          } else {
            await setDoc(docRef, { quantity: quantity - 1, category: foodCategory})
          }
        }
        await updateInventory()
      }

      const handleOpen = () => setOpen(true)
        const handleClose = () => setOpen(false)

        const filteredInventory = inventory.filter(item => {
          const matchesSearch = searchName === '' || item.name.includes(searchName)
          const matchesCategory = searchCategory === '' || item.category === searchCategory
          return matchesSearch && matchesCategory
        })

        return (
            <Box sx={style.container}>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style.modal}>
                  <Typography id="modal-modal-title" variant="h6" component="h2" textAlign="center">
                    Add Item
                  </Typography>
                  <Stack width="100%" spacing={2}>
                    <TextField
                      id="item-name"
                      label="Item"
                      variant="standard"
                      fullWidth
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />
                    <TextField
                      id="item-quantity" 
                      label="Quantity"
                      variant="standard"
                      fullWidth
                      type='number'
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(e.target.value)}
                    />
                    <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                      id="outlined-basic" 
                      label="Category"
                      variant="outlined"
                      fullWidth
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                      sx={style.select}
                    >
                      <MenuItem value={'Dairy'}>Dairy</MenuItem>
                      <MenuItem value={'Fruit'}>Fruit</MenuItem>
                      <MenuItem value={'Veggie'}>Veggie</MenuItem>
                      <MenuItem value={'Meat'}>Meat</MenuItem>
                      <MenuItem value={'Seafood'}>Seafood</MenuItem>
                      <MenuItem value={'Drinks'}>Drinks</MenuItem>
                      <MenuItem value={'Bread'}>Bread</MenuItem>
                      <MenuItem value={'Other'}>Other</MenuItem>
            
                    </Select>
                    </FormControl>
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <Button
                        variant="contained"
                        color="primary"
                        sx={style.button}
                        onClick={() => {
                          addItem(itemName.toLowerCase(), itemQuantity, itemCategory)
                          setItemName('')
                          setItemQuantity('')
                          setItemCategory('')
                          handleClose()
                        }}
                      >
                      Add
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={style.cancelButton}
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Modal>
              <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<AddCircle />}>
                Add New Item
              </Button>
              <Box width="80%" maxWidth="800px">
        <Paper elevation={3} sx={style.paper}>
          <Typography variant="h4" gutterBottom>
            Inventory Items
          </Typography>
          <Stack width="100%" spacing={2}>
            <TextField
              id="search-field"
              label="Search"
              variant="standard"
              fullWidth
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <FormControl fullWidth>
                    <InputLabel id="filter-category-label">Filter Category</InputLabel>
                    <Select
                      id="filter-category" 
                      label="Filter Category"
                      variant="outlined"
                      overflowY={'auto'}
                      fullWidth
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      sx={style.select}
                    >
                      <MenuItem value=''><b><em>All</em></b></MenuItem>
                      <MenuItem value={'Dairy'}>Dairy</MenuItem>
                      <MenuItem value={'Fruit'}>Fruit</MenuItem>
                      <MenuItem value={'Veggie'}>Veggie</MenuItem>
                      <MenuItem value={'Meat'}>Meat</MenuItem>
                      <MenuItem value={'Seafood'}>Seafood</MenuItem>
                      <MenuItem value={'Drinks'}>Drinks</MenuItem>
                      <MenuItem value={'Bread'}>Bread</MenuItem>
                      <MenuItem value={'Other'}>Other</MenuItem>
            
                    </Select>
                    </FormControl>
          </Stack>
          <Box sx={style.itemContainer}>
          <Grid container spacing={2}>
            {filteredInventory.map(({ name, quantity, category }) => (
              <Grid item xs={12} key={name}>
                <Paper elevation={1} sx={style.gridItem}>
                  <Typography variant="body1">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" >
                  <Typography variant="body1">
                    Quantity: {quantity}
                  </Typography>
                  <Typography variant="body1">
                    Category: {category}
                  </Typography>
                  <IconButton color="secondary" onClick={() => addItem(name.toLowerCase(), 1, category)}>
                    <AddCircle />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => removeItem(name.toLowerCase(), category)}>
                    <RemoveCircle />
                  </IconButton>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
          </Box>
        </Paper>
      </Box>
            </Box>
          )
}

