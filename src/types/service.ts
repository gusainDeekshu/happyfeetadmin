// Domain-level types used ONLY by the UI/editor

export interface Item {
  id?: string;          // UI-only
  title: string;
  model?: string;
  description?: string;
  image?: string;
  features: string[];
}

export interface Group {
  id?: string;          // UI-only
  groupTitle: string;
  items: Item[];
}

export interface ServicePageData {
  pageTitle: string;
  slug: string;
  groups: Group[];
}
