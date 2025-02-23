import React, {useRef, useEffect} from 'react';
import {ActivityIndicator, FlatList, Image} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {Checkout} from '@components/molecules';
import {fetchCart, updateCart, deleteCart} from '@store/cartSlice';
import {Text} from '@components/common';

const Container = styled.View`
  flex: 1;
  padding: 4px;
  background-color: ${({theme}) => theme.background};
`;

const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  background-color: ${({theme}) => theme.surface};
  border-width: 1px;
  border-color: gray;
  margin-vertical: 8px;
  margin-horizontal: 12px;
`;

const ProductImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  margin-right: 12px;
`;

const InfoContainer = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({theme}) => theme.textPrimary};
  margin-bottom: 4px;
`;

const Price = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${({theme}) => theme.primary};
`;

const QuantityContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const QuantityButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background-color: ${({theme}) => theme.primary};
`;

const QuantityButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({theme}) => theme.background};
`;

const Quantity = styled.Text`
  font-size: 16px;
  margin: 0 12px;
  font-weight: bold;
  color: ${({theme}) => theme.textPrimary};
`;

const TotalContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top-width: 1px;
  border-top-color: ${({theme}) => theme.textSecondary};
  margin-top: 10px;
`;

const TotalText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({theme}) => theme.textPrimary};
`;

const CheckoutButton = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.primary};
  padding: 12px 20px;
  border-radius: 8px;
`;

const CheckoutButtonText = styled.Text`
  color: ${({theme}) => theme.background};
  font-size: 16px;
  font-weight: bold;
`;

const ShoppingCartScreen = () => {
  const dispatch = useDispatch();
  const {cart, status} = useSelector(state => state.cart);
  const bottomSheetRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    const updatedProducts = cart.products.map(product =>
      product.id === productId ? {...product, quantity} : product,
    );
    dispatch(updateCart({id: cart.id, products: updatedProducts}));
  };

  const handleCheckout = () => {
    bottomSheetRef.current?.open();
  };

  const handleConfirmCheckout = () => {
    dispatch(deleteCart(cart.id));
    bottomSheetRef.current?.close();
  };

  if (status === 'loading') {
    return (
      <Container>
        <ActivityIndicator size={'large'} />
      </Container>
    );
  }

  if (!cart) {
    return (
      <Container>
        <Text>No cart found.</Text>
      </Container>
    );
  }

  const totalPrice = cart.products
    .reduce((sum, product) => sum + product.price * product.quantity, 0)
    .toFixed(2);

  return (
    <Container>
      <FlatList
        data={cart.products}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <ItemContainer>
            <ProductImage source={{uri: item.thumbnail}} />
            <InfoContainer>
              <Title>{item.title}</Title>
              <Price>${(item.price * item.quantity).toFixed(2)}</Price>
            </InfoContainer>
            <QuantityContainer>
              <QuantityButton
                onPress={() =>
                  handleUpdateQuantity(item.id, item.quantity - 1)
                }>
                <QuantityButtonText>-</QuantityButtonText>
              </QuantityButton>
              <Quantity>{item.quantity}</Quantity>
              <QuantityButton
                onPress={() =>
                  handleUpdateQuantity(item.id, item.quantity + 1)
                }>
                <QuantityButtonText>+</QuantityButtonText>
              </QuantityButton>
            </QuantityContainer>
          </ItemContainer>
        )}
      />
      <TotalContainer>
        <TotalText>Total: ${totalPrice}</TotalText>
        <CheckoutButton onPress={handleCheckout}>
          <CheckoutButtonText>Checkout</CheckoutButtonText>
        </CheckoutButton>
      </TotalContainer>
      <Checkout
        ref={bottomSheetRef}
        cartItems={cart.products}
        totalPrice={totalPrice}
        onClose={handleConfirmCheckout}
      />
    </Container>
  );
};

export default ShoppingCartScreen;
