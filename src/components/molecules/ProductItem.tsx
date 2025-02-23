import React from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import {Product} from '@types/product';
import {Text, Button} from '@components/common';
import {Dimensions, Image} from 'react-native';
import {addFavorite, removeFavorite} from '@store/productsSlice';
import {useDispatch, useSelector} from 'react-redux';
import { RootState } from '@store/store';

const screenWidth = Dimensions.get('window').width;

// Styled components
const ProductCard = styled.TouchableOpacity`
  padding: 16px;
  margin-left: 16px;
  margin-vertical: 8px;
  border-radius: 8px;
  background-color: ${({theme}) => theme.surface};
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  width: ${screenWidth / 2 - 24}px;
`;

const ProductImage = styled(FastImage)`
  width: 100%;
  height: 100px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const PriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  margin-top: auto;
`;

const DiscountPrice = styled(Text)`
  color: ${({theme}) => theme.primary};
  font-weight: bold;
  margin-right: 8px;
`;

const OriginalPrice = styled(Text)`
  color: ${({theme}) => theme.textSecondary};
  text-decoration: line-through;
`;

const Stock = styled(Text)`
  color: ${({theme}) => theme.textSecondary};
  font-size: 12px;
`;

const Rating = styled(Text)`
  color: ${({theme}) => theme.primary};
  font-size: 12px;
`;

const StockRatingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const FavoriteButton = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
`;

interface ProductItemProps {
  product: Product;
  handleAddToCart: () => void;
  onCardPress: () => void;
}

const ProductItem = ({
  product,
  handleAddToCart,
  onCardPress,
}: ProductItemProps) => {
    const dispatch = useDispatch();
  // Calculate discounted price if a discount percentage exists
  const discountedPrice = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const favorites = useSelector((state: RootState) => state.products.favorites);


  const isFavorite = product && favorites
    ? favorites.some(item => item.id === product.id)
    : false;

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(product.id));
    } else {
      dispatch(addFavorite(product));
    }
  };

  return (
    <ProductCard onPress={onCardPress}>
      <FavoriteButton onPress={handleToggleFavorite}>
        <Image
          source={
            isFavorite
              ? require('../../assets/icons/heart-filled.png')
              : require('../../assets/icons/heart-outline.png')
          }
          style={{
            width:isFavorite ? 24: 24,
            height:isFavorite ?20: 24,
          }}
        />
      </FavoriteButton>
      <ProductImage
        source={{uri: product.thumbnail, priority: FastImage.priority.normal}}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Text numberOfLines={2} bold size={14} style={{marginBottom: 8}}>
        {product.title}
      </Text>

      {/* Display Discounted Price if Available */}
      <PriceContainer>
        {discountedPrice ? (
          <DiscountPrice size={16}>${discountedPrice}</DiscountPrice>
        ) : null}
        <OriginalPrice size={14}>${product.price}</OriginalPrice>
      </PriceContainer>

      {/* Show stock and rating */}
      <StockRatingContainer>
        <Stock>
          Stock: {product.stock > 0 ? product.stock : 'Out of Stock'}
        </Stock>
        <Rating>⭐ {product.rating.toFixed(1)}</Rating>
      </StockRatingContainer>

      <Button
        title="Add to Cart"
        onPress={handleAddToCart}
        primary
        disabled={product.stock === 0} // Disable if out of stock
      />
    </ProductCard>
  );
};

export default ProductItem;
