'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BizFlow</span>
            </div>
            <p className="text-gray-400 max-w-md">
              AI-powered business management suite for Pakistani entrepreneurs. Generate invoices, track payments, manage clients, and get intelligent insights.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Product</h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/clients" className="hover:text-white transition-colors">Clients</Link>
              <Link href="/invoices" className="hover:text-white transition-colors">Invoices</Link>
              <Link href="/expenses" className="hover:text-white transition-colors">Expenses</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <div className="flex flex-col gap-2 text-sm">
              <span>Built with ❤️ in Pakistan</span>
              <span className="text-gray-500">© 2024 BizFlow</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
