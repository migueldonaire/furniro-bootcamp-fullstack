import { api } from "../../app/api";

export type User = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
};

export type LoginResponse = { accessToken: string };

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({ query: () => "/auth/me" }),
    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useGetMeQuery, useLazyGetMeQuery, useLoginMutation } = authApi;
