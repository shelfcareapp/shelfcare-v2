'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import OrderLayout from '@/components/order/Layout';
import { useDropzone } from 'react-dropzone';
import { FaFileUpload, FaTrashAlt } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import {
  setAdditionalNotes,
  addUploadedFiles,
  removeUploadedFile
} from '@/redux/slices/servicesSlice';

const OrderDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { selectedServices, additionalNotes, uploadedFiles, orderCount } =
    useSelector((state) => state.services);

  const { lang } = useLanguage();
  const t = useTranslations(lang, 'order-details');

  const onDrop = useCallback(
    (acceptedFiles) => {
      dispatch(addUploadedFiles(acceptedFiles));
    },
    [dispatch]
  );

  const handleFileRemove = (fileName) => {
    dispatch(removeUploadedFile(fileName));
  };

  const handleSubmit = () => {
    console.log('Submitting order with details:', {
      selectedServices,
      additionalNotes,
      uploadedFiles
    });

    sessionStorage.removeItem('selectedServices');
    sessionStorage.removeItem('selectedOptions');

    router.push('/confirmation');
  };

  const handleBack = () => {
    router.back();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  return (
    <OrderLayout
      title={t.title}
      onContinue={handleSubmit}
      onBack={handleBack}
      disableContinue={false}
      orderCount={orderCount}
    >
      <div className="flex gap-6">
        <section className="flex-1">
          <h3 className="text-xl font-semibold mb-4">
            {t.additionalInformation}
          </h3>
          <textarea
            className="w-full p-2 border rounded mb-4"
            rows="4"
            placeholder={t.additionalNotesPlaceholder}
            value={additionalNotes}
            onChange={(e) => dispatch(setAdditionalNotes(e.target.value))}
          />

          <h3 className="text-xl font-semibold mb-2">{t.uploadImages}</h3>
          <p className="text-sm text-gray-500 mb-4">{t.uploadImagesSubtitle}</p>
          <div
            {...getRootProps()}
            className={`border-dashed border-2 p-6 rounded cursor-pointer text-center ${
              isDragActive ? 'border-blue-500' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <FaFileUpload className="text-4xl text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">{t.dragAndDropFiles}</p>
          </div>

          <div className="mt-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded mb-2"
              >
                <span className="text-sm text-gray-600">{file.name}</span>
                <FaTrashAlt
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleFileRemove(file.name)}
                />
              </div>
            ))}
          </div>

          <button className="btn-primary mt-4" onClick={handleSubmit}>
            {t.submitOrder}
          </button>
        </section>

        <aside className="w-1/3 bg-gray-100 p-4 rounded overflow-y-auto max-h-[60vh]">
          <h3 className="text-xl font-semibold mb-4">{t.summary}</h3>
          <div className="h-full max-h-[50vh] overflow-y-auto">
            {Object.entries(selectedServices).map(([item, services]) => (
              <div key={item} className="mb-4">
                <h4 className="font-bold">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </h4>
                <ul className="list-disc list-inside">
                  {services.map((serviceName) => (
                    <li key={serviceName}>{serviceName}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-4 font-bold">
              {t.totalServices}: {orderCount}
            </div>
          </div>
        </aside>
      </div>
    </OrderLayout>
  );
};

export default OrderDetails;
