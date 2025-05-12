import React from 'react';
import { useTransactionStore } from '../store/transactionStore';
import { format } from 'date-fns';
import { ArrowUpFromLine, Plus, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import AddExpenseForm from '../components/Forms/AddExpenseForm';
import type { ExpenseFormData } from '../components/Forms/AddExpenseForm';

const Expenses: React.FC = () => {
  const [showAddExpense, setShowAddExpense] = React.useState(false);
  const { transactions, addTransaction, isLoading } = useTransactionStore();

  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const essentialExpenses = expenseTransactions
    .filter(t => t.category === 'housing' || t.category === 'food' || t.category === 'transportation' || t.category === 'education')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const latestExpense = expenseTransactions[0]?.amount || 0;

  const handleAddExpense = async (data: ExpenseFormData) => {
    await addTransaction({
      amount: data.amount,
      type: 'expense',
      category: data.category,
      description: data.description,
      date: data.date,
      recurring: false,
      recurring_period: null,
      income_source_id: data.income_source_id, // Add this line to include the income source
    });
    setShowAddExpense(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
          Gestión de Gastos
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
          Rastree y administre sus Gastos
          </p>
        </div>
        <button
          onClick={() => setShowAddExpense(true)}
          className="btn btn-danger"
        >
          <Plus className="mr-2 h-4 w-4" />
          Añadir Gastos
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gastos Totales</h3>
            <div className="rounded-full bg-danger-100 p-2 text-danger-600 dark:bg-danger-900 dark:text-danger-300">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            ${totalExpenses.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gastos de todo el tiempo
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gastos Esenciales</h3>
            <div className="rounded-full bg-warning-100 p-2 text-warning-600 dark:bg-warning-900 dark:text-warning-300">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            ${essentialExpenses.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gastos de necesidades básicas
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Último gasto</h3>
            <div className="rounded-full bg-primary-100 p-2 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            ${latestExpense.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gasto más reciente
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Historial de gastos
        </h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {expenseTransactions.map((transaction) => (
              <div key={transaction.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-100 text-danger-600 dark:bg-danger-900 dark:text-danger-300">
                      <ArrowUpFromLine className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(transaction.date), 'MMM d, yyyy')} • {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-danger-600 dark:text-danger-400">
                      -${transaction.amount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddExpense && (
        <AddExpenseForm
          onClose={() => setShowAddExpense(false)}
          onSubmit={handleAddExpense}
        />
      )}
    </div>
  );
};

export default Expenses;