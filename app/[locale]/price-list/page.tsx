'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Layout from 'components/common/Layout';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import {
  tailoringKeys,
  tailoringServicesKeys,
  tailoringSubOptionsKeys
} from './tailoringKeys';
import {
  cobblerKeys,
  cobblerServicesKeys,
  cobblerSubOptionsKeys
} from './cobblerKeys';
import { laundryKeys, laundrySubOptionsKeys } from './laundryKeys';

const PricingPage = () => {
  const t = useTranslations('pricing');
  const [activeTab, setActiveTab] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (groupKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const getNamespace = () => {
    if (activeTab === 0) return 'tailoring';
    if (activeTab === 1) return 'cobbler';
    if (activeTab === 2) return 'laundry';
  };

  const renderGroupedContent = (groupKeys, servicesKeys, subOptionsKeys) => {
    const namespace = getNamespace();

    return groupKeys.map((groupKey) => {
      const groupTitle = t(`${namespace}.groups.${groupKey}.title`);
      const isExpanded = expandedGroups[groupKey];

      return (
        <div
          key={groupKey}
          className="bg-white rounded-lg mb-6 p-4 border border-gray-200 w-full"
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleGroup(groupKey)}
          >
            <p className="text-base font-semibold text-primary ">
              {groupTitle}
            </p>
            {isExpanded ? (
              <FaChevronUp className="text-primary" />
            ) : (
              <FaChevronDown className="text-primary" />
            )}
          </div>
          <div
            className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
              isExpanded ? 'max-h-screen' : 'max-h-0'
            }`}
          >
            {servicesKeys[groupKey].map((serviceKey) => (
              <div key={serviceKey} className="py-2 border-gray-100">
                <div className="flex justify-between">
                  <span className="text-sm">
                    {t(
                      `${namespace}.groups.${groupKey}.services.${serviceKey}.name`
                    )}
                  </span>
                  <span className="text-sm">
                    {t(
                      `${namespace}.groups.${groupKey}.services.${serviceKey}.price`
                    )}
                    €
                  </span>
                </div>
                {subOptionsKeys[serviceKey] &&
                  subOptionsKeys[serviceKey].map((subOptionKey) => (
                    <div
                      key={subOptionKey}
                      className="flex justify-between py-1 text-gray-600 ml-4"
                    >
                      <span className="text-sm">
                        {t(
                          `${namespace}.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.name`
                        )}
                      </span>
                      <span className="text-sm">
                        {t(
                          `${namespace}.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.price`
                        )}
                        €
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  const renderLaundryContent = () => {
    return (
      <div className="w-full bg-white p-6 border border-gray-200">
        {laundryKeys.map((serviceKey) => (
          <div key={serviceKey} className="mb-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">
                {t(`laundry.services.${serviceKey}.name`)}
              </span>
              <span className="text-sm">
                {t(`laundry.services.${serviceKey}.price`)} €
              </span>
            </div>
            {laundrySubOptionsKeys[serviceKey] &&
              laundrySubOptionsKeys[serviceKey].map((subOptionKey) => (
                <div
                  key={subOptionKey}
                  className="flex justify-between py-1 text-gray-600 ml-4"
                >
                  <span className="text-sm">
                    {t(
                      `laundry.services.${serviceKey}.subOptions.${subOptionKey}.name`
                    )}
                  </span>
                  <span className="text-sm">
                    {t(
                      `laundry.services.${serviceKey}.subOptions.${subOptionKey}.price`
                    )}
                    €
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  };

  const renderActiveTabContent = () => {
    if (activeTab === 0) {
      return renderGroupedContent(
        tailoringKeys,
        tailoringServicesKeys,
        tailoringSubOptionsKeys
      );
    } else if (activeTab === 1) {
      return renderGroupedContent(
        cobblerKeys,
        cobblerServicesKeys,
        cobblerSubOptionsKeys
      );
    } else if (activeTab === 2) {
      return renderLaundryContent();
    }
  };

  return (
    <Layout>
      <section className="py-16 px-6 md:px-24 bg-gradient-to-r relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r opacity-50 pointer-events-none"></div>
        <div className="container mx-auto relative z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-12 text-center">
            {t('title')}
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-center">
            {t('disclaimer')}
          </p>
          <div className="tabs mb-12 flex justify-center items-center space-x-4">
            {['0', '1', '2'].map((category, index) => (
              <button
                key={index}
                className={`py-2 px-6 rounded-full font-medium text-sm transition-all ${
                  activeTab === index
                    ? 'bg-primary text-white transform scale-105'
                    : 'bg-gray-200 text-primary hover:bg-primary hover:text-white hover:shadow-md'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center flex-col w-full max-w-3xl">
            {renderActiveTabContent()}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PricingPage;
