import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AddressForm } from "./AddressForm";

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nombre", { exact: true }), "Ana");
  await user.type(screen.getByLabelText("Apellidos"), "López");
  await user.type(screen.getByLabelText("Teléfono"), "611223344");
  await user.type(screen.getByLabelText("Calle y número"), "C/ Colón 10");
  await user.type(screen.getByLabelText("Ciudad"), "Valencia");
  await user.type(screen.getByLabelText("Código postal"), "46004");
}

describe("AddressForm", () => {
  it("prefills the usual address and submits the edited address", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const initialAddress = {
      firstName: "Ana",
      lastName: "López",
      phone: "611223344",
      street: "C/ Colón 10",
      city: "Valencia",
      province: "Valencia",
      postalCode: "46004",
      country: "ES",
    };
    render(<AddressForm initialAddress={initialAddress} onSubmit={onSubmit} />);

    expect(screen.getByLabelText("Nombre", { exact: true })).toHaveValue(initialAddress.firstName);
    expect(screen.getByLabelText("Apellidos")).toHaveValue(initialAddress.lastName);
    expect(screen.getByLabelText("Teléfono")).toHaveValue(initialAddress.phone);
    expect(screen.getByLabelText("Calle y número")).toHaveValue(initialAddress.street);
    expect(screen.getByLabelText("Ciudad")).toHaveValue(initialAddress.city);
    expect(screen.getByLabelText("Provincia (opcional)")).toHaveValue(initialAddress.province);
    expect(screen.getByLabelText("Código postal")).toHaveValue(initialAddress.postalCode);
    expect(screen.getByLabelText("País")).toHaveValue(initialAddress.country);

    const street = screen.getByLabelText("Calle y número");
    await user.clear(street);
    await user.type(street, "C/ Colón 20");
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    expect(onSubmit).toHaveBeenCalledWith(
      { ...initialAddress, street: "C/ Colón 20" },
      expect.anything(),
    );
  });

  it("sends a correct address", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AddressForm onSubmit={onSubmit} />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        firstName: "Ana",
        lastName: "López",
        phone: "611223344",
        street: "C/ Colón 10",
        city: "Valencia",
        province: "",
        postalCode: "46004",
        country: "ES",
      },
      expect.anything(),
    );
  });

  it("shows an error and does not send if the city is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AddressForm onSubmit={onSubmit} />);

    await fillForm(user);
    await user.clear(screen.getByLabelText("Ciudad"));
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    expect(await screen.findByText("La ciudad es obligatoria")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows an error if the postal code does not have 5 digits", async () => {
    const user = userEvent.setup();
    render(<AddressForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText("Código postal"), "460");
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    expect(await screen.findByText("El código postal debe tener 5 cifras")).toBeInTheDocument();
  });

  it("keeps the leading zero of the postal code", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AddressForm onSubmit={onSubmit} />);

    await fillForm(user);
    await user.clear(screen.getByLabelText("Código postal"));
    await user.type(screen.getByLabelText("Código postal"), "01234");
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    expect(onSubmit.mock.calls[0][0].postalCode).toBe("01234");
  });
});
