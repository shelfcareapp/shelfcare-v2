import { redirect } from 'next/navigation';
import { validateRequest } from '@/lib/auth';
import AuthLayout from '@/components/common/AuthLayout';
import { Form } from '@/components/common/Form';
import { signin } from './actions';

export default async function SignInPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect('/');
  }

  return (
    <AuthLayout>
      <h2 className="mt-8 text-3xl font-semibold tracking-tight text-primary-dark">
        Sign in to your account
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Sign in to access your account and enjoy our services.
      </p>

      <div className="mt-10">
        <Form className="space-y-6" action={signin}>
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
                className="block w-full rounded-full border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
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
              Sign in
            </button>
          </div>
        </Form>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don’t have an account?{' '}
          <a
            href="/sign-up"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            Sign up
          </a>
        </p>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          <a
            href="/forgot-password"
            className="font-semibold text-primary hover:text-primary-dark"
          >
            Forgot your password?
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
