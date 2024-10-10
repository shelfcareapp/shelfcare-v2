'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { format, addDays, isAfter } from 'date-fns';
import { toast } from 'react-toastify';

import Layout from 'components/common/Layout';
import { formatTxtToDates } from 'app/utils/formatTxtToDates';

const OrderPage = () => {
  const t = useTranslations('order');
  const tCommon = useTranslations('common');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    zip: '',
    city: '',
    orderDetails: '',
    pickupDate: null,
    returnDate: null
    // orderImages: []
  });
  const [pickupDates, setPickupDates] = useState([]);
  const [returnDates, setReturnDates] = useState([]);
  const [loading, setLoading] = useState(false);

  const removeDuplicates = (datesArray) => {
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
      } catch (error) {
        toast.error('Failed to fetch dates. Please try again later.');
      }
    };

    fetchDates();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePickUpDateChange = (e) => {
    const selectedDate = pickupDates.find(
      (d) => d.date.toISOString() === e.target.value
    );
    if (selectedDate) {
      setFormData((prevData) => ({
        ...prevData,
        pickupDate: selectedDate
      }));
      updateReturnDates(selectedDate);
    }
  };

  const updateReturnDates = (pickupDate) => {
    if (pickupDate) {
      const filteredDates = returnDates.filter((date) =>
        isAfter(date.date, addDays(pickupDate.date, 6))
      );
      setReturnDates(filteredDates);

      if (
        !filteredDates.find((date) => date?.date === formData.returnDate?.date)
      ) {
        setFormData((prevData) => ({ ...prevData, returnDate: null }));
      }
    }
  };

  const handleReturnDateChange = (e) => {
    const selectedDate = returnDates.find(
      (d) => d.date.toISOString() === e.target.value
    );
    if (selectedDate) {
      setFormData((prevData) => ({
        ...prevData,
        returnDate: selectedDate
      }));
    }
  };

  // const handleImageUpload = (e) => {
  //   const files = Array.from(e.target.files);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     orderImages: files
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/send-order-email', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(tCommon('orderSuccess'));
      } else {
        toast.error(tCommon('error'));
      }

      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        zip: '',
        city: '',
        orderDetails: '',
        pickupDate: null,
        returnDate: null,
        orderImages: []
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Error submitting order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-16 px-6 md:px-24 max-w-3xl mx-auto">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold text-primary mb-12 text-center">
            {t('title')}
          </h1>
          <p className="text-sm text-gray-500 mb-8">{t('subtitle')}</p>
          <p className="text-sm text-gray-500 mt-4 mb-8">
            {t.rich('subtitle-2', {
              strong: <strong className="font-bold" />,
              link1: (chunks) => (
                <Link href="/price-list" className="text-primary underline">
                  {chunks}
                </Link>
              ),
              link2: (chunks) => (
                <Link
                  href="/measurement-guide"
                  className="text-primary underline"
                >
                  {chunks}
                </Link>
              )
            })}
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="font-semibold text-primary">
                {t('pickupDateLabel')}
              </label>
              <select
                name="pickupDate"
                value={formData.pickupDate?.date?.toISOString() || ''}
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
                    {format(date.date, 'EEEEEE dd.MM.yyyy')} {date.time}
                  </option>
                ))}
              </select>
            </div>

            {formData.pickupDate && (
              <div>
                <label className="font-semibold text-primary">
                  {t('returnDateLabel')}
                </label>
                <p className="text-sm text-gray-500 mb-8">
                  {t('returnPickupDateDescription')}
                </p>
                <select
                  name="returnDate"
                  value={formData.returnDate?.date?.toISOString() || ''}
                  onChange={handleReturnDateChange}
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
                      {format(date.date, 'EEEEEE dd.MM.yyyy')} {date.time}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="font-semibold text-primary">
                {t('orderDetailsLabel')}
              </label>
              <textarea
                name="orderDetails"
                value={formData.orderDetails}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={t('orderDetailsPlaceholder')}
                required
              />
            </div>

            {/* <div>
              <label className="font-semibold text-primary mb-2">
                {t('orderImages')}
              </label>
              <p className="text-sm text-gray-500 mb-4">
                {t('orderImageInstruction')}
              </p>
              <input
                type="file"
                name="orderImages"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div> */}

            <div>
              <label className="font-semibold text-primary">
                {t('nameLabel')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-primary">
                {t('phoneLabel')}
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-primary">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-primary">
                {t('addressLabel')}
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-primary">
                  {t('zipLabel')}
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-primary">
                  {t('cityLabel')}
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-6 bg-primary text-white rounded-full"
              disabled={loading}
            >
              {loading ? t('sending') : t('submit')}
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default OrderPage;
