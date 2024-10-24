'use client';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLayoutEffect } from 'react';
import { auth } from '../../firebase';

interface ProtectRouteProps {
  children: React.ReactNode;
}

export default function ProtectRoute({ children }: ProtectRouteProps) {
  const [user, loading] = useAuthState(auth);
  console.log('user', user);
  const router = useRouter();

  useLayoutEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  return <>{user && children}</>;
}
