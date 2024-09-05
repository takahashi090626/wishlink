import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from '../../services/firebase';
import WishItem from './WishItem';
import AddWishItem from './AddWishItem';
import { useAuth } from '../../hooks/useAuth';
import { PlusCircle } from 'lucide-react';

export const WishList = () => {
  const [wishItems, setWishItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user: currentUser } = useAuth();

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

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">マイウィッシュリスト</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          {showAddForm ? 'キャンセル' : 'アイテムを追加'}
        </button>
      </div>
      {showAddForm && <AddWishItem setWishItems={setWishItems} setShowAddForm={setShowAddForm} currentUser={currentUser} />}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wishItems.map(item => (
          <WishItem key={item.id} item={item} setWishItems={setWishItems} currentUser={currentUser} />
        ))}
      </div>
    </div>
  );
};