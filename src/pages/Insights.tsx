import { useMemo } from "react";
import { useGlobalContext } from "../context/GlobalContext";

export function Insights() {
  const { transactions } = useGlobalContext();

  const formatCurrency = (val: number, abbreviate = false) => {
    if (abbreviate && val >= 1000) {
      return `₹${(val / 1000).toFixed(1)}k`;
    }
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val).replace("INR", "₹").trim();
  };

  const {
    savingsRate,
    topCategory,
    topCategoryPercentage,
    avgExpense,
    entries,
    sortedCategories
  } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const categoryTotals: Record<string, number> = {};

    transactions.forEach(tx => {
      if (tx.type === "Income") inc += tx.amount;
      if (tx.type === "Expense") {
        exp += tx.amount;
        if (!categoryTotals[tx.category]) categoryTotals[tx.category] = 0;
        categoryTotals[tx.category] += tx.amount;
      }
    });

    const svRate = inc > 0 ? Math.max(0, ((inc - exp) / inc) * 100) : 0;

    let topCat = "None";
    let topCatAmt = 0;
    for (const [cat, amt] of Object.entries(categoryTotals)) {
      if (amt > topCatAmt) {
        topCatAmt = amt;
        topCat = cat;
      }
    }

    const sortedCats = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        percentage: exp > 0 ? (value / exp) * 100 : 0
      }));

    return {
      income: inc,
      expense: exp,
      savingsRate: svRate,
      topCategory: topCat,
      topCategoryAmount: topCatAmt,
      topCategoryPercentage: exp > 0 ? (topCatAmt / exp) * 100 : 0,
      avgExpense: exp > 0 ? exp / Math.max(1, new Set(transactions.map(t => new Date(t.date).getMonth())).size) : 0,
      entries: transactions.length,
      sortedCategories: sortedCats.slice(0, 5) // Top 5
    };
  }, [transactions]);

  const { monthlyData, maxMonthlyValue } = useMemo(() => {
    const data: Record<string, { income: number, expense: number, month: string, order: number }> = {};
    const now = new Date();
    // Initialize last 6 months to ensure recent emptiness is visually anchored
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const yearStr = d.getFullYear().toString().slice(2);
      data[key] = {
        month: `${d.toLocaleString("en-US", { month: "short" })} '${yearStr}`,
        income: 0,
        expense: 0,
        order: d.getFullYear() * 100 + d.getMonth()
      };
    }

    transactions.forEach(tx => {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const yearStr = d.getFullYear().toString().slice(2);
      if (!data[key]) {
        data[key] = {
          month: `${d.toLocaleString("en-US", { month: "short" })} '${yearStr}`,
          income: 0,
          expense: 0,
          order: d.getFullYear() * 100 + d.getMonth()
        };
      }
      if (tx.type === "Income") data[key].income += tx.amount;
      if (tx.type === "Expense") data[key].expense += tx.amount;
    });

    const vals = Object.values(data).sort((a, b) => a.order - b.order);
    const mxVal = Math.max(...vals.flatMap(d => [d.income, d.expense]), 1); // Avoid div by 0

    return {
      monthlyData: vals,
      maxMonthlyValue: mxVal
    };
  }, [transactions]);

  const barColors = ["bg-blue-600"];

  return (
    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight">Insights</h2>
        </div>
        <div className="flex items-center gap-2 bg-[#161616] p-1 rounded-xl">
          <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#161616] text-white shadow-sm">
            Monthly
          </button>
          <button className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            Quarterly
          </button>
          <button className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors">
            Yearly
          </button>
        </div>
      </div>

      {/* Top Stat Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Savings Rate */}
        <div className="bg-[#161616] p-6 rounded-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-blue-600 bg-blue-600/10 p-2 rounded-lg">
              account_balance_wallet
            </span>
            <span className="text-[0.65rem] font-bold text-blue-600 uppercase tracking-tighter bg-blue-600/10 px-2 py-0.5 rounded">
              Trend
            </span>
          </div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Savings Rate
          </p>
          <h3 className="text-3xl font-bold text-white mt-1">{savingsRate.toFixed(1)}%</h3>
          <div className="mt-4 h-1 w-full bg-[#161616] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-1000"
              style={{ width: `${savingsRate}%` }}
            ></div>
          </div>
        </div>

        {/* Top Category */}
        <div className="bg-[#161616] p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-blue-600 bg-blue-600/10 p-2 rounded-lg">
              shopping_bag
            </span>
          </div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Top Category
          </p>
          <h3 className="text-3xl font-bold text-white mt-1 truncate">{topCategory}</h3>
          <p className="text-[10px] text-slate-500 mt-2">Accounts for {topCategoryPercentage.toFixed(0)}% of total spend</p>
        </div>

        {/* Avg Monthly Expense */}
        <div className="bg-[#161616] p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-2 rounded-lg">
              trending_up
            </span>
          </div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Avg Expense
          </p>
          <h3 className="text-3xl font-bold text-white mt-1">{formatCurrency(avgExpense)}</h3>
          <p className="text-[10px] text-slate-500 mt-2">Per active month</p>
        </div>

        {/* Expense Entries */}
        <div className="bg-[#161616] p-6 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="material-symbols-outlined text-on-surface-variant bg-surface-variant/30 p-2 rounded-lg">
              list_alt
            </span>
          </div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Entries
          </p>
          <h3 className="text-3xl font-bold text-white mt-1">{entries}</h3>
          <p className="text-[10px] text-slate-500 mt-2">Transactions overall</p>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Comparison Bar Chart */}
        <div className="lg:col-span-2 bg-[#161616] rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-lg font-bold text-white tracking-tight">Monthly Comparison</h4>
              <p className="text-slate-400 text-xs">Income vs Expenses over the last 6 months</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#93c5fd]"></div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-blue-600"></div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Expenses</span>
              </div>
            </div>
          </div>

          {/* Grouped Bar Chart Area */}
          <div className="h-64 flex items-end justify-between gap-2 px-2 relative border-b border-[#383838] pb-2">
            {/* Grid Lines (Background) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
              <div className="w-full border-t border-[#383838]"></div>
              <div className="w-full border-t border-[#383838]"></div>
              <div className="w-full border-t border-[#383838]"></div>
              <div className="w-full border-t border-[#383838]"></div>
            </div>

            {monthlyData.map((data, index) => {
              const incomeHeight = Math.max(5, (data.income / maxMonthlyValue) * 100);
              const expenseHeight = Math.max(5, (data.expense / maxMonthlyValue) * 100);
              const monthShort = data.month.split(" ")[0]; // "Oct", "Jan", etc.

              return (
                <div key={index} className="flex flex-col items-center flex-1 group z-10 h-full relative">
                  <div className="flex items-end gap-[6px] w-full max-w-[60px] h-[90%] mt-auto px-1">
                    <div
                      className="bg-[#93c5fd] w-1/2 rounded-t-[4px] transition-all relative group/income"
                      style={{ height: `${incomeHeight}%` }}
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#93c5fd] opacity-0 group-hover:opacity-100 transition-opacity bg-[#0A0A0A] px-1.5 py-0.5 rounded border border-[#383838] whitespace-nowrap z-20">
                        {formatCurrency(data.income, true)}
                      </span>
                    </div>
                    <div
                      className="bg-blue-600 w-1/2 rounded-t-[4px] transition-all relative group/expense"
                      style={{ height: `${expenseHeight}%` }}
                    >
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0A0A0A] px-1.5 py-0.5 rounded border border-[#383838] whitespace-nowrap z-20">
                        {formatCurrency(data.expense, true)}
                      </span>
                    </div>
                  </div>
                  <span className="absolute -bottom-6 text-[11px] font-medium text-slate-500">
                    {monthShort}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-8"></div> {/* Spacer for x-axis labels */}
        </div>

        {/* Category Breakdown */}
        <div className="bg-[#161616] rounded-xl p-8">
          <div className="mb-8">
            <h4 className="text-lg font-bold text-white tracking-tight">Category Breakdown</h4>
            <p className="text-slate-400 text-xs">Expense allocation by type</p>
          </div>
          <div className="space-y-6">
            {sortedCategories.length === 0 ? (
              <p className="text-sm text-slate-500">No expenses recorded yet.</p>
            ) : (
              sortedCategories.map((cat, idx) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-white">{cat.name}</span>
                    <span className="text-slate-400">{formatCurrency(cat.value)} ({cat.percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-[#161616] rounded-full">
                    <div
                      className={`h-full ${barColors[idx % barColors.length]} rounded-full transition-all duration-1000`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-[#383838] text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-[#161616] transition-colors">
            View Detailed Report
          </button>
        </div>
      </div>

      {/* Smart Observations Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span
            className="material-symbols-outlined text-blue-600"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
          <h4 className="text-xl font-bold text-white tracking-tight">Smart Observations</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Observation Card */}
          <div className="bg-[#161616] border-l-4 border-blue-600 p-6 rounded-r-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
              <h5 className="font-bold text-sm text-white">Top Spending Category</h5>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Spending in {topCategory} is currently your highest at{' '}
              <span className="text-blue-600 font-bold">{topCategoryPercentage.toFixed(0)}%</span> of total expenses.
            </p>
          </div>
          {/* Observation Card */}
          <div className="bg-[#161616] border-l-4 border-blue-600 p-6 rounded-r-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-blue-600 text-lg">info</span>
              <h5 className="font-bold text-sm text-white">Savings Rate Indicator</h5>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your current savings rate is{' '}
              <span className="text-blue-600 font-bold">{savingsRate.toFixed(1)}%</span>. {savingsRate > 20 ? "Budgeting looks healthy." : "There may be opportunities to reduce non-essential spending."}
            </p>
          </div>
          {/* Observation Card */}
          <div className="bg-[#161616] border-l-4 border-tertiary p-6 rounded-r-xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-tertiary text-lg">warning</span>
              <h5 className="font-bold text-sm text-white">Activity Alert</h5>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Currently tracking <span className="text-tertiary font-bold">{entries}</span> transactions. More data will improve trend accuracy.
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Credits */}
      <footer className="p-10 text-center border-t border-[#161616]/30">
        <p className="text-xs text-slate-500 font-medium">
          © 2026 Financial Dashboard.
        </p>
      </footer>
    </div>
  );
}
