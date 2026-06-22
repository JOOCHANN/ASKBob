export interface PricingPlan {
  plan: string;
  price: string;
  unit: string;
  features: string[];
}

export interface ProductData {
  name: string;
  version: string;
  features: string[];
  pricing: PricingPlan[];
  supportedIDEs: string[];
  lastUpdated: string;
  sourceUrl: string;
}

export interface Diff {
  field: string;
  old: string;
  new: string;
}

export interface ProductDiff {
  product: string;
  changes: Diff[];
}
