import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db, auth } from '../../services/firebase';
import WishItem from '../WishList/WishItem';

const FriendsPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFriendsPosts = async () => {
      if (auth.currentUser) {
        // Get friend IDs
        const friendsQuery = query(collection(db, "friends"), where("userId", "==", auth.currentUser.uid));
        const friendsSnapshot = await getDocs(friendsQuery);
        const friendIds = friendsSnapshot.docs.map(doc => doc.data().friendId);

        if (friendIds.length === 0) {
          setPosts([]);
          return;
        }

        // Get public posts from friends
        const postsQuery = query(
          collection(db, "wishItems"),
          where("userId", "in", friendIds),
          where("isPublic", "==", true)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const postsData = await Promise.all(postsSnapshot.docs.map(async postDoc => {
          const postData = postDoc.data();
          const userDoc = await getDoc(doc(db, "users", postData.userId));
          const userData = userDoc.data();
          return { 
            id: postDoc.id, 
            ...postData, 
            userName: userData.userName,
            userAvatar: userData.avatar
          };
        }));
        setPosts(postsData);
      }
    };

    fetchFriendsPosts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">フレンドの投稿</h2>
      {posts.length > 0 ? (
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id} className="bg-white p-4 rounded-xl shadow">
              <div className="flex items-center mb-2">
                <img src={post.userAvatar || '/default-avatar.png'} alt={post.userName} className="w-10 h-10 rounded-full mr-2" />
                <span className="font-semibold">{post.userName}</span>
              </div>
              <WishItem item={post} />
            </li>
          ))}
        </ul>
      ) : (
        <p>フレンドの公開投稿はありません。</p>
      )}
    </div>
  );
};

export default FriendsPosts;