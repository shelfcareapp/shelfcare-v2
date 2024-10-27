'use client';

import Layout from 'components/common/Layout';
import React, {useState, useEffect, use, useLayoutEffect} from 'react';
import {fetchChat, sendMessage} from 'store/slices/chat-slice';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../../../firebase';
import {useRouter} from 'next/navigation';
import {PaperAirplaneIcon} from '@heroicons/react/24/outline';
import {FiPaperclip} from 'react-icons/fi';
import {AiOutlineLoading} from 'react-icons/ai';
import {useTranslations} from 'next-intl';
import {useAppDispatch, useAppSelector} from 'hooks/store';
import UserDashboardLeftbar from 'components/common/UserDashboardLeftbar';
import {useChatScroll} from 'hooks/use-chat-scroll';
import ProtectRoute from 'components/common/ProtectedRoute';

export default function UserEnquiryPage() {
    const [user] = useAuthState(auth);

    const dispatch = useAppDispatch();
    const router = useRouter();
    const {messages, loading} = useAppSelector((state) => state.chat);
    const [message, setMessage] = useState<string>('');
    const [images, setImages] = useState<File[] | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const chatRef = useChatScroll(messages);
    const t = useTranslations('user-dashboard');

    useEffect(() => {
        if (user) {
            dispatch(fetchChat(user.uid));
        } else {
            router.push('/sign-in');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, router]);

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

    const handleSendMessage = () => {
        if (!message.trim() && (!images || images.length === 0)) return;

        dispatch(
            sendMessage({
                userId: user?.uid,
                content: message,
                images: images || [],
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
                                style={{transform: 'translate(50%, -50%)'}}
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

    useEffect(() => {
        if (messages.length === 0 && user) {
            const adminWelcomeMessage = t('welcome-message');
            dispatch(
                sendMessage({
                    userId: user.uid,
                    content: adminWelcomeMessage,
                    images: [],
                    sender: 'admin',
                    isAutoReply: true
                })
            );
        }
    }, [messages, user, dispatch, t]);

    return (
        <ProtectRoute>
            <Layout>
                <div className="mx-auto max-w-7xl lg:flex h-full">
                    <UserDashboardLeftbar/>
                    <main className="flex-1 flex flex-col bg-white relative h-screen">
                        <div
                            className="flex-1 flex flex-col justify-between bg-white"
                            style={{height: 'calc(100vh - 100px)'}}
                        >
                            <div
                                className="flex-1 overflow-y-auto"
                                ref={chatRef}
                                style={{maxHeight: 'calc(100vh - 150px)'}}
                            >
                                <div className="flex flex-col w-full">
                                    <div className="flex flex-col justify-end bg-gray-50 w-full h-screen">
                                        <div className="p-4 overflow-y-auto" id="chat-container">
                                            {loading ? (
                                                <AiOutlineLoading className="animate-spin text-4xl mx-auto"/>
                                            ) : (
                                                <>
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
                                                                            className={`inline-block p-4 rounded-lg shadow max-w-md lg:w-auto $ ${
                                                                                msg.sender === user?.uid
                                                                                    ? 'bg-primary text-white'
                                                                                    : 'bg-secondary'
                                                                            }`}
                                                                        >
                                                                            {msg.imageUrls &&
                                                                                msg.imageUrls.length > 0 && (
                                                                                    <div
                                                                                        className="flex flex-wrap gap-2">
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
                                                                                {msg.content}
                                                                            </p>
                                                                            <span className="text-xs text-gray-300">
                                        {msg.time}
                                      </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Message input area */}
                            <div className="sticky bottom-0 p-4 bg-white shadow flex flex-col z-10">
                                {showImagePreviews()}

                                <div className="flex items-center">
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                        <FiPaperclip className="text-gray-500 mr-2"/>
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
                                        className={`ml-4 bg-primary text-white p-2 rounded-lg ${
                                            loading
                                                ? 'cursor-not-allowed opacity-50'
                                                : 'cursor-pointer'
                                        }`}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <AiOutlineLoading className="animate-spin"/>
                                        ) : (
                                            <PaperAirplaneIcon className="h-5 w-5 -rotate-45"/>
                                        )}
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
