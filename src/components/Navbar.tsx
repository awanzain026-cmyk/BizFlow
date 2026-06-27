'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BizFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
              Dashboard
            </Link>
            <Link href="/clients" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
              Clients
            </Link>
            <Link href="/invoices" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
              Invoices
            </Link>
            <Link href="/expenses" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
              Expenses
            </Link>
            <Link
              href="/dashboard"
              className="gradient-bg text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Launch App
            </Link>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-gray-100 px-4 pb-4"
        >
          <div className="flex flex-col gap-3 pt-2">
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 py-2" onClick={() => setOpen(false)}>Dashboard</Link>
            <Link href="/clients" className="text-sm font-medium text-gray-600 py-2" onClick={() => setOpen(false)}>Clients</Link>
            <Link href="/invoices" className="text-sm font-medium text-gray-600 py-2" onClick={() => setOpen(false)}>Invoices</Link>
            <Link href="/expenses" className="text-sm font-medium text-gray-600 py-2" onClick={() => setOpen(false)}>Expenses</Link>
            <Link href="/dashboard" className="gradient-bg text-white px-4 py-2 rounded-lg text-sm font-semibold text-center" onClick={() => setOpen(false)}>
              Launch App
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
