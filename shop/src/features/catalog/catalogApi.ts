import { api } from "../../app/api";
import { toProduct, type Product, type ProductRow } from "./product";

const catalogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: (rows: ProductRow[]) => rows.map(toProduct),
    }),
  }),
});

export const { useGetProductsQuery } = catalogApi;
