'use client';

import { useState } from 'react';
import AuthLayout from 'components/common/AuthLayout';
import { auth } from '../../../firebase';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useLocale } from 'next-intl';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const locale = useLocale();

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(
        locale === 'fi'
          ? 'Salasanan palautuslinkki lähetetty sähköpostiisi'
          : 'Password reset link sent to your email'
      );
      setEmailSent(true);
    } catch (error) {
      toast.error(
        locale === 'fi'
          ? 'Virhe salasanan palautuksessa. Tarkista sähköpostiosoite.'
          : 'Error sending password reset email. Check your email address.'
      );
    }
  };
  return (
    <AuthLayout>
      <h2 className="mt-8 text-3xl font-semibold tracking-tight text-primary-dark">
        {locale === 'fi' ? 'Palauta salasana' : 'Reset your password'}
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        {locale === 'fi'
          ? 'Anna sähköpostiosoitteesi, niin lähetämme sinulle linkin salasanan palauttamiseksi.'
          : 'Enter your email address and we will send you a link to reset your password.'}
      </p>

      <div className="mt-10">
        <form className="space-y-6" onSubmit={handlePasswordReset}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              {locale === 'fi' ? 'Sähköpostiosoite' : 'Email address'}
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-full border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-secondary bg-primary hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {locale === 'fi' ? 'Lähetä linkki' : 'Send link'}
            </button>
          </div>
        </form>
      </div>

      {emailSent && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {locale === 'fi'
              ? 'Tarkista sähköpostisi ja seuraa ohjeita salasanan palauttamiseksi.'
              : 'Check your email and follow the instructions to reset your password.'}
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {locale === 'fi'
            ? 'Muistitko salasanasi?'
            : 'Remember your password?'}{' '}
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
