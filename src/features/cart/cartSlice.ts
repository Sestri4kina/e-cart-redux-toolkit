import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {checkout} from "../../app/api";
import {RootState} from "../../app/store";
import {selectProducts} from "../products/productsSlice";

type CheckoutState = 'READY' | 'ERROR' | 'LOADING'; 
export interface CartState {
    items: {[productID: string]: number}; 
    checkoutState: CheckoutState;
    errorMessage: string;
}

const initialState: CartState = {
    items: {},
    checkoutState: 'READY',
    errorMessage: ''
};

export const checkoutCart = createAsyncThunk<
    {success: boolean},
    undefined,
    {state: RootState}
>('cart/checkout', async (_, thunkApi) => {
    const state = thunkApi.getState();
    const items = state.cart.items;
    const response = await checkout(items);
    return response;
});

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
    },
    extraReducers: function(builder) {
        builder.addCase(checkoutCart.pending, (state, action) => {
            state.checkoutState = 'LOADING';
        });
        builder.addCase(checkoutCart.fulfilled, (state, action: PayloadAction<{success: boolean}>) => {
            const {success} = action.payload;

            if (success) {
                state.checkoutState = 'READY';
                state.items = {};
            } else {
                state.checkoutState = 'ERROR';
            }
            
        });
        builder.addCase(checkoutCart.rejected, (state, action) => {
            state.checkoutState = 'ERROR';
            state.errorMessage = action.error.message ?? 'Error occured';
        });
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

export const selectCheckoutState = createSelector(
    (state: RootState) => state.cart.checkoutState,
    checkoutState => checkoutState
);

export const selectErrorMessage = createSelector(
    (state: RootState) => state.cart.errorMessage,
    errorMessage => errorMessage
);
