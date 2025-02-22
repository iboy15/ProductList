import React from 'react';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image'; // Import FastImage
import { Product } from '@types/product';
import { Text, Button } from '@components/common';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// Styled components for ProductItem
const ProductCard = styled.View`
  padding: 16px;
  margin-left: 16px;
  margin-vertical: 8px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.surface};
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

const Price = styled(Text)`
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 16px;
`;

interface ProductItemProps {
  product: Product;
  onPress: () => void;
}

const ProductItem = ({ product, onPress }: ProductItemProps) => {
  return (
    <ProductCard>
      {/* Use styled FastImage component */}
      <ProductImage
        source={{ uri: product.thumbnail, priority: FastImage.priority.normal }}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Text numberOfLines={2} bold size={14} style={{ marginBottom: 8}}>
        {product.title}
      </Text>
      <Price size={16}  style={{ marginTop:'auto' }}>${product.price || 'N/A'}</Price>
      <Button title="Add to Cart" onPress={onPress} primary  />
    </ProductCard>
  );
};

export default ProductItem;