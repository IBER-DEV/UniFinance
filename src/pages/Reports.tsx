import React, { useState } from 'react';
import { useTransactionStore } from '../store/transactionStore';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ArrowUpFromLine,
  ArrowDownToLine,
  Calendar,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const Reports: React.FC = () => {
  const { transactions } = useTransactionStore();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  // Filter transactions for selected month
  const selectedDate = new Date(selectedMonth);
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= monthStart && transactionDate <= monthEnd;
  });

  // Calculate monthly statistics
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome) * 100 : 0;

  // Calculate expense by category
  const expensesByCategory = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  // Calculate daily spending
  const dailySpending = eachDayOfInterval({ start: monthStart, end: monthEnd }).map(date => {
    const dayExpenses = monthlyTransactions
      .filter(t => t.type === 'expense' && t.date === format(date, 'yyyy-MM-dd'))
      .reduce((sum, t) => sum + Number(t.amount), 0);
    return {
      date: format(date, 'MMM dd'),
      amount: dayExpenses,
    };
  });

  // Calculate income sources breakdown
  const incomeSourcesBreakdown = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      const source = t.category;
      if (!acc[source]) {
        acc[source] = {
          total: 0,
          expenses: 0,
          remaining: 0,
        };
      }
      acc[source].total += Number(t.amount);
      
      // Calculate expenses for this income source
      const sourceExpenses = monthlyTransactions
        .filter(e => e.type === 'expense' && e.income_source_id === t.id)
        .reduce((sum, e) => sum + Number(e.amount), 0);
      
      acc[source].expenses = sourceExpenses;
      acc[source].remaining = acc[source].total - sourceExpenses;
      
      return acc;
    }, {} as Record<string, { total: number; expenses: number; remaining: number }>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
            Reportes
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
          Análisis detallado de su actividad financiera
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input"
          />
        </div>
      </div>

      {/* Monthly Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Ingreso Mensual
            </h3>
            <div className="rounded-full bg-secondary-100 p-2 text-secondary-600 dark:bg-secondary-900 dark:text-secondary-300">
              <ArrowDownToLine className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            ${monthlyIncome.toFixed(2)}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Gastos Mensuales
            </h3>
            <div className="rounded-full bg-danger-100 p-2 text-danger-600 dark:bg-danger-900 dark:text-danger-300">
              <ArrowUpFromLine className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            ${monthlyExpenses.toFixed(2)}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Ahorros Mensuales
            </h3>
            <div className="rounded-full bg-primary-100 p-2 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            ${monthlySavings.toFixed(2)}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Tasa de Ahorro
            </h3>
            <div className="rounded-full bg-warning-100 p-2 text-warning-600 dark:bg-warning-900 dark:text-warning-300">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Expense Categories Analysis */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Análisis de Gastos por Categoría
          </h3>
          <div className="space-y-4">
            {Object.entries(expensesByCategory).map(([category, amount]) => {
              const percentage = (amount / monthlyExpenses) * 100;
              return (
                <div key={category}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-primary-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Análisis de Gastos Diarios
          </h3>
          <div className="space-y-2">
            {dailySpending.map((day) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {day.date}
                </span>
                <div className="flex flex-1 items-center px-4">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-secondary-500"
                      style={{
                        width: `${(day.amount / Math.max(...dailySpending.map(d => d.amount))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium">${day.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Income Sources Analysis */}
      <div className="card">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Análisis de Fuentes de Ingreso
        </h3>
        <div className="space-y-6">
          {Object.entries(incomeSourcesBreakdown).map(([source, data]) => (
            <div key={source} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium capitalize">{source}</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total: ${data.total.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-danger-500">Spent: ${data.expenses.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-secondary-500">
                    Remaining: ${data.remaining.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-2 rounded-full bg-danger-500"
                  style={{ width: `${(data.expenses / data.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;