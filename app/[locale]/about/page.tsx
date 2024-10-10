'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import Layout from 'components/common/Layout';

const image = '/images/F92723E0-595D-4944-B8E1-57870BF67F86.JPG';

const teamMembers = [
  {
    key: 'maija',
    image
  },
  {
    key: 'ida',
    image
  },
  {
    key: 'petra',
    image
  },
  {
    key: 'josephine',
    image
  }
];

const About = () => {
  const t = useTranslations('team');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
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
      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(t('contact.successMessage'));
      } else {
        toast.error(t('contact.errorMessage'));
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast.error(t('contact.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-12 bg-gray-50">
        <div id="team" className="container mx-auto px-4">
          {/* <h2 className="text-5xl text-primary font-semibold text-center mb-4">
            {t('title')}
          </h2> */}
          <h2 className="text-5xl font-semibold text-center mb-6 text-primary">
            {t('contact.title')}
          </h2>
          {/* <p className="text-center text-gray-600 mb-8">{t('description')}</p> */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 justify-items-center">
            {teamMembers.map((member, index) => (
              <div key={index} className="relative group w-full max-w-xs">
                <div className="overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={member.image}
                    alt={`Picture of ${t(`members.${member.key}.name`)}`}
                    width={300}
                    height={300}
                    className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-80 p-4">
                    <h3 className="text-xl font-semibold text-primary">
                      {t(`members.${member.key}.name`)}
                    </h3>
                    <p className="text-gray-700">
                      {t(`members.${member.key}.role`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          <div
            id="contact"
            className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto"
          >
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t('contact.firstName')}
                className="border p-2 rounded"
                aria-label={t('contact.ariaLabels.firstName')}
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t('contact.lastName')}
                className="border p-2 rounded"
                aria-label={t('contact.ariaLabels.lastName')}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('contact.email')}
                className="border p-2 rounded md:col-span-2"
                aria-label={t('contact.ariaLabels.email')}
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t('contact.phone')}
                className="border p-2 rounded md:col-span-2"
                aria-label={t('contact.ariaLabels.phone')}
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('contact.message')}
                className="border p-2 rounded md:col-span-2"
                rows={4}
                aria-label={t('contact.ariaLabels.message')}
              ></textarea>
              <button
                type="submit"
                className="btn-primary w-full md:col-span-2 mt-4"
                disabled={loading}
                aria-label={t('contact.ariaLabels.submit')}
              >
                {loading ? t('contact.sending') : t('contact.submit')}
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
