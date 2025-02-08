"use client";

import { createContext, useContext, useState } from "react";
import type { SubscriptionData } from "@/types/subscription";

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  isSupernova: boolean;
  updateSubscription: (data: SubscriptionData) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null,
  );

  const isSupernova = subscription?.status === "active";

  const updateSubscription = (data: SubscriptionData) => {
    setSubscription(data);
  };

  return (
    <SubscriptionContext.Provider
      value={{ subscription, isSupernova, updateSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return context;
};
