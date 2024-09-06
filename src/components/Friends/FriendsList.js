import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db, auth } from '../../services/firebase';
import { Link } from 'react-router-dom';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (auth.currentUser) {
        const q = query(collection(db, "friends"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const friendPromises = querySnapshot.docs.map(async (document) => {
          const friendId = document.data().friendId;
          if (friendId) {
            const friendDocRef = doc(db, "users", friendId);
            const friendDocSnap = await getDoc(friendDocRef);
            if (friendDocSnap.exists()) {
              return { id: friendDocSnap.id, ...friendDocSnap.data() };
            }
          }
          return null;
        });
        const friendsData = (await Promise.all(friendPromises)).filter(friend => friend !== null);
        setFriends(friendsData);
      }
    };

    fetchFriends();
  }, []);
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">フレンド一覧</h2>
      {friends.length > 0 ? (
        <ul className="space-y-4">
          {friends.map(friend => (
            <li key={friend.id} className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4">
              <img src={friend.avatar || '/default-avatar.png'} alt={friend.userName} className="w-16 h-16 rounded-full border-2 border-indigo-200" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">{friend.userName}</h3>
                <p className="text-indigo-600">@{friend.userId}</p>
              </div>
              <Link
                to={`/friends/${friend.id}`}
                className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-indigo-700"
              >
                詳細
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>フレンドがいません。</p>
      )}
    </div>
  );
};

export default FriendsList;