export type Role = "Admin" | "Viewer";
export type TransactionType = "Income" | "Expense" | "Transfer";
export type TransactionCategory = "Software" | "Real Estate" | "Marketing" | "Consulting" | "Investment" | "Operations" | "Fixed Cost" | "Variable" | "Other";

export interface Transaction {
  id: string;
  date: string; // ISO String
  description: string;
  category: TransactionCategory | string;
  type: TransactionType;
  amount: number;
}

export type SortConfig = {
  key: "date" | "amount";
  direction: "asc" | "desc";
};

export interface FilterConfig {
  search: string;
  category: string;
  type: string;
}

export interface ContextState {
  role: Role;
  transactions: Transaction[];
}
