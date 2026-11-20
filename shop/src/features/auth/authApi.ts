import { api } from "../../app/api";

export type User = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
};

// GET /auth/me: who am I? It sends the token (see app/api.ts) and the API
// answers with the user. The user only lives in the cache of RTK Query,
// never in localStorage.
const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({ query: () => "/auth/me" }),
  }),
});

export const { useGetMeQuery } = authApi;
