import React from 'react';
import WishItem from '../components/WishList/WishItem';

const Home = ({ wishList, onTogglePublic, onDeleteItem }) => {
    if (!wishList || wishList.length === 0) {
        return <div>まだアイテムがありません。新しいアイテムを追加してください。</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">マイリスト</h1>
            <div className="space-y-4">
                {wishList.map(item => (
                    <WishItem 
                        key={item.id} 
                        item={item} 
                        onTogglePublic={onTogglePublic}
                        onDelete={onDeleteItem}
                        showControls={true}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;