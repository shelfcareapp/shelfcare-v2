import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminRef = doc(db, 'admins', user.uid);
        const adminDoc = await getDoc(adminRef);
        if (adminDoc.exists()) {
          setIsAdmin(true);
        } else {
          router.push('/not-authorized');
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    };
    checkAdmin();
  }, [user, router]);

  return { isAdmin, loading };
};
