import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetail, clearProductDetail } from '@store/productsSlice';
import { RootState } from '@store/store';
import styled, { useTheme } from 'styled-components/native';
import { useRoute } from '@react-navigation/native';
import { addCart } from '@store/cartSlice';
import { addFavorite, removeFavorite } from '@store/productsSlice';
import Toast from 'react-native-simple-toast';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  padding: 16px;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 300px;
  border-radius: 10px;
  margin-bottom: 16px;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 8px;
`;

const Description = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 16px;
`;

const PriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const Price = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  margin-right: 10px;
`;

const Discount = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.error};
  text-decoration: line-through;
`;

const RatingStockContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Rating = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.accent};
`;

const Stock = styled.Text`
  font-size: 16px;
  color: ${({ theme, inStock }) => (inStock ? theme.success : theme.error)};
`;

const BuyButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.primary};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const BuyButtonText = styled.Text`
  color: ${({ theme }) => theme.background};
  font-size: 18px;
  font-weight: bold;
`;

const FavoriteButton = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
`;

const ProductDetailScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const route = useRoute();
  const { productId } = route.params as { productId: number };

  const { productDetail, productLoading, productError } = useSelector(
    (state: RootState) => state.products
  );
  const favorites = useSelector((state: RootState) => state.products.favorites);

  // Derive isFavorite from the Redux store
  const isFavorite = favorites && productDetail
    ? favorites.some((item) => item.id === productDetail.id)
    : false;

  useEffect(() => {
    dispatch(fetchProductDetail(productId));

    return () => {
      dispatch(clearProductDetail()); // Clean up when leaving the screen
    };
  }, [dispatch, productId]);

  const handleAddToCart = () => {
    if (productDetail && productDetail.stock > 0) {
      dispatch(addCart([{ id: productDetail.id, quantity: 1 }]));
      Toast.show(
        `${productDetail.title} has been added to your cart.`,
        Toast.LONG
      );
    }
  };

  const handleToggleFavorite = () => {
    if (productDetail) {
      if (isFavorite) {
        dispatch(removeFavorite(productDetail.id));
        Toast.show(
          `${productDetail.title} has been removed from your favorites.`,
          Toast.LONG
        );
      } else {
        dispatch(addFavorite(productDetail));
        Toast.show(
          `${productDetail.title} has been added to your favorites.`,
          Toast.LONG
        );
      }
    }
  };

  if (productLoading) {
    return (
      <Container>
        <ActivityIndicator size="large" color={theme.primary} />
      </Container>
    );
  }

  if (productError || !productDetail) {
    return (
      <Container>
        <Title>Product not found</Title>
      </Container>
    );
  }

  return (
    <Container>
      <ScrollView>
        <FavoriteButton onPress={handleToggleFavorite}>
          <Image
            source={
              isFavorite
                ? require('../../assets/icons/heart-filled.png')
                : require('../../assets/icons/heart-outline.png')
            }
            style={{
              width: 24,
              height: 24,
         
            }}
          />
        </FavoriteButton>
        <ProductImage source={{ uri: productDetail.thumbnail }} />

        <Title>{productDetail.title}</Title>
        <Description>{productDetail.description}</Description>

        <PriceContainer>
          <Price>${productDetail.price.toFixed(2)}</Price>
          <Discount>
            $
            {(
              productDetail.price +
              (productDetail.discountPercentage / 100) * productDetail.price
            ).toFixed(2)}
          </Discount>
        </PriceContainer>

        <RatingStockContainer>
          <Rating>⭐ {productDetail.rating.toFixed(1)} / 5</Rating>
          <Stock inStock={productDetail.stock > 0}>
            {productDetail.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </Stock>
        </RatingStockContainer>

        <BuyButton onPress={handleAddToCart}>
          <BuyButtonText>Add to Cart</BuyButtonText>
        </BuyButton>
      </ScrollView>
    </Container>
  );
};

export default ProductDetailScreen;