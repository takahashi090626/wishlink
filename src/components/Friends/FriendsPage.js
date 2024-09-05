import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from '../services/firebase';
import FriendItem from '../components/Friends/FriendItem';
import FriendSearch from '../components/Friends/FriendSearch';

const FriendsPage = () => {
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

  const handleFriendFound = async (user) => {
    if (user.id === auth.currentUser.uid) {
      alert('自分自身をフレンドに追加することはできません。');
      return;
    }
    if (friends.some(friend => friend.id === user.id)) {
      alert('このユーザーは既にフレンドです。');
      return;
    }
    await addDoc(collection(db, "friends"), {
      userId: auth.currentUser.uid,
      friendId: user.id
    });
    setFriends([...friends, user]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">フレンド</h1>
      <FriendSearch onFriendFound={handleFriendFound} />
      <div className="space-y-4">
        {friends.map(friend => (
          <FriendItem key={friend.id} friend={friend} />
        ))}
      </div>
    </div>
  );
};

export default FriendsPage;