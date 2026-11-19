import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

export type Health = { status: string; version: string; database: string };

// The ONLY createApi of the app. Do not add your endpoints here:
// each feature adds its own in its folder with api.injectEndpoints
// (see src/features/README.md). That way two pairs never edit this file.
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL, // http://localhost:3000/api/v1
    // Sends the token (if there is one) in every request
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Product", "Order", "User"],
  endpoints: (builder) => ({
    getHealth: builder.query<Health, void>({ query: () => "/health" }),
  }),
});

export const { useGetHealthQuery } = api;
