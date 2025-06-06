import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useTransactionStore } from '../../store/transactionStore';

export const expenseSchema = z.object({
  amount: z.number().min(0.01, 'El importe debe ser mayor que 0'),
  category: z.enum([
    'housing',
    'food',
    'transportation',
    'education',
    'entertainment',
    'shopping',
    'health',
    'other',
  ], {
    errorMap: () => ({ message: 'Seleccione una categoría' }),
  }),
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
  date: z.string(),
  essential: z.boolean(),
  income_source_id: z.string().uuid('Por favor seleccione una fuente de ingreso'),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

interface AddExpenseFormProps {
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onClose, onSubmit }) => {
  const { transactions, fetchTransactions } = useTransactionStore();
  const incomeSources = transactions.filter(t => t.type === 'income');

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
    clearErrors,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      essential: false,
    },
  });

  const selectedIncomeSourceId = watch('income_source_id');
  const selectedIncomeSource = incomeSources.find(source => source.id === selectedIncomeSourceId);
  const availableBalance = selectedIncomeSource ? 
    selectedIncomeSource.amount - 
    transactions
      .filter(t => t.type === 'expense' && t.income_source_id === selectedIncomeSourceId)
      .reduce((sum, t) => sum + Number(t.amount), 0)
    : 0;

  const currentAmount = watch('amount');

  useEffect(() => {
    const amountValue = typeof currentAmount === 'number' ? currentAmount : undefined;

    // Only set/clear our custom error if an income source is selected
    if (selectedIncomeSourceId) {
      if (typeof amountValue === 'number' && amountValue > 0 && amountValue > availableBalance) {
        setError('amount', {
          type: 'manual',
          message: `Amount exceeds available balance of $${availableBalance.toFixed(2)}`,
        });
      } else if (errors.amount && errors.amount.message?.includes('exceeds available balance')) {
        // Clear our custom error if the condition is no longer met or amount is not positive
        clearErrors('amount');
      }
    } else if (errors.amount && errors.amount.message?.includes('exceeds available balance')){
      // If no income source is selected, clear any existing 'exceeds balance' error for the amount
      clearErrors('amount');
    }
  }, [currentAmount, availableBalance, selectedIncomeSourceId, setError, clearErrors, errors.amount]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Añadir Gasto
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label" htmlFor="income_source_id">
              Fuente de Ingreso
            </label>
            <select className="select w-full" {...register('income_source_id')}>
              <option value="">Seleccione Una Fuente de Ingreso</option>
              {incomeSources.map(source => (
                <option key={source.id} value={source.id}>
                  {source.description} (${source.amount})
                </option>
              ))}
            </select>
            {errors.income_source_id && (
              <p className="mt-1 text-sm text-danger-500">{errors.income_source_id.message}</p>
            )}
            {selectedIncomeSourceId && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Available balance: ${availableBalance.toFixed(2)}
              </p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="amount">
              Importe
            </label>
            <input
              type="number"
              step="0.01"
              className={`input w-full ${errors.amount ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-danger-500">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="category">
              Categoria
            </label>
            <select className="select w-full" {...register('category')}>
              <option value="housing">Vivienda</option>
              <option value="food">Alimentación</option>
              <option value="transportation">Transporte</option>
              <option value="education">Educación</option>
              <option value="entertainment">Entretenimiento</option>
              <option value="shopping">Compras</option>
              <option value="health">Salud</option>
              <option value="other">Otro</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-danger-500">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="description">
              Descripcion
            </label>
            <input
              type="text"
              className="input w-full"
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger-500">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="date">
              Fecha
            </label>
            <input
              type="date"
              className="input w-full"
              {...register('date')}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-danger-500">{errors.date.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('essential')}
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Gasto Esencial
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting || !selectedIncomeSourceId || Number(watch('amount')) > availableBalance}
            >
              {isSubmitting ? 'Adding...' : 'Añadir Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;