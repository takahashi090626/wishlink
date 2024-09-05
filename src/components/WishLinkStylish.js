import React, { useState, useCallback } from 'react';
import { Gift, Users, Bell, PlusCircle, User, Search, LogOut, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AddWishItem from './WishList/AddWishItem';
import SearchAndFriendRequest from './Friends/SearchAndFriendRequest';
import NotificationCenter from './Notifications/NotificationCenter';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import FriendsList from './Friends/FriendsList';

export default function WishLinkStylish({ children, refreshWishList }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showAddItem, setShowAddItem] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showFriendsList, setShowFriendsList] = useState(false);
    const [showMenu, setShowMenu] = useState(false);  // メニュー表示用のstate

    const tabs = [
        { name: 'マイリスト', path: '/' },
        { name: 'タイムライン', path: '/friendspost' },
        { name: 'プロフィール', path: '/profile' },
    ];

    const handleAddItem = useCallback(() => {
        setShowAddItem(false);
        refreshWishList();
    }, [refreshWishList]);

    const handleLogout = useCallback(async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    }, [navigate]);

    return (
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen relative pb-16">
            <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-b-3xl shadow-lg flex justify-between items-center">
                <h1 className="text-3xl font-bold">wishlink</h1>
                <button onClick={() => setShowSearch(true)} className="text-white hover:text-indigo-200 transition-colors">
                    <Search size={24} />
                </button>
                <button onClick={() => setShowMenu(!showMenu)} className="text-white hover:text-indigo-200 transition-colors">
                    <Menu size={24} /> {/* ハンバーガーメニューアイコン */}
                </button>
            </header>

            <nav className="bg-white shadow-sm mt-4 mx-4 rounded-full">
                <ul className="flex justify-around">
                    {tabs.map((tab) => (
                        <li key={tab.name} className="flex-1">
                            <button
                                onClick={() => navigate(tab.path)}
                                className={`w-full py-3 px-4 rounded-full transition-all duration-300 ${
                                    location.pathname === tab.path
                                        ? 'bg-indigo-100 text-indigo-600 font-semibold'
                                        : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                {tab.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <main className="p-6">
                {children}
            </main>

            {/* ハンバーガーメニューのポップアップ */}
            {showMenu && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-4">
                    <div className="bg-white w-full max-w-xs rounded-lg shadow-lg p-6 mt-16">
                        <ul className="space-y-4">
                            <li><button onClick={() => navigate('/')} className="text-indigo-600 hover:text-indigo-800 flex items-center"><Gift size={24} className="mr-2" /> マイリスト</button></li>
                            <li><button onClick={() => setShowFriendsList(true)} className="text-indigo-600 hover:text-indigo-800 flex items-center"><Users size={24} className="mr-2" /> フレンドリスト</button></li>
                            <li><button onClick={() => setShowAddItem(true)} className="text-indigo-600 hover:text-indigo-800 flex items-center"><PlusCircle size={24} className="mr-2" /> 新しいアイテム作成</button></li>
                            <li><button onClick={() => setShowNotifications(true)} className="text-indigo-600 hover:text-indigo-800 flex items-center"><Bell size={24} className="mr-2" /> 通知</button></li>
                            <li><button onClick={() => navigate('/profile')} className="text-indigo-600 hover:text-indigo-800 flex items-center"><User size={24} className="mr-2" /> プロフィール</button></li>
                            <li><button onClick={handleLogout} className="text-red-600 hover:text-red-800 flex items-center"><LogOut size={24} className="mr-2" /> ログアウト</button></li>
                        </ul>
                        <button 
                            onClick={() => setShowMenu(false)} 
                            className="mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            )}

            {/* その他のモーダルやポップアップ */}
            {showAddItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">新しいアイテムを追加</h2>
                        <AddWishItem onAdd={handleAddItem} />
                        <button 
                            onClick={() => setShowAddItem(false)} 
                            className="mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            キャンセル
                        </button>
                    </div>
                </div>
            )}

            {showSearch && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">検索</h2>
                        <SearchAndFriendRequest onClose={() => setShowSearch(false)} />
                    </div>
                </div>
            )}

            {showFriendsList && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <FriendsList />
                        <button 
                            onClick={() => setShowFriendsList(false)} 
                            className="mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            )}

            {showNotifications && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <NotificationCenter />
                        <button 
                            onClick={() => setShowNotifications(false)} 
                            className="mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
