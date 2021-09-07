import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {RootState} from "../../app/store";
import {selectProducts} from "../products/productsSlice";

export interface CartState {
    items: {[productID: string]: number}; 
}

const initialState: CartState = {
    items: {}
};
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<string>) {
            const id = action.payload;

            if (state.items[id]) {
                state.items[id]++;
            } else {
                state.items[id] = 1;
            }
        },
        removeFromCart(state, action: PayloadAction<string>) {
            delete state.items[action.payload];
        },
        updateQuantity(state, action: PayloadAction<{id: string; quantity: number}>) {
            const {id, quantity} = action.payload;
            state.items[id] = quantity;
        }
    }
});

export const {addToCart, removeFromCart, updateQuantity} = cartSlice.actions;
export  default cartSlice.reducer;

export const selectCartItems = createSelector(
    (state: RootState) => state.cart.items,
    items => items
);

export const selectItemsCount = createSelector(
    selectCartItems,
    items => {
        let count = 0;
        for (let id in items) {
            count += items[id];
        }
        return count;
    });

export const selectTotalPrice = createSelector(
    selectCartItems,
    selectProducts,
    (items, products) => {
        let totalPrice = 0;
        Object.entries(items).forEach(([id, quantity]) => {
            totalPrice += quantity * products[id].price;
        });
        return totalPrice.toFixed(2);
    }
);
