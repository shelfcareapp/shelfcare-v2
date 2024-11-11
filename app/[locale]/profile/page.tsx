'use client';

import Layout from 'components/common/Layout';
import UserDashboardLayout from 'components/common/UserDashboardLayout';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  updatePassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { debounce } from 'lodash';
import { useAuthState } from 'react-firebase-hooks/auth';

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  doorInfo: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const t = useTranslations('user-dashboard');
  const locale = useLocale();
  const [user] = useAuthState(auth);

  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    address: '',
    city: '',
    postalCode: '',
    doorInfo: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      router.push('/sign-in');
    }
  }, [user]);

  const validatePasswords = useCallback(
    debounce(() => {
      setNewPasswordError(newPassword.length > 0 && newPassword.length < 8);
      setConfirmPasswordError(
        confirmPassword !== newPassword ||
          (confirmPassword.length > 0 && confirmPassword.length < 8)
      );
    }, 500),
    [newPassword, confirmPassword]
  );

  useEffect(() => {
    validatePasswords();
    return validatePasswords.cancel;
  }, [newPassword, confirmPassword, validatePasswords]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as ProfileData;

        setProfileData({
          ...userData
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
      const { name, email, phone, address, city, postalCode, doorInfo } =
        profileData;

      const userDocRef = doc(db, 'users', user.uid);

      await updateDoc(userDocRef, {
        name,
        email,
        phone,
        address,
        city,
        postalCode,
        doorInfo,
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

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    setPasswordChangeLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match.');
        setPasswordChangeLoading(false);
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      toast.success(
        locale === 'fi'
          ? 'Salasana vaihdettu onnistuneesti'
          : 'Password changed successfully'
      );

      await signOut(auth);
      router.push('/sign-in');
    } catch (error) {
      console.error('Error changing password:', error);

      toast.error(
        locale === 'fi'
          ? 'Salasanan vaihto epäonnistui'
          : 'Failed to change password'
      );
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const disableConfirmButton = () => {
    return (
      newPasswordError ||
      confirmPasswordError ||
      newPassword.length === 0 ||
      confirmPassword.length === 0
    );
  };

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
                  loading && 'opacity-40'
                } text-white px-4 py-2 rounded-md bg-primary`}
              >
                {loading ? t('saving') : t('save-changes')}
              </button>
            </div>
          </form>

          <form
            onSubmit={handlePasswordReset}
            className="mt-8 space-y-8 border-t pt-8"
          >
            <h3 className="text-md font-semibold mb-4">
              {t('change-password')}
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {t('current-password')}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-2 block w-full rounded-md shadow-sm p-2 border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {t('new-password')}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`mt-2 block w-full rounded-md shadow-sm p-2 ${
                    newPasswordError
                      ? 'border border-red-500'
                      : 'border-gray-300'
                  }`}
                  required
                />
                {newPasswordError && (
                  <p className="text-red-500 text-sm mt-1">
                    {locale === 'fi'
                      ? 'Salasanan tulee olla vähintään 8 merkkiä pitkä.'
                      : 'Password must be at least 8 characters.'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">
                  {t('confirm-password')}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`mt-2 block w-full rounded-md shadow-sm p-2 ${
                    confirmPasswordError
                      ? 'border border-red-500'
                      : 'border-gray-300'
                  }`}
                  required
                />
                {confirmPasswordError && (
                  <p className="text-red-500 text-sm mt-1">
                    {confirmPassword.length < 8
                      ? locale === 'fi'
                        ? 'Salasanan tulee olla vähintään 8 merkkiä pitkä.'
                        : 'Password must be at least 8 characters.'
                      : locale === 'fi'
                      ? 'Salasanat eivät täsmää.'
                      : 'Passwords do not match.'}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={passwordChangeLoading || disableConfirmButton()}
                className={`${
                  passwordChangeLoading && 'opacity-40'
                } text-white px-4 py-2 rounded-md bg-primary
                ${
                  disableConfirmButton()
                    ? 'cursor-not-allowed opacity-40'
                    : 'cursor-pointer'
                }
                `}
              >
                {passwordChangeLoading ? t('saving') : t('change-password')}
              </button>
            </div>
          </form>
        </div>
      </UserDashboardLayout>
    </Layout>
  );
}
