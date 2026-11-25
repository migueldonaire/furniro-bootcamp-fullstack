import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginPage } from "./LoginPage";
import { useLoginMutation } from "./authApi";

vi.mock("./authApi", () => ({
  useLoginMutation: vi.fn(),
}));

describe("LoginPage", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    (useLoginMutation as any).mockReturnValue([mockLogin]);
  });

  it("muestra error si no se marca el CAPTCHA", async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText("Iniciar sesión"));
    expect(screen.getByText("Confirma que no eres un robot")).toBeInTheDocument();
  });
});