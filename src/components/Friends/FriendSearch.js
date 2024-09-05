import React, { useState } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../services/firebase';

const FriendSearch = ({ onFriendFound }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = query(collection(db, "users"), where("userName", "==", searchTerm));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      onFriendFound({ id: userDoc.id, ...userDoc.data() });
    } else {
      alert('ユーザーが見つかりませんでした。');
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="ユーザーネームで検索"
        className="w-full px-3 py-2 border rounded-md"
      />
      <button
        type="submit"
        className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
      >
        検索
      </button>
    </form>
  );
};

export default FriendSearch;