import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from '../services/firebase';
import WishItem from '../components/WishList/WishItem';

const Home = () => {
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


  const togglePublic = async (id) => {
    const item = wishItems.find(item => item.id === id);
    await updateDoc(doc(db, "wishItems", id), { isPublic: !item.isPublic });
    setWishItems(wishItems.map(item => item.id === id ? { ...item, isPublic: !item.isPublic } : item));
  };

  const deleteWishItem = async (id) => {
    await deleteDoc(doc(db, "wishItems", id));
    setWishItems(wishItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">マイウィッシュリスト</h1>
      <div className="space-y-4">
        {wishItems.map(item => (
          <WishItem 
            key={item.id} 
            item={item} 
            onTogglePublic={togglePublic}
            onDelete={deleteWishItem}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;