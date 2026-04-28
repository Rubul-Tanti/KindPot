export type SubscriptionModel = {
  id: string;
  planName: string;
  planDescription?: string;
  price: number;
  currency: string;
  features: string[];
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
};

export type GetSubscriptionModelsResponse = {
  message: string;
  data: SubscriptionModel[];
};

export type CreateSubscriptionOrderResponse = {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    clientSecret: string;
    paymentIntentId: string;
    status: "requires_payment_method" | "requires_confirmation" | "succeeded" | "processing" | "canceled";
  };
};
export type Subscription = {
  id: string;
  subscriptionModelId: string;
  userId: string;

  periodStart: string; // ISO date
  periodEnd: string;   // ISO date

  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  stripeCustomerId: string | null;
  stripeClientSecret: string | null;
  stripeEventId: string | null;

  paymentGateway: "STRIPE"; // can extend later
  amount: number; // in smallest unit (e.g. cents)
  currency: string;

  status: "COMPLETED" | "PENDING" | "FAILED"; // extendable
  failReason: string | null;

  completedAt: string | null;
  cancelledAt: string | null;

  ipAddress: string;
  userAgent: string;

  createdAt: string;
  updatedAt: string;
};