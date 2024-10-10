'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import OrderLayout from 'components/order/Layout';
import usePricingData from 'app/hooks/usePricingData';
import {
  toggleService,
  setSelectedServices
} from 'app/redux/slices/servicesSlice';

const SelectService = () => {
  const { combinedPricingData } = usePricingData();
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedItems = useSelector((state) => state.services.selectedItems);
  const selectedServices = useSelector(
    (state) => state.services.selectedServices
  );
  const orderCount = useSelector((state) => state.services.orderCount);
  const [openAccordion, setOpenAccordion] = useState(null);

  console.log('selectedItems', selectedItems);
  console.log('selectedServices', selectedServices);
  console.log('orderCount', orderCount);

  useEffect(() => {
    if (selectedItems.length > 0) {
      setOpenAccordion(selectedItems[0]);
    }
  }, [selectedItems]);

  const getServicesByCategory = (category) => {
    const servicesData = combinedPricingData.find((group) =>
      group.category.toLowerCase().includes(category.toLowerCase())
    ) || { services: [] };

    return servicesData;
  };

  const handleServiceToggle = (item, service) => {
    dispatch(toggleService({ item, service }));
  };

  const calculateTotal = () => {
    let total = 0;
    Object.entries(selectedServices).forEach(([item, services]) => {
      services.forEach((serviceName) => {
        const service = getServicesByCategory(item).services.find(
          (s) => s.name === serviceName
        );
        if (service) {
          total += parseFloat(service.price.replace('+', '')) || 0;
        }
      });
    });
    return total.toFixed(2);
  };

  const renderOptions = (item) => {
    const { services } = getServicesByCategory(item);

    console.log('Item:', item);

    return (
      <details
        className="mb-4 w-full max-w-md border rounded"
        key={item}
        open={openAccordion === item}
        onClick={() => setOpenAccordion(item)}
      >
        <summary className="font-bold text-lg bg-gray-100 p-2 cursor-pointer">
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </summary>
        <div className="accordion-content flex flex-col gap-2 p-2">
          {services.map((option) => (
            <div
              key={option.name}
              className="flex items-center justify-between p-2 border rounded"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={
                    selectedServices[item]?.includes(option.name) || false
                  }
                  onChange={() => handleServiceToggle(item, option.name)} // Pass only the service name
                />
                <span className="ml-2">{option.name}</span>
              </label>
              <span className="text-gray-500">{option.price} €</span>
            </div>
          ))}
        </div>
      </details>
    );
  };

  const handleContinue = () => {
    dispatch(setSelectedServices(selectedServices));
    router.push('/order-details');
  };

  const handleBack = () => {
    router.back();
  };

  const isContinueDisabled = Object.values(selectedServices).every(
    (services) => services.length === 0
  );

  return (
    <OrderLayout
      title="Select type of Adjustments"
      onContinue={handleContinue}
      onBack={handleBack}
      disableContinue={isContinueDisabled}
      orderCount={orderCount}
    >
      <div className="flex gap-6">
        <section className="mt-2 flex-1 overflow-y-auto">
          {selectedItems.map((item) => renderOptions(item))}
        </section>
        <aside className="w-1/3 bg-gray-100 p-4 rounded overflow-y-auto max-h-[60vh]">
          <h3 className="text-xl font-semibold mb-4">Selected Alterations</h3>
          <div className="h-full max-h-[50vh] overflow-y-auto">
            {Object.entries(selectedServices).map(([item, services]) => (
              <div key={item} className="mb-4">
                <h4 className="font-bold">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </h4>
                <ul className="list-disc list-inside">
                  {services.map((serviceName) => {
                    const service = getServicesByCategory(item).services.find(
                      (s) => s.name === serviceName
                    );

                    // Check if service is defined before accessing its properties
                    if (!service) {
                      return (
                        <li key={serviceName}>
                          {serviceName} - Price Not Available
                        </li>
                      );
                    }

                    return (
                      <li key={serviceName}>
                        {serviceName} - {service.price} €
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className="mt-4 font-bold">Total: {calculateTotal()} €</div>
          </div>
        </aside>
      </div>
    </OrderLayout>
  );
};

export default SelectService;
