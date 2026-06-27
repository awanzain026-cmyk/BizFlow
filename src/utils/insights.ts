import { AIInsight, AppData } from '@/types';

export function generateInsights(data: AppData): AIInsight[] {
  const insights: AIInsight[] = [];
  const { invoices, clients, expenses } = data;

  const totalOutstanding = invoices
    .filter(i => i.status === 'unpaid' || i.status === 'overdue' || i.status === 'partial')
    .reduce((sum, i) => sum + (i.total - i.amountPaid), 0);

  if (totalOutstanding > 100000) {
    insights.push({
      id: 'insight-1',
      type: 'warning',
      title: 'High Outstanding Receivables',
      description: `You have Rs. ${totalOutstanding.toLocaleString('en-PK')} in unpaid invoices. Consider sending payment reminders or offering early payment discounts to improve cash flow.`,
    });
  } else {
    insights.push({
      id: 'insight-1',
      type: 'success',
      title: 'Healthy Receivables',
      description: `Only Rs. ${totalOutstanding.toLocaleString('en-PK')} outstanding. Your collection process is working well. Keep it up!`,
    });
  }

  const overdueCount = invoices.filter(i => i.status === 'overdue').length;
  if (overdueCount > 0) {
    insights.push({
      id: 'insight-2',
      type: 'warning',
      title: `${overdueCount} Invoice${overdueCount > 1 ? 's' : ''} Overdue`,
      description: `${overdueCount} client${overdueCount > 1 ? 's have' : ' has'} overdue payments. We recommend sending follow-up reminders today to avoid delayed payments.`,
    });
  } else {
    insights.push({
      id: 'insight-2',
      type: 'info',
      title: 'No Overdue Payments',
      description: 'All your invoices are within payment terms. Keep maintaining this discipline!',
    });
  }

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;

  if (profitMargin < 20 && totalRevenue > 0) {
    insights.push({
      id: 'insight-3',
      type: 'warning',
      title: 'Low Profit Margin',
      description: `Your current profit margin is ${profitMargin.toFixed(1)}%. Consider reviewing expenses or adjusting pricing to improve profitability.`,
    });
  } else if (profitMargin >= 40) {
    insights.push({
      id: 'insight-3',
      type: 'success',
      title: 'Excellent Profit Margin',
      description: `Your profit margin is ${profitMargin.toFixed(1)}%. Great job managing costs while generating revenue!`,
    });
  } else {
    insights.push({
      id: 'insight-3',
      type: 'info',
      title: 'Moderate Profit Margin',
      description: `Your profit margin is ${profitMargin.toFixed(1)}%. Look for opportunities to optimize expenses and increase revenue.`,
    });
  }

  if (clients.length >= 3) {
    const clientTotals = clients.map(c => {
      const clientInvoices = invoices.filter(i => i.clientId === c.id);
      const totalBilled = clientInvoices.reduce((s, i) => s + i.total, 0);
      return { name: c.businessName, totalBilled };
    });
    const topClient = clientTotals.sort((a, b) => b.totalBilled - a.totalBilled)[0];
    if (topClient && topClient.totalBilled > 0) {
      insights.push({
        id: 'insight-4',
        type: 'opportunity',
        title: 'Top Client Opportunity',
        description: `${topClient.name} is your highest-value client (Rs. ${topClient.totalBilled.toLocaleString('en-PK')}). Consider offering them a loyalty package or referral incentive.`,
      });
    }
  } else {
    insights.push({
      id: 'insight-4',
      type: 'info',
      title: 'Build Your Client Base',
      description: 'Add more clients to unlock revenue insights and identify your most valuable business relationships.',
    });
  }

  return insights;
}
