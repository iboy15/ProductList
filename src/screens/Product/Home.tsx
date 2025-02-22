import React, {useState, useEffect} from 'react';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useDispatch, useSelector} from 'react-redux';
import styled, {useTheme} from 'styled-components/native';
import ProductList from '@components/molecules/ProductList'; // Import ProductList
import {RootState} from '@store/store';
import {ActivityIndicator} from 'react-native';
import {fetchProducts} from '@store/productsSlice';
import SearchComponent from '@components/molecules/Search';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
`;

const LoadingIndicator = styled(ActivityIndicator).attrs(({theme}) => ({
  color: theme.primary,
}))`
  margin-top: 20px;
`;

const StyledTabBar = styled(TabBar).attrs(({theme}) => ({
  indicatorStyle: {
    backgroundColor: theme.primary, // Use theme primary color for the indicator
  },
  style: {
    backgroundColor: theme.tabBarBackground, // Use theme color for the tab bar background
  },
  labelStyle: {
    color: theme.tabBarLabel, // Use theme color for the tab labels
  },
}))``;

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

  useEffect(() => {
    dispatch(fetchProducts()); // Fetch initial set of products
  }, [dispatch]);

  // Extract unique categories from products
  useEffect(() => {
    if (products?.length > 0) {
      const uniqueCategories = [
        'all',
        ...new Set(products.map(product => product.category)),
      ];
      const dynamicRoutes = uniqueCategories.map(category => ({
        key: category,
        title: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize the first letter
      }));
      setRoutes(dynamicRoutes);
    }
  }, [products]);

  // Handle search input change
  const handleSearch = query => {
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

  console.log('theme', theme.tabBarBackground);

  if (routes.length === 0) {
    <Container>
      <LoadingIndicator size="large" />
    </Container>;
  }

  return (
    <Container>
      {/* Search Component */}
      <SearchComponent
        onSearchResultPress={product => {
          // Navigate to product details or handle selection
          console.log('Selected Product:', product);
        }}
      />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{backgroundColor: 'black'}}
            style={{backgroundColor: theme.tabBarBackground}}
            activeColor="black"
            inactiveColor="black"
          />
        )}
      />
    </Container>
  );
};

export default Home;
