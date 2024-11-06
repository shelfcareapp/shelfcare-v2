'use client';

import Layout from 'components/common/Layout';
import React, { useState, useEffect, useRef } from 'react';
import {
  sendMessage,
  listenToChat,
  setWelcomeMessageSent
} from 'store/slices/chat-slice';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebase';
import { useRouter } from 'next/navigation';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { FiPaperclip } from 'react-icons/fi';
import { AiOutlineLoading } from 'react-icons/ai';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from 'hooks/store';
import UserDashboardLeftbar from 'components/common/UserDashboardLeftbar';
import { useChatScroll } from 'hooks/use-chat-scroll';
import ProtectRoute from 'components/common/ProtectedRoute';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useTimeOptions } from 'hooks/useTimeOptions';
import { getNextEightDays } from 'utils/dateUtils';

export default function UserEnquiryPage() {
  const [user] = useAuthState(auth);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { messages, initialLoading, welcomeMessageSent } = useAppSelector(
    (state) => state.chat
  );
  const [message, setMessage] = useState<string>('');
  const [images, setImages] = useState<File[] | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const chatRef = useChatScroll(messages);
  const t = useTranslations('user-dashboard');
  const [pickupOption, setPickupOption] = useState<string | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const messagesEndRef = useRef(null);
  const [confirmationComplete, setConfirmationComplete] = useState(false);
  const { pickupDates, returnDates } = useTimeOptions();

  useEffect(() => {
    if (user) {
      dispatch(listenToChat(user.uid));
    } else {
      router.push('/login');
    }
  }, [user, dispatch]);

  const adminWelcomeMessage = t('welcome-message');

  useEffect(() => {
    if (!welcomeMessageSent) {
      dispatch(
        sendMessage({
          userId: user?.uid,
          content: adminWelcomeMessage,
          sender: 'admin',
          isAutoReply: true,
          welcomeMessageSent: true,
          images: []
        })
      );
      dispatch(setWelcomeMessageSent(true));
    }
  }, [welcomeMessageSent]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages((prev) => (prev ? [...prev, ...filesArray] : filesArray));
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    if (images) {
      const updatedImages = images.filter((_, i) => i !== index);
      const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
      setImages(updatedImages);
      setImagePreviews(updatedPreviews);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && (!images || images.length === 0)) return;

    let imageUrls = [];
    if (images) {
      const uploadPromises = images.map((image) => {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `chat-images/${user.uid}/${Date.now()}-${image.name}`
        );
        return uploadBytes(storageRef, image).then((snapshot) =>
          getDownloadURL(snapshot.ref)
        );
      });
      imageUrls = await Promise.all(uploadPromises);
    }

    dispatch(
      sendMessage({
        userId: user?.uid,
        content: message,
        images: imageUrls,
        sender: user?.uid
      })
    );

    setMessage('');
    setImages(null);
    setImagePreviews([]);
  };

  const handleSendOnEnter = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage();
    }
  };

  const showImagePreviews = () => {
    if (imagePreviews.length > 0) {
      return (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {imagePreviews.map((url, i) => (
            <div key={i} className="relative">
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className="w-20 h-20 object-cover rounded-md border border-gray-200"
              />
              <button
                onClick={() => removeImage(i)}
                className="absolute top-0 right-0 bg-white rounded-full text-red-500 hover:text-red-700 p-1"
                style={{ transform: 'translate(50%, -50%)' }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const confirmationMessage = t('order-confirmation', {
    pickupOption,
    deliveryOption
  })
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br />');

  const handleConfirmSelection = async (orderId: string) => {
    setIsConfirming(true);
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, {
        pickupTime: pickupOption,
        deliveryTime: deliveryOption,
        status: 'confirmed'
      });

      await dispatch(
        sendMessage({
          userId: user?.uid,
          content: confirmationMessage,
          images: [],
          sender: 'Admin'
        })
      );

      setIsConfirming(false);
    } catch (error) {
      setIsConfirming(false);
    } finally {
      setConfirmationComplete(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderPickupOptions = () => {
    return (
      <select
        onChange={(e) => setPickupOption(e.target.value)}
        className="w-full p-2 rounded-lg border border-gray-200"
      >
        <option value="">{t('select-pickup-time')}</option>
        {pickupDates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>
    );
  };

  const renderDeliveryOptions = () => {
    const deliveryOptions = getNextEightDays(pickupOption, returnDates);

    return (
      <select
        onChange={(e) => setDeliveryOption(e.target.value)}
        className={`
        w-full p-2 rounded-lg border border-gray-200
        ${!pickupOption && 'cursor-not-allowed disabled:opacity-70'}
        `}
        disabled={!pickupOption}
      >
        <option value="">{t('select-return-time')}</option>
        {deliveryOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };

  const disableConfirmationBtn = !pickupOption || !deliveryOption;

  return (
    <ProtectRoute>
      <Layout>
        <div className="mx-auto max-w-7xl lg:flex h-full">
          <UserDashboardLeftbar />
          <main className="flex-1 flex flex-col bg-white relative h-screen">
            <div
              className="flex-1 flex flex-col justify-between bg-white"
              style={{ height: 'calc(100vh - 100px)' }}
            >
              <div
                className="flex-1 overflow-y-auto"
                ref={chatRef}
                style={{ maxHeight: 'calc(100vh - 150px)' }}
              >
                <div className="flex flex-col w-full">
                  <div className="flex flex-col justify-end bg-gray-50 w-full h-screen">
                    <div className="p-4 overflow-y-auto" id="chat-container">
                      {initialLoading ? (
                        <AiOutlineLoading className="animate-spin text-4xl mx-auto" />
                      ) : (
                        <div className="flex flex-col">
                          {messages.length > 0 &&
                            messages
                              .filter((msg) => Boolean(msg))
                              .map((msg, index) => (
                                <div
                                  key={index}
                                  className={`mb-4 ${
                                    msg.sender === user?.uid
                                      ? 'text-right'
                                      : 'text-left'
                                  }`}
                                >
                                  <div
                                    className={`inline-block p-4 rounded-lg shadow max-w-md lg:w-auto ${
                                      msg.sender === user?.uid
                                        ? 'bg-primary text-white'
                                        : 'bg-[#FAEDE9]'
                                    }`}
                                  >
                                    {msg.imageUrls &&
                                      msg.imageUrls.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                          {msg.imageUrls.map((url, i) => (
                                            <img
                                              key={i}
                                              src={url}
                                              alt={`Sent image ${i + 1}`}
                                              className="mb-2 rounded-lg max-w-32 max-h-24"
                                            />
                                          ))}
                                        </div>
                                      )}
                                    <p
                                      className={
                                        msg.sender === user?.uid
                                          ? 'text-white'
                                          : 'text-gray-900'
                                      }
                                    >
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: msg.content
                                        }}
                                      />
                                      {msg.type === 'options' && (
                                        <span className="mt-4">
                                          <div className="space-y-4">
                                            <div>
                                              <span className="font-medium text-gray-700 my-2 text-sm">
                                                {t('select-pickup-time')}:
                                              </span>
                                              {renderPickupOptions()}
                                            </div>

                                            <div>
                                              <span className="font-medium text-gray-700 my-2 text-sm">
                                                {t('select-return-time')}:
                                              </span>
                                              {renderDeliveryOptions()}
                                            </div>

                                            <button
                                              onClick={() =>
                                                handleConfirmSelection(
                                                  msg.orderId
                                                )
                                              }
                                              className={`mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-brown-700 transition-colors
                                              ${
                                                disableConfirmationBtn &&
                                                'cursor-not-allowed opacity-40'
                                              }
                                              `}
                                              disabled={disableConfirmationBtn}
                                            >
                                              {isConfirming
                                                ? t('confirming')
                                                : t('confirm-selection')}
                                            </button>
                                          </div>
                                        </span>
                                      )}
                                    </p>
                                    <span className="text-xs text-gray-400 mt-1 block">
                                      {msg.time}
                                    </span>
                                  </div>
                                </div>
                              ))}
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Message input area */}
              <div className="sticky bottom-0 p-4 bg-white shadow flex flex-col z-10">
                {showImagePreviews()}

                <div className="flex items-center">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FiPaperclip className="text-gray-500 mr-2" />
                  </label>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('type-message')}
                    className="flex-1 bg-gray-100 p-2 rounded-lg outline-none"
                    onKeyDown={handleSendOnEnter}
                  />

                  <button
                    onClick={handleSendMessage}
                    className="ml-4 bg-primary text-white p-2 rounded-lg cursor-pointer"
                  >
                    <PaperAirplaneIcon className="h-5 w-5 -rotate-45" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </ProtectRoute>
  );
}
