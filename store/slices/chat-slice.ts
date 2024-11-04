import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  doc,
  updateDoc,
  getDoc,
  setDoc,
  Timestamp,
  onSnapshot,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../../firebase';
import { Message } from 'components/types';
import { toast } from 'react-toastify';

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    {
      userId,
      content,
      images,
      sender,
      isAutoReply,
      welcomeMessageSent
    }: {
      userId: string;
      content: string;
      images: string[];
      sender: string;
      isAutoReply?: boolean;
      welcomeMessageSent?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const chatDocRef = doc(db, 'chats', userId);

      const message: Message = {
        sender,
        content,
        time: new Date().toLocaleTimeString(),
        imageUrls: images,
        isRead: false,
        isAutoReply,
        welcomeMessageSent
      };

      const chatSnap = await getDoc(chatDocRef);

      if (chatSnap.exists()) {
        await updateDoc(chatDocRef, {
          messages: arrayUnion(message)
        });
      } else {
        const newChat = {
          userId,
          createdAt: Timestamp.now(),
          messages: [message],
          welcomeMessageSent: sender === 'admin' ? true : false
        };
        await setDoc(chatDocRef, newChat);
      }

      return null;
    } catch (error) {
      console.error('Error sending message', error);
      toast.error('Error sending message');
      return rejectWithValue('Error sending message');
    }
  }
);

export const listenToChat = (userId: string) => (dispatch: any) => {
  dispatch(setInitialLoading(true));

  const chatDocRef = doc(db, 'chats', userId);

  return onSnapshot(
    chatDocRef,
    (doc) => {
      if (doc.exists()) {
        const chatData = doc.data();
        dispatch(updateMessages(chatData.messages || []));
        dispatch(setWelcomeMessageSent(chatData.welcomeMessageSent || false));
      } else {
        dispatch(updateMessages([]));
        dispatch(setWelcomeMessageSent(false));
      }
      dispatch(setInitialLoading(false));
    },
    (error) => {
      console.error('Error listening to chat:', error);
      toast.error('Error listening to chat updates');
      dispatch(setInitialLoading(false));
    }
  );
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    error: null,
    initialLoading: false,
    welcomeMessageSent: true
  },
  reducers: {
    updateMessages(state, action) {
      state.messages = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
      state.welcomeMessageSent = false;
    },
    setInitialLoading(state, action) {
      state.initialLoading = action.payload;
    },
    setWelcomeMessageSent(state, action) {
      state.welcomeMessageSent = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.error = action.payload;
    });
  }
});

export const {
  updateMessages,
  clearMessages,
  setInitialLoading,
  setWelcomeMessageSent
} = chatSlice.actions;
export default chatSlice.reducer;
