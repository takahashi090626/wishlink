import React, { useState } from 'react';
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from '../../services/firebase';

const AddWishItem = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [url, setUrl] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newItem = {
      name,
      price: Number(price),
      url: url || null,
      isPublic,
      userId: auth.currentUser.uid,
      createdAt: new Date().toISOString()  // ISO文字列として保存
    };
    const docRef = await addDoc(collection(db, "wishItems"), newItem);
    onAdd({ id: docRef.id, ...newItem });
    setName('');
    setPrice('');
    setUrl('');
    setIsPublic(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="isPublic">公開する</label>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
      >
        アイテムを追加
      </button>
    </form>
  );
};

export default AddWishItem;