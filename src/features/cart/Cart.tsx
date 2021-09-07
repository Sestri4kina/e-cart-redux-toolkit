import React, {useCallback} from "react";
import classNames from "classnames";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectProducts} from "../products/productsSlice";
import styles from "./Cart.module.css";
import {
  removeFromCart,
  selectCartItems,
  selectCheckoutState,
  selectTotalPrice,
  updateQuantity,
  checkoutCart,
  selectErrorMessage
} from "./cartSlice";

export function Cart() {
  const cartItems = useAppSelector(selectCartItems);
  const products = useAppSelector(selectProducts);
  const totalPrice = useAppSelector(selectTotalPrice);
  const checkoutState = useAppSelector(selectCheckoutState);
  const errorMessage = useAppSelector(selectErrorMessage);

  const dispatch = useAppDispatch();
  const onRemoveItemFromCart = useCallback((id) => {
    dispatch(removeFromCart(id));
  }, [dispatch]);
  const onUpdateQuantity = useCallback((e: React.FocusEvent<HTMLInputElement>, id: string) => {
    const quantity = Number(e.target.value) ?? 0;
    dispatch(updateQuantity({id, quantity}));
  }, [dispatch]);
  const onCheckout = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(checkoutCart());
  }, [dispatch]);

  const tableClasses = classNames({
    [styles.table]: true,
    [styles.checkoutError]: checkoutState === 'ERROR',
    [styles.checkoutLoading]: checkoutState === 'LOADING'
  });

  return (
    <main className="page">
      <h1>Shopping Cart</h1>
      <table className={tableClasses}>
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
                <tr key={id}>
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
      <form onSubmit={onCheckout}>
        {
          checkoutState === 'ERROR' && (
            <p className={styles.errorBox}>{errorMessage}</p>
          )
        }
        <button 
          className={styles.button}
          type="submit"
        >
          Checkout
        </button>
      </form>
    </main>
  );
}
