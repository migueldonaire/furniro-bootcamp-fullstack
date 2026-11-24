import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { makeStore } from "../app/store";

type PreloadedState = Parameters<typeof makeStore>[0];

// Renders a component with a fresh store and a router, for the tests.
// - route: the URL where the test starts ("/private", "/products/3"...)
// - preloadedState: how the store starts, e.g. { auth: { token: "fake-token" } }
export function renderWithProviders(
  ui: ReactElement,
  route = "/",
  preloadedState?: PreloadedState,
) {
  const store = makeStore(preloadedState);
  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>,
  );
  return { store, ...result };
}
