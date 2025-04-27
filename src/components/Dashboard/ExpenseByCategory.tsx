import React, { useMemo } from 'react';
import { useTransactions } from '../../hooks/useTransactions'; // el hook nuevo
import { ExpenseCategory } from '../../types';

const categoryColors: Record<string, string> = {
  housing: 'bg-blue-500',
  food: 'bg-green-500',
  transportation: 'bg-yellow-500',
  education: 'bg-purple-500',
  entertainment: 'bg-pink-500',
  shopping: 'bg-indigo-500',
  health: 'bg-red-500',
  other: 'bg-gray-500',
};

const ExpenseByCategory: React.FC = () => {
  const { transactions, loading } = useTransactions();

  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const grouped = expenses.reduce((acc, expense) => {
      const category = expense.category ?? 'other';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([category, amount]) => ({
      category,
      amount: amount.toFixed(2),
      percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : '0',
    }));
  }, [transactions]);

  if (loading) {
    return <div className="card h-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="card h-full">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Expenses by Category
      </h3>
      <div className="space-y-3">
        {expensesByCategory.map(({ category, amount, percentage }) => (
          <div key={category} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`mr-2 h-3 w-3 rounded-full ${categoryColors[category] || 'bg-gray-500'}`}></div>
                <span className="text-sm capitalize">
                  {category} <span className="ml-1 text-gray-500 dark:text-gray-400">${amount}</span>
                </span>
              </div>
              <span className="text-sm font-medium">{percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full ${categoryColors[category] || 'bg-gray-500'}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseByCategory;
