'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import OrderLayout from 'components/order/Layout';
import usePricingData from 'app/hooks/usePricingData';
import { setSelectedItems } from 'app/redux/slices/servicesSlice';

const SelectItem = () => {
  const { categories } = usePricingData();
  const dispatch = useDispatch();
  const selectedItems = useSelector((state) => state.services.selectedItems);
  const orderCount = useSelector((state) => state.services.orderCount);

  const router = useRouter();

  useEffect(() => {
    const storedItems = sessionStorage.getItem('selectedOptions');
    if (storedItems) {
      dispatch(setSelectedItems(storedItems.split(',')));
    }
  }, [dispatch]);

  const handleOptionClick = (key) => {
    let updatedOptions;
    if (selectedItems.includes(key)) {
      updatedOptions = selectedItems.filter((option) => option !== key);
    } else {
      updatedOptions = [...selectedItems, key];
    }

    dispatch(setSelectedItems(updatedOptions));
    sessionStorage.setItem('selectedOptions', updatedOptions.join(','));
  };

  const handleContinue = () => {
    if (selectedItems.length > 0) {
      router.push('/select-service');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <OrderLayout
      title="Select the item you want to fix"
      onContinue={handleContinue}
      onBack={handleBack}
      disableContinue={selectedItems.length === 0}
      orderCount={orderCount}
    >
      <section className="mt-2 md:w-2/3">
        <div className="relative z-10">
          {categories.map((category) => (
            <button
              key={category}
              className={`py-2 px-4 border rounded-full mb-4 mr-4 transition-all ${
                selectedItems.includes(category)
                  ? 'bg-primary text-white'
                  : 'bg-white text-primary hover:bg-primary hover:text-white border-primary'
              }`}
              onClick={() => handleOptionClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>
    </OrderLayout>
  );
};

export default SelectItem;
