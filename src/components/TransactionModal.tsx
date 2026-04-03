import { useState, useEffect } from "react";
import type { Transaction, TransactionType, TransactionCategory } from "../types";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tx: Omit<Transaction, "id"> | Transaction) => void;
  initialData?: Transaction | null;
}

const CATEGORIES: TransactionCategory[] = [
  "Software",
  "Real Estate",
  "Marketing",
  "Consulting",
  "Investment",
  "Operations",
  "Fixed Cost",
  "Variable",
  "Other",
];

export function TransactionModal({ isOpen, onClose, onSubmit, initialData }: TransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("Expense");
  const [category, setCategory] = useState<TransactionCategory>("Software");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description);
      setAmount(initialData.amount.toString());
      setType(initialData.type);
      setCategory(initialData.category as TransactionCategory);
      setDate(new Date(initialData.date).toISOString().slice(0, 16)); // Format for datetime-local
    } else {
      setDescription("");
      setAmount("");
      setType("Expense");
      setCategory("Software");
      setDate(new Date().toISOString().slice(0, 16));
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date(date).toISOString(),
    };
    
    if (initialData) {
      onSubmit({ ...data, id: initialData.id });
    } else {
      onSubmit(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#161616] border border-[#383838] w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-[#161616] rounded-xl transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
        <h3 className="text-xl font-bold text-white mb-6">
          {initialData ? "Edit Transaction" : "New Transaction"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <input
              required
              className="w-full px-4 py-2 bg-[#161616] border border-[#383838] rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. AWS Infrastructure"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Amount</label>
              <input
                required
                className="w-full px-4 py-2 bg-[#161616] border border-[#383838] rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Type</label>
              <select
                className="w-full px-4 py-2 bg-[#161616] border border-[#383838] rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
              <select
                className="w-full px-4 py-2 bg-[#161616] border border-[#383838] rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date</label>
              <input
                required
                className="w-full px-4 py-2 bg-[#161616] border border-[#383838] rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-[#161616] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
