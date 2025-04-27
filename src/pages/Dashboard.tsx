import React, { useMemo } from 'react';
import {
  DollarSign,
  ShoppingCart,
  PiggyBank,
  Wallet,
} from 'lucide-react';
import { useTransactionStore } from '../store/transactionStore'; // Ajusta la ruta según tu estructura de carpetas
import OverviewCard from '../components/Dashboard/OverviewCard';
import ExpenseByCategory from '../components/Dashboard/ExpenseByCategory';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import BudgetProgressCard from '../components/Dashboard/BudgetProgressCard';
import SavingsGoalsCard from '../components/Dashboard/SavingsGoalsCard';
import AlertsCard from '../components/Dashboard/AlertsCard';
import FinancialTipsCard from '../components/Dashboard/FinancialTipsCard';

const Dashboard: React.FC = () => {
  const { transactions } = useTransactionStore();

  const overview = useMemo(() => {
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0); // SIN Math.abs
    const savingsAmount = totalIncome - totalExpenses;
    const savingsPercentage = totalIncome > 0 ? ((savingsAmount / totalIncome) * 100) : 0;
  
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
  
    return {
      month,
      year,
      totalIncome: totalIncome.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      savingsAmount: savingsAmount.toFixed(2),
      savingsPercentage: savingsPercentage.toFixed(1),
    };
  }, [transactions]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
          Financial Dashboard
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {overview.month} {overview.year} Overview
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Total Income"
          value={`$${overview.totalIncome}`}
          icon={<DollarSign className="h-5 w-5 text-primary-500" />}
          change={5}
          trend="up"
        />
        <OverviewCard
          title="Total Expenses"
          value={`$${overview.totalExpenses}`}
          icon={<ShoppingCart className="h-5 w-5 text-danger-500" />}
          change={3}
          trend="down"
        />
        <OverviewCard
          title="Savings"
          value={`$${overview.savingsAmount}`}
          icon={<PiggyBank className="h-5 w-5 text-secondary-500" />}
          change={12}
          trend="up"
        />
        <OverviewCard
          title="Savings Rate"
          value={overview.savingsPercentage}
          icon={<Wallet className="h-5 w-5 text-warning-500" />}
          prefix=""
          suffix="%"
          change={2}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BudgetProgressCard />
        </div>
        <div>
          <AlertsCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <ExpenseByCategory />
        </div>
        <div>
          <RecentTransactions />
        </div>
        <div>
          <SavingsGoalsCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <FinancialTipsCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
