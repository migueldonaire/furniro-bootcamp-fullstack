import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getAddToCartError, itemAdded, type CartItem } from "./cartSlice";

// The product of the page, without the quantity (the visitor chooses it)
type Props = { product: Omit<CartItem, "quantity"> };

export function AddToCartButton({ product }: Props) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  function handleAdd() {
    const newItem = { ...product, quantity };
    const message = getAddToCartError(items, newItem);
    setError(message);
    if (message === null) {
      dispatch(itemAdded(newItem));
    }
  }
  return (
    <div>
      <input
        type="number"
        aria-label="Cantidad"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <button onClick={handleAdd}>Añadir al carrito</button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
