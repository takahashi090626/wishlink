import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from '../../services/firebase';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (auth.currentUser) {
        const q = query(collection(db, "friends"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const friendPromises = querySnapshot.docs.map(async (doc) => {
          const friendDoc = await getDocs(doc(db, "users", doc.data().friendId));
          return { id: friendDoc.id, ...friendDoc.data() };
        });
        const friendsData = await Promise.all(friendPromises);
        setFriends(friendsData);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">フレンド一覧</h2>
      <ul className="space-y-2">
        {friends.map(friend => (
          <li key={friend.id} className="bg-white p-2 rounded shadow">
            <p>{friend.userName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;