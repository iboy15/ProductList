import React, {useState, useEffect} from 'react';
import {TabView, SceneMap, TabBar, TextInput, Modal, TouchableOpacity, View, Text, Image, FlatList, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import styled, {useTheme} from 'styled-components/native';
// import Icon from 'react-native-vector-icons/MaterialIcons'; // For search icon

import ProductList from '@components/molecules/ProductList'; // Import ProductList
import {RootState} from '@store/store';
import {fetchProducts} from '@store/productsSlice'; // Import fetchProducts action

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background-color: ${({theme}) => theme.tabBarBackground};
`;

const SearchInput = styled.TextInput`
  flex: 1;
  height: 40px;
  padding: 10px;
  background-color: ${({theme}) => theme.inputBackground};
  color: ${({theme}) => theme.text};
  border-radius: 20px;
`;

const SearchResultModal = styled.View`
  position: absolute;
  top: 60px; // Position below the search input
  left: 10px;
  right: 10px;
  max-height: 200px;
  background-color: ${({theme}) => theme.background};
  border-radius: 10px;
  elevation: 5; // Shadow for Android
  shadow-color: #000; // Shadow for iOS
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 2px;
`;

const SearchResultItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.border};
`;

const ProductTitle = styled.Text`
  flex: 1;
  font-size: 16px;
  color: ${({theme}) => theme.text};
`;

const ProductImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 10px;
`;

const LoadingIndicator = styled(ActivityIndicator).attrs(({theme}) => ({
  color: theme.primary,
}))`
  margin-top: 20px;
`;

const Home = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0); // Track the active tab index
  const [routes, setRoutes] = useState([]); // Define the tabs dynamically
  const {products} = useSelector((state: RootState) => state.products);

  // State for search functionality
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch products when the component mounts
  useEffect(() => {
    dispatch(fetchProducts()); // Fetch initial set of products
  }, [dispatch]);

  // Extract unique categories from products
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = ['all', ...new Set(products.map(product => product.category))];
      const dynamicRoutes = uniqueCategories.map(category => ({
        key: category,
        title: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize the first letter
      }));
      setRoutes(dynamicRoutes);
    }
  }, [products]);

  // Handle search input change
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const results = products.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()),
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Dynamically generate scenes for each category
  const renderScene = ({route}) => {
    return <ProductList category={route.key} />;
  };

  // Show loading indicator while fetching initial data
  if (routes.length === 0) {
    return (
      <Container>
        <LoadingIndicator size="large"  />
      </Container>
    );
  }

  return (
    <Container>
      {/* Search Header */}
      {/* <SearchContainer>
        {isSearchVisible ? (
          <>
            <SearchInput
              placeholder="Search products..."
              placeholderTextColor={theme.placeholderText}
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            <TouchableOpacity onPress={() => setIsSearchVisible(false)}>
              <Icon name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={() => setIsSearchVisible(true)}>
            <Icon name="search" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
      </SearchContainer> */}

      {/* Search Results Modal */}
      {/* {isSearchVisible && searchQuery && (
        <SearchResultModal>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
              <SearchResultItem
                onPress={() => {
                  // Navigate to product details or handle selection
                  setIsSearchVisible(false);
                }}>
                <ProductTitle>{item.title}</ProductTitle>
                <ProductImage source={{uri: item.thumbnail}} />
              </SearchResultItem>
            )}
          />
        </SearchResultModal>
      )} */}

      {/* TabView for Categories */}
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{backgroundColor: theme.primary}}
            style={{backgroundColor: theme.tabBarBackground}}
            labelStyle={{color: theme.text}}
          />
        )}
      />
    </Container>
  );
};

export default Home;