import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup(); // removes what the test rendered
  vi.restoreAllMocks(); // fetch is real again (see mockFetch.ts)
});
