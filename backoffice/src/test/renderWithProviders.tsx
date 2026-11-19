import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { makeStore } from "../app/store";

// Renders a component with a fresh store and a router, for the tests
export function renderWithProviders(ui: ReactElement, route = "/") {
  const store = makeStore();
  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>,
  );
  return { store, ...result };
}
