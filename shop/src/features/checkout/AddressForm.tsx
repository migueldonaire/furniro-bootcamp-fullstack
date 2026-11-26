import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addressSchema, type Address } from "./addressSchema";
import styles from "./AddressForm.module.css";

type AddressFormProps = {
  initialAddress?: Address | null;
  onSubmit: (address: Address) => void;
};

export function AddressForm({ initialAddress, onSubmit }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: initialAddress ?? { country: "ES" },
  });

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.nameFields}>
        <div className={styles.field}>
          <label htmlFor="firstName">Nombre</label>
          <input
            id="firstName"
            autoComplete="given-name"
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p id="firstName-error" className="error">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className={styles.field}>
          <label htmlFor="lastName">Apellidos</label>
          <input
            id="lastName"
            autoComplete="family-name"
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p id="lastName-error" className="error">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">Teléfono</label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          {...register("phone")}
        />
        {errors.phone && (
          <p id="phone-error" className="error">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="street">Calle y número</label>
        <input
          id="street"
          autoComplete="street-address"
          aria-invalid={Boolean(errors.street)}
          aria-describedby={errors.street ? "street-error" : undefined}
          {...register("street")}
        />
        {errors.street && (
          <p id="street-error" className="error">
            {errors.street.message}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="city">Ciudad</label>
        <input
          id="city"
          autoComplete="address-level2"
          aria-invalid={Boolean(errors.city)}
          aria-describedby={errors.city ? "city-error" : undefined}
          {...register("city")}
        />
        {errors.city && (
          <p id="city-error" className="error">
            {errors.city.message}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="province">Provincia (opcional)</label>
        <input id="province" autoComplete="address-level1" {...register("province")} />
      </div>

      <div className={styles.field}>
        <label htmlFor="postalCode">Código postal</label>
        <input
          id="postalCode"
          inputMode="numeric"
          autoComplete="postal-code"
          aria-invalid={Boolean(errors.postalCode)}
          aria-describedby={errors.postalCode ? "postalCode-error" : undefined}
          {...register("postalCode")}
        />
        {errors.postalCode && (
          <p id="postalCode-error" className="error">
            {errors.postalCode.message}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="country">País</label>
        <select id="country" autoComplete="country" {...register("country")}>
          <option value="ES">España</option>
        </select>
      </div>

      <button type="submit" className={styles.submit}>
        Continuar
      </button>
    </form>
  );
}
