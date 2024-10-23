'use client';

import Layout from 'components/common/Layout';
import UserDashboardLayout from 'components/common/UserDashboardLayout';
import { useState, useEffect, useRef } from 'react';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { db, auth, storage } from '../../../firebase';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Chat, Message } from 'components/types';
import { useTranslations } from 'next-intl';

export default function UserEnquiryPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [images, setImages] = useState<File[] | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('user-dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (user) {
      const chatsRef = collection(db, 'chats');
      const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
        const fetchedChats = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((chat: Chat) => chat.userId === user.uid)
          .sort(
            (a: Chat, b: Chat) =>
              b.createdAt.toMillis() - a.createdAt.toMillis()
          );
        setUserChats(fetchedChats as Chat[]);

        if (!selectedChat && fetchedChats.length > 0) {
          setSelectedChat(fetchedChats[0] as Chat);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      const chatDocRef = doc(db, 'chats', selectedChat.id);
      const unsubscribe = onSnapshot(chatDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMessages(data.messages || []);
        } else {
          setMessages([]);
        }
        scrollToBottom();
      });

      return () => unsubscribe();
    }
  }, [selectedChat]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  const createNewChat = async () => {
    const userChatsCount = userChats.length;
    const newChatName = `${t('order-enquiry')} ${userChatsCount + 1}`;

    try {
      const newChatData: Omit<Chat, 'id'> = {
        chatName: newChatName,
        createdAt: Timestamp.now(),
        messages: [],
        name: user?.displayName || 'Anonymous',
        email: user?.email || 'no-email',
        isAdmin: false,
        userId: user?.uid
      };

      const newChatRef = await addDoc(collection(db, 'chats'), newChatData);
      setSelectedChat({ ...newChatData, id: newChatRef.id });
    } catch (error) {
      toast.error('Error creating new chat');
    }
  };

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

    const newMessage: Message = {
      sender: user?.email || 'Anonymous',
      content: message.trim(),
      time: new Date().toLocaleTimeString(),
      imageUrls: [],
      isRead: false
    };

    setUploading(true);
    setMessages((prev) => [...prev, newMessage]);

    let uploadedImageUrls: string[] = [];
    if (images && images.length > 0) {
      try {
        const uploadPromises = images.map(async (image) => {
          const imageRef = ref(
            storage,
            `chats-images/${user?.uid}/${image.name}`
          );
          await uploadBytes(imageRef, image);
          const downloadUrl = await getDownloadURL(imageRef);
          return downloadUrl;
        });

        uploadedImageUrls = await Promise.all(uploadPromises);

        setImages(null);
        setImagePreviews([]);
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error('Error uploading images.');
      }
    }

    const updatedMessage: Message = {
      ...newMessage,
      imageUrls: uploadedImageUrls
    };

    try {
      const chatDocRef = doc(db, 'chats', selectedChat!.id);
      const chatSnapshot = await getDoc(chatDocRef);

      if (chatSnapshot.exists()) {
        const chatData = chatSnapshot.data();
        const chatsArray = chatData.messages || [];
        chatsArray.push(updatedMessage);

        await updateDoc(chatDocRef, {
          messages: chatsArray
        });

        setMessage('');
        scrollToBottom();
      } else {
        toast.error('Chat not found');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message.');
    } finally {
      setUploading(false);
    }
  };

  const filteredChats = userChats.filter((chat) =>
    chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showIsUnreadMessages = (chat: Chat) => {
    if (chat.isAdmin) {
      return (
        chat.messages.filter((msg) => {
          return msg.sender !== user?.email && !msg.isRead;
        }).length > 0
      );
    }
  };

  return (
    <Layout>
      <UserDashboardLayout
        selectedChat={selectedChat}
        handleFileChange={handleFileChange}
        handleSendMessage={handleSendMessage}
        message={message}
        setMessage={setMessage}
        uploading={uploading}
        imagePreviews={imagePreviews}
        removeImage={removeImage}
        toggleChatList={() => setIsSidebarOpen((prev) => !prev)}
      >
        <div className="flex h-screen w-full">
          <div
            className={`bg-gray-100 lg:relative lg:w-1/4 transform transition-transform duration-500 ease-in-out ${
              isSidebarOpen
                ? 'translate-x-0 p-2'
                : '-translate-x-full lg:translate-x-0 lg:p-2'
            }`}
          >
            <div className={isSidebarOpen ? 'block' : 'hidden lg:block'}>
              <h2 className="text-lg font-semibold mb-4">{t('my-chats')}</h2>

              <input
                type="text"
                placeholder={t('search-chat')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-4 rounded-lg border border-gray-300"
              />
              <button
                className="mb-4 bg-secondary text-primary p-2 rounded w-full"
                onClick={createNewChat}
              >
                {t('new-order-enquiry')}
              </button>
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`mb-2 p-2 bg-white rounded-lg shadow-sm cursor-pointer ${
                      selectedChat?.id === chat.id ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="font-bold">{chat.chatName}</div>
                    <div className="text-sm text-gray-500">
                      {t('last-message')}:{' '}
                      {chat.messages.length > 0
                        ? chat.messages[chat.messages.length - 1].content
                        : 'No messages'}
                    </div>

                    {showIsUnreadMessages(chat) && (
                      <span className="text-sm text-red-500 font-semibold">
                        {t('unread-messages')}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">{t('no-chats')}</p>
              )}
            </div>
          </div>

          {/* Chat content */}
          <div className="w-full flex flex-col bg-gray-50 h-full ml-0 lg:ml-1/4">
            <div className="flex-1 p-4 overflow-y-auto">
              {selectedChat ? (
                <>
                  <h3 className="text-xl font-bold mb-4">
                    {selectedChat.chatName}
                  </h3>
                  <div className="flex flex-col">
                    {messages.length > 0 ? (
                      messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`mb-4 ${
                            msg.sender === user?.email
                              ? 'text-right'
                              : 'text-left'
                          }`}
                        >
                          <div
                            className={`inline-block p-2 rounded-lg shadow ${
                              msg.sender === user?.email
                                ? 'bg-primary text-white'
                                : 'bg-gray-200'
                            }`}
                          >
                            {msg.imageUrls && msg.imageUrls.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {msg.imageUrls.map((url, i) => (
                                  <img
                                    key={i}
                                    src={url}
                                    alt={`Sent image ${i + 1}`}
                                    className="mb-2 rounded-lg max-w-xs"
                                  />
                                ))}
                              </div>
                            )}
                            <p
                              className={
                                msg.sender === user?.email
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
                      ))
                    ) : (
                      <p className="text-gray-500">{t('no-messages')}</p>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </>
              ) : (
                <p className="text-gray-500">
                  Select a chat or start a new one.
                </p>
              )}
            </div>
          </div>
        </div>
      </UserDashboardLayout>
    </Layout>
  );
}
