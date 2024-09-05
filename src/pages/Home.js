import React, { useState } from 'react';
import { WishList } from '../components/WishList';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <WishList />
    </div>
  );
};

export default Home;