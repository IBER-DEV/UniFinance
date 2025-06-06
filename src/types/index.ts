export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Income {
  id: string;
  amount: number;
  source: IncomeSource;
  date: string;
  description?: string;
  recurring: boolean;
  recurringPeriod?: 'weekly' | 'biweekly' | 'monthly';
}

export type IncomeSource = 'scholarship' | 'family' | 'job' | 'other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  description: string;
  essential: boolean;
  income_source_id?: string; // Es opcional porque no todos los gastos quizás vengan de una fuente específica
}

export type ExpenseCategory = 
  | 'housing' 
  | 'food' 
  | 'transportation' 
  | 'education' 
  | 'entertainment' 
  | 'shopping' 
  | 'health'
  | 'other';

export interface Budget {
  id: string;
  month: string;
  year: number;
  categories: BudgetCategory[];
  totalIncome: number;
  totalExpenses: number;
  savingsGoal: number;
}

export interface BudgetCategory {
  category: ExpenseCategory;
  limit: number;
  spent: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  contribution_amount?: number;
  income_source_id?: string;
}

export interface Alert {
  id: string;
  type: 'budget' | 'payment' | 'savings';
  message: string;
  date: string;
  read: boolean;
  category?: ExpenseCategory;
}

export interface FinancialTip {
  id: string;
  title: string;
  content: string;
  category: 'saving' | 'budgeting' | 'earning' | 'investing';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}