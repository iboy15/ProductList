import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import ProductList from './ProductList'; // Import your ProductList component

// Define the tabs
const categories = [
  {key: 'all', title: 'All'},
  {key: 'smartphones', title: 'Smartphones'},
  {key: 'laptops', title: 'Laptops'},
  {key: 'fragrances', title: 'Fragrances'},
  // Add more categories as needed
];

// Placeholder components for each category
const AllProducts = () => <ProductList category="all" />;
const Smartphones = () => <ProductList category="smartphones" />;
const Laptops = () => <ProductList category="laptops" />;
const Fragrances = () => <ProductList category="fragrances" />;

// Map the tabs to their respective components
const renderScene = SceneMap({
  all: AllProducts,
  smartphones: Smartphones,
  laptops: Laptops,
  fragrances: Fragrances,
});

const CategoryTabs = () => {
  const [index, setIndex] = useState(0); // Track the active tab index
  const [routes] = useState(categories); // Define the tabs

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={styles.indicator}
          style={styles.tabBar}
          labelStyle={styles.label}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF', // Customize the tab bar background color
  },
  indicator: {
    backgroundColor: '#007BFF', // Customize the indicator color
  },
  label: {
    color: '#000000', // Customize the label color
  },
});

export default CategoryTabs;