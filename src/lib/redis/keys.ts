export const keys = {
  stripeCustomer: (userId: string) => `stripe:user:${userId}`,
  stripeData: (customerId: string) => `stripe:customer:${customerId}`,
} as const;
