'use client';

import { useRouter } from 'next/navigation';
import { AiOutlineLoading } from 'react-icons/ai';
import AuthLayout from 'components/common/AuthLayout';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { useState } from 'react';
import { useLocale } from 'next-intl';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const locale = useLocale();

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { email, password, name } = formData;

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: user.email,
        isAdmin: false,
        createdAt: new Date()
      });

      setFormData({ email: '', password: '', name: '' });

      router.push('/');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error(
          locale === 'fi'
            ? 'Sähköpostiosoite on jo käytössä'
            : 'Email is already in use'
        );
      } else if (error.code === 'auth/weak-password') {
        toast.error(
          locale === 'fi'
            ? 'Salasanan tulee olla vähintään 6 merkkiä pitkä'
            : 'Password should be at least 6 characters long'
        );
      } else {
        toast.error(
          locale === 'fi' ? 'Rekisteröinti epäonnistui' : 'Sign up failed'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="mt-8 text-3xl font-semibold tracking-tight text-primary-dark">
        {locale === 'fi' ? 'Rekisteröidy' : 'Sign up'}
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        {locale === 'fi'
          ? 'Rekisteröidy käyttääksesi palveluitamme'
          : 'Sign up to use our services '}
      </p>

      <div className="mt-10">
        <form className="space-y-6" onSubmit={handleSignUp}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900"
            >
              {locale === 'fi' ? 'Nimi' : 'Name'}
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="block w-full rounded-full border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              {locale === 'fi' ? 'Sähköposti' : 'Email'}
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleFormChange}
                value={formData.email}
                required
                className="block w-full rounded-full border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              {locale === 'fi' ? 'Salasana' : 'Password'}
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                onChange={handleFormChange}
                value={formData.password}
                required
                className="block w-full rounded-full border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-secondary bg-primary hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {locale === 'fi' ? 'Rekisteröidy' : 'Sign up'}
              {loading && (
                <span className="ml-2">
                  <AiOutlineLoading className="animate-spin" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {locale === 'fi'
            ? 'Onko sinulla jo tili?'
            : 'Already have an account?'}{' '}
          <a
            href="/sign-in"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            {locale === 'fi' ? 'Kirjaudu sisään' : 'Sign in'}
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
