import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Order } from 'types';

import { Timestamp } from 'firebase/firestore';
import { TimeOptions } from 'types';

export const convertTimestampToISO = (data: any) => {
  if (data?.createdAt instanceof Timestamp) {
    return {
      ...data,
      createdAt: data.createdAt.toDate().toISOString()
    };
  }
  return data;
};

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchOrdersByUserId = createAsyncThunk(
  'orders/fetchOrdersByUserId',
  async (userId: string) => {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    const ordersData: Order[] = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return convertTimestampToISO({
          id: doc.id,
          ...data
        });
      })
      .filter((order) => order.customerId === userId);
    return ordersData;
  }
);

export const updateOrderTimes = createAsyncThunk(
  'orders/updateOrderTimes',
  async ({
    orderId,
    pickupTime,
    deliveryTime
  }: {
    orderId: string;
    pickupTime: TimeOptions;
    deliveryTime: TimeOptions;
  }) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { pickupTime, deliveryTime });
    return { orderId, pickupTime, deliveryTime };
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByUserId.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrdersByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(updateOrderTimes.fulfilled, (state, action) => {
        const { orderId, pickupTime, deliveryTime } = action.payload;
        state.orders = state.orders.map((order) => {
          if (order.id === orderId) {
            return { ...order, pickupTime, deliveryTime };
          }
          return order as Order;
        });
      });
  }
});

export default ordersSlice.reducer;
