'use client';

import { AppData, Client, Invoice, Expense, LineItem, InvoiceStatus } from '@/types';

const STORAGE_KEY = 'bizflow_data';

export function getData(): AppData {
  if (typeof window === 'undefined') return { clients: [], invoices: [], expenses: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { clients: [], invoices: [], expenses: [] };
    return JSON.parse(raw);
  } catch {
    return { clients: [], invoices: [], expenses: [] };
  }
}

export function saveData(data: AppData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveClients(clients: Client[]): void {
  const data = getData();
  data.clients = clients;
  saveData(data);
}

export function saveInvoices(invoices: Invoice[]): void {
  const data = getData();
  data.invoices = invoices;
  saveData(data);
}

export function saveExpenses(expenses: Expense[]): void {
  const data = getData();
  data.expenses = expenses;
  saveData(data);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function generateInvoiceNumber(invoices: Invoice[]): string {
  const nums = invoices.map(inv => {
    const match = inv.invoiceNumber.match(/INV-(\d+)/);
    return match ? parseInt(match[1]) : 0;
  });
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `INV-${String(max + 1).padStart(3, '0')}`;
}

export function calculateLineTotal(item: LineItem): number {
  return item.quantity * item.unitPrice;
}

export function calculateSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
}

export function calculateGST(subtotal: number, gstRate: number): number {
  return subtotal * (gstRate / 100);
}

export function calculateTotal(subtotal: number, gstAmount: number): number {
  return subtotal + gstAmount;
}

export function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getStatusColor(status: InvoiceStatus): string {
  switch (status) {
    case 'paid': return 'text-emerald-600 bg-emerald-50';
    case 'unpaid': return 'text-amber-600 bg-amber-50';
    case 'partial': return 'text-blue-600 bg-blue-50';
    case 'overdue': return 'text-red-600 bg-red-50';
  }
}

export function getClientStatusColor(totalBilled: number, totalPaid: number): string {
  if (totalBilled === 0) return 'border-l-4 border-gray-300';
  if (totalPaid >= totalBilled) return 'border-l-4 border-emerald-500';
  if (totalPaid > 0) return 'border-l-4 border-amber-500';
  return 'border-l-4 border-red-500';
}

export function getExpenseCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    office_supplies: 'Office Supplies',
    utilities: 'Utilities',
    rent: 'Rent',
    salary: 'Salary',
    marketing: 'Marketing',
    travel: 'Travel',
    food: 'Food',
    equipment: 'Equipment',
    software: 'Software',
    maintenance: 'Maintenance',
    tax: 'Tax',
    other: 'Other',
  };
  return labels[cat] || cat;
}
