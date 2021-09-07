import React from "react";
import { Link } from "react-router-dom";
import {useAppSelector} from "../../app/hooks";
import styles from "./CartLink.module.css";
import {selectItemsCount} from "./cartSlice";

export function CartLink() {
  const itemsCount = useAppSelector(selectItemsCount);
  return (
    <Link to="/cart" className={styles.link}>
      <span className={styles.text}>🛒&nbsp;&nbsp;{itemsCount ? itemsCount : 'Cart'}</span>
    </Link>
  );
}
