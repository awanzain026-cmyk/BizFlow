'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import AppShell from '@/components/AppShell';
import PageHeader from '@/components/PageHeader';
import { formatCurrency, formatDate, generateId, getStatusColor, calculateSubtotal, calculateGST } from '@/utils/storage';
import { LineItem, InvoiceStatus, PaymentTerms } from '@/types';
import { Plus, X, Trash2, Download, Share2, Send, CheckCircle, FileText, Sparkles } from 'lucide-react';
import { generateAIDescription } from '@/utils/ai';

export default function InvoicesPage() {
  const { data, addInvoice, updateInvoice } = useApp();
  const { invoices, clients } = data;
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    clientId: '',
    lineItems: [{ id: generateId(), description: '', quantity: 1, unitPrice: 0 }] as LineItem[],
    gstRate: 15,
    paymentTerms: 'net_15' as PaymentTerms,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    notes: '',
  });

  const subtotal = useMemo(() => calculateSubtotal(form.lineItems), [form.lineItems]);
  const gstAmount = useMemo(() => calculateGST(subtotal, form.gstRate), [subtotal, form.gstRate]);
  const total = subtotal + gstAmount;

  const filteredInvoices = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);

  const selectedClient = clients.find(c => c.id === form.clientId);

  function addLineItem() {
    setForm({ ...form, lineItems: [...form.lineItems, { id: generateId(), description: '', quantity: 1, unitPrice: 0 }] });
  }

  function removeLineItem(id: string) {
    if (form.lineItems.length <= 1) return;
    setForm({ ...form, lineItems: form.lineItems.filter(li => li.id !== id) });
  }

  function updateLineItem(id: string, updates: Partial<LineItem>) {
    setForm({
      ...form,
      lineItems: form.lineItems.map(li => li.id === id ? { ...li, ...updates } : li),
    });
  }

  function resetForm() {
    setForm({
      clientId: '',
      lineItems: [{ id: generateId(), description: '', quantity: 1, unitPrice: 0 }],
      gstRate: 15,
      paymentTerms: 'net_15',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      notes: '',
    });
  }

  function handleSubmit() {
    if (!form.clientId || form.lineItems.some(li => !li.description || li.unitPrice <= 0)) return;
    const client = clients.find(c => c.id === form.clientId);
    addInvoice({
      clientId: form.clientId,
      clientName: client?.businessName || client?.name || 'Unknown',
      lineItems: form.lineItems,
      gstRate: form.gstRate,
      status: 'unpaid',
      paymentTerms: form.paymentTerms,
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      notes: form.notes,
      amountPaid: 0,
    });
    resetForm();
    setShowForm(false);
  }

  function handleWhatsApp(inv: typeof invoices[0]) {
    const msg = `*${inv.invoiceNumber}* - ${inv.clientName}\nAmount: ${formatCurrency(inv.total)}\nStatus: ${inv.status}\nDue: ${formatDate(inv.dueDate)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function handleDownloadPDF(inv: typeof invoices[0]) {
    const win = window.open('', '_blank');
    if (!win) return;
    const itemsHtml = inv.lineItems.map(li => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${li.description}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${li.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">Rs. ${li.unitPrice.toLocaleString()}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">Rs. ${(li.quantity * li.unitPrice).toLocaleString()}</td>
      </tr>
    `).join('');
    const html = `
      <html><head><style>
        body{font-family:Arial,sans-serif;padding:40px;color:#333}
        h1{color:#0c8ee9;margin:0}
        .header{display:flex;justify-content:space-between;margin-bottom:40px}
        .info{margin-bottom:30px}
        .info p{margin:4px 0;color:#666}
        table{width:100%;border-collapse:collapse}
        th{background:#f8fafc;padding:10px 8px;text-align:left;font-size:12px;text-transform:uppercase;color:#666}
        .total-row td{padding:8px;font-weight:bold}
        .grand-total{font-size:18px;color:#0c8ee9}
        .footer{margin-top:40px;padding-top:20px;border-top:2px solid #eee;color:#999;font-size:12px}
      </style></head><body>
        <div class="header">
          <div><h1>BizFlow</h1><p style="color:#666;margin:2px 0">AI Business Suite</p></div>
          <div><h2 style="margin:0">${inv.invoiceNumber}</h2></div>
        </div>
        <div class="info">
          <p><strong>Client:</strong> ${inv.clientName}</p>
          <p><strong>Issue Date:</strong> ${formatDate(inv.issueDate)}</p>
          <p><strong>Due Date:</strong> ${formatDate(inv.dueDate)}</p>
        </div>
        <table>
          <tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
          ${itemsHtml}
        </table>
        <div style="text-align:right;margin-top:20px">
          <p>Subtotal: Rs. ${inv.subtotal.toLocaleString()}</p>
          <p>GST (${inv.gstRate}%): Rs. ${inv.gstAmount.toLocaleString()}</p>
          <p class="grand-total"><strong>Total: Rs. ${inv.total.toLocaleString()}</strong></p>
        </div>
        ${inv.notes ? `<div style="margin-top:20px;padding:12px;background:#f8fafc;border-radius:8px"><strong>Notes:</strong><br>${inv.notes}</div>` : ''}
        <div class="footer">Generated by BizFlow — AI Business Suite</div>
      </body></html>`;
    win.document.write(html);
    win.document.close();
    win.print();
  }

  return (
    <AppShell>
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}`}
        action={
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="flex items-center gap-2 gradient-bg text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'paid', 'unpaid', 'partial', 'overdue'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'gradient-bg text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-200'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Invoice Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-10 px-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create New Invoice</h2>
              <button onClick={() => { setShowForm(false); resetForm(); }} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
                  <select
                    value={form.clientId}
                    onChange={e => setForm({ ...form, clientId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select a client...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.businessName || c.name}</option>
                    ))}
                  </select>
                  {clients.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1">Add clients first before creating invoices</p>
                  )}
                </div>

                {/* Line Items */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Line Items</label>
                    <button onClick={addLineItem} className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Item
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {form.lineItems.map((li, idx) => (
                      <div key={li.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-400">Item {idx + 1}</span>
                          <button onClick={() => removeLineItem(li.id)} className="p-0.5 hover:bg-red-100 rounded"><Trash2 className="w-3 h-3 text-red-400" /></button>
                        </div>
                        <div className="flex gap-2 mb-2">
                          <input
                            value={li.description}
                            onChange={e => updateLineItem(li.id, { description: e.target.value })}
                            placeholder="Description (e.g. Website Design)"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              const desc = await generateAIDescription(li.description || 'professional business service');
                              updateLineItem(li.id, { description: desc });
                            }}
                            className="px-2.5 py-2 bg-gradient-to-r from-brand-500 to-violet-500 text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1 shrink-0"
                            title="AI Write Description"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> AI
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Qty</label>
                            <input type="number" min={1} value={li.quantity} onChange={e => updateLineItem(li.id, { quantity: parseInt(e.target.value) || 1 })}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Rate (Rs.)</label>
                            <input type="number" min={0} value={li.unitPrice} onChange={e => updateLineItem(li.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Total</label>
                            <p className="text-sm font-semibold text-gray-900 pt-1.5">
                              {formatCurrency(li.quantity * li.unitPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GST (15%)</label>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={form.gstRate > 0} onChange={e => setForm({ ...form, gstRate: e.target.checked ? 15 : 0 })}
                        className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500" />
                      <span className="text-sm text-gray-600">Apply GST</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                    <select value={form.paymentTerms} onChange={e => setForm({ ...form, paymentTerms: e.target.value as PaymentTerms })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-white">
                      <option value="due_on_receipt">Due on Receipt</option>
                      <option value="net_15">Net 15</option>
                      <option value="net_30">Net 30</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                    <input type="date" value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" rows={2} placeholder="Any additional notes..." />
                </div>

                <button onClick={handleSubmit} disabled={!form.clientId || form.lineItems.some(li => !li.description || li.unitPrice <= 0) || clients.length === 0}
                  className="w-full gradient-bg text-white px-4 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                  Generate Invoice
                </button>
              </div>

              {/* Right: Preview */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Invoice Preview</h3>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-brand-600 text-lg">BizFlow</p>
                      <p className="text-xs text-gray-400">AI Business Suite</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">INV-{String(invoices.length + 1).padStart(3, '0')}</p>
                  </div>
                  <div className="text-xs text-gray-600 mb-4">
                    <p><strong>Client:</strong> {selectedClient?.businessName || selectedClient?.name || '—'}</p>
                    <p><strong>Issue:</strong> {formatDate(form.issueDate)}</p>
                    <p><strong>Due:</strong> {formatDate(form.dueDate)}</p>
                  </div>
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-gray-200">
                      <th className="text-left pb-2 text-gray-400">Item</th>
                      <th className="text-center pb-2 text-gray-400">Qty</th>
                      <th className="text-right pb-2 text-gray-400">Rate</th>
                      <th className="text-right pb-2 text-gray-400">Total</th>
                    </tr></thead>
                    <tbody>
                      {form.lineItems.filter(li => li.description).map(li => (
                        <tr key={li.id} className="border-b border-gray-100">
                          <td className="py-2 text-gray-700">{li.description}</td>
                          <td className="py-2 text-center">{li.quantity}</td>
                          <td className="py-2 text-right">{formatCurrency(li.unitPrice)}</td>
                          <td className="py-2 text-right font-medium">{formatCurrency(li.quantity * li.unitPrice)}</td>
                        </tr>
                      ))}
                      {form.lineItems.filter(li => li.description).length === 0 && (
                        <tr><td colSpan={4} className="py-4 text-center text-gray-300">Add items to see preview</td></tr>
                      )}
                    </tbody>
                  </table>
                  <div className="text-right mt-3 pt-3 border-t border-gray-200 text-xs">
                    <p className="text-gray-500">Subtotal: {formatCurrency(subtotal)}</p>
                    {form.gstRate > 0 && <p className="text-gray-500">GST ({form.gstRate}%): {formatCurrency(gstAmount)}</p>}
                    <p className="text-base font-bold text-brand-600 mt-1">Total: {formatCurrency(total)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice List */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium text-gray-500 mb-1">No invoices {filter !== 'all' ? `with status "${filter}"` : 'yet'}</p>
          <p className="text-sm">Create your first invoice to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInvoices.slice().reverse().map(inv => (
            <div key={inv.id} className="bg-white rounded-xl border border-gray-200 p-4 card-hover">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {inv.invoiceNumber.slice(-3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{inv.invoiceNumber}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(inv.status)}`}>
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{inv.clientName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Due: {formatDate(inv.dueDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:text-right">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(inv.total)}</p>
                    {inv.status === 'partial' && (
                      <p className="text-xs text-gray-400">Paid: {formatCurrency(inv.amountPaid)}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {inv.status !== 'paid' && (
                      <button
                        onClick={() => updateInvoice(inv.id, { status: 'paid', amountPaid: inv.total })}
                        className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Mark as Paid"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      </button>
                    )}
                    {inv.status === 'overdue' && (
                      <button
                        onClick={() => handleWhatsApp(inv)}
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                        title="Send WhatsApp Reminder"
                      >
                        <Send className="w-4 h-4 text-green-500" />
                      </button>
                    )}
                    <button
                      onClick={() => handleWhatsApp(inv)}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                      title="Share on WhatsApp"
                    >
                      <Share2 className="w-4 h-4 text-green-500" />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(inv)}
                      className="p-2 hover:bg-brand-50 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4 text-brand-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
