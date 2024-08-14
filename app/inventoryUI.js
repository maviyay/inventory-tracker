'use client'
import { auth } from '@/firebase'
import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Paper, Grid, IconButton, Select, InputLabel, FormControl, MenuItem} from '@mui/material'
import { AddCircle, RemoveCircle, LightbulbCircle } from '@mui/icons-material'
import { firestore } from '@/firebase'
import { signOut } from 'firebase/auth'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { getRecipeRecommendations } from './groq.js'

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

  modalRecipe: {
    position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  height: 450,
  overflowY: 'auto',
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
},

signOutButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#c82333',
    },
    borderRadius: '8px',
  },

container: {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundImage: 'url("https://dri.es/files/cache/blog/interests-cabinet-1280w.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  gap: 4,
  color: '#fff', // Change text color for better contrast
},

paper: {
  padding: 2,
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255)', // Light background color for readability
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
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
},
button: {
  backgroundColor: '#007bff', // Primary color for buttons
  color: '#fff',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
  borderRadius: '8px',
},
cancelButton: {
  color: '#dc3545', // Secondary color for cancel button
  borderColor: '#dc3545',
  '&:hover': {
    borderColor: '#c82333',
  },
  borderRadius: '8px',
},

iconButton: {
    color: '#007bff', // Same color as buttons for consistency
  },

}

export default function InventoryUI() {
  // We'll add our component logic here
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState('')
    const [itemQuantity, setItemQuantity] = useState('')
    const [itemCategory, setItemCategory] = useState('')
    const [searchName, setSearchName] = useState('')
    const [searchCategory, setSearchCategory] = useState('')
    const [recipeOpen, setRecipeOpen] = useState(false)
    const [recipes, setRecipes] = useState('')
    const [recipeIndex, setRecipeIndex] = useState(0)
    const [error, setError] = useState(null)


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

      const handleOpen = () => {
        setOpen(true)
      }
        const handleClose = () => setOpen(false)

      const handleGenerate = async () => {
        const recommendations = await getRecipeRecommendations (inventory);
        setRecipes(recommendations.choices[0]?.message?.content.split('%%%').filter(Boolean) || "No recommendations available.")
        setRecipeIndex(1)
      }

      const handleRecipeOpen = async () => {
        await handleGenerate()
        setRecipeOpen(true)
      }
      const handleRecipeClose = () => setRecipeOpen(false)

      const handleNextRecipe = () => {
        if (recipeIndex < recipes.length - 1) {
            setRecipeIndex(recipeIndex + 1)
        }
      }

      const handlePrevRecipe = () => {
          if (recipeIndex > 0) {
              setRecipeIndex(recipeIndex - 1)
          }
      }

      const handleSignOut = async () => {
        try {
          await signOut(auth);
          setError(null)
        } catch (err) {
          setError(err.message);
        }
      };

        const filteredInventory = inventory.filter(item => {
          const matchesSearch = searchName === '' || item.name.includes(searchName)
          const matchesCategory = searchCategory === '' || item.category === searchCategory
          return matchesSearch && matchesCategory
        })

        return (
            <>
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
                      required
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
                      defaultValue={1}
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
                        onClick={() => setError("Camera feature coming soon!")}
                      >
                      Camera
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={style.button}
                        onClick={() => {
                            if (itemName) {
                            addItem(itemName.toLowerCase(), itemQuantity, itemCategory);
                            setItemName('');
                            setItemQuantity('');
                            setItemCategory('');
                            setError(null);
                            handleClose();
                            } else {
                            setError("Input item name to add item");
                            }
                        }}
                        >
                        Add
                        </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={style.cancelButton}
                        onClick={ () => {
                            setError(null);
                            handleClose();
                        }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                    {error && (
                        <Typography sx={{ mt: 2, color: 'red', textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}
                  </Stack>
                </Box>
              </Modal>
              <Modal
                open={recipeOpen}
                onClose={handleRecipeClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style.modalRecipe}>
                  <Typography id="modal-modal-title" variant="h6" component="h2" textAlign="center">
                    Your Recipe Recommendations
                  </Typography>
                  <Stack width="100%" spacing={2} justifyContent={"space-between"} sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Typography variant="body1">
                            {recipes[recipeIndex]}
                        </Typography>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                            <Button
                                variant="contained"
                                color="primary"
                                sx={style.button}
                                onClick={handlePrevRecipe}
                                disabled={recipeIndex === 1}
                            >
                                Prev
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={style.button}
                                onClick={handleNextRecipe}
                                disabled={recipeIndex === recipes.length - 1}
                            >
                                Next
                            </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={style.button}
                        onClick={handleRecipeClose}
                      >
                        Done
                      </Button>
                      </Stack>
                  </Stack>
                </Box>
              </Modal>
              {//<Box width="80%" maxWidth="800px">}
}           
<Paper elevation={3} sx={style.paper}>
        <Typography variant="h3" component="h1" gutterBottom>
          PantryPro Tracker
        </Typography>
        <Stack spacing={2} direction="row" mr={2} ml={2}>
          <TextField
            label="Search Item"
            value={searchName}
            variant="standard"
            onChange={(e) => setSearchName(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="category-filter">Category</InputLabel>
            <Select
              labelId="category-filter"
              variant="standard"
              value={searchCategory}
              label="Category"
              onChange={(e) => setSearchCategory(e.target.value)}
            >
              <MenuItem value={''}>All</MenuItem>
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
            {filteredInventory.map((item, index) => (
              <Grid key={index} item xs={12}>
                <Paper elevation={1} sx={style.gridItem}>
                  <Stack direction="row" alignItems="center" gap={2}>
                    <Typography variant="body1">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Category: {item.category}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={2}>
                    <IconButton
                      aria-label="increase quantity"
                      onClick={() => addItem(item.name, 1, item.category)}
                      sx={style.iconButton}
                    >
                      <AddCircle />
                    </IconButton>
                    <Typography variant="body1">{item.quantity}</Typography>
                    <IconButton
                      aria-label="decrease quantity"
                      onClick={() => removeItem(item.name, item.category)}
                      sx={style.iconButton}
                    >
                      <RemoveCircle />
                    </IconButton>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Button variant="contained" sx={style.button} onClick={handleOpen} startIcon={<AddCircle />}>
            Add Item
          </Button>
          <Button variant="contained" sx={style.button} onClick={handleRecipeOpen} startIcon={<LightbulbCircle/>}>
            Get Recipe Recommendation
          </Button>
          <Button vairant="contained" sx={style.signOutButton} onClick={handleSignOut}>
            Sign Out
            </Button>
            {error && (
                    <Typography color="error" variant="body2">
                    {error}
                    </Typography>
                )}
        </Stack>
      </Paper> 
    </>
  )
}

