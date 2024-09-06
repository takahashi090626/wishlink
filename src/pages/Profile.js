import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db, auth, storage } from '../services/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, Save, Edit } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [userName, setUserName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setUserName(data.userName);
          setAvatarUrl(data.avatar || '');
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (user) {
      const docRef = doc(db, "users", user.uid);
      let updateData = { userName: userName };

      if (avatarFile) {
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(avatarRef, avatarFile);
        const downloadURL = await getDownloadURL(avatarRef);
        updateData.avatar = downloadURL;
        setAvatarUrl(downloadURL);
      }

      await updateDoc(docRef, updateData);
      setProfile({ ...profile, ...updateData });
      setEditMode(false);
      setAvatarFile(null);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!profile) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <img 
              src={avatarUrl || '/default-avatar.png'} 
              alt="User Avatar" 
              className="w-32 h-32 rounded-full object-cover"
            />
            {editMode && (
              <button 
                onClick={() => fileInputRef.current.click()} 
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <Camera size={20} />
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>
          <div className="text-center">
            {editMode ? (
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="text-2xl font-bold text-gray-800 border-b-2 border-indigo-500 focus:outline-none text-center"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800">{profile.userName}</h2>
            )}
            <p className="text-indigo-600">@{profile.userId}</p>
          </div>
        </div>
        {editMode ? (
          <button 
            onClick={handleSave} 
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors mb-4 flex items-center justify-center"
          >
            <Save size={20} className="mr-2" />
            保存
          </button>
        ) : (
          <button 
            onClick={() => setEditMode(true)} 
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors mb-4 flex items-center justify-center"
          >
            <Edit size={20} className="mr-2" />
            プロフィールを編集
          </button>
        )}
        <button 
          onClick={handleLogout} 
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center"
        >
          <LogOut size={20} className="mr-2" />
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default Profile;