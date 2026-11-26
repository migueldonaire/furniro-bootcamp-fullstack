import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getAddToCartError, itemAdded, type CartItem } from "./cartSlice";

type Props = { product: Omit<CartItem, "quantity"> };

const quantitySchema = z.object({
  quantity: z.number({ error: "La cantidad mínima es 1" }).int().min(1, "La cantidad mínima es 1"),
});

type QuantityForm = z.infer<typeof quantitySchema>;

export function AddToCartButton({ product }: Props) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<QuantityForm>({
    resolver: zodResolver(quantitySchema),
    defaultValues: { quantity: 1 },
  });

  function onSubmit({ quantity }: QuantityForm) {
    const newItem = { ...product, quantity };
    const message = getAddToCartError(items, newItem);
    if (message !== null) {
      setError("quantity", { type: "stock", message });
      return;
    }
    dispatch(itemAdded(newItem));
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <input
        type="number"
        aria-label="Cantidad"
        {...register("quantity", { valueAsNumber: true })}
      />
      <button type="submit">Añadir al carrito</button>
      {errors.quantity && <p role="alert">{errors.quantity.message}</p>}
    </form>
  );
}
