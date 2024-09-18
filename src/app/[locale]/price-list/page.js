'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Layout from '@/components/common/Layout';
import {
  tailoringKeys,
  tailoringServicesKeys,
  subOptionsKeys,
  cobblerKeys,
  cobblerServicesKeys,
  laundryKeys,
  laundryServicesKeys
} from './key';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PricingPage = () => {
  const t = useTranslations('pricing');
  const [activeTab, setActiveTab] = useState(0); // 0: Tailoring, 1: Cobbler, 2: Laundry
  const [expandedGroups, setExpandedGroups] = useState({}); // Track expanded/collapsed state for each group

  // Function to toggle group collapse/expand state
  const toggleGroup = (groupKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const renderTailoringContent = () => {
    return tailoringKeys.map((groupKey) => {
      const groupTitle = t(`tailoring.groups.${groupKey}.title`);
      const isExpanded = expandedGroups[groupKey]; // Check if group is expanded

      return (
        <div
          key={groupKey}
          className="bg-white shadow-lg rounded-lg mb-6 p-4 border border-gray-200"
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleGroup(groupKey)} // Toggle expand/collapse on click
          >
            <h3 className="text-xl font-semibold text-primary">{groupTitle}</h3>
            {isExpanded ? (
              <FaChevronUp className="text-primary" />
            ) : (
              <FaChevronDown className="text-primary" />
            )}
          </div>
          <div
            className={`mt-4 transition-max-height duration-500 ease-in-out overflow-hidden ${
              isExpanded ? 'max-h-screen' : 'max-h-0'
            }`}
          >
            {tailoringServicesKeys[groupKey].map((serviceKey) => (
              <div key={serviceKey} className="py-2 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>
                    {t(
                      `tailoring.groups.${groupKey}.services.${serviceKey}.name`
                    )}
                  </span>
                  <span>
                    {t(
                      `tailoring.groups.${groupKey}.services.${serviceKey}.price`
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
                      <span>
                        {t(
                          `tailoring.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.name`
                        )}
                      </span>
                      <span>
                        {t(
                          `tailoring.groups.${groupKey}.services.${serviceKey}.subOptions.${subOptionKey}.price`
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

  const renderCobblerContent = () => {
    return cobblerKeys.map((groupKey) => {
      const groupTitle = t(`cobbler.groups.${groupKey}.title`);
      const isExpanded = expandedGroups[groupKey];

      return (
        <div
          key={groupKey}
          className="bg-white shadow-lg rounded-lg mb-6 p-4 border border-gray-200"
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleGroup(groupKey)}
          >
            <h3 className="text-xl font-semibold text-primary">{groupTitle}</h3>
            {isExpanded ? (
              <FaChevronUp className="text-primary" />
            ) : (
              <FaChevronDown className="text-primary" />
            )}
          </div>
          <div
            className={`mt-4 transition-max-height duration-500 ease-in-out overflow-hidden ${
              isExpanded ? 'max-h-screen' : 'max-h-0'
            }`}
          >
            {cobblerServicesKeys[groupKey].map((serviceKey) => (
              <div key={serviceKey} className="py-2 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>
                    {t(
                      `cobbler.groups.${groupKey}.services.${serviceKey}.name`
                    )}
                  </span>
                  <span>
                    {t(
                      `cobbler.groups.${groupKey}.services.${serviceKey}.price`
                    )}{' '}
                    €
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  const renderLaundryContent = () => {
    return laundryKeys.map((groupKey) => {
      const groupTitle = t(`laundry.groups.${groupKey}.title`);
      const isExpanded = expandedGroups[groupKey];

      return (
        <div
          key={groupKey}
          className="bg-white shadow-lg rounded-lg mb-6 p-4 border border-gray-200"
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleGroup(groupKey)}
          >
            <h3 className="text-xl font-semibold text-primary">{groupTitle}</h3>
            {isExpanded ? (
              <FaChevronUp className="text-primary" />
            ) : (
              <FaChevronDown className="text-primary" />
            )}
          </div>
          <div
            className={`mt-4 transition-max-height duration-500 ease-in-out overflow-hidden ${
              isExpanded ? 'max-h-screen' : 'max-h-0'
            }`}
          >
            {laundryServicesKeys[groupKey].map((serviceKey) => (
              <div key={serviceKey} className="py-2 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>
                    {t(
                      `laundry.groups.${groupKey}.services.${serviceKey}.name`
                    )}
                  </span>
                  <span>
                    {t(
                      `laundry.groups.${groupKey}.services.${serviceKey}.price`
                    )}{' '}
                    €
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  const renderActiveTabContent = () => {
    if (activeTab === 0) {
      return renderTailoringContent();
    } else if (activeTab === 1) {
      return renderCobblerContent();
    } else if (activeTab === 2) {
      return renderLaundryContent();
    }
  };

  return (
    <Layout>
      <section className="py-16 px-6 md:px-24 bg-gradient-to-r from-blue-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-100 opacity-50 pointer-events-none"></div>
        <div className="container mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-12 text-center">
            {t('title')}
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-center">
            {t('disclaimer')}
          </p>
          <div className="tabs mb-12 flex justify-center space-x-4">
            {['0', '1', '2'].map((category, index) => (
              <button
                key={index}
                className={`py-2 px-6 rounded-full font-medium transition-all ${
                  activeTab === index
                    ? 'bg-primary text-white shadow-md transform scale-105'
                    : 'bg-gray-200 text-primary hover:bg-primary hover:text-white hover:shadow-md'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {t(`categories.${category}`)}
              </button>
            ))}
          </div>
          <div>{renderActiveTabContent()}</div>
        </div>
      </section>
    </Layout>
  );
};

export default PricingPage;
