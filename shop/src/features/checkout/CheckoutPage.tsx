import { useState } from "react";
import { AddressForm } from "./AddressForm";
import type { Address } from "./addressSchema";

export function CheckoutPage() {
  // The address only lives here, in memory: it is personal data, never in localStorage
  const [address, setAddress] = useState<Address | null>(null);

  return (
    <section>
      <h1>Dirección de entrega</h1>
      <AddressForm onSubmit={setAddress} />
      {address && (
        <p role="status">
          Dirección guardada. Envío a {address.fullName}, {address.street}, {address.postalCode}{" "}
          {address.city}.
        </p>
      )}
    </section>
  );
}
