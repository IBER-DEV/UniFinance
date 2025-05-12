import React, { useEffect } from 'react';
import { PiggyBank, Calendar } from 'lucide-react';
import { useSavingsStore } from '../../store/savingsStore';
import { Link } from 'react-router-dom';
import { differenceInDays } from 'date-fns';

const SavingsGoalsCard: React.FC = () => {
  const { goals, isLoading, error, fetchGoals } = useSavingsStore();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

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
          Error loading savings goals: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Metas de Ahorro</h3>
        <Link 
          to="/savings"
          className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Ver Todas
        </Link>
      </div>
      {goals.length > 0 ? (
        <div className="space-y-4">
          {goals.slice(0, 3).map((goal) => {
            const progressPercentage = Math.round((goal.current_amount / goal.target_amount) * 100);
            let statusColor = 'bg-warning-500';
            
            if (progressPercentage >= 75) {
              statusColor = 'bg-secondary-500';
            } else if (progressPercentage <= 25) {
              statusColor = 'bg-danger-500';
            }
            
            const daysLeft = differenceInDays(new Date(goal.target_date), new Date());
            
            return (
              <div key={goal.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-medium">{goal.name}</h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="mb-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <PiggyBank className="mr-1 h-4 w-4" />
                  <span>${goal.current_amount.toFixed(2)} of ${goal.target_amount.toFixed(2)}</span>
                </div>
                <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full ${statusColor}`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">{progressPercentage}% Complete</span>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>{daysLeft} days left</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
          <PiggyBank className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">No savings goals yet</p>
          <Link
            to="/savings"
            className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Create your first goal
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalsCard;