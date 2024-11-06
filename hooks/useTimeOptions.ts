import { isAfter } from 'date-fns';
import { useEffect, useState } from 'react';
import { formatTxtToDates, removeDuplicates } from 'utils/dateUtils';

export const useTimeOptions = () => {
  const [pickupDates, setPickupDates] = useState<string[]>([]);
  const [returnDates, setReturnDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
        )
          .filter((date) => isAfter(date.date, today))
          .map(
            (date) => `${date.date.toLocaleDateString()} - klo: ${date.details}`
          );

        const parsedReturnDates = removeDuplicates(
          formatTxtToDates(returnDatesText)
        )
          .filter((date) => isAfter(date.date, today))
          .map(
            (date) => `${date.date.toLocaleDateString()} - klo: ${date.details}`
          );

        console.log('--parsedReturnDates', parsedReturnDates);

        setPickupDates(parsedPickupDates);
        setReturnDates(parsedReturnDates);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchDates();
  }, []);

  return { pickupDates, returnDates, loading };
};
