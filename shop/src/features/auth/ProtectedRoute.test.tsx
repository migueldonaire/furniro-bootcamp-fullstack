import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/renderWithProviders";
import { ProtectedRoute } from "./ProtectedRoute";

describe("ProtectedRoute", () => {
  it("sends you to the login if there is no token", () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<p>Página de login</p>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/private" element={<p>Privado</p>} />
        </Route>
      </Routes>,
      "/private",
    );
    expect(screen.getByText("Página de login")).toBeInTheDocument();
  });
});
