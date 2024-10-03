'use client';

import Layout from '@/components/common/Layout';
import UserDashboardLayout from '@/components/common/UserDashboardLayout';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    doorInfo: '',
    birthday: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        toast.error('Failed to fetch profile data');
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        name,
        email,
        phone,
        address,
        city,
        postalCode,
        doorInfo,
        birthday
      } = profileData;

      const response = await fetch('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          city,
          postal_code: postalCode,
          door_info: doorInfo,
          birthday
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <UserDashboardLayout>
        <div className="max-w-3xl mx-auto mt-6">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="text-sm text-gray-500 mb-6">
            This information will be used for shipping and billing purposes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-md font-semibold mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Birthday
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={profileData.birthday}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div>
              <h3 className="text-md font-semibold mb-4">Address Details</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={profileData.postalCode}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Entrance information
                  </label>
                  <input
                    type="text"
                    name="doorInfo"
                    value={profileData.doorInfo}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading ? 'bg-secondary' : 'bg-primary'
                } text-white px-4 py-2 rounded-md`}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </UserDashboardLayout>
    </Layout>
  );
}
