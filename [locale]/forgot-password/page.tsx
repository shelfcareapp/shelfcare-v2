'use client';

import { useState } from 'react';
import AuthLayout from 'components/common/AuthLayout';
import { auth } from '../../../firebase';
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent. Check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast.error('Failed to send password reset email. Please try again.');
    }
  };
  return (
    <AuthLayout>
      <h2 className="mt-8 text-3xl font-semibold tracking-tight text-primary-dark">
        Reset your password
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Enter your email address to reset your password.
      </p>

      <div className="mt-10">
        <form className="space-y-6" onSubmit={handlePasswordReset}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              E-mail
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
              Reset Password
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <a
            href="/sign-in"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            Sign in
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
