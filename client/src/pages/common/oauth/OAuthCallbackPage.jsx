// client/src/pages/common/oauth/OAuthCallbackPage.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const avatar = searchParams.get('avatar');

    if (token && email) {
      // Save user data to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', 'member'); // Default role, update as needed
      localStorage.setItem('currentUser', JSON.stringify({
        email,
        fullName: name,
        avatarUrl: avatar
      }));

      // Redirect to dashboard
      navigate('/member');
    } else {
      toast.error('Authentication failed. Please try again.');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 text-center bg-white rounded-lg shadow-md">
        <div className="w-16 h-16 mx-auto mb-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold text-gray-800">Signing you in...</h2>
        <p className="text-gray-600">Please wait while we log you in with your account.</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;