import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMemberById } from '../../../services/admin/member/memberService';

const MemberDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMember();
  }, [id]);

  const loadMember = async () => {
    try {
      setLoading(true);
      const response = await getMemberById(id);
      if (response.success) {
        setMember(response.member);
      } else {
        setError(response.message || 'Unable to load member information');
      }
    } catch (err) {
      console.error('Error loading member:', err);
      setError('An error occurred while loading member information');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusBadge = (isActive) => (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
      isActive 
        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' 
        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
    }`}>
      {isActive ? 'Active' : 'Locked'}
    </span>
  );

  const getRoleBadge = (role) => {
    const roleColors = {
      ADMIN: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
      MEMBER: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${roleColors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
        {role}
      </span>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading member information...</p>
      </div>
    </div>
  );

  if (error || !member) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">An error occurred</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
        <button
          onClick={() => navigate('/admin/members/list')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to list
        </button>
      </div>
    </div>
  );

  return (
    <div className="
     min-h-screen 
      bg-gradient-to-br from-primary-500 via-white to-accent-300 
      dark:from-secondary-400 dark:via-secondary-600 dark:to-secondary-900 
      flex items-center justify-center p-8 transition-all duration-300 
    ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/admin/members/list")}
            className="inline-flex items-center text-blue-100 dark:text-blue-900 hover:text-blue-600 dark:hover:text-blue-200 font-semibold"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Member Details</h1>
        </div>

        <div className="bg dark: shadow-lg rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-8 bg-gradient-to-r from-purple-200 via-pink-500 to-red-220 dark:from-secondary-700 dark:via-blue-800 dark:to-gray-900 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold bg-gradient-to-tr from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800">
                  {member.fullName ? member.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{member.fullName}</h2>
                  <p className="text-gray-700 dark:text-gray-300">{member.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {getStatusBadge(member.isActive)}
                {getRoleBadge(member.role)}
              </div>
            </div>
          </div>

          <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 bg-blue-50 dark:bg-gray-900/100 p-4 rounded-xl">
              <p className="text-gray-900 dark:text-gray-100"><strong>ID:</strong> {member.id}</p>
              <p className="text-gray-900 dark:text-gray-100"><strong>Full Name:</strong> {member.fullName || "Not updated"}</p>
              <p className="text-gray-900 dark:text-gray-100"><strong>Email:</strong> {member.email}</p>
              <p className="text-gray-900 dark:text-gray-100"><strong>Phone:</strong> {member.phoneNumber || "Not updated"}</p>
            </div>
            <div className="space-y-4 bg-pink-100 dark:bg-pink-900/50 p-4 rounded-xl">
              <p className="text-gray-900 dark:text-gray-100"><strong>Role:</strong> {member.role}</p>
              <p className="text-gray-900 dark:text-gray-100"><strong>Status:</strong> {member.isActive ? "Active" : "Locked"}</p>
              <p className="text-gray-900 dark:text-gray-100"><strong>Organization ID:</strong> {member.organizationId}</p>
              {member.organization && (
                <p className="text-gray-900 dark:text-gray-100"><strong>Organization Name:</strong> {member.organization.name}</p>
              )}
            </div>
          </div>

          <div className="mt-6 px-6 py-4 bg-green-200 dark:bg-orange-900/20 rounded-b-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-900 dark:text-gray-100"><strong>Created At:</strong> {formatDate(member.createdAt)}</p>
            <p className="text-gray-900 dark:text-gray-100"><strong>Last Updated:</strong> {formatDate(member.updatedAt)}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/admin/members/list")}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-700 dark:to-indigo-800 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailPage;
