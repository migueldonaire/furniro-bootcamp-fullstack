import { api } from "../../app/api";

export type AdminProduct = {
  id: string;
  name: string;
  sku: string;
  basePrice: string;
  stock: number;
  status: ProductStatus;
  categoryName: string;
  imageUrl: string | null;
};

export type Category = {
  id: string;
  name: string;
};

export type ProductStatus = "ACTIVE" | "INACTIVE";

export type SortOption = "newest" | "oldest" | "priceDesc" | "priceAsc";

// Copiado a mano las categorías de la BBDD, hasta que haya un endpoint que devuelva una lista de categorías (si lo hay algún día).
export const productCategories: Category[] = [
  { id: "c0000000-0000-4000-8000-000000000001", name: "Sillas" },
  { id: "c0000000-0000-4000-8000-000000000002", name: "Mesas" },
  { id: "c0000000-0000-4000-8000-000000000003", name: "Sofás" },
  { id: "c0000000-0000-4000-8000-000000000004", name: "Lámparas" },
  { id: "c0000000-0000-4000-8000-000000000005", name: "Dormitorio" },
  { id: "c0000000-0000-4000-8000-000000000006", name: "Decoración" },
];

export type SearchFilters = {
  search?: string;
  status?: ProductStatus;
  category?: string;
  sort?: SortOption;
};

const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProducts: builder.query<AdminProduct[], SearchFilters>({
      query: (searchFilters) => ({ url: "/admin/products", params: searchFilters }),
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetAdminProductsQuery } = productsApi;
