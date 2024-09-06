import React from 'react';
import { Trash2, Globe, Lock } from 'lucide-react';

const WishItem = ({ item, onTogglePublic, onDelete, showControls }) => {
    const formatDate = (dateValue) => {
        if (dateValue instanceof Date) {
            return dateValue.toLocaleDateString();
        } else if (typeof dateValue === 'object' && dateValue.toDate) {
            return dateValue.toDate().toLocaleDateString();
        } else if (typeof dateValue === 'string') {
            return new Date(dateValue).toLocaleDateString();
        }
        return 'Invalid Date';
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                <p className="text-indigo-600 font-bold mb-2">{item.price}円</p>
                {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mb-2 block">
                        商品リンク
                    </a>
                )}
                <p className="text-xs text-gray-400 mb-3">
                    {item.createdAt && formatDate(item.createdAt)}
                </p>
                {showControls && (
                    <div className="flex justify-between items-center">
                        <button onClick={() => onTogglePublic(item.id)} className="text-gray-500 hover:text-gray-700 transition-colors">
                            {item.isPublic ? <Globe size={20} /> : <Lock size={20} />}
                        </button>
                        <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-600 transition-colors">
                            <Trash2 size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishItem;
