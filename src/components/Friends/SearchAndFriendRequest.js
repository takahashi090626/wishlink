import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, getDoc, doc } from "firebase/firestore";
import { db, auth } from '../../services/firebase';

const SearchAndFriendRequest = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      if (!auth.currentUser) return;

      // フレンドリストを取得
      const friendsQuery = query(collection(db, "friends"), where("userId", "==", auth.currentUser.uid));
      const friendsSnapshot = await getDocs(friendsQuery);
      setFriends(friendsSnapshot.docs.map(doc => doc.data().friendId));

      // 保留中のリクエストを取得
      const requestsQuery = query(
        collection(db, "friendRequests"),
        where("senderId", "==", auth.currentUser.uid),
        where("status", "==", "pending")
      );
      const requestsSnapshot = await getDocs(requestsQuery);
      setPendingRequests(requestsSnapshot.docs.map(doc => doc.data().receiverId));
    };

    fetchFriendsAndRequests();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = query(collection(db, "users"), where("userName", ">=", searchTerm), where("userName", "<=", searchTerm + '\uf8ff'));
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => user.id !== auth.currentUser.uid);
    setSearchResults(results);
  };

  const sendFriendRequest = async (userId, userName) => {
    if (friends.includes(userId)) {
      alert('既にフレンドです');
      return;
    }

    if (pendingRequests.includes(userId)) {
      alert('既にフレンドリクエストを送信済みです');
      return;
    }

    try {
      await addDoc(collection(db, "friendRequests"), {
        senderId: auth.currentUser.uid,
        receiverId: userId,
        status: 'pending',
        createdAt: new Date()
      });

      const senderDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const senderData = senderDoc.data();

      await addDoc(collection(db, "notifications"), {
        receiverId: userId,
        senderId: auth.currentUser.uid,
        content: `${senderData.userName}さんからフレンド申請が届いています。`,
        createdAt: new Date(),
        read: false,
        type: 'friendRequest'
      });

      setPendingRequests([...pendingRequests, userId]);
      alert('フレンド申請を送信しました');
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert('フレンド申請の送信に失敗しました');
    }
  };

  return (
    <div>
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

      {searchResults.length > 0 && (
        <ul className="space-y-2">
          {searchResults.map(user => (
            <li key={user.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{user.userName}</span>
              <button
                onClick={() => sendFriendRequest(user.id, user.userName)}
                className="bg-indigo-600 text-white py-1 px-2 rounded text-sm hover:bg-indigo-700 transition-colors"
              >
                フレンド申請
              </button>
            </li>
          ))}
        </ul>
      )}

      <button 
        onClick={onClose} 
        className="mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
      >
        閉じる
      </button>
    </div>
  );
};

export default SearchAndFriendRequest;