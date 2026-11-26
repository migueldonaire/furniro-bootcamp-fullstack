import { formatEuro, priceWithTax } from "../../lib/money";

export type Product = {
  id: string;
  imgURL: string | null;
  title: string;
  description: string;
  price: string;
};

export type ProductRow = {
  id: string;
  name: string;
  description: string;
  base_price: string;
  tax_rate: string;
  url: string | null;
};

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    imgURL: row.url,
    title: row.name,
    description: row.description,
    price: formatEuro(priceWithTax(Number(row.base_price), Number(row.tax_rate))),
  };
}
