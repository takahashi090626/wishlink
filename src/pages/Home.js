import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { db, auth } from '../services/firebase';
import WishItem from '../components/WishList/WishItem';
import AddWishItem from '../components/WishList/AddWishItem';

const Home = () => {
  const [wishItems, setWishItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchWishItems();
  }, []);

  const fetchWishItems = async () => {
    if (auth.currentUser) {
      const q = query(collection(db, "wishItems"), where("userId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      setWishItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  };

  const handleTogglePublic = async (itemId) => {
    const item = wishItems.find(item => item.id === itemId);
    if (item) {
      const itemRef = doc(db, "wishItems", itemId);
      await updateDoc(itemRef, { isPublic: !item.isPublic });
      fetchWishItems();
    }
  };

  const handleDelete = async (itemId) => {
    await deleteDoc(doc(db, "wishItems", itemId));
    fetchWishItems();
  };

  const handleAddItem = useCallback(async (newItem) => {
    const docRef = await addDoc(collection(db, "wishItems"), {
      ...newItem,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
      isPublic: false
    });
    setWishItems(prevItems => [{id: docRef.id, ...newItem}, ...prevItems]);
    setShowAddForm(false);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">マイリスト</h1>
      {showAddForm && <AddWishItem onAdd={handleAddItem} />}
      <div className="space-y-4">
        {wishItems.map(item => (
          <WishItem 
            key={item.id} 
            item={item} 
            onTogglePublic={handleTogglePublic}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;