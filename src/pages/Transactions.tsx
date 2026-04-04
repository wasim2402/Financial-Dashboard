import { useState, useMemo } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { TransactionModal } from "../components/TransactionModal";
import type { Transaction } from "../types";

export function Transactions() {
  const { transactions, role, addTransaction, editTransaction, deleteTransaction } = useGlobalContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Filter & Sort State
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterType, setFilterType] = useState("All Types");
  const [sortKey, setSortKey] = useState("Date Newest");

  const isAdmin = role === "Admin";

  const handleAddClick = () => {
    if (!isAdmin) return;
    setEditingTx(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (tx: Transaction) => {
    if (!isAdmin) return;
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let result = transactions.filter((tx) => {
      const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === "All Categories" || tx.category === filterCategory;
      const matchesType = filterType === "All Types" || tx.type === filterType;
      return matchesSearch && matchesCategory && matchesType;
    });

    result.sort((a, b) => {
      if (sortKey === "Date Newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortKey === "Date Oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortKey === "Amount High-Low") {
        return b.amount - a.amount;
      } else if (sortKey === "Amount Low-High") {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [transactions, search, filterCategory, filterType, sortKey]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val).replace("INR", "₹").trim();

  const handleModalSubmit = (tx: any) => {
    if ("id" in tx) {
      editTransaction(tx as Transaction);
    } else {
      addTransaction(tx);
    }
  };

  // Stats over current viewed transactions
  const { viewNet, maxExpValue, maxExpName } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    let highestExp = 0;
    let highestExpName = "None";

    filteredAndSortedTransactions.forEach((tx) => {
      if (tx.type === "Income") inc += tx.amount;
      if (tx.type === "Expense") {
        exp += tx.amount;
        if (tx.amount > highestExp) {
           highestExp = tx.amount;
           highestExpName = tx.description;
        }
      }
    });

    return {
      viewNet: inc - exp,
      maxExpValue: highestExp,
      maxExpName: highestExpName
    };
  }, [filteredAndSortedTransactions]);

  const CATEGORIES = [
    "All Categories",
    "Software",
    "Real Estate",
    "Marketing",
    "Consulting",
    "Investment",
    "Operations",
    "Fixed Cost",
    "Variable",
    "Other"
  ];

  return (
    <section className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">
            Overview
          </span>
          <h2 className="text-3xl font-bold text-white tracking-tight">Transactions</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-[#161616] rounded-xl text-sm font-semibold border border-[#383838] hover:bg-[#161616] transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span> Export
          </button>
          {isAdmin && (
            <button 
              onClick={handleAddClick}
              className="px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span> Add
            </button>
          )}
        </div>
      </div>

      {/* Filters Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-[#161616] border border-[#383838] rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Search transactions..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="w-full px-4 py-2.5 bg-[#161616] border border-[#383838] rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select 
          className="w-full px-4 py-2.5 bg-[#161616] border border-[#383838] rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option>All Types</option>
          <option>Income</option>
          <option>Expense</option>
          <option>Transfer</option>
        </select>
        <select 
          className="w-full px-4 py-2.5 bg-[#161616] border border-[#383838] rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option>Date Newest</option>
          <option>Date Oldest</option>
          <option>Amount High-Low</option>
          <option>Amount Low-High</option>
        </select>
      </div>

      {/* Data Table Container */}
      <div className="bg-[#161616] rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-[#383838]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#383838]">
                <th className="hidden sm:table-cell px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Date
                </th>
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Description
                </th>
                <th className="hidden lg:table-cell px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Category
                </th>
                <th className="hidden md:table-cell px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Type
                </th>
                <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">
                  Amount
                </th>
                {isAdmin && (
                  <th className="px-4 md:px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredAndSortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#161616]/50 transition-colors group">
                    <td className="hidden sm:table-cell px-6 py-4">
                      <div className="text-sm font-medium text-slate-300">
                        {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(tx.date).getFullYear()}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${tx.type === "Income" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}>
                          <span className="material-symbols-outlined text-sm">
                            {tx.type === "Income" ? "payments" : "shopping_cart"}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white truncate max-w-[100px] sm:max-w-none">{tx.description}</span>
                          <span className="sm:hidden text-[10px] text-slate-500">
                            {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {tx.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${tx.type === "Income" ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-primary/10 text-primary border-primary/20"}`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-sm text-slate-400">{tx.type}</td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <span className={`text-sm font-bold whitespace-nowrap ${tx.type === "Income" ? "text-secondary" : "text-tertiary"}`}>
                        {tx.type === "Income" ? "+" : "-"}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 md:px-6 py-4">
                        <div className="flex items-center justify-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditClick(tx)} className="p-2 rounded-lg hover:bg-[#161616] text-slate-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button onClick={() => handleDeleteClick(tx.id)} className="p-2 rounded-lg hover:bg-[#161616] text-slate-400 hover:text-tertiary transition-colors">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#383838] flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Showing <span className="text-white">{filteredAndSortedTransactions.length}</span> results
          </span>
        </div>
      </div>

      {/* Bento Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-[#161616] rounded-xl p-6 border border-[#383838]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Filtered Net</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${viewNet >= 0 ? "bg-secondary/10" : "bg-tertiary/10"}`}>
              <span
                className={`material-symbols-outlined text-sm ${viewNet >= 0 ? "text-secondary" : "text-tertiary"}`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {viewNet >= 0 ? "trending_up" : "trending_down"}
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{viewNet >= 0 ? "+" : ""}{formatCurrency(viewNet)}</div>
          <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
             Current view selection
          </div>
        </div>

        <div className="bg-[#161616] rounded-xl p-6 border border-[#383838]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Largest Expense Filtered
            </span>
            <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-tertiary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                analytics
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{formatCurrency(maxExpValue)}</div>
          <div className="text-xs text-slate-500 font-medium truncate">Outflow: {maxExpName}</div>
        </div>

        <div className="bg-[#161616] rounded-xl p-6 border border-[#383838] relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10">
            <img
              alt="background chart"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaloxv2KSsT3bu570UVscG_uicAAB_rfHlOQX55D3LBPzUF1746jjc8hhqCxpEgmRok8wpDk3mQIbuUq-PArOpOMLKt55sM6IHBpJH57Wzc2E5PCpO82_INky9QI682wX-5Fv7IDFLbn3BUXxlINgCKfYk_orFm6IfQ3JZkpLMHaf6h70DBpSR_WgG2okihVaEdp7MUn6OgHC_5_DYtJ3yuR__UpW_nRnysytl7qDeL61HAhFZHwFiB-FMi75zduTpr-nmQqchKQE"
            />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Insight</span>
              <span className="material-symbols-outlined text-primary text-sm">lightbulb</span>
            </div>
            <p className="text-sm font-medium text-slate-300 leading-relaxed">
              Based on the current filtered view, the highest single outgoing expense was {formatCurrency(maxExpValue)}.
            </p>
          </div>
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTx}
      />
    </section>
  );
}
