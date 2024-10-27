import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {doc, getDoc, setDoc, Timestamp, updateDoc} from 'firebase/firestore';
import {db, realtimeDatabase, storage} from '../../firebase';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {Message} from 'components/types';
import {toast} from 'react-toastify';
import {convertTimestampToISO} from './orders-slice';
import database from 'firebase/database';

export const fetchChat = createAsyncThunk(
    'chat/fetchChat',
    async (userId: string, {rejectWithValue}) => {
        try {
            ////////////
            const chatsRef = database.ref(realtimeDatabase, `chats/${userId}`);

            database.onValue(chatsRef, (snapshot: database.DataSnapshot) => {
                const data = snapshot.val();
                return convertTimestampToISO(data);
            })

            const newChat = {
                userId,
                createdAt: Timestamp.now().toString(),
                messages: []
            };
            newChat['chatId'] = database.push(database.child(database.ref(realtimeDatabase), 'chats')).key;
            return newChat;
            ////////////

            // const chatDocRef = doc(db, 'chats', userId);
            // const chatSnap = await getDoc(chatDocRef);
            // if (chatSnap.exists()) {
            //   const data = chatSnap.data();
            //   return convertTimestampToISO(data);
            // } else {
            //   const newChat = {
            //     userId,
            //     createdAt: Timestamp.now(),
            //     messages: []
            //   };
            //   await addDoc(collection(db, 'chats'), newChat);
            //   return newChat;
            // }
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
            isAutoReply,
            chatId
        }: {
            userId: string;
            content: string;
            images: File[];
            sender: string;
            isAutoReply?: boolean;
            chatId: string
        },
        {rejectWithValue}
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
                    return await getDownloadURL(imageRef);
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
                    await updateDoc(chatDocRef, {messages: updatedMessages});
                    return updatedMessage;
                }
            } else {
                const newChat = {
                    userId,
                    createdAt: new Date(),
                    messages: [updatedMessage],
                    welcomeMessageSent: sender === 'admin' // Set the flag based on the sender
                };
                await setDoc(chatDocRef, newChat);
                return updatedMessage;
            }
            // uploading the images and sending the message should be in a transaction
            // get reference to messages/chatId
            // push the message into the above reference

            // Step 4: Run transaction to add the message to Firebase Realtime Database.
            const messageRef = database.ref(realtimeDatabase, `messages/${chatId}`);
            const result = await database.runTransaction(messageRef, (messages) => {
                if (!messages) {
                    messages = [];
                }
                messages.push(updatedMessage);
                return messages;
            });
            console.log('Result', result);
            return result.toJSON();
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
                console.log('Fetch chat pending');
                state.loading = true;
            })
            .addCase(fetchChat.fulfilled, (state, action) => {
                console.log('Fetch chat fulfilled', action.payload);
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
