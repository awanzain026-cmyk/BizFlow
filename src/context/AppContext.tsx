'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { AppData, Client, Invoice, Expense } from '@/types';
import { getData, saveData, generateId, generateInvoiceNumber, calculateSubtotal, calculateGST, calculateTotal } from '@/utils/storage';
import { getDemoData } from '@/utils/demoData';

interface AppContextType {
  data: AppData;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'subtotal' | 'gstAmount' | 'total'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;
  loadDemoData: () => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>({ clients: [], invoices: [], expenses: [] });

  useEffect(() => {
    setData(getData());
  }, []);

  useEffect(() => {
    if (data.clients.length > 0 || data.invoices.length > 0 || data.expenses.length > 0) {
      saveData(data);
    }
  }, [data]);

  const addClient = useCallback((client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = { ...client, id: generateId(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, clients: [...prev.clients, newClient] }));
  }, []);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  }, []);

  const deleteClient = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.filter(c => c.id !== id),
      invoices: prev.invoices.filter(i => i.clientId !== id),
    }));
  }, []);

  const addInvoice = useCallback((invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'subtotal' | 'gstAmount' | 'total'>) => {
    setData(prev => {
      const invNumber = generateInvoiceNumber(prev.invoices);
      const subtotal = calculateSubtotal(invoice.lineItems);
      const gstAmount = calculateGST(subtotal, invoice.gstRate);
      const total = calculateTotal(subtotal, gstAmount);
      const newInvoice: Invoice = {
        ...invoice,
        id: generateId(),
        invoiceNumber: invNumber,
        subtotal,
        gstAmount,
        total,
        createdAt: new Date().toISOString(),
      };
      return { ...prev, invoices: [...prev.invoices, newInvoice] };
    });
  }, []);

  const updateInvoice = useCallback((id: string, updates: Partial<Invoice>) => {
    setData(prev => ({
      ...prev,
      invoices: prev.invoices.map(inv => {
        if (inv.id !== id) return inv;
        const updated = { ...inv, ...updates };
        if (updates.lineItems || updates.gstRate !== undefined) {
          const lineItems = updates.lineItems || inv.lineItems;
          const gstRate = updates.gstRate ?? inv.gstRate;
          updated.subtotal = calculateSubtotal(lineItems);
          updated.gstAmount = calculateGST(updated.subtotal, gstRate);
          updated.total = calculateTotal(updated.subtotal, updated.gstAmount);
        }
        return updated;
      }),
    }));
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      invoices: prev.invoices.filter(i => i.id !== id),
    }));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = { ...expense, id: generateId(), createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, expenses: [...prev.expenses, newExpense] }));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id),
    }));
  }, []);

  const loadDemoData = useCallback(() => {
    setData(getDemoData());
  }, []);

  const clearAllData = useCallback(() => {
    setData({ clients: [], invoices: [], expenses: [] });
    localStorage.removeItem('bizflow_data');
  }, []);

  return (
    <AppContext.Provider value={{ data, addClient, updateClient, deleteClient, addInvoice, updateInvoice, deleteInvoice, addExpense, deleteExpense, loadDemoData, clearAllData }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
