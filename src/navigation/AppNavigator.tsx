import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '@types/navigation';
import { Home } from '@screens/Product';
import { Cart } from '@screens/Product';


// import ProductDetails from '../screens/ProductDetails';
// import Cart from '../screens/Cart';



// Create a stack navigator
const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Product List Screen */}
        <Stack.Screen
          name="Home"
          component={Home}
         
          options={{ headerShown: false }}
        />
        {/* Product Details Screen */}
        {/* <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{ title: 'Product Details' }}
        /> */}
        {/* Cart Screen */}
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{ title: 'Cart' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;