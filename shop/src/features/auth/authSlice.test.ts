import { describe, expect, it } from "vitest";
import authReducer, { loggedIn, loggedOut } from "./authSlice";

describe("authSlice", () => {
  it("keeps only the token when the user logs in", () => {
    const state = authReducer(undefined, loggedIn("token-123"));
    expect(state).toEqual({ token: "token-123" });
  });

  it("returns a new object and does not change the old one", () => {
    const before = { token: "token-123" };
    const after = authReducer(before, loggedOut());
    expect(after).toEqual({ token: null });
    expect(before).toEqual({ token: "token-123" });
    expect(after).not.toBe(before);
  });
});
