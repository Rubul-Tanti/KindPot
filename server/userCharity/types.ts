export type CharityImage = {
  id: string;
  charityId: string;
  url: string;
  altText: string;
  order: number;
  createdAt: string;
};
export type Charity = {
  id: string;
  name: string;
  slug: string;
  description: string;

  logoUrl: string;
  websiteUrl: string;

  isFeatured: boolean;
  isActive: boolean;
  country: string;

  createdAt: string;
  updatedAt: string;

  images: CharityImage[]; // ✅ added
};
export type UserCharity = {
  id: string;
  userId: string;
  charityId: string;
  subscriptionId: string;

  type: "SUBSCRIPTION_PERCENTAGE";

  percentage: number | null;
  amount: string; // ⚠️ comes as string
  currency: string;

  month: number;
  year: number;

  status: "PENDING" | "COMPLETED" | "FAILED";

  paidAt: string;
  createdAt: string;
  updatedAt: string;

  charity: Charity;
};
export type UserCharityResponse = {
  message: string;
  data: UserCharity;
};