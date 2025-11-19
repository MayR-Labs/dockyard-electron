export type AppCategory = string;
export type AppSuite = string | null;

export interface PopularApp {
  id: string;
  name: string;
  url: string;
  logo_url: string;
  description: string;
  categories: AppCategory[];
  collections: string[];
  suite: AppSuite;
}

export interface AppSetupData {
  categories: AppCategory[];
  suites: AppSuite[];
  collections: string[];
  apps: PopularApp[];
}

export interface AppSetupApiResponse {
  status: 'success' | 'error';
  message: string;
  data?: AppSetupData;
}
