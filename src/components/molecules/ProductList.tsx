import React, {useEffect, useCallback} from 'react';
import {FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';

import {ProductItem} from '@components/molecules';
import {fetchProducts, setRefreshing, resetProducts, loadMoreProducts} from '@store/productsSlice';
import {RootState} from '@store/store';
import { addCart } from '@store/cartSlice';

interface ProductList{
  category:string
}

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
`;

const LoadingIndicator = styled(ActivityIndicator).attrs(({theme}) => ({
  color: theme.primary,
}))`
  margin-top: 20px;
`;

const ProductList = ({category}:ProductList) => {
  const theme = useTheme();

  const dispatch = useDispatch();

  // Get state from Redux
  const {
    products,
    loading,
    error,
    isRefreshing,
    hasMore,
    limit,
    skip,
  } = useSelector((state: RootState) => state.products);

  // Filter products based on the selected category
  const filteredProducts = category === 'all' ? products : products.filter(product => product.category === category);

  // // Fetch products from the API
  // const fetchData = useCallback(async () => {
  //   await dispatch(fetchProducts({limit, skip}));
  // }, [limit, skip, dispatch]);

  // // Initial data fetch
  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    dispatch(resetProducts()); // Reset the products list
    dispatch(setRefreshing(true));
    dispatch(fetchProducts({limit, skip: 0})); // Fetch the first page
  }, [dispatch, limit]);

  // Handle loading more products
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(loadMoreProducts()); // Dispatch action to load more products
    }
  }, [loading, hasMore, dispatch]);



  
    const handleAddToCart = (id) => {
      // Format the product data to match the API's expected structure
      const productToAdd = {
        id: id,
        quantity: 1, // Default quantity is 1
      };
  
      // Dispatch the addCart action
      dispatch(addCart([productToAdd])); // Pass an array of products
  
    };

  // Render loading indicator while fetching initial data
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
      contentContainerStyle={{paddingTop: 8}}
      numColumns={2}
        data={filteredProducts}
        keyExtractor={item => item.id.toString()} // Use a unique identifier
        renderItem={({item}) => (
          <ProductItem
            product={item}
            handleAddToCart={() =>
              handleAddToCart(item.id)
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
        onEndReached={handleLoadMore} // Trigger when the user scrolls to the end
        onEndReachedThreshold={0.5} // Load more when 50% of the list is visible
        ListFooterComponent={
          loading && skip > 0 ? <LoadingIndicator size="large" /> : null // Show loading indicator at the bottom
        }
      />
    </Container>
  );
};

export default ProductList;