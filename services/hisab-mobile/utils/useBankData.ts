/**
 * Hook that loads accounts / balances / transactions from the OBIE API,
 * with an optional pull-to-refresh re-fetch and a "connected" flag.
 */

import { useCallback, useEffect, useState } from "react";
import { isBankConnected } from "./consent";
import { getAccounts, getAllBalances, getAllTransactions, OBAccount, OBBalance, OBTransaction } from "./api";

export interface BankData {
  connected: boolean;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  accounts: OBAccount[];
  balances: OBBalance[];
  transactions: OBTransaction[];
  refresh: () => Promise<void>;
}

export function useBankData(): BankData {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<OBAccount[]>([]);
  const [balances, setBalances] = useState<OBBalance[]>([]);
  const [transactions, setTransactions] = useState<OBTransaction[]>([]);

  const load = useCallback(async (mode: "initial" | "refresh") => {
    try {
      const isConnected = await isBankConnected();
      setConnected(isConnected);
      if (!isConnected) {
        if (mode === "initial") setLoading(false);
        return;
      }

      if (mode === "refresh") setRefreshing(true);
      else setLoading(true);

      const [a, b, t] = await Promise.all([
        getAccounts().catch(() => []),
        getAllBalances().catch(() => []),
        getAllTransactions().catch(() => []),
      ]);
      setAccounts(a);
      setBalances(b);
      setTransactions(t);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load("initial");
  }, [load]);

  const refresh = useCallback(async () => {
    await load("refresh");
  }, [load]);

  return {
    connected,
    loading,
    refreshing,
    error,
    accounts,
    balances,
    transactions,
    refresh,
  };
}
