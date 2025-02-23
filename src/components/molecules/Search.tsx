import React, {useState} from 'react';
import {TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import styled, {useTheme} from 'styled-components/native';

import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {fetchSearchResults, clearSearchResults} from '@store/searchSlice'; // Import search actions
import {RootState} from '@store/store';
import {Text} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';

// Styled components
const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  background-color: ${({theme}) => theme.tabBarBackground};
`;

const SearchItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
  background-color: ${({theme}) => theme.background};
`;

const ProductImage = styled(FastImage)`
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;

// SearchComponent Props
interface SearchComponentProps {
  onSearchResultPress?: (product: any) => void; // Callback when a search result is pressed
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearchResultPress,
}) => {
  const theme = useTheme();
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {results: searchResults, loading: searchLoading} = useSelector(
    (state: RootState) => state.search,
  );

  // Handle search input change
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      dispatch(fetchSearchResults(query)); // Fetch search results
    } else {
      dispatch(clearSearchResults()); // Clear search results
    }
  };

  // Transform search results for the dropdown
  const dropdownData = searchResults.map(product => ({
    id: product.id.toString(),
    title: product.title,
    thumbnail: product.thumbnail,
  }));

  return (
    <>
      {/* Search Input */}
      <SearchContainer>
        {/* {isSearchVisible ? ( */}
        <>
          <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={false}
            onChangeText={handleSearch} // Handle search input change
            onSelectItem={item => {
              if (item && onSearchResultPress) {
                const selectedProduct = searchResults.find(
                  product => product.id.toString() === item.id,
                );
                if (selectedProduct) {
                  onSearchResultPress(selectedProduct); // Trigger callback
                }
              }
              setIsSearchVisible(false); // Close the search dropdown
            }}
            dataSet={dropdownData} // Pass the search results
            textInputProps={{
              placeholder: 'Search products...',
              placeholderTextColor: theme.placeholderText,
              autoFocus: true,
              style: {
                color: theme.text,
                backgroundColor: theme.inputBackground,
                borderRadius: 20,
              },
            }}
            containerStyle={{flexGrow: 1, flexShrink: 1}}
            loading={searchLoading} // Show loading indicator
            activityIndicatorColor={theme.primary}
            emptyResultText="No products found"
            inputContainerStyle={{
              backgroundColor: theme.background,
              borderRadius: 20,
              borderBottomWidth: 1,
            }}
            suggestionsListContainerStyle={{
              backgroundColor: theme.background,
              borderColor: theme.border,
            }}
            suggestionsListTextStyle={{
              color: theme.text,
            }}
            // RightIconComponent={<Image style={{height:15,width:15}} source={require('../../assets/icons/dropdownicon.png')} />}
            renderItem={item => {
              return (
                <SearchItemContainer>
                  <Text numberOfLines={1}>{item.title}</Text>
                  <ProductImage
                    source={{
                      uri: item.thumbnail,
                      priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </SearchItemContainer>
              );
            }}
            showChevron={false}
          />
        </>
        <TouchableOpacity onPress={()=>navigation.navigate('Cart')}>
          <Image
            style={{height: 32, width: 32}}
            source={require('../../assets/icons/cart.png')}
          />
        </TouchableOpacity>
      </SearchContainer>
    </>
  );
};

export default SearchComponent;
