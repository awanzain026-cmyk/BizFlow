export interface Client {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export type InvoiceStatus = 'paid' | 'unpaid' | 'partial' | 'overdue';
export type PaymentTerms = 'due_on_receipt' | 'net_15' | 'net_30';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  lineItems: LineItem[];
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  total: number;
  amountPaid: number;
  status: InvoiceStatus;
  paymentTerms: PaymentTerms;
  issueDate: string;
  dueDate: string;
  notes: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'office_supplies'
  | 'utilities'
  | 'rent'
  | 'salary'
  | 'marketing'
  | 'travel'
  | 'food'
  | 'equipment'
  | 'software'
  | 'maintenance'
  | 'tax'
  | 'other';

export interface AIInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'info' | 'success';
  title: string;
  description: string;
}

export interface AppData {
  clients: Client[];
  invoices: Invoice[];
  expenses: Expense[];
}
