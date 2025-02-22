// src/store/themeSlice.ts
import {createSlice} from '@reduxjs/toolkit';
import {lightTheme, darkTheme} from '../themes/themes'; // Import your themes

// Define the type for the theme
type Theme = typeof lightTheme | typeof darkTheme;

interface ThemeState {
  mode: 'light' | 'dark';
  theme: Theme; // Use a union type for lightTheme and darkTheme
}

const initialState: ThemeState = {
  mode: 'light', // Default theme mode
  theme: lightTheme, // Default theme
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: state => {
      // Toggle between light and dark themes
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      state.theme = state.mode === 'light' ? lightTheme : darkTheme;
    },
  },
});

export const {toggleTheme} = themeSlice.actions;

export default themeSlice.reducer;