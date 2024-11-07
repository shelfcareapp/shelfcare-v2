'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { formatTxtToDates } from 'utils/dateUtils';
import { format, isAfter } from 'date-fns';
import { toast } from 'react-toastify';
import { Order } from 'types';

interface PickupReturnTimeProps {
  order: Order;
  onUpdateTimes: (pickupTime: string, returnTime: string) => void;
}

export default function PickupReturnTime({
  order,
  onUpdateTimes
}: PickupReturnTimeProps) {
  const t = useTranslations('order');
  const tCommon = useTranslations('common');
  const [formData, setFormData] = useState({
    pickupDate: order.pickupTime || '',
    returnDate: order.deliveryTime || ''
  });

  const [pickupDates, setPickupDates] = useState<
    { date: Date; time: string }[]
  >([]);
  const [returnDates, setReturnDates] = useState<
    { date: Date; time: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const removeDuplicates = (datesArray: { date: Date; time: string }[]) => {
    return datesArray.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.date.getTime() === value.date.getTime())
    );
  };

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const [pickupDateResponse, returnDateResponse] = await Promise.all([
          fetch(
            'https://m8v1yt95qjd1nofn.public.blob.vercel-storage.com/pickupDates.txt'
          ),
          fetch(
            'https://m8v1yt95qjd1nofn.public.blob.vercel-storage.com/returnDates.txt'
          )
        ]);

        const pickupDatesText = await pickupDateResponse.text();
        const returnDatesText = await returnDateResponse.text();

        const today = new Date();
        const parsedPickupDates = removeDuplicates(
          formatTxtToDates(pickupDatesText)
        ).filter((date) => isAfter(date.date, today));
        const parsedReturnDates = removeDuplicates(
          formatTxtToDates(returnDatesText)
        ).filter((date) => isAfter(date.date, today));

        setPickupDates(parsedPickupDates);
        setReturnDates(parsedReturnDates);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to fetch dates. Please try again later.');
        setLoading(false);
      }
    };

    fetchDates();
  }, []);

  const handlePickUpDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      pickupDate: e.target.value
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (formData.pickupDate && formData.returnDate) {
      onUpdateTimes(formData.pickupDate, formData.returnDate);
    } else {
      toast.error('Please select both pickup and return dates.');
    }
  };

  return (
    <div className="flex flex-col justify-center space-y-2 py-4 w-1/2">
      {loading ? (
        <p>Loading dates...</p>
      ) : (
        <>
          <div>
            <label className="font-semibold text-primary">
              {t('pickupDateLabel')}
            </label>
            <select
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handlePickUpDateChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="" disabled>
                {t('selectPickupDate')}
              </option>
              {pickupDates.map((date, index) => (
                <option
                  key={`${date.date.toISOString()}-${index}`}
                  value={date.date.toISOString()}
                >
                  {format(date.date, 'EEEE dd.MM.yyyy')} {date.time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-primary">
              {t('returnDateLabel')}
            </label>
            <select
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="" disabled>
                {t('selectReturnDate')}
              </option>
              {returnDates.map((date, index) => (
                <option
                  key={`${date.date.toISOString()}-${index}`}
                  value={date.date.toISOString()}
                >
                  {format(date.date, 'EEEE dd.MM.yyyy')} {date.time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={handleSubmit}
              className="mt-4 bg-primary text-secondary px-4 py-2 rounded-md"
            >
              {tCommon('save')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
