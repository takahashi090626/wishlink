import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from '../../services/firebase';
import WishItem from './WishItem';
import AddWishItem from './AddWishItem';

export const WishList = () => {
  const [wishItems, setWishItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">マイウィッシュリスト</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition-colors"
        >
          {showAddForm ? 'キャンセル' : 'アイテムを追加'}
        </button>
      </div>
      {showAddForm && <AddWishItem setWishItems={setWishItems} setShowAddForm={setShowAddForm} />}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wishItems.map(item => (
          <WishItem key={item.id} item={item} setWishItems={setWishItems} />
        ))}
      </div>
    </div>
  );
};