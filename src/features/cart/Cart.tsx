import React, {useCallback} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectProducts} from "../products/productsSlice";
import styles from "./Cart.module.css";
import {removeFromCart, selectCartItems, selectTotalPrice, updateQuantity} from "./cartSlice";

export function Cart() {
  const cartItems = useAppSelector(selectCartItems);
  const products = useAppSelector(selectProducts);
  const totalPrice = useAppSelector(selectTotalPrice);

  const dispatch = useAppDispatch();
  const onRemoveItemFromCart = useCallback((id) => {
    dispatch(removeFromCart(id));
  }, [dispatch]);
  const onUpdateQuantity = useCallback((e: React.FocusEvent<HTMLInputElement>, id: string) => {
    const quantity = Number(e.target.value) ?? 0;
    dispatch(updateQuantity({id, quantity}));
  }, [dispatch]);

  return (
    <main className="page">
      <h1>Shopping Cart</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {
            Object.entries(cartItems).map(([id, quantity]) => {
              return (
                <tr>
                  <td>{products[id].name}</td>
                  <td>
                    <input 
                      type="number"
                      className={styles.input}
                      defaultValue={quantity}
                      onBlur={(e) => onUpdateQuantity(e, id)}
                    />
                  </td>
                  <td>{(products[id].price * quantity).toFixed(2)}</td>
                  <td>
                    <button
                      aria-label={`Remove ${products[id].name} from Shopping Cart`}
                      onClick={() => onRemoveItemFromCart(id)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td></td>
            <td className={styles.total}>${totalPrice}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <form>
        <button className={styles.button} type="submit">
          Checkout
        </button>
      </form>
    </main>
  );
}
