import React, { useRef } from 'react';
import BottomSheet from 'react-native-raw-bottom-sheet';
import styled from 'styled-components/native';

const Content = styled.View`
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.textPrimary};
`;

const ItemRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ItemText = styled.Text`
  color: ${({ theme }) => theme.textPrimary};
`;

const TotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.textSecondary};
  padding-top: 16px;
`;

const TotalText = styled.Text`
  font-weight: bold;
  color: ${({ theme }) => theme.textPrimary};
`;

const CloseButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.primary};
  padding: 10px;
  border-radius: 5px;
  margin-top: 16px;
`;

const CloseButtonText = styled.Text`
  color: ${({ theme }) => theme.background};
  text-align: center;
`;

const Checkout = React.forwardRef(({ cartItems, totalPrice, onClose }, ref) => {
  return (
    <BottomSheet
      ref={ref}
      height={300} // Adjust height as needed
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        wrapper: {
          backgroundColor: '${({ theme }) => theme.surface}',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
      }}
    >
      <Content>
        <Title>Checkout Summary</Title>
        {cartItems.map(item => (
          <ItemRow key={item.id}>
            <ItemText>{item.title}</ItemText>
            <ItemText>${item.price * item.quantity}</ItemText>
          </ItemRow>
        ))}
        <TotalRow>
          <TotalText>Total:</TotalText>
          <TotalText>${totalPrice}</TotalText>
        </TotalRow>
        <CloseButton onPress={onClose}>
          <CloseButtonText>Confirm Checkout</CloseButtonText>
        </CloseButton>
      </Content>
    </BottomSheet>
  );
});

export default Checkout;