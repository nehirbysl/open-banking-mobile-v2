/**
 * Shared app store — localStorage-backed so both Applications list and AppDetail can read.
 */

export interface TppApplication {
  id: string;
  name: string;
  description: string;
  clientId: string;
  clientSecret: string;
  status: 'active' | 'pending' | 'inactive';
  roles: string[];
  redirectUris: string[];
  createdAt: string;
  environment: string;
  companyName?: string;
  contactEmail?: string;
}

const STORAGE_KEY = 'qantara_registered_apps';

const BUILT_IN_APPS: TppApplication[] = [
  {
    id: 'masroofi-demo',
    name: 'Masroofi \u2014 Personal Finance Manager',
    description: "Bank Dhofar's personal finance management app. Aggregates accounts, tracks spending, and provides budgeting insights using Open Banking APIs.",
    clientId: 'masroofi-demo',
    clientSecret: 'masroofi-demo-secret-tnd',
    status: 'active',
    roles: ['AISP'],
    redirectUris: ['https://masroofi.tnd.bankdhofar.com/callback'],
    createdAt: '2026-04-12T00:00:00Z',
    environment: 'production',
    contactEmail: 'emrahbaysal@gmail.com',
  },
  {
    id: 'sadad-payment-gateway',
    name: 'Sadad Payment Gateway',
    description: "Oman's multi-bank payment gateway. Enables merchants to accept payments directly from customers' bank accounts via Open Banking. Supported banks: Bank Dhofar (live), Bank Muscat (coming soon), Sohar International (coming soon).",
    clientId: 'sadad-payment-gateway',
    clientSecret: 'sadad-payment-secret-tnd',
    status: 'active',
    roles: ['PISP', 'CBPII'],
    redirectUris: ['https://sadad.tnd.bankdhofar.com/payment/callback'],
    createdAt: '2026-04-13T00:00:00Z',
    environment: 'production',
    companyName: 'Sadad Technologies LLC',
    contactEmail: 'emrahbaysal@gmail.com',
  },
];

function loadCustomApps(): TppApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomApps(apps: TppApplication[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

/** Get all apps (built-in + user-registered). */
export function getAllApps(): TppApplication[] {
  return [...BUILT_IN_APPS, ...loadCustomApps()];
}

/** Get a single app by ID. */
export function getAppById(id: string): TppApplication | undefined {
  return getAllApps().find(a => a.id === id);
}

/** Register a new app. */
export function registerApp(app: TppApplication): void {
  const custom = loadCustomApps();
  custom.unshift(app);
  saveCustomApps(custom);
}
