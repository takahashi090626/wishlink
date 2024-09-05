import React from 'react';
import { Link } from 'react-router-dom';

const FriendItem = ({ friend }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4">
      <img src={friend.avatar} alt={friend.name} className="w-16 h-16 rounded-full border-2 border-indigo-200" />
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-gray-800">{friend.name}</h3>
        <p className="text-indigo-600">@{friend.userId}</p>
      </div>
      <Link
        to={`/friends/${friend.id}`}
        className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-indigo-700"
      >
        詳細
      </Link>
    </div>
  );
};

export default FriendItem;