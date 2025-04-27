import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ExpenseCategory } from '../types';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category?: ExpenseCategory;
  date: string; // ISO format
  description?: string;
  user_id: string;
}

interface UseTransactionsOptions {
  month?: number; // 1-12
  year?: number;
  userId?: string;
}

export const useTransactions = (options: UseTransactionsOptions = {}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      let query = supabase.from('transactions').select('*');

      // Si pasa userId, filtra
      if (options.userId) {
        query = query.eq('user_id', options.userId);
      }

      // Si pasa mes y año, filtra por rango de fechas
      if (options.month && options.year) {
        const startDate = new Date(options.year, options.month - 1, 1).toISOString();
        const endDate = new Date(options.year, options.month, 0, 23, 59, 59).toISOString(); // último día del mes

        query = query.gte('date', startDate).lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching transactions:', error);
        setError(error.message);
      } else {
        setTransactions(data || []);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [options.month, options.year, options.userId]);

  return {
    transactions,
    loading,
    error,
  };
};
