// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure this is imported
import productsReducer from './productsSlice';
import themeReducer from './themeSlice';
import searchReducer from './searchSlice';
import cartReducer from './cartSlice'

// Persist configuration
const persistConfig = {
  key: 'root', // Key for the persisted state
  storage: AsyncStorage, // Storage engine
  whitelist: ['products','cart'], // Optional: Only persist these reducers
  // blacklist: ['search'], // Optional: Exclude this reducer from persistence
};

// Wrap reducers with persistReducer
const persistedProductsReducer = persistReducer(persistConfig, productsReducer);
const persistedThemeReducer = persistReducer(persistConfig, themeReducer);
const persistedSearchReducer = persistReducer(persistConfig, searchReducer);
const persistedCartReducer = persistReducer(persistConfig, cartReducer);

// Configure the store
const store = configureStore({
  reducer: {
    products: persistedProductsReducer,
    search: persistedSearchReducer,
    theme: persistedThemeReducer,
    cart : persistedCartReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

// Create the persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;