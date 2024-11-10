'use client';

import { useRouter } from 'next/navigation';
import { AiOutlineLoading } from 'react-icons/ai';
import { useState } from 'react';
import AuthLayout from 'components/common/AuthLayout';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useLocale } from 'next-intl';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const locale = useLocale();

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      router.push('/chat');
    } catch (error) {
      toast.error(
        locale === 'fi' ? 'Kirjautuminen epäonnistui' : 'Sign in failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="mt-8 text-3xl font-semibold tracking-tight text-primary-dark">
        {locale === 'fi' ? 'Kirjaudu sisään' : 'Sign in'}
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        {locale === 'fi'
          ? 'Kirjaudu sisään käyttääksesi palveluitamme'
          : 'Sign in to use our services'}
      </p>

      <div className="mt-10">
        <form className="space-y-6" onSubmit={handleSignIn}>
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
                value={formData.email}
                onChange={handleFormChange}
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
                value={formData.password}
                onChange={handleFormChange}
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
              {locale === 'fi' ? 'Kirjaudu sisään' : 'Sign in'}
              {loading && (
                <span className="ml-2">
                  {/* Loading spinner (optional) */}
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
            ? 'Eikö sinulla ole tiliä?'
            : "Don't have an account?"}{' '}
          <a
            href="/sign-up"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            {locale === 'fi' ? 'Rekisteröidy' : 'Sign up'}
          </a>
        </p>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          <a
            href="/forgot-password"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            {locale === 'fi'
              ? 'Unohditko salasanasi?'
              : 'Forgot your password?'}
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
