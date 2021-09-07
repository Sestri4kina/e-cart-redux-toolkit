import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {Product} from '../../app/api';
import {RootState} from "../../app/store";

export interface ProductsState {
    products: {[id: string]: Product};
}

const initialState: ProductsState = {
    products: {}
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        receivedProducts(state, action: PayloadAction<Product[]>) {
            const products = action.payload;

            products.forEach(product => {
                state.products[product.id] = product;
            });
        }
    }
}); 

export const {receivedProducts} = productsSlice.actions;
export default productsSlice.reducer;

export const selectProducts = createSelector(
    (state: RootState) => state.products.products,
    products => products
);
