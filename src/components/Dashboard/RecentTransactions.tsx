import React, { useState, useEffect } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, ChevronRight, Plus, MinusCircle } from 'lucide-react';
import AddIncomeForm from '../Forms/AddIncomeForm';
import AddExpenseForm from '../Forms/AddExpenseForm';
import { format } from 'date-fns';
import { useTransactionStore } from '../../store/transactionStore';
import { updateOrCreateBudget } from '../../utils/updateOrCreateBudget'; // 👈 Nueva importación
import type { IncomeFormData } from '../Forms/AddIncomeForm';
import type { ExpenseFormData } from '../Forms/AddExpenseForm';

const RecentTransactions: React.FC = () => {
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const { transactions, isLoading, error, fetchTransactions, addTransaction } = useTransactionStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d');
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleAddIncome = async (data: IncomeFormData) => {
    await addTransaction({
      amount: data.amount,
      type: 'income',
      category: data.source,
      description: data.description,
      date: data.date,
      recurring: data.recurring,
      recurring_period: data.recurring ? data.recurringPeriod : null,
    });

    await updateOrCreateBudget(data.amount, 'income', data.date); // 👈 actualizar presupuesto también
    setShowAddIncome(false);
  };

  const handleAddExpense = async (data: ExpenseFormData) => {
    await addTransaction({
      amount: data.amount,
      type: 'expense',
      category: data.category,
      description: data.description,
      date: data.date,
      recurring: false,
      recurring_period: null,
    });

    await updateOrCreateBudget(data.amount, 'expense', data.date); // 👈 actualizar presupuesto también
    setShowAddExpense(false);
  };

  const calculateBalance = () => {
    return transactions.reduce((acc, transaction) => {
      return transaction.type === 'income'
        ? acc + Number(transaction.amount)
        : acc - Number(transaction.amount);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="card h-full">
        <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card h-full">
        <div className="p-4 text-center text-danger-500">
          Error loading transactions: {error}
        </div>
      </div>
    );
  }

  const currentBalance = calculateBalance();

  return (
    <>
      <div className="card h-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Transacciones recientes
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Saldo actual:
              <span className={`ml-2 font-semibold ${currentBalance >= 0
                  ? 'text-secondary-600 dark:text-secondary-400'
                  : 'text-danger-600 dark:text-danger-400'
                }`}>
                ${currentBalance.toFixed(2)}
              </span>
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:space-x-2 sm:gap-0">
            <button
              onClick={() => setShowAddExpense(true)}
              className="btn btn-danger w-full sm:w-auto"
            >
              <MinusCircle className="mr-1 h-4 w-4" />
              Add Gasto
            </button>
            <button
              onClick={() => setShowAddIncome(true)}
              className="btn btn-secondary w-full sm:w-auto"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Ingreso
            </button>
          </div>

        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${transaction.type === 'income'
                      ? 'bg-secondary-100 text-secondary-600 dark:bg-secondary-900 dark:text-secondary-300'
                      : 'bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-300'
                    }`}>
                    {transaction.type === 'income' ? (
                      <ArrowDownToLine className="h-4 w-4" />
                    ) : (
                      <ArrowUpFromLine className="h-4 w-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getCategoryLabel(transaction.category)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${transaction.type === 'income'
                      ? 'text-secondary-600 dark:text-secondary-400'
                      : 'text-danger-600 dark:text-danger-400'
                    }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 py-2 text-sm font-medium text-primary-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-gray-700">
          View All Transactions
          <ChevronRight className="ml-1 h-4 w-4" />
        </div>
      </div>

      {showAddIncome && (
        <AddIncomeForm
          onClose={() => setShowAddIncome(false)}
          onSubmit={handleAddIncome}
        />
      )}

      {showAddExpense && (
        <AddExpenseForm
          onClose={() => setShowAddExpense(false)}
          onSubmit={handleAddExpense}
        />
      )}
    </>
  );
};

export default RecentTransactions;
