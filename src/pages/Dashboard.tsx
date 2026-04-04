import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useGlobalContext } from "../context/GlobalContext";

export function Dashboard() {
  const { transactions } = useGlobalContext();

  const { totalIncome, totalExpenses, totalBalance } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach((tx) => {
      if (tx.type === "Income") inc += tx.amount;
      if (tx.type === "Expense") exp += tx.amount;
    });
    return {
      totalIncome: inc,
      totalExpenses: exp,
      totalBalance: inc - exp + 200000, // added base to match realistic numbers for the demo
    };
  }, [transactions]);

  // Aggregate monthly data for area chart
  const monthlyData = useMemo(() => {
    const aggregated = transactions.reduce((acc, tx) => {
      const date = new Date(tx.date);
      const year = date.getFullYear().toString().slice(2);
      const monthLabel = `${date.toLocaleString("en-US", { month: "short" })} '${year}`;
      const key = `${date.getFullYear()}-${date.getMonth()}`;

      if (!acc[key]) {
        acc[key] = { name: monthLabel, Income: 0, Expenses: 0, order: date.getFullYear() * 100 + date.getMonth() };
      }
      if (tx.type === "Income") acc[key].Income += tx.amount;
      if (tx.type === "Expense") acc[key].Expenses += tx.amount;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(aggregated).sort((a, b) => a.order - b.order);
  }, [transactions]);

  // Aggregate spending by category
  const spendingData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "Expense");
    const grouped = expenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const COLORS = ["#93c5fd", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"];

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(val).replace("INR", "₹").trim();

  const formatCurrencyAbbreviated = (val: number) => {
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
    return `₹${val.toFixed(0)}`;
  };

  // Pick top 3 recent transactions
  const topTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Dashboard Title Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Dashboard</h1>
          <p className="text-slate-400 font-medium">Overview of your activity</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary text-on-primary font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-primary/10 hover:shadow-primary/20">
            <span className="material-symbols-outlined text-lg">download</span>
            <span className="text-sm">Export Data</span>
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="bg-[#161616] rounded-xl p-6 relative overflow-hidden group border border-[#383838] hover:border-[#383838] transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-6xl text-primary">account_balance_wallet</span>
          </div>
          <p className="text-[0.75rem] font-bold uppercase tracking-wider text-primary mb-3">Total Balance</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white tracking-tight">{formatCurrency(totalBalance)}</span>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-[#161616] rounded-xl p-6 relative overflow-hidden group border border-[#383838] hover:border-[#383838] transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-6xl text-secondary">payments</span>
          </div>
          <p className="text-[0.75rem] font-bold uppercase tracking-wider text-secondary mb-3">Total Income</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white tracking-tight">{formatCurrency(totalIncome)}</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-[#161616] rounded-xl p-6 relative overflow-hidden group border border-[#383838] hover:border-[#383838] transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <span className="material-symbols-outlined text-6xl text-tertiary">receipt</span>
          </div>
          <p className="text-[0.75rem] font-bold uppercase tracking-wider text-tertiary mb-3">Total Expenses</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white tracking-tight">{formatCurrency(totalExpenses)}</span>
          </div>
        </div>
      </section>

      {/* Main Visualizations Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cash Flow Line Chart (Bento Large) */}
        <div className="lg:col-span-2 bg-[#161616] rounded-xl p-6 flex flex-col h-[400px] border border-[#383838]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white">Cash Flow Trend</h3>
              <p className="text-xs text-slate-500">Income vs Expenses over time</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-xs text-slate-400">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                <span className="text-xs text-slate-400">Expenses</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative min-h-[250px]">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#adc6ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#adc6ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffb2b7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ffb2b7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2E2E2E" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                    tickFormatter={formatCurrencyAbbreviated}
                    width={45}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#161616", borderColor: "#161616", borderRadius: "8px" }}
                    itemStyle={{ fontSize: "14px", fontWeight: "bold" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px" }}
                  />
                  <Area type="monotone" dataKey="Income" stroke="#adc6ff" strokeWidth={3} fillOpacity={1} fill="url(#incomeColor)" />
                  <Area type="monotone" dataKey="Expenses" stroke="#ffb2b7" strokeWidth={3} fillOpacity={1} fill="url(#expenseColor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">No data available</div>
            )}
          </div>
        </div>

        {/* Spending Breakdown Donut (Bento Small) */}
        <div className="bg-[#161616] rounded-xl p-6 flex flex-col border border-[#383838]">
          <h3 className="text-lg font-semibold text-white mb-2">Spending Breakdown</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
            {spendingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={spendingData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    stroke="#161616"
                    strokeWidth={2}
                    labelLine={false}
                    label={(props: any) => `${(props.percent * 100).toFixed(0)}%`}
                  >
                    {spendingData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#161616", borderColor: "#383838", borderRadius: "8px" }}
                    itemStyle={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    formatter={(value: string) => <span className="text-xs text-slate-300 font-medium ml-1">{value}</span>}
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-500 text-sm h-[200px] flex items-center">No expenses yet</div>
            )}
          </div>
        </div>
      </section>

      {/* Secondary Data: Recent Transactions */}
      <section className="bg-[#161616] rounded-xl overflow-hidden border border-[#383838]">
        <div className="p-6 border-b border-[#383838] flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#161616]/50">
                <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-wider text-slate-500">Transaction</th>
                <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-wider text-slate-500">Category</th>
                <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-wider text-slate-500 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {topTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No recent transactions.</td>
                </tr>
              ) : topTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#161616] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'Income' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                        <span className="material-symbols-outlined text-sm">
                          {tx.type === "Income" ? "call_made" : "shopping_cart"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white">{tx.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-xs px-2 py-1 bg-[#161616] rounded-full text-slate-300">{tx.category}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold ${tx.type === "Income" ? "text-secondary" : "text-tertiary"}`}>
                    {tx.type === "Income" ? "+" : "-"} {formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

