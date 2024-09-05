import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {isLogin ? <Login /> : <SignUp />}
        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            {isLogin ? "アカウントをお持ちでない方" : "既にアカウントをお持ちの方"}
          </button>
        </div>
      </div>
    </div>
  );
};