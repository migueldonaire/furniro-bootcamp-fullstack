import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { CheckoutPage } from "./CheckoutPage";

it("shows the saved delivery address after submitting the form", async () => {
  const user = userEvent.setup();
  render(<CheckoutPage />);

  expect(screen.queryByRole("status")).not.toBeInTheDocument();

  await user.type(screen.getByLabelText("Nombre completo"), "Ana López");
  await user.type(screen.getByLabelText("Teléfono"), "611223344");
  await user.type(screen.getByLabelText("Calle y número"), "C/ Colón 10");
  await user.type(screen.getByLabelText("Ciudad"), "Valencia");
  await user.type(screen.getByLabelText("Código postal"), "46004");
  await user.click(screen.getByRole("button", { name: "Continuar" }));

  expect(await screen.findByRole("status")).toHaveTextContent(
    "Dirección guardada. Envío a Ana López, C/ Colón 10, 46004 Valencia.",
  );
});
