'use client';

import Layout from 'components/common/Layout';
import UserDashboardLayout from 'components/common/UserDashboardLayout';
import { useState, useEffect } from 'react';
import { FiSearch, FiPaperclip } from 'react-icons/fi';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db, messaging, getToken } from '../../../firebase';
import { toast } from 'react-toastify';

export default function NewOrderPage() {
  const [orders, setOrders] = useState([
    {
      id: 'Order12345',
      messageCount: 3,
      lastMessage: 'New updates on your order'
    },
    {
      id: 'Order54321',
      messageCount: 1,
      lastMessage: 'Awaiting your confirmation'
    },
    {
      id: 'Order98765',
      messageCount: 0,
      lastMessage: 'Your order has been shipped'
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (selectedOrder) {
      const messagesRef = collection(db, 'orders', selectedOrder, 'messages');

      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(newMessages);
      });

      return () => unsubscribe();
    }
  }, [selectedOrder]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    const newMessage = {
      sender: 'User',
      content: message,
      time: new Date().toLocaleTimeString()
    };

    try {
      const messagesRef = collection(db, 'orders', selectedOrder, 'messages');
      await addDoc(messagesRef, newMessage);

      await sendNotification(newMessage.content);

      setMessage('');
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  const sendNotification = async (messageContent) => {
    try {
      // Request permission to use notifications
      const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });
      if (token) {
        console.log('FCM Token:', token);

        // Here you would typically send the messageContent via your backend server to FCM
        console.log(`Notification sent with message: "${messageContent}"`);
      } else {
        console.log(
          'No FCM token available. Request permission to generate one.'
        );
      }
    } catch (error) {
      console.error('Error getting FCM token or sending notification:', error);
    }
  };

  return (
    <Layout>
      <UserDashboardLayout>
        <div className={`flex h-full`}>
          <div className="w-1/3 bg-gray-100 p-4 border-r h-full">
            {/* Search Bar */}
            <div className="flex items-center bg-white p-2 rounded-lg shadow">
              <FiSearch className="text-gray-500" />
              <input
                type="text"
                placeholder="Search orders"
                className="ml-2 w-full outline-none text-sm"
              />
            </div>

            <div className="mt-4 overflow-y-auto h-5/6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 bg-white my-2 rounded-lg shadow cursor-pointer ${
                    selectedOrder === order.id ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <div className="flex justify-between">
                    <h2 className="font-semibold">{order.id}</h2>
                    {order.messageCount > 0 && (
                      <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {order.messageCount}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">{order.lastMessage}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-2/3 flex flex-col bg-gray-50 h-full">
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 ${
                    msg.sender === 'User' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg shadow ${
                      msg.sender === 'User'
                        ? 'bg-primary text-secondary'
                        : 'bg-gray-200'
                    }`}
                  >
                    <p
                      className={`${
                        msg.sender === 'User' ? 'text-white' : 'bg-gray-200'
                      }`}
                    >
                      {msg.content}
                    </p>
                    <span className="text-xs text-gray-300">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white shadow flex items-center">
              <FiPaperclip className="text-gray-500 mr-2 cursor-pointer" />
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 p-2 rounded-lg outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="ml-4 bg-primary text-white p-2 rounded-lg"
              >
                <PaperAirplaneIcon className="h-6 w-6 text-white transform -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </UserDashboardLayout>
    </Layout>
  );
}
