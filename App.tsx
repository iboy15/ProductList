import React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ThemeProvider} from 'styled-components/native';
import store, {persistor} from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/store';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'

const AppContent = () => {
  const theme = useSelector((state: RootState) => state.theme.theme); // Get the current theme from Redux

  return (
    <ThemeProvider theme={theme}>
      <AutocompleteDropdownContextProvider>
      <AppNavigator />
      </AutocompleteDropdownContextProvider>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
