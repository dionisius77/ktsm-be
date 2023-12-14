const STRIPE_PRODUCTS = {
  data: [
    {
      id: "prod_JwT8rukgKpgBnR",
      active: false,
      metadata: {
        DASHBOARD: "true",
        SUBSIDIARY_ACCOUNTS: "10",
        INTEGRATION_COUNT: "10",
        SOFTWARE_STACK: "true",
        TASKS_MANAGEMENT: "true",
        FORMS_MANAGEMENT: "true",
        POSITION: "2",
        SHOW: "true",
        PRICE: "3000",
      },
      name: "Pro Plan",
    },
    {
      id: "prod_Jn7EAJ8x4RLavZ",
      active: true,
      metadata: {
        DASHBOARD: "true",
        SUBSIDIARY_ACCOUNTS: "2",
        INTEGRATION_COUNT: "1",
        SOFTWARE_STACK: "true",
        POSITION: "0",
        TASKS_MANAGEMENT: "true",
        SHOW: "true",
        PRICE: "1000",
      },
      name: "Tasks Plan",
    },
  ],
};

const STRIPE_PRODUCT = {
  id: "prod_Jn7EAJ8x4RLavZ",
  active: true,
  metadata: {
    DASHBOARD: "true",
    SUBSIDIARY_ACCOUNTS: "2",
    INTEGRATION_COUNT: "1",
    SOFTWARE_STACK: "true",
    POSITION: "0",
    TASKS_MANAGEMENT: "true",
    SHOW: "true",
    PRICE: "1000",
  },
  name: "Tasks Plan",
};

const STRIPE_PRICES = {
  data: [
    {
      id: "price_1JIaCGDolxBdkPyDY1uqUZHq",
      unit_amount: 3000,
      product: "prod_JwT8rukgKpgBnR",
      recurring: {
        interval: "month",
      },
    },
    {
      id: "price_1JVqrCGD7jj9JSZZMH65ykme",
      unit_amount: 30000,
      product: "prod_JwT8rukgKpgBnR",
      recurring: {
        interval: "year",
      },
    },
    {
      id: "price_1J9WzxDolxBdkPyDtJpj5sq2",
      unit_amount: 1000,
      product: "prod_Jn7EAJ8x4RLavZ",
      recurring: {
        interval: "month",
      },
    },
  ],
};

const STRIPE_PRICE = {
  id: "price_1J9WzxDolxBdkPyDtJpj5sq2",
  unit_amount: 1000,
  product: "prod_Jn7EAJ8x4RLavZ",
};

const STRIPE_SUBSCRIPTION = {
  created: 1627824549,
  cancel_at: 1627824549,
  items: {
    object: "list",
    data: [
      {
        plan: {
          id: "price_1J9WzxDolxBdkPyDtJpj5sq2",
        },
      },
    ],
  },
};

const STRIPE_CHECKOUT_SESSION = {
  url: "https://www.checkout.com",
};

const STRIPE_BILLING_SESSION = {
  url: "https://www.billing.com",
};

const STRIPE_CHECKOUT_SESSION_PAID = {
  customer: "cus_JzTw2JbWZNMTDB",
  payment_status: "paid",
  subscription: "sub_JzTwgdR0hvNPvo",
};

const STRIPE_CHECKOUT_SESSION_UNPAID = {
  customer: "cus_JzTw2JbWZNMTDB",
  payment_status: "unpaid",
  subscription: "sub_JzTwgdR0hvNPvo",
};

export {
  STRIPE_BILLING_SESSION,
  STRIPE_CHECKOUT_SESSION,
  STRIPE_CHECKOUT_SESSION_PAID,
  STRIPE_CHECKOUT_SESSION_UNPAID,
  STRIPE_PRICE,
  STRIPE_PRICES,
  STRIPE_PRODUCT,
  STRIPE_PRODUCTS,
  STRIPE_SUBSCRIPTION,
};
