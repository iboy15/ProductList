import React, {useEffect, useCallback} from 'react';
import {FlatList, ActivityIndicator, RefreshControl} from 'react-native';
import styled, {useTheme} from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';

import {ProductItem} from '@components/molecules';
import {fetchProducts, setRefreshing, resetProducts, loadMoreProducts} from '@store/productsSlice';
import {RootState} from '@store/store';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
`;

const LoadingIndicator = styled(ActivityIndicator).attrs(({theme}) => ({
  color: theme.primary,
}))`
  margin-top: 20px;
`;

const ProductList = ({category}) => {
  const theme = useTheme();
  const navigation = useNavigation();
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
            onPress={() =>
              navigation.navigate('ProductDetails', {product: item})
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