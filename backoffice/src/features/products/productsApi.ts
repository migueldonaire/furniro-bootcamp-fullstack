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

export type ProductStatus = "ACTIVE" | "INACTIVE";

export type SearchFilters = { search?: string; status?: ProductStatus };

const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminProducts: builder.query<AdminProduct[], SearchFilters>({
      query: (searchFilters) => ({ url: "/admin/products", params: searchFilters }),
      providesTags: ["Product"],
    }),
  }),
});

export const { useGetAdminProductsQuery } = productsApi;
