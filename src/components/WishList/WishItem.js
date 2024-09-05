import React from 'react';
import { Heart, Trash2, ExternalLink } from 'lucide-react';
import { updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../services/firebase';

const WishItem = ({ item, setWishItems }) => {
  const handleLike = async () => {
    const itemRef = doc(db, "wishItems", item.id);
    await updateDoc(itemRef, {
      likes: (item.likes || 0) + 1
    });
    setWishItems(prev => prev.map(i => i.id === item.id ? {...i, likes: (i.likes || 0) + 1} : i));
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, "wishItems", item.id));
    setWishItems(prev => prev.filter(i => i.id !== item.id));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow hover:shadow-lg">
      <div className="p-6">
        <h3 className="font-semibold text-xl mb-2 text-gray-800">{item.name}</h3>
        <p className="text-indigo-600 font-bold text-lg mb-3">{item.price.toLocaleString()}円</p>
        <p className="text-sm text-gray-500 mb-4">{new Date(item.createdAt).toLocaleDateString()}</p>
        <div className="flex justify-between items-center">
          <button onClick={handleLike} className="text-pink-500 hover:text-pink-600 transition-colors flex items-center">
            <Heart size={20} className="mr-1" fill={item.likes > 0 ? "currentColor" : "none"} />
            <span>{item.likes || 0}</span>
          </button>
          <div className="space-x-2">
            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">
                <ExternalLink size={20} />
              </a>
            )}
            <button onClick={handleDelete} className="text-red-500 hover:text-red-600 transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishItem;