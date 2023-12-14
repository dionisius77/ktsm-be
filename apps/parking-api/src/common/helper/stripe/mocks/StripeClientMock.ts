import { addDays, subDays } from "date-fns";

import {
  STRIPE_BILLING_SESSION,
  STRIPE_CHECKOUT_SESSION,
  STRIPE_CHECKOUT_SESSION_PAID,
  STRIPE_CHECKOUT_SESSION_UNPAID,
  STRIPE_PRICE,
  STRIPE_PRICES,
  STRIPE_PRODUCT,
  STRIPE_PRODUCTS,
  STRIPE_SUBSCRIPTION,
} from "./constants.js";

const stripe = {
  products: {
    list: async () => {
      return STRIPE_PRODUCTS;
    },
    retrieve: async () => {
      return STRIPE_PRODUCT;
    },
  },

  prices: {
    list: async () => {
      return STRIPE_PRICES;
    },
    retrieve: async () => {
      return STRIPE_PRICE;
    },
  },

  subscriptions: {
    retrieve: async (subsId) => {
      return subsId !== "EXPIRED"
        ? {
            ...STRIPE_SUBSCRIPTION,
            cancel_at: addDays(new Date(), 1).getTime() / 1000,
          }
        : {
            ...STRIPE_SUBSCRIPTION,
            cancel_at: subDays(new Date(), 1).getTime() / 1000,
          };
    },
  },

  checkout: {
    sessions: {
      create: async () => {
        return STRIPE_CHECKOUT_SESSION;
      },
      retrieve: async (checkoutId) => {
        return checkoutId === "UNPAID"
          ? STRIPE_CHECKOUT_SESSION_UNPAID
          : STRIPE_CHECKOUT_SESSION_PAID;
      },
    },
  },

  billingPortal: {
    sessions: {
      create: async () => {
        return STRIPE_BILLING_SESSION;
      },
    },
  },
};

const StripeClientMock = {
  build: () => stripe,
};

export { StripeClientMock };
