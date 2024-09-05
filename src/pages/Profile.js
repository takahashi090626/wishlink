import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
          setUserName(docSnap.data().userName);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { userName: userName });
      setProfile({ ...profile, userName: userName });
      setEditMode(false);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-4">
          <img src={profile.avatar} alt="User Avatar" className="w-20 h-20 rounded-full" />
          <div>
            {editMode ? (
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="text-xl font-bold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800">{profile.userName}</h2>
            )}
            <p className="text-indigo-600">@{profile.userId}</p>
          </div>
        </div>
        {editMode ? (
          <button onClick={handleSave} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
            保存
          </button>
        ) : (
          <button onClick={() => setEditMode(true)} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
            プロフィールを編集
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;