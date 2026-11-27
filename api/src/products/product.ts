export type Product = {
  id: string;
  imgURL: string | null;
  title: string;
  description: string;
  basePrice: number;
  taxRate: number;
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
    basePrice:Number(row.base_price),
    taxRate: Number(row.tax_rate),
  };
}
