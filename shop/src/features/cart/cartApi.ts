import { api } from "../../app/api";

export type CartUpdate = { productId: string; quantity: number };

// The cart lives in the frontend; this only tells the (mocked) API about each change.
const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendCartUpdate: builder.mutation<void, CartUpdate>({
      query: (update) => ({ url: "/cartUpdates", method: "POST", body: update }),
    }),
  }),
});

export const { useSendCartUpdateMutation } = cartApi;
