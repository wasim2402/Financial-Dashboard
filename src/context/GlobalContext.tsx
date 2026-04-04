import React, { createContext, useContext, useState, useEffect } from "react";
import type { Transaction, Role, ContextState } from "../types";

// Setup initial mocked transactions matching the UI
const getInitialTransactions = (): Transaction[] => [
  {
    id: "t1",
    date: new Date("2023-01-15T09:41:00Z").toISOString(),
    description: "AWS Infrastructure",
    category: "Software",
    type: "Expense",
    amount: 1240.0,
  },
  {
    id: "t2",
    date: new Date("2023-05-20T14:15:00Z").toISOString(),
    description: "Client Project: Zenith",
    category: "Consulting",
    type: "Income",
    amount: 8500.0,
  },
  {
    id: "t3",
    date: new Date("2024-03-10T11:00:00Z").toISOString(),
    description: "Tower HQ Rent",
    category: "Real Estate",
    type: "Expense",
    amount: 4200.0,
  },
  {
    id: "t4",
    date: new Date("2024-03-25T17:30:00Z").toISOString(), // Same month as t3, different day
    description: "Google Ads - Q1",
    category: "Marketing",
    type: "Expense",
    amount: 2150.0,
  },
  {
    id: "t5",
    date: new Date("2025-08-14T09:00:00Z").toISOString(),
    description: "Quarterly Dividends",
    category: "Investment",
    type: "Income",
    amount: 45200.0,
  },
  {
    id: "t6",
    date: new Date("2025-11-02T10:00:00Z").toISOString(),
    description: "Office Rental HQ",
    category: "Real Estate",
    type: "Expense",
    amount: 19000.0,
  },
  {
    id: "t7",
    date: new Date("2026-02-18T10:00:00Z").toISOString(),
    description: "Software License Renewal",
    category: "Software",
    type: "Expense",
    amount: 850.0,
  },
];

interface GlobalContextProps extends ContextState {
  setRole: (role: Role) => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  editTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load from localStorage first
  const [role, setRoleState] = useState<Role>(() => {
    const saved = localStorage.getItem("fa_role");
    return (saved as Role) || "Viewer";
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("fa_transactions_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return getInitialTransactions();
      }
    }
    return getInitialTransactions();
  });

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem("fa_role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("fa_transactions_v2", JSON.stringify(transactions));
  }, [transactions]);

  const setRole = (newRole: Role) => setRoleState(newRole);

  const addTransaction = (tx: Omit<Transaction, "id">) => {
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substring(2, 9),
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const editTransaction = (updatedTx: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === updatedTx.id ? updatedTx : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <GlobalContext.Provider
      value={{
        role,
        transactions,
        setRole,
        addTransaction,
        editTransaction,
        deleteTransaction,
        isSidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
