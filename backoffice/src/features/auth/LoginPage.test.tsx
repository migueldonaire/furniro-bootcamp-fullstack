import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { LoginPage } from "./LoginPage";
import { useLazyGetMeQuery, useLoginMutation } from "./authApi";
import { renderWithProviders } from "../../test/renderWithProviders";
import { Route, Routes } from "react-router";

vi.mock("./authApi", () => ({
  useLoginMutation: vi.fn(),
  useLazyGetMeQuery: vi.fn(),
}));

const mockLogin = vi.fn();
const mockGetMe = vi.fn();

function resolved<T>(value: T) {
  return { unwrap: () => Promise.resolve(value) };
}

function rejected(error: unknown) {
  return { unwrap: () => Promise.reject(error) };
}

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "luis@mail.com" } });
  fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "Secret123" } });
  fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
}

describe("Iniciar sesión en el backoffice", () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockGetMe.mockReset();
    vi.mocked(useLoginMutation).mockReturnValue([mockLogin, {}] as unknown as ReturnType<
      typeof useLoginMutation
    >);
    vi.mocked(useLazyGetMeQuery).mockReturnValue([mockGetMe, {}, {}] as unknown as ReturnType<
      typeof useLazyGetMeQuery
    >);
  });

  it("toggles the password visibility with the eye button", () => {
    renderWithProviders(<LoginPage />, "/login");
    const password = screen.getByLabelText("Contraseña");

    expect(password).toHaveAttribute("type", "password");
    fireEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));
    expect(password).toHaveAttribute("type", "text");
  });

  it("Escenario: Un administrador entra", async () => {
    mockLogin.mockReturnValue(resolved({ accessToken: "token-luis" }));
    mockGetMe.mockReturnValue(resolved({ id: "a1", name: "Luis", role: "ADMIN" }));
    const { store } = renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products" element={<p>Listado de productos</p>} />
      </Routes>,
      "/login",
    );
    fillAndSubmit();
    expect(await screen.findByText("Listado de productos")).toBeInTheDocument();
    expect(store.getState().auth.token).toBe("token-luis");
  });

  it("Escenario: Una clienta no puede entrar", async () => {
    mockLogin.mockReturnValue(resolved({ accessToken: "token-ana" }));
    mockGetMe.mockReturnValue(resolved({ id: "u1", name: "Ana", role: "CUSTOMER" }));
    const { store } = renderWithProviders(<LoginPage />, "/login");
    fillAndSubmit();
    expect(await screen.findByText("No tienes permiso para acceder")).toBeInTheDocument();
    expect(store.getState().auth.token).toBeNull();
  });

  it("Escenario: Credenciales incorrectas", async () => {
    mockLogin.mockReturnValue(
      rejected({ status: 401, data: { message: "Credenciales no válidas" } }),
    );
    renderWithProviders(<LoginPage />, "/login");
    fillAndSubmit();
    expect(await screen.findByText("Credenciales no válidas")).toBeInTheDocument();
    expect(mockGetMe).not.toHaveBeenCalled();
  });

  it("Escenario: Demasiados intentos", async () => {
    mockLogin.mockReturnValue(rejected({ status: 429 }));
    renderWithProviders(<LoginPage />, "/login");
    fillAndSubmit();
    expect(await screen.findByText("Demasiados intentos. Espera un minuto")).toBeInTheDocument();
    expect(mockGetMe).not.toHaveBeenCalled();
  });
});
