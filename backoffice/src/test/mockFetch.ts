import { vi } from "vitest";

// Fakes the API: every request made with fetch (RTK Query uses it) gets
// this answer. No server is needed. setup.ts undoes it after each test.
// Example: const fetchMock = mockFetch({ id: "1", name: "Ana" });
//          mockFetch({ message: "Not found" }, 404);
export function mockFetch(body: unknown, status = 200) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(async () => Response.json(body, { status }));
}
