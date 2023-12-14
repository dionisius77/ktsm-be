import { isBefore } from "date-fns";

import { FREE_TRIAL_PLAN } from "./constants";
import { StripeClient } from "./StripeClient";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

const stripe = StripeClient.build();
const config: ConfigService = new ConfigService();

const StripeUtils = {
  getFreeTrialPlan: () => {
    return FREE_TRIAL_PLAN;
  },

  listPlans: async () => {
    try {
      const stripePricesResponse = await stripe.prices.list();
      const stripePrices = stripePricesResponse.data;

      const stripeProductsResponse = await stripe.products.list();
      const stripeProducts = stripeProductsResponse.data;

      let plans = [];

      for (const product of stripeProducts
        .filter((p) => p.metadata.SHOW === "true")
        .sort((a, b) => {
          const positionA = Number(a.metadata.POSITION);
          const positionB = Number(b.metadata.POSITION);
          return positionA - positionB;
        })) {
        const prices = stripePrices.filter((p) => p.product === product.id);
        const plan = parsePlan(prices, product);
        plans = [...plans, plan];
      }

      return plans;
    } catch (e) {
      console.error("StripeUtils", "listPlans", e.message);
      return [];
    }
  },
  getPlan: async (priceId: string) => {
    try {
      const price = await stripe.prices.retrieve(priceId);
      const product = await stripe.products.retrieve(price.product.toString());

      return parsePlan([price], product);
    } catch (e) {
      console.error("StripeUtils", "getPlan", e.message);
      return null;
    }
  },
  getSubscription: async (subscriptionId: string, active: boolean = true) => {
    try {
      const stripeSubscription =
        await stripe.subscriptions?.retrieve(subscriptionId);

      if (
        active &&
        stripeSubscription.cancel_at &&
        isBefore(new Date(stripeSubscription.cancel_at * 1000), new Date())
      ) {
        return null;
      }

      const plan = await StripeUtils.getPlan(
        stripeSubscription.items.data[0].plan.id,
      );

      return {
        plan,
        createdAt: new Date(stripeSubscription.created * 1000),
      };
    } catch (e) {
      console.error("StripeUtils", "getSubscription", e.message);
      return null;
    }
  },
  getCheckoutSession: async (checkoutId) => {
    try {
      const checkout = await stripe.checkout.sessions.retrieve(checkoutId);
      return {
        paymentStatus: checkout.payment_status,
        customerId: checkout.customer,
        subscriptionId: checkout.subscription,
      };
    } catch (e) {
      console.error("StripeUtils", "getCheckoutSession", e.message);
      return null;
    }
  },
  createCheckoutSession: async (priceId, customerId) => {
    try {
      let checkoutParams: Stripe.Checkout.SessionCreateParams = {
        success_url: `${config.get<string>(
          "CHECKOUT_SUCCESS_URL",
        )}?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: config.get<string>("CHECKOUT_CANCEL_URL"),
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
      };

      if (customerId) {
        checkoutParams = { ...checkoutParams, customer: customerId };
      }

      const session = await stripe.checkout.sessions.create(checkoutParams);
      return session.url;
    } catch (e) {
      console.error("StripeUtils", "createCheckoutSession", e.message);
      return null;
    }
  },
  createBillingSession: async (customerId) => {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: config.get<string>("BILLING_RETURN_URL"),
      });
      return session.url;
    } catch (e) {
      console.error("StripeUtils", "createBillingSession", e.message);
      return null;
    }
  },
  createMobileCheckoutSession: async (priceId, customerId) => {
    try {
      let checkoutParams: Stripe.Checkout.SessionCreateParams = {
        success_url: `${config.get<string>(
          "CHECKOUT_SUCCESS_URL_MOBILE",
        )}?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: config.get<string>("CHECKOUT_CANCEL_URL"),
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
      };

      if (customerId) {
        checkoutParams = { ...checkoutParams, customer: customerId };
      }

      const session = await stripe.checkout.sessions.create(checkoutParams);
      return session.url;
    } catch (e) {
      console.error("StripeUtils", "createCheckoutSession", e.message);
      return null;
    }
  },
};

const parseFeaturesFromMetadata = (metadata) => {
  let features = [];
  for (const [key, value] of Object.entries(metadata)) {
    features = [...features, { name: key, value }];
  }

  return features;
};

const parsePlan = (prices, product) => {
  return {
    id: product.id,
    name: product.name,
    prices: prices.map((price) => ({
      id: price.id,
      amount: price.unit_amount,
      interval: price.recurring?.interval,
    })),
    features: parseFeaturesFromMetadata(product.metadata),
    active: product.active,
  };
};

export { StripeUtils };
