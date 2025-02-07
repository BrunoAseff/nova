export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "trialing"
  | "unpaid"
  | "paused"
  | "none";

export interface SubscriptionData {
  status: SubscriptionStatus;
  subscriptionId?: string;
  priceId?: string;
  currentPeriodEnd?: number;
  currentPeriodStart?: number;
  cancelAtPeriodEnd?: boolean;
  paymentMethod?: {
    brand: string | null;
    last4: string | null;
  } | null;
}
