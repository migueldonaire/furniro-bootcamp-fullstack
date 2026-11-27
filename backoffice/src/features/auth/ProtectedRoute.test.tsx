import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { ProtectedRoute } from "./ProtectedRoute";

describe("Iniciar sesión en el backoffice", () => {
  it("Escenario: Sin sesión", () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<p>Página de login</p>} />
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route path="/products" element={<p>Listado de productos</p>} />
        </Route>
      </Routes>,
      "/products",
    );
    expect(screen.getByText("Página de login")).toBeInTheDocument();
    expect(screen.queryByText("Listado de productos")).not.toBeInTheDocument();
  });
});
