import React, { useState, useEffect } from 'react';
import { PiggyBank, Target, Calendar, TrendingUp, Plus, Trash2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { useTransactionStore } from '../store/transactionStore';
import { useSavingsStore } from '../store/savingsStore';
import AddSavingsGoalForm from '../components/Forms/AddSavingsGoalForm';
import type { SavingsGoalFormData } from '../components/Forms/AddSavingsGoalForm';

const Savings: React.FC = () => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any | null>(null);

  const { transactions, addTransaction } = useTransactionStore();
  const { goals, isLoading, error, fetchGoals, addGoal, updateGoal, deleteGoal } = useSavingsStore();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;

  const handleAddGoal = async (data: SavingsGoalFormData) => {
    try {
      if (data.income_source_id && data.contribution_amount) {
        await addTransaction({
          amount: data.contribution_amount,
          type: 'expense',
          category: 'savings',
          description: `Contribution to savings goal: ${data.name}`,
          date: new Date().toISOString().split('T')[0],
          income_source_id: data.income_source_id,
          recurring: false,
        });

        data.current_amount = (data.current_amount || 0) + data.contribution_amount;
      }

      await addGoal({
        name: data.name,
        target_amount: data.target_amount,
        current_amount: data.current_amount,
        target_date: data.target_date,
        description: data.description,
      });

      setShowAddGoal(false);
    } catch (error) {
      console.error('Error creating savings goal:', error);
    }
  };

  const handleUpdateGoal = async (goalId: string, data: SavingsGoalFormData) => {
    try {
      if (data.income_source_id && data.contribution_amount) {
        await addTransaction({
          amount: data.contribution_amount,
          type: 'expense',
          category: 'savings',
          description: `Contribution to savings goal: ${data.name}`,
          date: new Date().toISOString().split('T')[0],
          income_source_id: data.income_source_id,
          recurring: false,
        });

        const goal = goals.find(g => g.id === goalId);
        if (goal) {
          await updateGoal(goalId, {
            current_amount: goal.current_amount + data.contribution_amount,
          });
        }
      }
      setShowContributionForm(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Error updating savings goal:', error);
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-secondary-500';
    if (progress >= 50) return 'bg-primary-500';
    if (progress >= 25) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">
          Metas de ahorro
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
          Realice un seguimiento y administre sus objetivos de ahorro
          </p>
        </div>
        <button onClick={() => setShowAddGoal(true)} className="btn btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Añadir meta
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ahorro total</h3>
            <div className="rounded-full bg-secondary-100 p-2 text-secondary-600 dark:bg-secondary-900 dark:text-secondary-300">
              <PiggyBank className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            ${totalSavings.toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Saldo actual de ahorro</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasa de ahorro</h3>
            <div className="rounded-full bg-primary-100 p-2 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
            {savingsRate.toFixed(1)}%
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">De los ingresos totales</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Objetivos activos</h3>
            <div className="rounded-full bg-warning-100 p-2 text-warning-600 dark:bg-warning-900 dark:text-warning-300">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{goals.length}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Objetivos de ahorro actuales</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.current_amount, goal.target_amount);
            const daysLeft = differenceInDays(new Date(goal.target_date), new Date());

            return (
              <div key={goal.id} className="card">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{goal.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{goal.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>{daysLeft} days left</span>
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-gray-400 hover:text-danger-500 dark:text-gray-500 dark:hover:text-danger-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    ${goal.current_amount.toFixed(2)} de ${goal.target_amount.toFixed(2)}
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {progress.toFixed(1)}%
                  </span>
                </div>

                <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Fecha objetivo: {format(new Date(goal.target_date), 'MMM d, yyyy')}</span>
                  <span>
                   Necesidad mensual: $
                    {((goal.target_amount - goal.current_amount) / Math.max(daysLeft / 30, 1)).toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setShowContributionForm(true);
                    }}
                    className="btn btn-secondary text-sm"
                  >
                    Añadir contribución
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAddGoal && (
        <AddSavingsGoalForm
          onClose={() => setShowAddGoal(false)}
          onSubmit={handleAddGoal}
        />
      )}

      {showContributionForm && selectedGoal && (
        <AddSavingsGoalForm
          mode="update"
          initialData={selectedGoal}
          onClose={() => {
            setShowContributionForm(false);
            setSelectedGoal(null);
          }}
          onSubmit={(data) => handleUpdateGoal(selectedGoal.id, data)}
        />
      )}
    </div>
  );
};

export default Savings;
