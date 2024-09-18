'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import Layout from '@/components/common/Layout';
import { sendOrderEmail } from '@/utils/sendOrderEmail';
import Link from 'next/link';

const OrderPage = () => {
  const t = useTranslations('order');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    zip: '',
    city: '',
    orderDetails: '',
    pickupDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOrderEmail(formData);
      toast.success(t('successMessage'));
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        zip: '',
        city: '',
        orderDetails: '',
        pickupDate: ''
      });
    } catch (error) {
      toast.error(t('error'));
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
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            {/* Order Details Instructions */}
            <p className="text-sm text-gray-600 mb-4">
              {t('orderDetailsInstruction1')}
            </p>
            <p className="text-sm text-gray-600 mb-8">
              {t('orderDetailsInstruction2')}
            </p>
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
