import { Product } from './product';

export type RootStackParamList = {
  Home : undefined; // No parameters expected for Home
  ProductList: undefined; // No parameters expected for ProductList
  ProductDetails: { product: Product }; // ProductDetails expects a `product` object
  Cart: undefined; // No parameters expected for Cart
};