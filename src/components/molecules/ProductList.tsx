import React, { useEffect, useCallback } from "react";
import { FlatList, ActivityIndicator, RefreshControl } from "react-native";
import styled, { useTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import { ProductItem } from "@components/molecules";
import {
  fetchProducts,
  setRefreshing,
  resetProducts,
  loadMoreProducts,
} from "@store/productsSlice";
import { RootState } from "@store/store";
import { addCart } from "@store/cartSlice";

interface ProductListProps {
  category: string;
}

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const LoadingIndicator = styled(ActivityIndicator).attrs(({ theme }) => ({
  color: theme.primary,
}))`
  margin-top: 20px;
`;

const ProductList = ({ category }: ProductListProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Get state from Redux
  const { products, loading, error, isRefreshing, hasMore, limit, skip } =
    useSelector((state: RootState) => state.products);

  // Filter products based on the selected category
  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) => product.category === category);


  

  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    dispatch(resetProducts());
    dispatch(setRefreshing(true));
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle loading more products
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(loadMoreProducts());
    }
  }, [loading, hasMore, dispatch]);

  const handleAddToCart = (id: number, stock: number) => {
    if (stock === 0) return; // Prevent adding out-of-stock items

    const productToAdd = {
      id: id,
      quantity: 1,
    };

    dispatch(addCart([productToAdd]));
  };



  if (loading && skip === 0 && filteredProducts.length === 0) {
    return (
      <Container>
        <LoadingIndicator size="large" />
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        contentContainerStyle={{ paddingTop: 8 }}
        numColumns={2}
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            discountedPrice={item.discountedPrice} // Show discounted price
            stock={item.stock} // Show stock
            rating={item.rating} // Show rating
            handleAddToCart={() => handleAddToCart(item.id, item.stock)}
            isDisabled={item.stock === 0} // Disable button if out of stock
            onCardPress={() =>
              navigation.navigate("ProductDetails", { productId: item.id })
            }

          />
        )}

        refreshControl={
          <RefreshControl
            refreshing={isRefreshing || loading}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && skip > 0 ? <LoadingIndicator size="large" /> : null
        }
      />
    </Container>
  );
};

export default ProductList;
