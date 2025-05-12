import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

interface TransactionStore {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      set({ transactions: data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

addTransaction: async (transaction) => {
  set({ isLoading: true, error: null });
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transaction,
        user_id: user.id, // 🔥 Aquí le inyectas el user_id antes de insertar
      }])
      .select()
      .single();

    if (error) throw error;

    set((state) => ({
      transactions: [data, ...state.transactions],
    }));
  } catch (error) {
    set({ error: (error as Error).message });
  } finally {
    set({ isLoading: false });
  }
},


  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateTransaction: async (id, transaction) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(transaction)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        transactions: state.transactions.map((t) => 
          t.id === id ? { ...t, ...data } : t
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));