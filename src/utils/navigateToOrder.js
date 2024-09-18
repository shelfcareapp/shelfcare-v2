import { useRouter } from 'next/navigation';

export const navigateToOrder = () => {
  const router = useRouter();

  const handleNavigateToOrder = () => {
    router.push('/order');
  };

  return handleNavigateToOrder;
};
