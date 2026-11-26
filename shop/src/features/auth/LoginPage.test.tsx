import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginPage } from "./LoginPage";
import { useLoginMutation } from "./authApi";
import { renderWithProviders } from "../../test/renderWithProviders";

// authApi falso: así no hacemos peticiones de verdad a la API
vi.mock("./authApi", () => ({
  useLoginMutation: vi.fn(),
}));

type LoginMutationResult = ReturnType<typeof useLoginMutation>;

// Rellena el formulario como lo haría la usuaria y pulsa el botón
function fillForm({ email = "ana@mail.com", checkCaptcha = true } = {}) {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Contraseña"), { target: { value: "Secreta123" } });
  if (checkCaptcha) fireEvent.click(screen.getByLabelText("Confirmo que no soy un robot"));
  fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}

describe("Iniciar sesión en la tienda", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    mockLogin.mockReset(); // cada test empieza de cero
    vi.mocked(useLoginMutation).mockReturnValue([mockLogin, {}] as unknown as LoginMutationResult);
  });

  it("Escenario: Login correcto", async () => {
    // Dado: la API responde con un token
    mockLogin.mockReturnValue({ unwrap: () => Promise.resolve({ accessToken: "fake-token" }) });
    const { store } = renderWithProviders(<LoginPage />);

    // Cuando: Ana inicia sesión
    fillForm();

    // Entonces: el token queda guardado (con él la web pide /auth/me y pinta su nombre)
    await waitFor(() => expect(store.getState().auth.token).toBe("fake-token"));
  });

  it("Escenario: Contraseña incorrecta o email que no existe", async () => {
    // Dado: la API responde 401 con «Credenciales no válidas»
    mockLogin.mockReturnValue({
      unwrap: () => Promise.reject({ status: 401, data: { message: "Credenciales no válidas" } }),
    });
    renderWithProviders(<LoginPage />);

    // Cuando: alguien inicia sesión
    fillForm();

    // Entonces: ve el mensaje
    expect(await screen.findByText("Credenciales no válidas")).toBeInTheDocument();
  });

  it("Escenario: Demasiados intentos", async () => {
    // Dado: ya ha fallado 5 veces y la API responde 429
    mockLogin.mockReturnValue({ unwrap: () => Promise.reject({ status: 429 }) });
    renderWithProviders(<LoginPage />);

    // Cuando: lo intenta una sexta vez
    fillForm();

    // Entonces: ve que tiene que esperar
    expect(await screen.findByText("Demasiados intentos. Espera un minuto")).toBeInTheDocument();
  });

  it("Escenario: Sin pasar el CAPTCHA", async () => {
    // Dado: el formulario de login
    renderWithProviders(<LoginPage />);

    // Cuando: envía el login sin marcar el CAPTCHA
    fillForm({ checkCaptcha: false });

    // Entonces: ve el mensaje y no se llama a la API
    expect(await screen.findByText("Confirma que no eres un robot")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
