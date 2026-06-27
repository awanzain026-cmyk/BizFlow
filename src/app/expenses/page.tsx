'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import AppShell from '@/components/AppShell';
import PageHeader from '@/components/PageHeader';
import { formatCurrency, formatDate } from '@/utils/storage';
import { ExpenseCategory } from '@/types';
import { Plus, X, Trash2, Receipt, PieChart as PieChartIcon, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; emoji: string }[] = [
  { value: 'office_supplies', label: 'Office Supplies', emoji: '📎' },
  { value: 'utilities', label: 'Utilities', emoji: '💡' },
  { value: 'rent', label: 'Rent', emoji: '🏠' },
  { value: 'salary', label: 'Salary', emoji: '👨‍💼' },
  { value: 'marketing', label: 'Marketing', emoji: '📢' },
  { value: 'travel', label: 'Travel', emoji: '🚗' },
  { value: 'food', label: 'Food', emoji: '🍽️' },
  { value: 'equipment', label: 'Equipment', emoji: '🖥️' },
  { value: 'software', label: 'Software', emoji: '💻' },
  { value: 'maintenance', label: 'Maintenance', emoji: '🔧' },
  { value: 'tax', label: 'Tax', emoji: '📋' },
  { value: 'other', label: 'Other', emoji: '📦' },
];

const CATEGORY_COLORS: Record<string, string> = {
  office_supplies: '#0c8ee9',
  utilities: '#f59e0b',
  rent: '#ef4444',
  salary: '#10b981',
  marketing: '#8b5cf6',
  travel: '#f97316',
  food: '#ec4899',
  equipment: '#14b8a6',
  software: '#6366f1',
  maintenance: '#78716c',
  tax: '#d946ef',
  other: '#6b7280',
};

export default function ExpensesPage() {
  const { data, addExpense, deleteExpense } = useApp();
  const { expenses } = data;

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: 'other' as ExpenseCategory,
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return EXPENSE_CATEGORIES.map(c => ({
      name: c.label,
      value: map[c.value] || 0,
      color: CATEGORY_COLORS[c.value],
      category: c.value,
    })).filter(d => d.value > 0);
  }, [expenses]);

  const monthlyExpenses = useMemo(() => {
    const map: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    expenses.forEach(e => {
      const d = new Date(e.date);
      const key = months[d.getMonth()];
      map[key] = (map[key] || 0) + e.amount;
    });
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const name = months[d.getMonth()];
      return { name, expenses: map[name] || 0 };
    });
  }, [expenses]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.amount <= 0) return;
    addExpense(form);
    setForm({ category: 'other', amount: 0, description: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  }

  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <AppShell>
      <PageHeader
        title="Expenses"
        description={`Total: ${formatCurrency(totalExpenses)} across ${expenses.length} expense${expenses.length !== 1 ? 's' : ''}`}
        action={
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 gradient-bg text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Log Expense
          </button>
        }
      />

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-20 px-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Log Expense</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as ExpenseCategory })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-white">
                  {EXPENSE_CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs.)</label>
                <input type="number" min={1} value={form.amount || ''} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" placeholder="5000" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" placeholder="Office supplies purchase" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" />
              </div>
              <button type="submit" disabled={form.amount <= 0}
                className="w-full gradient-bg text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                Log Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Charts */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-brand-500" />
              Expenses by Category
            </h2>
            {categoryTotals.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No expenses yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={categoryTotals} cx="50%" cy="50%" outerRadius={90} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                    {categoryTotals.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-brand-500" />
              Monthly Expenses
            </h2>
            {monthlyExpenses.every(d => d.expenses === 0) ? (
              <p className="text-sm text-gray-400 text-center py-8">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlyExpenses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={v => `Rs.${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Expense List */}
      {recentExpenses.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Receipt className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium text-gray-500 mb-1">No expenses logged</p>
          <p className="text-sm">Track your business expenses to get better financial insights.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50">
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Category</th>
                  <th className="p-3 font-medium">Description</th>
                  <th className="p-3 font-medium text-right">Amount</th>
                  <th className="p-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map(exp => {
                  const cat = EXPENSE_CATEGORIES.find(c => c.value === exp.category);
                  return (
                    <tr key={exp.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-gray-500 whitespace-nowrap">{formatDate(exp.date)}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {cat?.emoji} {cat?.label || exp.category}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700 max-w-[200px] truncate">{exp.description || '—'}</td>
                      <td className="p-3 text-right font-semibold text-red-600 whitespace-nowrap">{formatCurrency(exp.amount)}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => deleteExpense(exp.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}
