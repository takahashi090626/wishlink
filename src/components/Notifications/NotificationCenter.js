import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db, auth } from '../../services/firebase';
import { getDocs } from "firebase/firestore";


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
    if (accept) {
      // フレンドリストに追加
      await addDoc(collection(db, "friends"), {
        userId: auth.currentUser.uid,
        friendId: senderId
      });
    }

    // 通知を削除
    await deleteDoc(doc(db, "notifications", notificationId));

    // フレンドリクエストを更新または削除
    const requestQuery = query(
      collection(db, "friendRequests"),
      where("senderId", "==", senderId),
      where("receiverId", "==", auth.currentUser.uid)
    );
    const requestSnapshot = await getDocs(requestQuery);
    if (!requestSnapshot.empty) {
      const requestDoc = requestSnapshot.docs[0];
      if (accept) {
        await updateDoc(doc(db, "friendRequests", requestDoc.id), { status: 'accepted' });
      } else {
        await deleteDoc(doc(db, "friendRequests", requestDoc.id));
      }
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