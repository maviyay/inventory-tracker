// firebaseRoutes.js
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'


export default async function handler(req, res) {
  if (req.method === 'GET')
  {
    const snapshot = await getDocs(collection(firestore, 'inventory'));
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    return res.status(200).json(inventoryList);
  }
  else if (req.method === 'POST') 
  {
    const { item, newQuantity, foodCategory } = req.body;
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + newQuantity, category: foodCategory });
    } else {
      await setDoc(docRef, { quantity: newQuantity, category: foodCategory });
    }
    return res.status(200).json({ message: 'Item added/updated successfully' });
  }
  else if (req.method === 'DELETE') 
  {
    const { item, food_category } = req.body;
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
        return res.status(200).json({ message: 'Item removed successfully' });
      } else {
        await setDoc(docRef, { quantity: quantity - 1, category: food_category})
        return res.status(200).json({ message: 'Item removed successfully' });
      }
    }
    else
    {
      return res.status(405).end();
    }
  }
}





















/*
export const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    return inventoryList
}

export const addItem = async (item, new_quantity, food_category) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    const newQuantity = parseInt(new_quantity, 10)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      const temp_quantity = parseInt(quantity, 10)
      await setDoc(docRef, { quantity: temp_quantity + newQuantity, category: food_category})
    } else {
      await setDoc(docRef, { quantity: newQuantity, category: food_category})
    }
}

export const removeItem = async (item, food_category) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1, category: food_category})
      }
    }
}
    */
