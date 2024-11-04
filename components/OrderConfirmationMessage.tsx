import React, { useState } from 'react';

const OrderConfirmationMessage = ({
  selectedServices,
  totalPrice,
  pickupDates,
  returnDates,
  onDateSelect
}) => {
  const [selectedPickupDate, setSelectedPickupDate] = useState(null);
  const [selectedReturnDate, setSelectedReturnDate] = useState(null);

  const generateOrderSummary = () => {
    let msg = `Here's your service plan:\n`;

    selectedServices.forEach((serviceKey, index) => {
      const service = selectedServices[serviceKey];
      msg += `${index + 1}. ${service.name}, ${(
        service.price * service.quantity
      ).toFixed(2)} €\n`;

      if (service.subOptions && service.subOptions.length > 0) {
        msg += `  Sub-options: ${service.subOptions
          .map((subOption) => `${subOption.name} (${subOption.price} €)`)
          .join(', ')}\n`;
      }
    });

    msg += `\nTotal: ${totalPrice.toFixed(2)} €\n\n`;
    return msg;
  };

  const handlePickupSelect = (date) => {
    setSelectedPickupDate(date);
    onDateSelect('pickup', date);
  };

  const handleReturnSelect = (date) => {
    setSelectedReturnDate(date);
    onDateSelect('return', date);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <p className="whitespace-pre-line text-gray-700 mb-4">
        {generateOrderSummary()}
      </p>

      <p className="text-gray-800 font-semibold mb-2">
        Choose the pickup time:
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {pickupDates.map((date, index) => (
          <button
            key={index}
            onClick={() => handlePickupSelect(date)}
            className={`px-4 py-2 rounded-lg ${
              selectedPickupDate === date
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:bg-green-400`}
          >
            {date}
          </button>
        ))}
      </div>

      <p className="text-gray-800 font-semibold mb-2">
        Choose the return time:
      </p>
      <div className="flex flex-wrap gap-2">
        {returnDates.map((date, index) => (
          <button
            key={index}
            onClick={() => handleReturnSelect(date)}
            className={`px-4 py-2 rounded-lg ${
              selectedReturnDate === date
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:bg-blue-400`}
          >
            {date}
          </button>
        ))}
      </div>

      {selectedPickupDate && selectedReturnDate && (
        <p className="mt-4 text-gray-600">
          You selected pickup time:{' '}
          <span className="font-semibold">{selectedPickupDate}</span> and return
          time: <span className="font-semibold">{selectedReturnDate}</span>.
        </p>
      )}
    </div>
  );
};

export default OrderConfirmationMessage;
