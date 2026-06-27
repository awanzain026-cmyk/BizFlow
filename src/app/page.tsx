'use client';

import { motion } from 'framer-motion';
import { FileText, Users, CreditCard, BarChart3, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6 },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-violet-50 pointer-events-none" />
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-200 rounded-full blur-[128px] opacity-30 pointer-events-none" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-200 rounded-full blur-[128px] opacity-30 pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Business Suite for Pakistan
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
            >
              Run Your Business Like a Pro{' '}
              <span className="gradient-text">Without the Accountant</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10"
            >
              Generate invoices, track payments, manage clients and get AI insights — all in one place. 
              Built for Pakistani small businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/dashboard"
                className="gradient-bg text-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:opacity-90 transition-all hover:shadow-lg hover:shadow-brand-200 flex items-center gap-2"
              >
                Launch App <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="bg-white text-gray-700 px-8 py-3.5 rounded-xl text-lg font-semibold border border-gray-200 hover:border-brand-200 hover:text-brand-600 transition-all flex items-center gap-2"
              >
                Try Free Demo <CheckCircle className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to Run Your Business
              </h2>
              <p className="text-lg text-gray-500 max-w-xl mx-auto">
                No more paper invoices, WhatsApp reminders, or lost receipts.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <FileText className="w-6 h-6" />, title: 'AI Invoices', desc: 'Generate professional PDF invoices with AI-powered descriptions. Add GST, discounts, and payment terms instantly.' },
                { icon: <Users className="w-6 h-6" />, title: 'Client Manager', desc: 'Keep track of all your clients, their payment history, and outstanding balances in one place.' },
                { icon: <CreditCard className="w-6 h-6" />, title: 'Payment Tracker', desc: 'Know who has paid and who hasn\'t. Get reminders for overdue invoices automatically.' },
                { icon: <BarChart3 className="w-6 h-6" />, title: 'Business Insights', desc: 'AI-powered analytics show your revenue trends, profit margins, and top clients.' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 card-hover border border-gray-100"
                >
                  <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center text-white mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-lg text-gray-500">Get started in 3 simple steps</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Add Your Clients', desc: 'Import or add your client details. Names, businesses, contact info — all stored securely.' },
                { step: '02', title: 'Create Invoices', desc: 'Select a client, add items, and let AI write professional descriptions. Generate PDFs instantly.' },
                { step: '03', title: 'Track & Get Insights', desc: 'Monitor payments, track expenses, and get AI-powered business insights to grow.' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Trusted by Pakistani Business Owners</h2>
              <p className="text-lg text-gray-500">See what our users say</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Hassan Ali', business: 'Hassan Electronics, Lahore', text: 'BizFlow completely changed how I manage invoices. My clients love the professional PDFs, and I finally know who owes me money.', rating: 5 },
                { name: 'Zara Khan', business: 'Zara\'s Beauty Clinic, Karachi', text: 'The AI insights helped me realize I was spending too much on marketing. Now I track everything and my profit margins have improved.', rating: 5 },
                { name: 'Imran Sheikh', business: 'Sheikh Consultants, Islamabad', text: 'From paper invoices to professional billing in one day. The WhatsApp share feature is a game changer for my consultancy business.', rating: 5 },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <svg key={j} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.business}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div {...fadeInUp} className="gradient-bg rounded-3xl p-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-brand-100 mb-8 text-lg">
                Join hundreds of Pakistani business owners using BizFlow. Free to start.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-3.5 rounded-xl text-lg font-semibold hover:shadow-xl transition-all"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
