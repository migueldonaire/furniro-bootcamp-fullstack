import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { mockFetch } from "../../test/mockFetch";
import { renderWithProviders } from "../../test/renderWithProviders";
import type { User } from "./authApi";
import { ProtectedRoute } from "./ProtectedRoute";

const admin: User = {
  id: "1",
  name: "Luis",
  lastName: "García",
  email: "luis@furniro.com",
  role: "ADMIN",
};

// The same little app in every test: a login page and a private page for admins
function renderPrivatePage(token: string | null) {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<p>Página de login</p>} />
      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route path="/private" element={<p>Privado</p>} />
      </Route>
    </Routes>,
    "/private",
    { auth: { token } },
  );
}

describe("ProtectedRoute", () => {
  it("sends you to the login if there is no token", () => {
    renderPrivatePage(null);
    expect(screen.getByText("Página de login")).toBeInTheDocument();
  });

  it("shows the page if GET /auth/me answers with an admin", async () => {
    const fetchMock = mockFetch(admin); // the fake API answers with Luis
    renderPrivatePage("fake-token");

    // findBy... waits until the answer arrives (getBy... does not wait)
    expect(await screen.findByText("Privado")).toBeInTheDocument();
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toBe("http://localhost:3000/api/v1/auth/me");
    expect(request.headers.get("Authorization")).toBe("Bearer fake-token");
  });

  it("does not show the page to a customer", async () => {
    mockFetch({ ...admin, role: "CUSTOMER" });
    renderPrivatePage("fake-token");
    expect(await screen.findByText("No tienes permiso para ver esta página.")).toBeInTheDocument();
  });

  it("sends you to the login if the token is not valid (401)", async () => {
    mockFetch({ message: "Unauthorized" }, 401);
    renderPrivatePage("expired-token");
    expect(await screen.findByText("Página de login")).toBeInTheDocument();
  });
});
