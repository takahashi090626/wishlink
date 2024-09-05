import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../services/firebase';
import WishItem from '../components/WishList/WishItem';

const FriendDetailPage = () => {
  const { id } = useParams();
  const [friend, setFriend] = useState(null);
  const [friendWishItems, setFriendWishItems] = useState([]);

  useEffect(() => {
    const fetchFriendAndWishItems = async () => {
      const friendDoc = await getDoc(doc(db, "users", id));
      if (friendDoc.exists()) {
        setFriend({ id: friendDoc.id, ...friendDoc.data() });

        const q = query(collection(db, "wishItems"), where("userId", "==", id), where("isPublic", "==", true));
        const querySnapshot = await getDocs(q);
        setFriendWishItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };

    fetchFriendAndWishItems();
  }, [id]);

  if (!friend) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">{friend.name}のプロフィール</h1>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-6">
          <img src={friend.avatar} alt={friend.name} className="w-24 h-24 rounded-full border-4 border-indigo-200" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{friend.name}</h2>
            <p className="text-indigo-600">@{friend.userId}</p>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">ほしいものリスト</h2>
      <div className="space-y-4">
        {friendWishItems.map(item => (
          <WishItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FriendDetailPage;