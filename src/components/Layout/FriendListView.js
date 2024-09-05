import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from '../../services/firebase';

const FriendListView = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (auth.currentUser) {
        const q = query(collection(db, "friends"), where("userId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        setFriends(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };

    fetchFriends();
  }, []);

  return (
    <div>
      <h2>Friends List</h2>
      {friends.map(friend => (
        <div key={friend.id}>{friend.name}</div>
      ))}
    </div>
  );
};

export default FriendListView;