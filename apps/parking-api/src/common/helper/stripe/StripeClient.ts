import Stripe from "stripe";

// import { StripeClientMock } from "./mocks/StripeClientMock";

const StripeClient = {
  build: () => {
    return new Stripe(
      "sk_test_51IkfxbGD7jj9JSZZzR23M2kFU7PKHCPxfBrSUkAIkyN2U6HAtR3i1LHp568MjE4iubJJ3hm6LaKuvDzvpFWizP1300iEThqNrA",
      {
        apiVersion: "2023-08-16",
      },
    );
  },
};

export { StripeClient };
