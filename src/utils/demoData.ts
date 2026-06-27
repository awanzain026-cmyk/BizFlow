import { AppData, Client, Invoice, Expense } from '@/types';

const today = new Date();
const d = (daysOffset: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + daysOffset);
  return dt.toISOString().split('T')[0];
};

export const demoClients: Client[] = [
  { id: 'c1', name: 'Ahmed Raza', businessName: 'Raza Electronics', email: 'ahmed@razaelec.com', phone: '0300-1234567', address: '12 Main Boulevard, Lahore', createdAt: d(-90) },
  { id: 'c2', name: 'Fatima Zainab', businessName: 'Zainab Designs Studio', email: 'fatima@zainabdesigns.com', phone: '0321-7654321', address: '45 Clifton Road, Karachi', createdAt: d(-75) },
  { id: 'c3', name: 'Usman Khalid', businessName: 'Khalid & Sons Traders', email: 'usman@khalidtraders.com', phone: '0345-9876543', address: '78 Mall Road, Islamabad', createdAt: d(-60) },
  { id: 'c4', name: 'Sana Tariq', businessName: 'Sana Beauty Clinic', email: 'sana@sanaclinic.com', phone: '0333-4567890', address: '23 Garden Town, Lahore', createdAt: d(-45) },
  { id: 'c5', name: 'Bilal Hassan', businessName: 'Hassan Freight Services', email: 'bilal@hassanfreight.com', phone: '0311-2345678', address: '56 Industrial Area, Faisalabad', createdAt: d(-30) },
  { id: 'c6', name: 'Ayesha Malik', businessName: 'Ayesha Legal Consultancy', email: 'ayesha@ayeshalegal.com', phone: '0346-8765432', address: '90 Blue Area, Islamabad', createdAt: d(-20) },
];

export const demoInvoices: Invoice[] = [
  { id: 'i1', invoiceNumber: 'INV-001', clientId: 'c1', clientName: 'Raza Electronics', lineItems: [{ id: 'li1', description: 'Website Development - E-commerce Platform', quantity: 1, unitPrice: 85000 }, { id: 'li2', description: 'Monthly SEO & Maintenance', quantity: 3, unitPrice: 15000 }], subtotal: 130000, gstRate: 15, gstAmount: 19500, total: 149500, amountPaid: 149500, status: 'paid', paymentTerms: 'net_15', issueDate: d(-60), dueDate: d(-45), notes: 'Great working with Ahmed. Full payment received on time.', createdAt: d(-60) },
  { id: 'i2', invoiceNumber: 'INV-002', clientId: 'c2', clientName: 'Zainab Designs Studio', lineItems: [{ id: 'li3', description: 'Brand Identity Package - Logo, Stationery, Guidelines', quantity: 1, unitPrice: 65000 }], subtotal: 65000, gstRate: 15, gstAmount: 9750, total: 74750, amountPaid: 40000, status: 'partial', paymentTerms: 'net_30', issueDate: d(-30), dueDate: d(0), notes: 'Partial payment received. Balance of Rs. 34,750 pending.', createdAt: d(-30) },
  { id: 'i3', invoiceNumber: 'INV-003', clientId: 'c3', clientName: 'Khalid & Sons Traders', lineItems: [{ id: 'li4', description: 'Inventory Management Software Setup', quantity: 1, unitPrice: 120000 }, { id: 'li5', description: 'Staff Training (2 sessions)', quantity: 2, unitPrice: 10000 }], subtotal: 140000, gstRate: 15, gstAmount: 21000, total: 161000, amountPaid: 0, status: 'unpaid', paymentTerms: 'net_15', issueDate: d(-15), dueDate: d(0), notes: 'Awaiting payment. Follow up required.', createdAt: d(-15) },
  { id: 'i4', invoiceNumber: 'INV-004', clientId: 'c4', clientName: 'Sana Beauty Clinic', lineItems: [{ id: 'li6', description: 'Social Media Marketing Campaign - 3 Months', quantity: 3, unitPrice: 25000 }], subtotal: 75000, gstRate: 15, gstAmount: 11250, total: 86250, amountPaid: 86250, status: 'paid', paymentTerms: 'due_on_receipt', issueDate: d(-45), dueDate: d(-45), notes: 'Paid on receipt.', createdAt: d(-45) },
  { id: 'i5', invoiceNumber: 'INV-005', clientId: 'c5', clientName: 'Hassan Freight Services', lineItems: [{ id: 'li7', description: 'Custom Logistics Tracking Dashboard', quantity: 1, unitPrice: 200000 }], subtotal: 200000, gstRate: 15, gstAmount: 30000, total: 230000, amountPaid: 0, status: 'overdue', paymentTerms: 'net_30', issueDate: d(-40), dueDate: d(-10), notes: 'Payment overdue by 10 days. Send reminder.', createdAt: d(-40) },
  { id: 'i6', invoiceNumber: 'INV-006', clientId: 'c6', clientName: 'Ayesha Legal Consultancy', lineItems: [{ id: 'li8', description: 'Case Management Software - Annual License', quantity: 1, unitPrice: 95000 }, { id: 'li9', description: 'Data Migration', quantity: 1, unitPrice: 25000 }], subtotal: 120000, gstRate: 15, gstAmount: 18000, total: 138000, amountPaid: 69000, status: 'partial', paymentTerms: 'net_30', issueDate: d(-20), dueDate: d(10), notes: '50% upfront paid. Remaining due by due date.', createdAt: d(-20) },
  { id: 'i7', invoiceNumber: 'INV-007', clientId: 'c1', clientName: 'Raza Electronics', lineItems: [{ id: 'li10', description: 'Mobile App Development - Android & iOS', quantity: 1, unitPrice: 150000 }], subtotal: 150000, gstRate: 15, gstAmount: 22500, total: 172500, amountPaid: 0, status: 'unpaid', paymentTerms: 'net_15', issueDate: d(-5), dueDate: d(10), notes: 'New project - app development.', createdAt: d(-5) },
];

export const demoExpenses: Expense[] = [
  { id: 'e1', category: 'software', amount: 12000, description: 'Adobe Creative Cloud Subscription', date: d(-50), createdAt: d(-50) },
  { id: 'e2', category: 'utilities', amount: 8500, description: 'Electricity Bill - Office', date: d(-45), createdAt: d(-45) },
  { id: 'e3', category: 'rent', amount: 45000, description: 'Office Rent - Month', date: d(-30), createdAt: d(-30) },
  { id: 'e4', category: 'salary', amount: 120000, description: 'Developer Salary - Usman', date: d(-30), createdAt: d(-30) },
  { id: 'e5', category: 'marketing', amount: 25000, description: 'Google Ads Campaign', date: d(-25), createdAt: d(-25) },
  { id: 'e6', category: 'travel', amount: 3500, description: 'Client Meeting - Travel Reimbursement', date: d(-20), createdAt: d(-20) },
  { id: 'e7', category: 'food', amount: 2500, description: 'Team Lunch - Project Completion', date: d(-15), createdAt: d(-15) },
  { id: 'e8', category: 'equipment', amount: 32000, description: 'Office Chair - Ergonomic', date: d(-10), createdAt: d(-10) },
  { id: 'e9', category: 'office_supplies', amount: 4500, description: 'Printer Paper & Ink Cartridges', date: d(-8), createdAt: d(-8) },
  { id: 'e10', category: 'maintenance', amount: 6000, description: 'AC Repair & Servicing', date: d(-5), createdAt: d(-5) },
];

export function getDemoData(): AppData {
  return {
    clients: demoClients,
    invoices: demoInvoices,
    expenses: demoExpenses,
  };
}
