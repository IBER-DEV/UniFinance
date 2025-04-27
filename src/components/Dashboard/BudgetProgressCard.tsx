import React, { useEffect, useState } from 'react';
import { useTransactionStore } from '../../store/transactionStore';

const BudgetProgressCard: React.FC = () => {
  const { transactions } = useTransactionStore();

  const categoryBudgetLimits: Record<string, number> = {
    housing: 0.3,
    food: 0.15,
    transportation: 0.1,
    education: 0.15,
    entertainment: 0.1,
    shopping: 0.1,
    health: 0.05,
    other: 0.05,
  };

  // State para savings goal, inicializado desde localStorage si existe
  const [savingsGoalMultiplier, setSavingsGoalMultiplier] = useState(() => {
    const saved = localStorage.getItem('savingsGoalMultiplier');
    return saved ? Number(saved) : 0.2;
  });

  // Guardar automáticamente cada vez que cambia
  useEffect(() => {
    localStorage.setItem('savingsGoalMultiplier', String(savingsGoalMultiplier));
  }, [savingsGoalMultiplier]);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const currentSavings = totalIncome - totalExpenses;
  const savingsGoal = Math.max(totalIncome * savingsGoalMultiplier, 1);
  const savingsProgress = Math.min(100, Math.round((currentSavings / savingsGoal) * 100));

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.category;
      if (!acc[category]) {
        acc[category] = {
          spent: 0,
          limit: totalIncome * (categoryBudgetLimits[category] ?? 0.1),
        };
      }
      acc[category].spent += Number(t.amount);
      return acc;
    }, {} as Record<string, { spent: number; limit: number }>);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return 'bg-secondary-500';
    if (percentage >= 50) return 'bg-primary-500';
    if (percentage >= 25) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  if (totalIncome === 0) {
    return (
      <div className="card text-center py-10">
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">
          No data yet. Add your first income to start tracking!
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Budget Overview
      </h3>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3 text-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-white">
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Expenses</p>
          <p className="text-xl font-semibold text-danger-600 dark:text-danger-400">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Savings</p>
          <p className="text-xl font-semibold text-secondary-600 dark:text-secondary-400">
            ${currentSavings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Editable Savings Goal */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Savings Goal Progress</p>
          <p className="text-sm font-medium">
            ${currentSavings.toFixed(2)} of ${savingsGoal.toFixed(2)}
          </p>
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
            Adjust Savings Goal: {Math.round(savingsGoalMultiplier * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={(savingsGoalMultiplier * 100)}
            onChange={(e) => setSavingsGoalMultiplier(Number(e.target.value) / 100)}
            className="w-full cursor-pointer accent-secondary-500 dark:accent-secondary-400"
          />
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getStatusColor(savingsProgress)}`}
            style={{ width: `${savingsProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Expenses by Category */}
      <div className="grid gap-4">
        {Object.entries(expensesByCategory).map(([category, { spent, limit }]) => {
          const spentPercentage = (spent / limit) * 100;
          const barWidth = Math.min(spentPercentage, 100);
          const overBudget = spentPercentage > 100;

          const statusColor = spentPercentage > 90 
            ? 'bg-danger-500' 
            : spentPercentage > 75 
            ? 'bg-warning-500' 
            : 'bg-secondary-500';

          return (
            <div key={category} className="rounded-md border border-gray-200 p-3 dark:border-gray-700">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="capitalize">{category}</span>
                <div className="flex items-center gap-2">
                  <span>
                    ${spent.toFixed(2)} of ${limit.toFixed(2)}
                  </span>
                  {overBudget && (
                    <span className="rounded-full bg-danger-100 px-2 py-0.5 text-xs text-danger-700 dark:bg-danger-900 dark:text-danger-300">
                      Over!
                    </span>
                  )}
                </div>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-2 rounded-full ${statusColor}`}
                  style={{ width: `${barWidth}%` }}
                ></div>
              </div>

              <div className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
                {spentPercentage.toFixed(1)}% used
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetProgressCard;
