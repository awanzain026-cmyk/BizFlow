'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import AppShell from '@/components/AppShell';
import PageHeader from '@/components/PageHeader';
import { formatCurrency, formatDate, getClientStatusColor } from '@/utils/storage';
import { Client } from '@/types';
import { UserPlus, X, Search, Mail, Phone, MapPin, Building2, Eye, Trash2, FileText } from 'lucide-react';

export default function ClientsPage() {
  const { data, addClient, updateClient, deleteClient } = useApp();
  const { clients, invoices } = data;
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);

  const [form, setForm] = useState({
    name: '', businessName: '', email: '', phone: '', address: '',
  });

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.businessName.toLowerCase().includes(search.toLowerCase())
  );

  function resetForm() {
    setForm({ name: '', businessName: '', email: '', phone: '', address: '' });
    setEditClient(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editClient) {
      updateClient(editClient.id, form);
    } else {
      addClient(form);
    }
    resetForm();
    setShowForm(false);
  }

  function handleEdit(client: Client) {
    setForm({ name: client.name, businessName: client.businessName, email: client.email, phone: client.phone, address: client.address });
    setEditClient(client);
    setShowForm(true);
  }

  function getClientStats(clientId: string) {
    const clientInvoices = invoices.filter(i => i.clientId === clientId);
    const totalBilled = clientInvoices.reduce((s, i) => s + i.total, 0);
    const totalPaid = clientInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0) +
      clientInvoices.filter(i => i.status === 'partial').reduce((s, i) => s + i.amountPaid, 0);
    const outstanding = totalBilled - totalPaid;
    return { totalBilled, totalPaid, outstanding, invoiceCount: clientInvoices.length };
  }

  return (
    <AppShell>
      <PageHeader
        title="Clients"
        description={`${clients.length} client${clients.length !== 1 ? 's' : ''} registered`}
        action={
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="flex items-center gap-2 gradient-bg text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <UserPlus className="w-4 h-4" />
            Add Client
          </button>
        }
      />

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-20 px-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editClient ? 'Edit Client' : 'Add New Client'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" placeholder="Ahmed Raza" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" placeholder="Raza Electronics" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" placeholder="ahmed@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" placeholder="0300-1234567" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none" rows={2} placeholder="12 Main Boulevard, Lahore" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 gradient-bg text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                  {editClient ? 'Update Client' : 'Add Client'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search clients by name or business..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-white"
        />
      </div>

      {/* Client Cards */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Building2 className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium text-gray-500 mb-1">No clients yet</p>
          <p className="text-sm">Add your first client to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map(client => {
            const stats = getClientStats(client.id);
            return (
              <div
                key={client.id}
                className={`bg-white rounded-xl border border-gray-200 p-5 card-hover cursor-pointer ${getClientStatusColor(stats.totalBilled, stats.totalPaid)}`}
                onClick={() => setSelectedClient(client)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{client.name}</h3>
                    {client.businessName && <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" /> {client.businessName}
                    </p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={e => { e.stopPropagation(); handleEdit(client); }} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); deleteClient(client.id); }} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">Total Billed</p>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(stats.totalBilled)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Paid</p>
                    <p className="text-sm font-semibold text-emerald-600">{formatCurrency(stats.totalPaid)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Outstanding</p>
                    <p className={`text-sm font-semibold ${stats.outstanding > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                      {formatCurrency(stats.outstanding)}
                    </p>
                  </div>
                </div>

                {client.email && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Mail className="w-3 h-3" /> {client.email}
                    {client.phone && <><span className="mx-1">·</span><Phone className="w-3 h-3" /> {client.phone}</>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-20 px-4" onClick={() => setSelectedClient(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">{selectedClient.name}</h2>
                {selectedClient.businessName && <p className="text-sm text-gray-500">{selectedClient.businessName}</p>}
              </div>
              <button onClick={() => setSelectedClient(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {selectedClient.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="w-4 h-4 text-gray-400" /> {selectedClient.email}</div>
              )}
              {selectedClient.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4 text-gray-400" /> {selectedClient.phone}</div>
              )}
              {selectedClient.address && (
                <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600"><MapPin className="w-4 h-4 text-gray-400" /> {selectedClient.address}</div>
              )}
            </div>

            <h3 className="font-bold text-gray-900 mb-3">Invoice History</h3>
            {invoices.filter(i => i.clientId === selectedClient.id).length === 0 ? (
              <p className="text-sm text-gray-400">No invoices for this client yet.</p>
            ) : (
              <div className="space-y-2">
                {invoices.filter(i => i.clientId === selectedClient.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(inv => (
                  <a key={inv.id} href={`/invoices`} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{inv.invoiceNumber}</p>
                        <p className="text-xs text-gray-400">{formatDate(inv.issueDate)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(inv.total)}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
                        ${inv.status === 'paid' ? 'text-emerald-600 bg-emerald-50' : ''}
                        ${inv.status === 'unpaid' ? 'text-amber-600 bg-amber-50' : ''}
                        ${inv.status === 'partial' ? 'text-blue-600 bg-blue-50' : ''}
                        ${inv.status === 'overdue' ? 'text-red-600 bg-red-50' : ''}
                      `}>{inv.status}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
