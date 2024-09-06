// NotificationCenter.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, addDoc, getDocs, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from '../../services/firebase';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("receiverId", "==", auth.currentUser.uid),
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notificationsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notificationsList);
    });

    return () => unsubscribe();
  }, []);

  const handleFriendRequest = async (notificationId, senderId, accept) => {
    try {
      if (accept) {
        // フレンドリストに追加 (双方向の関係を作成)
        await setDoc(doc(db, "friends", `${auth.currentUser.uid}_${senderId}`), {
          userId: auth.currentUser.uid,
          friendId: senderId
        });
        await setDoc(doc(db, "friends", `${senderId}_${auth.currentUser.uid}`), {
          userId: senderId,
          friendId: auth.currentUser.uid
        });

        // フレンドリクエストのステータスを 'accepted' に更新
        const requestQuery = query(
          collection(db, "friendRequests"),
          where("senderId", "==", senderId),
          where("receiverId", "==", auth.currentUser.uid)
        );
        const requestSnapshot = await getDocs(requestQuery);
        if (!requestSnapshot.empty) {
          const requestDoc = requestSnapshot.docs[0];
          await updateDoc(doc(db, "friendRequests", requestDoc.id), { status: 'accepted' });
        }

        // 送信者に通知を送る
        const currentUserDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const currentUserData = currentUserDoc.data();
        await addDoc(collection(db, "notifications"), {
          receiverId: senderId,
          senderId: auth.currentUser.uid,
          content: `${currentUserData.userName}さんがフレンド申請を承認しました。`,
          createdAt: new Date(),
          read: false,
          type: 'friendRequestAccepted'
        });
      } else {
        // フレンドリクエストを削除
        const requestQuery = query(
          collection(db, "friendRequests"),
          where("senderId", "==", senderId),
          where("receiverId", "==", auth.currentUser.uid)
        );
        const requestSnapshot = await getDocs(requestQuery);
        if (!requestSnapshot.empty) {
          const requestDoc = requestSnapshot.docs[0];
          await deleteDoc(doc(db, "friendRequests", requestDoc.id));
        }
      }

      // 通知を削除
      await deleteDoc(doc(db, "notifications", notificationId));

      // 通知リストを更新
      setNotifications(notifications.filter(notif => notif.id !== notificationId));

    } catch (error) {
      console.error("Error handling friend request:", error);
      alert('フレンドリクエストの処理中にエラーが発生しました');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">通知</h2>
      {notifications.length === 0 ? (
        <p>新しい通知はありません</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map(notification => (
            <li key={notification.id} className="bg-gray-100 p-2 rounded">
              <p>{notification.content}</p>
              {notification.type === 'friendRequest' && (
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleFriendRequest(notification.id, notification.senderId, true)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    許可
                  </button>
                  <button
                    onClick={() => handleFriendRequest(notification.id, notification.senderId, false)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    拒否
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationCenter;