import { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const useWishList = () => {
  const [wishItems, setWishItems] = useState([]);

  useEffect(() => {
    const fetchWishItems = async () => {
      if (auth.currentUser) {
        const q = query(collection(db, "wishItems"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        setWishItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };

    fetchWishItems();
  }, []);

  const addWishItem = async (item) => {
    const docRef = await addDoc(collection(db, "wishItems"), {
      ...item,
      userId: auth.currentUser.uid,
      likes: 0,
    });
    setWishItems([...wishItems, { id: docRef.id, ...item, likes: 0 }]);
  };

  const updateWishItem = async (id, updates) => {
    await updateDoc(doc(db, "wishItems", id), updates);
    setWishItems(wishItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteWishItem = async (id) => {
    await deleteDoc(doc(db, "wishItems", id));
    setWishItems(wishItems.filter(item => item.id !== id));
  };

  return { wishItems, addWishItem, updateWishItem, deleteWishItem };
};