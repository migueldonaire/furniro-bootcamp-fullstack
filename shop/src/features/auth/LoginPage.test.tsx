import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { LoginPage } from "./LoginPage";
import { useLoginMutation } from "./authApi";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("./authApi", () => ({
  useLoginMutation: vi.fn(),
}));

describe("LoginPage", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    (useLoginMutation as any).mockReturnValue([mockLogin]);
  });

  it("muestra error si no se marca el CAPTCHA", async () => {
  renderWithProviders(<LoginPage />);

  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Contraseña"), {
    target: { value: "123456" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

  expect(screen.getByText("Confirma que no eres un robot")).toBeInTheDocument();
});
});