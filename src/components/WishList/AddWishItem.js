import React, { useState } from 'react';
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from '../../services/firebase';

const AddWishItem = ({ setWishItems, setShowAddForm }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.currentUser) {
      const newItem = {
        name,
        price: Number(price),
        url: url || null,
        createdAt: new Date().toISOString(),
        userId: auth.currentUser.uid,
        likes: 0
      };
      const docRef = await addDoc(collection(db, "wishItems"), newItem);
      setWishItems(prev => [...prev, { id: docRef.id, ...newItem }]);
      setName('');
      setPrice('');
      setUrl('');
      setShowAddForm(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-6">
      <div className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="アイテム名"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="価格"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="商品URL (オプション)"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        type="submit"
        className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
      >
        アイテムを追加
      </button>
    </form>
  );
};

export default AddWishItem;