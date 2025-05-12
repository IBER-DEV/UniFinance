import React from 'react';
import { useTransactionStore } from '../store/transactionStore';
import { format } from 'date-fns';
import { ArrowDownToLine, Plus, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import AddIncomeForm from '../components/Forms/AddIncomeForm';
import type { IncomeFormData } from '../components/Forms/AddIncomeForm';

const Income: React.FC = () => {
  const [showAddIncome, setShowAddIncome] = React.useState(false);
  const { transactions, addTransaction, isLoading } = useTransactionStore();

  const incomeTransactions = transactions.filter(t => t.type === 'income');

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const recurringIncome = incomeTransactions.filter(t => t.recurring).reduce((sum, t) => sum + Number(t.amount), 0);
  const latestIncome = incomeTransactions[0]?.amount || 0;

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
    setShowAddIncome(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
          Gestión de ingresos
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
          Rastree y administre sus fuentes de ingresos
          </p>
        </div>
        <button
          onClick={() => setShowAddIncome(true)}
          className="btn btn-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Añadir ingreso
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingresos totales
            </h3>
            <div className="rounded-full bg-secondary-100 p-2 text-secondary-600 dark:bg-secondary-900 dark:text-secondary-300">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            ${totalIncome.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ingresos totales desde el inicio
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ingresos Recurrentes</h3>
            <div className="rounded-full bg-primary-100 p-2 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
              <RefreshCw className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            ${recurringIncome.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ingresos recurrentes mensuales
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Últimos ingresos</h3>
            <div className="rounded-full bg-warning-100 p-2 text-warning-600 dark:bg-warning-900 dark:text-warning-300">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            ${latestIncome.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ingresos más recientes
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Historial de ingresos
        </h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {incomeTransactions.map((transaction) => (
              <div key={transaction.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-100 text-secondary-600 dark:bg-secondary-900 dark:text-secondary-300">
                      <ArrowDownToLine className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-secondary-600 dark:text-secondary-400">
                      +${transaction.amount}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.recurring && `Recurring ${transaction.recurring_period}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddIncome && (
        <AddIncomeForm
          onClose={() => setShowAddIncome(false)}
          onSubmit={handleAddIncome}
        />
      )}
    </div>
  );
};

export default Income;