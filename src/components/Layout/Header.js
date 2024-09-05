import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { auth } from '../../services/firebase';
import { Home, Users, User, LogOut } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">WishLink</Link>
        {user && (
          <nav className="flex items-center space-x-4">
            <Link to="/" className="hover:text-indigo-200 transition-colors">
              <Home size={24} />
            </Link>
            <Link to="/friends" className="hover:text-indigo-200 transition-colors">
              <Users size={24} />
            </Link>
            <Link to="/profile" className="hover:text-indigo-200 transition-colors">
              <User size={24} />
            </Link>
            <button onClick={() => auth.signOut()} className="hover:text-indigo-200 transition-colors">
              <LogOut size={24} />
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;