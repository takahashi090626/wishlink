import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getDoc, doc, onSnapshot } from "firebase/firestore";
import { db, auth } from '../../services/firebase';
import WishItem from '../WishList/WishItem';

const FriendsPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchFriendsPosts = async () => {
      // フレンドのIDを取得
      const friendsQuery = query(collection(db, "friends"), where("userId", "==", auth.currentUser.uid));
      const friendsSnapshot = await getDocs(friendsQuery);
      const friendIds = friendsSnapshot.docs.map(doc => doc.data().friendId);

      if (friendIds.length === 0) {
        setPosts([]);
        return;
      }

      // フレンドの公開投稿を取得
      const postsQuery = query(
        collection(db, "wishItems"),
        where("userId", "in", friendIds),
        where("isPublic", "==", true)
      );

      const unsubscribe = onSnapshot(postsQuery, async (snapshot) => {
        const postsData = await Promise.all(snapshot.docs.map(async postDoc => {
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
      });

      return () => unsubscribe();
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