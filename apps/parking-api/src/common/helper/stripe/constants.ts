const FREE_TRIAL_PLAN = {
  id: "FREE_TRIAL",
  name: "Free Trial",
  prices: [
    {
      id: "FREE_TRIAL",
      amount: 0,
      interval: "month",
    },
  ],
  features: [
    {
      name: "DASHBOARD",
      value: "true",
    },
    {
      name: "TASKS_MANAGEMENT",
      value: "true",
    },
    {
      name: "POSITION",
      value: "0",
    },
  ],
  active: true,
};

export { FREE_TRIAL_PLAN };
