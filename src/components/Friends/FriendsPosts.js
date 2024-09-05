import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from '../../services/firebase';

const FriendsPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFriendsPosts = async () => {
      if (auth.currentUser) {
        // フレンドのIDを取得
        const friendsQuery = query(collection(db, "friends"), where("userId", "==", auth.currentUser.uid));
        const friendsSnapshot = await getDocs(friendsQuery);
        const friendIds = friendsSnapshot.docs.map(doc => doc.data().friendId);

        // フレンドの公開投稿を取得
        const postsQuery = query(
          collection(db, "wishItems"),
          where("userId", "in", friendIds),
          where("isPublic", "==", true)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
      }
    };

    fetchFriendsPosts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">フレンドの投稿</h2>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold text-lg">{post.name}</h3>
            <p className="text-gray-600">{post.price}円</p>
            <p className="text-sm text-gray-500">{new Date(post.createdAt.toDate()).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsPosts;