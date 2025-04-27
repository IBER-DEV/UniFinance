import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface BudgetCategory {
  category: string;
  limit: number;
  spent: number;
}

interface Budget {
  id: string;
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  savingsGoal: number;
  categories: BudgetCategory[];
}

export const useBudget = (userId: string, month: number, year: number) => {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudget = async () => {
      setLoading(true);
      setError(null);

      const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId)
        .eq('month', monthName)
        .eq('year', year)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else {
        setBudget(data);
      }
      setLoading(false);
    };

    if (userId) {
      fetchBudget();
    }
  }, [userId, month, year]);

  return { budget, loading, error };
};
