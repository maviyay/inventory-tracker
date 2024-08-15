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
import { NextResponse } from 'next/server';


export async function GET() {
  const snapshot = await getDocs(collection(firestore, 'inventory'));
  const inventoryList = [];
  snapshot.forEach((doc) => {
    inventoryList.push({ name: doc.id, ...doc.data() });
  });
  return NextResponse.json(inventoryList);
}

export async function POST(request) 
{
  const { item, newQuantity, foodCategory } = await request.json();
  const docRef = doc(collection(firestore, 'inventory'), item);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const { quantity } = docSnap.data();
    await setDoc(docRef, { quantity: quantity + newQuantity, category: foodCategory });
  } else {
    await setDoc(docRef, { quantity: newQuantity, category: foodCategory });
  }
  return NextResponse.json({ message: 'Item added/updated successfully' });
}

export async function DELETE(request) {
  const { item, food_category } = await request.json();
  const docRef = doc(collection(firestore, 'inventory'), item);
  const docSnap = await getDoc(docRef)
  
  if (docSnap.exists()) {
    const { quantity } = docSnap.data()
    if (quantity === 1) {
      await deleteDoc(docRef)
      return NextResponse.json({ message: 'Item removed successfully' });
      } else {
        await setDoc(docRef, { quantity: quantity - 1, category: food_category})
        return NextResponse.json({ message: 'Item removed successfully' });
      }
  }
  else
  {
    return NextResponse.status(405).end();
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
