import { isAfter } from 'date-fns';
import { useEffect, useState } from 'react';
import { TimeOptions } from 'types';
import { formatTxtToDates } from 'utils/dateUtils';

export const useTimeOptions = () => {
  const [pickupDates, setPickupDates] = useState<TimeOptions[]>([]);
  const [returnDates, setReturnDates] = useState<TimeOptions[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const [pickupDateFile, returnDateFile] = await Promise.all([
          fetch(
            'https://m8v1yt95qjd1nofn.public.blob.vercel-storage.com/pickupDates.txt'
          ),
          fetch(
            'https://m8v1yt95qjd1nofn.public.blob.vercel-storage.com/returnDates.txt'
          )
        ]);

        const today = new Date();
        const pickupDates = formatTxtToDates(
          await pickupDateFile.text()
        ).filter((date) => isAfter(date.date, today));
        const returnDates = formatTxtToDates(
          await returnDateFile.text()
        ).filter((date) => isAfter(date.date, today));

        setPickupDates(pickupDates);
        setReturnDates(returnDates);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchDates();
  }, []);

  return { pickupDates, returnDates, loading };
};
