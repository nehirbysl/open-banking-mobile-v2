/**
 * Open Banking permission scope -> human-readable label mapping.
 * Mirrors the web app's PermissionDisplay component.
 */

export const PERMISSION_GROUPS: Record<string, { label: string; perms: string[] }> = {
  "Account Information": {
    label: "Account Information",
    perms: [
      "ReadAccountsBasic",
      "ReadAccountsDetail",
      "ReadBalances",
      "ReadProducts",
    ],
  },
  Transactions: {
    label: "Transactions",
    perms: [
      "ReadTransactionsBasic",
      "ReadTransactionsDetail",
      "ReadTransactionsCredits",
      "ReadTransactionsDebits",
    ],
  },
  Beneficiaries: {
    label: "Beneficiaries",
    perms: ["ReadBeneficiariesBasic", "ReadBeneficiariesDetail"],
  },
  "Direct Debits & Standing Orders": {
    label: "Direct Debits & Standing Orders",
    perms: [
      "ReadDirectDebits",
      "ReadStandingOrdersBasic",
      "ReadStandingOrdersDetail",
    ],
  },
  Statements: {
    label: "Statements",
    perms: ["ReadStatementsBasic", "ReadStatementsDetail"],
  },
  Payments: {
    label: "Payments",
    perms: ["ReadPAN", "Create"],
  },
};

export function describePermission(perm: string): string {
  const map: Record<string, string> = {
    ReadAccountsBasic: "Account name and identifiers",
    ReadAccountsDetail: "Account details (sort code, IBAN)",
    ReadBalances: "Account balances",
    ReadProducts: "Account product information",
    ReadTransactionsBasic: "Basic transaction information",
    ReadTransactionsDetail: "Full transaction details",
    ReadTransactionsCredits: "Incoming transactions only",
    ReadTransactionsDebits: "Outgoing transactions only",
    ReadBeneficiariesBasic: "Beneficiary names",
    ReadBeneficiariesDetail: "Beneficiary full details",
    ReadDirectDebits: "Direct debit mandates",
    ReadStandingOrdersBasic: "Standing order summaries",
    ReadStandingOrdersDetail: "Standing order full details",
    ReadStatementsBasic: "Statement summaries",
    ReadStatementsDetail: "Statement details",
    ReadPAN: "Card PAN (full card number)",
    Create: "Initiate a payment",
  };
  return map[perm] || perm;
}

export const CONSENT_TYPE_LABEL: Record<string, string> = {
  "account-access": "Account Access",
  "domestic-payment": "Domestic Payment",
  "scheduled-payment": "Scheduled Payment",
  "standing-order": "Standing Order",
  "domestic-vrp": "Variable Recurring Payment",
  "funds-confirmation": "Funds Confirmation",
};

export const STATUS_COLOR: Record<string, string> = {
  AwaitingAuthorisation: "#F59E0B",
  Authorised: "#16A34A",
  Rejected: "#DC2626",
  Consumed: "#64748B",
  Revoked: "#94A3B8",
  Expired: "#94A3B8",
};

export const STATUS_LABEL: Record<string, string> = {
  AwaitingAuthorisation: "Awaiting Approval",
  Authorised: "Active",
  Rejected: "Rejected",
  Consumed: "Used",
  Revoked: "Revoked",
  Expired: "Expired",
};
