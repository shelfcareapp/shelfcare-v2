'use client';

import Layout from 'components/common/Layout';
import UserDashboardLayout from 'components/common/UserDashboardLayout';
import { useState, useEffect } from 'react';
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

interface Message {
  sender: string;
  content: string;
  time: string;
  imageUrl?: string;
  isRead?: boolean;
}

interface Chat {
  id: string;
  chatName: string;
  createdAt: Timestamp;
  messages: Message[];
  name: string;
  email: string;
  isAdmin: boolean;
}

export default function UserEnquiryPage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatList, setShowChatList] = useState(false);

  useEffect(() => {
    const chatsRef = collection(db, 'chats');
    ('chats');
    const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
      const fetchedChats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];
      setUserChats(fetchedChats);

      if (!selectedChat && fetchedChats.length > 0) {
        setSelectedChat(fetchedChats[0]);
      }
    });

    return () => unsubscribe();
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
      });

      return () => unsubscribe();
    }
  }, [selectedChat]);

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  const createNewChat = async () => {
    const userChatsCount = userChats.length;
    const newChatName = `Order Enquiry ${userChatsCount + 1}`;

    try {
      const newChatData: Omit<Chat, 'id'> = {
        chatName: newChatName,
        createdAt: Timestamp.now(),
        messages: [],
        name: user?.displayName || 'Anonymous',
        email: user?.email || 'no-email',
        isAdmin: false
      };

      const newChatRef = await addDoc(collection(db, 'chats'), newChatData);
      setSelectedChat({ ...newChatData, id: newChatRef.id });
      setShowChatList(false);
    } catch (error) {
      toast.error('Error creating new chat');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !image) return;

    const newMessage: Message = {
      sender: user?.email || 'Anonymous',
      content: message.trim(),
      time: new Date().toLocaleTimeString(),
      imageUrl: null,
      isRead: false
    };

    setUploading(true);

    try {
      if (image) {
        const imageRef = ref(storage, `chat_images/${image.name}`);
        await uploadBytes(imageRef, image);
        const downloadURL = await getDownloadURL(imageRef);
        newMessage.imageUrl = downloadURL;
        setImage(null); // Clear image after upload
      }

      const chatDocRef = doc(db, 'chats', selectedChat!.id);
      const chatSnapshot = await getDoc(chatDocRef);

      if (chatSnapshot.exists()) {
        const chatData = chatSnapshot.data();
        const chatsArray = chatData.messages || [];
        chatsArray.push(newMessage);

        await updateDoc(chatDocRef, {
          messages: chatsArray
        });

        setMessage('');
      } else {
        toast.error('Chat not found');
      }
    } catch (error) {
      toast.error('Error sending message');
    } finally {
      setUploading(false);
    }
  };

  const filteredChats = userChats.filter((chat) =>
    chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <UserDashboardLayout
        selectedChat={selectedChat}
        handleFileChange={handleFileChange}
        handleSendMessage={handleSendMessage}
        message={message}
        setMessage={setMessage}
        image={image}
        setImage={setImage}
        uploading={uploading}
      >
        <div className="flex h-screen w-full">
          {/* Sidebar with Chat List */}
          <div
            className={`bg-gray-100 p-4 border-r lg:relative lg:w-1/4 h-full ${
              showChatList ? 'block' : 'hidden lg:block'
            }`}
          >
            <h2 className="hidden lg:block text-lg font-semibold mb-4">
              My Chats
            </h2>
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 rounded-lg border border-gray-300"
            />
            <button
              className="mb-4 bg-secondary text-primary p-2 rounded w-full"
              onClick={createNewChat}
            >
              New order enquiry
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
                    Last message:{' '}
                    {chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1].content
                      : 'No messages'}
                  </div>

                  {/* Display unread messages */}
                  {chat.messages.filter((msg) => !msg.isRead).length > 0 && (
                    <span className="text-sm text-red-500 font-semibold">
                      {chat.messages.filter((msg) => !msg.isRead).length}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No chats found.</p>
            )}
          </div>

          {/* Chat Messages Section */}
          <div className="w-full flex flex-col bg-gray-50 h-full">
            <div className="flex-1 p-4 overflow-y-auto">
              {selectedChat ? (
                <>
                  <h3 className="text-xl font-bold mb-4">
                    {selectedChat.chatName}
                  </h3>
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
                          {msg.imageUrl && (
                            <img
                              src={msg.imageUrl}
                              alt="Sent image"
                              className="mb-2 rounded-lg max-w-xs"
                            />
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
                    <p className="text-gray-500">No messages yet.</p>
                  )}
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
