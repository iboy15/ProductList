import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '@env';
import Toast from 'react-native-simple-toast';

// Fetch cart by user ID
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/carts`);
    if (!response.ok) throw new Error('Failed to fetch cart');
    const data = await response.json();
    return data.carts[0]; // Assuming the API returns an array of carts
  } catch (error) {
    Toast.show('Error fetching cart', Toast.LONG);
    return rejectWithValue(error.message);
  }
});

// Add a new cart
export const addCart = createAsyncThunk('cart/addCart', async (products, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/carts/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 1,
        products,
      }),
    });
    if (!response.ok) throw new Error('Failed to add cart');
    const data = await response.json();
    Toast.show('Cart added successfully!', Toast.SHORT);
    return data;
  } catch (error) {
    Toast.show('Error adding cart', Toast.LONG);
    return rejectWithValue(error.message);
  }
});

// Update cart
export const updateCart = createAsyncThunk('cart/updateCart', async (cart, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/carts/${cart.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: cart.products,
      }),
    });
    if (!response.ok) throw new Error('Failed to update cart');
    const data = await response.json();
    Toast.show('Cart updated successfully!', Toast.SHORT);
    return data;
  } catch (error) {
    Toast.show('Error updating cart', Toast.LONG);
    return rejectWithValue(error.message);
  }
});

// Delete cart
export const deleteCart = createAsyncThunk('cart/deleteCart', async (cartId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/carts/${cartId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete cart');
    const data = await response.json();
    Toast.show('Cart deleted successfully!', Toast.SHORT);
    return data;
  } catch (error) {
    Toast.show('Error deleting cart', Toast.LONG);
    return rejectWithValue(error.message);
  }
});

const initialState = {
  cart: null,
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(deleteCart.fulfilled, (state) => {
        state.cart = null;
      });
  },
});

export default cartSlice.reducer;
