import { api } from "../../app/api";
import { type Product } from "./product";

const catalogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
    }),
  }),
});

export const { useGetProductsQuery } = catalogApi;
