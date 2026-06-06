export interface Asset {
  originalName: string;
  suggestedSlug: string;
}

export interface Category {
  name: string;
  assets: Asset[];
}

export interface Metadata {
  projectName: string;
  totalAssets: number;
  totalCategories: number;
}

export interface OrganizeResponse {
  categories: Category[];
  metadata: Metadata;
  improvements: string[];
}
