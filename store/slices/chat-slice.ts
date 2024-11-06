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
      images?: string[];
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
  isAutoReply: isAutoReply ?? false, // default to false if undefined
  welcomeMessageSent: welcomeMessageSent ?? false // default to false if undefined
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


export const listenToChat = (userId: string) => (dispatch: any, getState: any) => {
  dispatch(setInitialLoading(true));

  const chatDocRef = doc(db, 'chats', userId);

  return onSnapshot(
    chatDocRef,
    (doc) => {
      if (doc.exists()) {
        const chatData = doc.data();
        const previousMessages = getState().chat.messages;

        dispatch(updateMessages(chatData.messages || []));
        dispatch(setWelcomeMessageSent(chatData.welcomeMessageSent || false));

        if (chatData.messages.length > previousMessages.length) {
          const newMessage = chatData.messages[chatData.messages.length - 1];

          if (!newMessage.isRead) {
            console.log("New message received:", newMessage.content);

            if (Notification.permission === "granted") {
              new Notification(`New message from ${newMessage.sender}`, {
                body: newMessage.content,
              });
            }

            // Set the notification flag to true to show the badge
            dispatch(setHasNewNotification(true));
            localStorage.setItem("not", "true")
          }
        }
      } else {
        // Handle case where no chat exists for this user
        dispatch(updateMessages([]));
        dispatch(setWelcomeMessageSent(false));
        dispatch(setHasNewNotification(false));
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


export const markMessageAsRead = (userId: string) => async (dispatch: any, getState: any) => {
  const chatDocRef = doc(db, 'chats', userId);
  try {
    const chatSnap = await getDoc(chatDocRef);
    if (chatSnap.exists()) {
      const chatData = chatSnap.data();
      const updatedMessages = chatData.messages.map((msg: Message) => ({
        ...msg,
        isRead: true
      }));

      await updateDoc(chatDocRef, { messages: updatedMessages });
      dispatch(updateMessages(updatedMessages));
      dispatch(setHasNewNotification(false)); // Clear notification after reading
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};


// Request notification permission when the app loads
export const requestNotificationPermission = () => {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.log("Notification permission denied.");
      }
    });
  }
};


const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    error: null,
    initialLoading: false,
    welcomeMessageSent: true,
    hasNewNotification: false
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
    setHasNewNotification(state, action) {
      state.hasNewNotification = action.payload;
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
  setWelcomeMessageSent,
  setHasNewNotification
} = chatSlice.actions;
export default chatSlice.reducer;
