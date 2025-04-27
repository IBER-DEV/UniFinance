import { Income, Expense, Budget, SavingsGoal, Alert, FinancialTip } from '../types';

// Mock current date - using a fixed date for demo purposes
const CURRENT_DATE = '2024-10-24';
const CURRENT_MONTH = 'October';
const CURRENT_YEAR = 2024;

// Mock Income Data
export const mockIncomes: Income[] = [
  {
    id: '1',
    amount: 500,
    source: 'scholarship',
    date: '2024-10-01',
    description: 'Monthly scholarship',
    recurring: true,
    recurringPeriod: 'monthly',
  },
  {
    id: '2',
    amount: 200,
    source: 'family',
    date: '2024-10-05',
    description: 'Monthly allowance from parents',
    recurring: true,
    recurringPeriod: 'monthly',
  },
  {
    id: '3',
    amount: 250,
    source: 'job',
    date: '2024-10-15',
    description: 'Part-time job at campus cafe',
    recurring: true,
    recurringPeriod: 'biweekly',
  },
];

// Mock Expense Data
export const mockExpenses: Expense[] = [
  {
    id: '1',
    amount: 350,
    category: 'housing',
    date: '2024-10-02',
    description: 'Monthly rent',
    essential: true,
  },
  {
    id: '2',
    amount: 75,
    category: 'food',
    date: '2024-10-10',
    description: 'Grocery shopping',
    essential: true,
  },
  {
    id: '3',
    amount: 30,
    category: 'transportation',
    date: '2024-10-08',
    description: 'Bus pass',
    essential: true,
  },
  {
    id: '4',
    amount: 55,
    category: 'education',
    date: '2024-10-12',
    description: 'Textbooks',
    essential: true,
  },
  {
    id: '5',
    amount: 45,
    category: 'entertainment',
    date: '2024-10-15',
    description: 'Movie night with friends',
    essential: false,
  },
  {
    id: '6',
    amount: 65,
    category: 'shopping',
    date: '2024-10-17',
    description: 'New t-shirts',
    essential: false,
  },
];

// Mock Budget Data
export const mockBudget: Budget = {
  id: '1',
  month: CURRENT_MONTH,
  year: CURRENT_YEAR,
  categories: [
    { category: 'housing', limit: 400, spent: 350 },
    { category: 'food', limit: 150, spent: 75 },
    { category: 'transportation', limit: 50, spent: 30 },
    { category: 'education', limit: 100, spent: 55 },
    { category: 'entertainment', limit: 70, spent: 45 },
    { category: 'shopping', limit: 80, spent: 65 },
    { category: 'health', limit: 50, spent: 0 },
    { category: 'other', limit: 50, spent: 0 },
  ],
  totalIncome: 950,
  totalExpenses: 620,
  savingsGoal: 200,
};

// Mock Savings Goals
export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'Spring Break Trip',
    targetAmount: 400,
    currentAmount: 150,
    targetDate: '2025-03-10',
    category: 'travel',
    priority: 'medium',
  },
  {
    id: '2',
    name: 'New Laptop',
    targetAmount: 800,
    currentAmount: 200,
    targetDate: '2025-01-15',
    category: 'tech',
    priority: 'high',
  },
  {
    id: '3',
    name: 'Emergency Fund',
    targetAmount: 1000,
    currentAmount: 300,
    targetDate: '2025-06-30',
    category: 'emergency',
    priority: 'medium',
  },
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'budget',
    message: 'You are approaching your entertainment budget limit (80% used)',
    date: '2024-10-18',
    read: false,
    category: 'entertainment',
  },
  {
    id: '2',
    type: 'payment',
    message: 'Rent payment due in 3 days',
    date: '2024-10-27',
    read: false,
    category: 'housing',
  },
  {
    id: '3',
    type: 'savings',
    message: 'You are on track to reach your laptop savings goal!',
    date: '2024-10-16',
    read: true,
  },
];

// Mock Financial Tips
export const mockFinancialTips: FinancialTip[] = [
  {
    id: '1',
    title: 'Use Student Discounts',
    content: 'Always ask about student discounts when shopping. Many places offer 10-15% off with a valid student ID.',
    category: 'saving',
    difficulty: 'beginner',
  },
  {
    id: '2',
    title: 'Cook in Bulk',
    content: 'Prepare meals in bulk and freeze portions to save both money and time during busy school weeks.',
    category: 'saving',
    difficulty: 'beginner',
  },
  {
    id: '3',
    title: 'Use Library Resources',
    content: 'Check if your university library offers free access to textbooks or digital resources before purchasing.',
    category: 'saving',
    difficulty: 'beginner',
  },
  {
    id: '4',
    title: '50/30/20 Budget Rule',
    content: 'Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings or debt payment.',
    category: 'budgeting',
    difficulty: 'intermediate',
  },
  {
    id: '5',
    title: 'Campus Side Hustles',
    content: 'Look for flexible on-campus jobs like tutoring, research assistantships, or admin work that fit with your class schedule.',
    category: 'earning',
    difficulty: 'intermediate',
  },
];

// Get monthly overview data
export const getMonthlyOverview = () => {
  const totalIncome = mockIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const essentialExpenses = mockExpenses
    .filter(expense => expense.essential)
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const nonEssentialExpenses = mockExpenses
    .filter(expense => !expense.essential)
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const savingsAmount = totalIncome - totalExpenses;
  const savingsPercentage = Math.round((savingsAmount / totalIncome) * 100);
  
  return {
    totalIncome,
    totalExpenses,
    essentialExpenses,
    nonEssentialExpenses,
    savingsAmount,
    savingsPercentage,
    month: CURRENT_MONTH,
    year: CURRENT_YEAR,
  };
};

// Get expense breakdown by category
export const getExpensesByCategory = () => {
  const categories = {} as Record<string, number>;
  
  mockExpenses.forEach(expense => {
    if (categories[expense.category]) {
      categories[expense.category] += expense.amount;
    } else {
      categories[expense.category] = expense.amount;
    }
  });
  
  return Object.entries(categories).map(([category, amount]) => ({
    category,
    amount,
    percentage: Math.round((amount / mockBudget.totalExpenses) * 100),
  }));
};

// Get recent transactions
export const getRecentTransactions = () => {
  const allTransactions = [
    ...mockIncomes.map(income => ({
      id: income.id,
      amount: income.amount,
      type: 'income' as const,
      category: income.source,
      date: income.date,
      description: income.description || '',
    })),
    ...mockExpenses.map(expense => ({
      id: expense.id,
      amount: -expense.amount,
      type: 'expense' as const,
      category: expense.category,
      date: expense.date,
      description: expense.description,
    })),
  ];
  
  return allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};