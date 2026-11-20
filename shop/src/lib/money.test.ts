import { describe, expect, it } from "vitest";
import { formatEuro, priceWithTax } from "./money";

describe("money", () => {
  it("adds the VAT to the base price", () => {
    expect(priceWithTax(100, 21)).toBe(121); // Silla Nora
    expect(priceWithTax(250, 21)).toBe(302.5); // Mesa Asgaard
  });

  it("formats euros in Spanish", () => {
    // Intl uses a non-breaking space before €: we compare without spaces
    expect(formatEuro(121).replace(/\s/g, "")).toBe("121,00€");
  });
});
