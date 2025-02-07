import { redis } from "./client";
import { keys } from "./keys";
import type { SubscriptionData } from "@/types/subscription";

export async function getStripeCustomerId(
  userId: string,
): Promise<string | null> {
  return redis.get(keys.stripeCustomer(userId));
}

export async function setStripeCustomerId(userId: string, customerId: string) {
  await redis.set(keys.stripeCustomer(userId), customerId);
}

export async function getSubscriptionData(
  customerId: string,
): Promise<SubscriptionData | null> {
  return redis.get(keys.stripeData(customerId));
}

export async function setSubscriptionData(
  customerId: string,
  data: SubscriptionData,
) {
  await redis.set(keys.stripeData(customerId), data);
}

export async function deleteStripeData(userId: string, customerId: string) {
  await redis.del(keys.stripeCustomer(userId));
  await redis.del(keys.stripeData(customerId));
}
