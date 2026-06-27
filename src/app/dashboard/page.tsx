'use client';

import { useApp } from '@/context/AppContext';
import AppShell from '@/components/AppShell';
import StatCard from '@/components/StatCard';
import PageHeader from '@/components/PageHeader';
import { formatCurrency, formatDate, getStatusColor } from '@/utils/storage';
import { generateInsights } from '@/utils/insights';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, Users, CreditCard, FileText, PlusCircle, UserPlus, Receipt, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2, Info, RotateCcw, Trash2 } from 'lucide-react';
import { Invoice } from '@/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getLast6Months() {
  const months: { name: string; index: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ name: MONTHS[d.getMonth()], index: d.getMonth() });
  }
  return months;
}

function getRevenueData(invoices: Invoice[]) {
  const months = getLast6Months();
  return months.map(m => {
    const total = invoices
      .filter(inv => {
        const d = new Date(inv.issueDate);
        return d.getMonth() === m.index && d.getFullYear() === new Date().getFullYear() && inv.status === 'paid';
      })
      .reduce((sum, inv) => sum + inv.total, 0);
    return { name: m.name, revenue: total };
  });
}

function getPaymentData(invoices: Invoice[]) {
  const paid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const unpaid = invoices.filter(i => i.status === 'unpaid').reduce((s, i) => s + i.total, 0);
  const partial = invoices.filter(i => i.status === 'partial').reduce((s, i) => s + i.total, 0);
  const overdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0);
  return [
    { name: 'Paid', value: paid, color: '#10b981' },
    { name: 'Unpaid', value: unpaid, color: '#f59e0b' },
    { name: 'Partial', value: partial, color: '#3b82f6' },
    { name: 'Overdue', value: overdue, color: '#ef4444' },
  ].filter(d => d.value > 0);
}

const insightIcons: Record<string, React.ReactNode> = {
  warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
  opportunity: <TrendingUp className="w-5 h-5 text-blue-600" />,
  info: <Info className="w-5 h-5 text-brand-600" />,
  success: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
};

const insightBg: Record<string, string> = {
  warning: 'bg-amber-50 border-amber-200',
  opportunity: 'bg-blue-50 border-blue-200',
  info: 'bg-brand-50 border-brand-200',
  success: 'bg-emerald-50 border-emerald-200',
};

export default function DashboardPage() {
  const { data, loadDemoData, clearAllData } = useApp();
  const { invoices, clients } = data;

  const validInvoices = invoices.filter(inv => clients.some(c => c.id === inv.clientId));

  const totalRevenue = validInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const outstanding = validInvoices.filter(i => i.status !== 'paid').reduce((s, i) => s + (i.total - i.amountPaid), 0);
  const thisMonthInvoices = validInvoices.filter(i => {
    const d = new Date(i.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const insights = clients.length > 0 || validInvoices.length > 0 ? generateInsights({ ...data, invoices: validInvoices }) : [];
  const revenueData = getRevenueData(validInvoices);
  const paymentData = getPaymentData(validInvoices);

  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description="Your business at a glance"
        action={
          <div className="flex gap-2">
            {clients.length > 0 || invoices.length > 0 ? (
              <button
                onClick={clearAllData}
                className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Reset All Data
              </button>
            ) : null}
            <button
              onClick={loadDemoData}
              className="flex items-center gap-2 text-sm font-medium text-brand-600 bg-brand-50 px-4 py-2 rounded-lg hover:bg-brand-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Load Demo Data
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon={<DollarSign className="w-5 h-5" />} color="emerald" />
        <StatCard label="Outstanding Payments" value={formatCurrency(outstanding)} icon={<CreditCard className="w-5 h-5" />} color="amber" />
        <StatCard label="Total Clients" value={clients.length.toString()} icon={<Users className="w-5 h-5" />} color="brand" />
        <StatCard label="Invoices This Month" value={thisMonthInvoices.toString()} icon={<FileText className="w-5 h-5" />} color="violet" />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <a href="/invoices?new=true" className="flex items-center gap-2 gradient-bg text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
          <PlusCircle className="w-4 h-4" /> New Invoice
        </a>
        <a href="/clients?new=true" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:border-brand-200 hover:text-brand-600 transition-all">
          <UserPlus className="w-4 h-4" /> Add Client
        </a>
        <a href="/expenses" className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:border-brand-200 hover:text-brand-600 transition-all">
          <Receipt className="w-4 h-4" /> Log Expense
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Invoices */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Invoices</h2>
          {validInvoices.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No invoices yet. Create your first invoice!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Invoice</th>
                    <th className="pb-3 font-medium">Client</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {validInvoices.slice().reverse().slice(0, 6).map(inv => (
                    <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 font-medium text-gray-900">{inv.invoiceNumber}</td>
                      <td className="py-3 text-gray-600">{inv.clientName}</td>
                      <td className="py-3 font-medium">{formatCurrency(inv.total)}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">{formatDate(inv.issueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-gray-900">AI Insights</h2>
          </div>
          {insights.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Add some data to get AI-powered insights about your business.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.map(insight => (
                <div key={insight.id} className={`p-3 rounded-lg border ${insightBg[insight.type]}`}>
                  <div className="flex items-start gap-2">
                    {insightIcons[insight.type]}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{insight.title}</p>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend (Last 6 Months)</h2>
          {revenueData.every(d => d.revenue === 0) ? (
            <div className="text-center py-8 text-gray-400">
              <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No revenue data yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={v => `Rs.${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="revenue" fill="#0c8ee9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Status</h2>
          {paymentData.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No payment data yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={paymentData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {paymentData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </AppShell>
  );
}
