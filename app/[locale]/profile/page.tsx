'use client';

import Layout from 'components/common/Layout';
import UserDashboardLayout from 'components/common/UserDashboardLayout';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  doorInfo: string;
  birthday: string | null;
};
function convertTimestampToDate(timestamp) {
  const { seconds } = timestamp;
  const date = new Date(seconds * 1000); // Convert seconds to milliseconds
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function ProfilePage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const t = useTranslations('user-dashboard');

  const [profileData, setProfileData] = useState<ProfileData>({
    name: user.displayName,
    email: user.email,
    phone: user.phoneNumber,
    address: '',
    city: '',
    postalCode: '',
    doorInfo: '',
    birthday: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      router.push('/sign-in');
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as ProfileData;
        const date = userData.birthday;

        const birthday = date ? date : '';

        setProfileData({
          ...userData,
          birthday
        });
      }
    } catch (error) {
      toast.error('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

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

      const userDocRef = doc(db, 'users', user.uid);

      const birthdayTimestamp = birthday
        ? Timestamp.fromDate(new Date(birthday))
        : null;

      await updateDoc(userDocRef, {
        name,
        email,
        phone,
        address,
        city,
        postalCode,
        doorInfo,
        birthday: birthdayTimestamp,
        updatedAt: Timestamp.now()
      });

      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  console.log('profileData:', profileData);

  return (
    <Layout>
      <UserDashboardLayout>
        <div className="max-w-3xl mt-6 p-4 md:p-8 lg:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {t('profile')}
          </h2>
          <p className="mt-2 text-sm text-gray-500 mb-8">
            {t('profile-subtitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h3 className="text-md font-semibold mb-4">
                {t('personal-information')}
              </h3>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    {t('full-name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    {t('email-address')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2 cursor-not-allowed"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    {t('phone-number')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-400">
                    {t('birthday')}
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={convertTimestampToDate(profileData?.birthday)}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div> */}
              </div>
            </div>

            <div>
              <h3 className="text-md font-semibold mb-4">
                {t('address-details')}
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    {t('address')}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    {t('city')}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    {t('postal-code')}
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={profileData.postalCode}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    {t('entrance-info')}
                  </label>
                  <input
                    type="text"
                    name="doorInfo"
                    value={profileData.doorInfo}
                    onChange={handleChange}
                    className="mt-2 block w-full border-gray-300 rounded-md shadow-sm p-2"
                    required
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
                {loading ? t('saving') : t('save-changes')}
              </button>
            </div>
          </form>
        </div>
      </UserDashboardLayout>
    </Layout>
  );
}
