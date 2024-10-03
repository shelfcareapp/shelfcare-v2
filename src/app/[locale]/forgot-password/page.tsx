import { useState } from 'react';
import AuthLayout from '@/components/common/AuthLayout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setMessage('Password reset link has been sent to your email.');
    } catch (err) {
      setError((err as Error).message);
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
        <form className="space-y-6" onSubmit={handleSubmit}>
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

          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-500">{message}</p>}

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
