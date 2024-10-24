import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  doc,
  updateDoc,
  getDoc,
  addDoc,
  collection,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Message } from 'components/types';
import { toast } from 'react-toastify';
import { convertTimestampToISO } from './orders-slice';

export const fetchChat = createAsyncThunk(
  'chat/fetchChat',
  async (userId: string, { rejectWithValue }) => {
    try {
      const chatDocRef = doc(db, 'chats', userId);
      const chatSnap = await getDoc(chatDocRef);
      if (chatSnap.exists()) {
        const data = chatSnap.data();
        return convertTimestampToISO(data);
      } else {
        const newChat = {
          userId,
          createdAt: Timestamp.now(),
          messages: []
        };
        await addDoc(collection(db, 'chats'), newChat);
        return newChat;
      }
    } catch (error) {
      toast.error('Error fetching chat');
      return rejectWithValue('Error fetching chat');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    {
      userId,
      content,
      images,
      sender,
      isAutoReply
    }: {
      userId: string;
      content: string;
      images: File[];
      sender: string;
      isAutoReply?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const chatDocRef = doc(db, 'chats', userId);

      const message: Message = {
        sender,
        content,
        time: new Date().toLocaleTimeString(),
        imageUrls: [],
        isRead: false
      };

      let uploadedImageUrls: string[] = [];
      if (images && images.length > 0) {
        const uploadPromises = images.map(async (image) => {
          const imageRef = ref(storage, `chats-images/${userId}/${image.name}`);
          await uploadBytes(imageRef, image);
          const downloadUrl = await getDownloadURL(imageRef);
          return downloadUrl;
        });
        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      const updatedMessage: Message = {
        ...message,
        imageUrls: uploadedImageUrls
      };

      const chatSnap = await getDoc(chatDocRef);

      if (chatSnap.exists()) {
        const chatData = chatSnap.data();

        if (sender === 'admin') {
          if (!chatData.welcomeMessageSent) {
            const updatedMessages = [...chatData.messages, updatedMessage];
            await updateDoc(chatDocRef, {
              messages: updatedMessages,
              welcomeMessageSent: true
            });
            return updatedMessage;
          }
        } else {
          const updatedMessages = [...chatData.messages, updatedMessage];
          await updateDoc(chatDocRef, { messages: updatedMessages });
          return updatedMessage;
        }
      } else {
        const newChat = {
          userId,
          createdAt: new Date(),
          messages: [updatedMessage],
          welcomeMessageSent: sender === 'admin' ? true : false // Set the flag based on the sender
        };
        await setDoc(chatDocRef, newChat);
        return updatedMessage;
      }
    } catch (error) {
      console.log('Error sending message', error);
      toast.error('Error sending message');
      return rejectWithValue('Error sending message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chat: null,
    messages: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChat.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chat = action.payload;
        state.messages = action.payload.messages || [];
      })
      .addCase(fetchChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error('Failed to fetch chat');
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
        toast.error('Failed to send message');
      });
  }
});

export default chatSlice.reducer;
