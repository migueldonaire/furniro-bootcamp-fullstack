// Shared helpers for prices. Use them in every card that shows money.

// 100 -> "100,00 €"
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
}

// Price with VAT, rounded to cents: priceWithTax(100, 21) -> 121
export function priceWithTax(basePrice: number, taxRate: number): number {
  return Math.round(basePrice * (1 + taxRate / 100) * 100) / 100;
}
