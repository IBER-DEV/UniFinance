import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useTransactionStore } from '../../store/transactionStore';

const savingsGoalSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  target_amount: z.number().min(1, 'El monto objetivo debe ser mayor que 0'),
  current_amount: z.number().min(0, 'El monto actual debe ser al menos 0'),
  target_date: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'La fecha objetivo debe estar en el futuro',
  }),
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
  income_source_id: z.string().optional(),
  contribution_amount: z.number().min(0, 'La contribución debe ser al menos 0').optional(),
});

export type SavingsGoalFormData = z.infer<typeof savingsGoalSchema>;

interface AddSavingsGoalFormProps {
  onClose: () => void;
  onSubmit: (data: SavingsGoalFormData) => void;
  initialData?: Partial<SavingsGoalFormData>;
  mode?: 'create' | 'update';
}

const AddSavingsGoalForm: React.FC<AddSavingsGoalFormProps> = ({ 
  onClose, 
  onSubmit, 
  initialData,
  mode = 'create' 
}) => {
  const { transactions } = useTransactionStore();
  const incomeSources = transactions.filter(t => t.type === 'income');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SavingsGoalFormData>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      current_amount: initialData?.current_amount || 0,
      target_date: initialData?.target_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ...initialData,
    },
  });

  const selectedIncomeSourceId = watch('income_source_id');
  const contributionAmount = watch('contribution_amount');
  
  const selectedIncomeSource = incomeSources.find(source => source.id === selectedIncomeSourceId);
  
  // Calculate available balance for the selected income source
  const availableBalance = selectedIncomeSource ? 
    Number(selectedIncomeSource.amount) - 
    transactions
      .filter(t => t.type === 'expense' && t.income_source_id === selectedIncomeSourceId)
      .reduce((sum, t) => sum + Number(t.amount), 0)
    : 0;

  // Check if the contribution amount exceeds available balance
  const exceedsBalance = contributionAmount && contributionAmount > availableBalance;

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
          {mode === 'create' ? 'Add New Savings Goal' : 'Update Savings Goal'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">
              Nombre del Objetivo
            </label>
            <input
              type="text"
              className="input w-full"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-danger-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="target_amount">
              Monto Objetivo
            </label>
            <input
              type="number"
              step="0.01"
              className="input w-full"
              {...register('target_amount', { valueAsNumber: true })}
            />
            {errors.target_amount && (
              <p className="mt-1 text-sm text-danger-500">{errors.target_amount.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="current_amount">
              Monto Inicial
            </label>
            <input
              type="number"
              step="0.01"
              className="input w-full"
              {...register('current_amount', { valueAsNumber: true })}
            />
            {errors.current_amount && (
              <p className="mt-1 text-sm text-danger-500">{errors.current_amount.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="income_source_id">
              Contribuir desde Fuente de Ingreso
            </label>
            <select 
              className="select w-full"
              {...register('income_source_id')}
            >
              <option value="">Selecciona una fuente de ingresos</option>
              {incomeSources.map(source => (
                <option key={source.id} value={source.id}>
                  {source.description} (${source.amount})
                </option>
              ))}
            </select>
            {selectedIncomeSourceId && (
              <p className={`mt-1 text-sm ${exceedsBalance ? 'text-danger-500' : 'text-gray-600 dark:text-gray-400'}`}>
                Saldo disponible: ${availableBalance.toFixed(2)}
              </p>
            )}
          </div>

          {selectedIncomeSourceId && (
            <div>
              <label className="label" htmlFor="contribution_amount">
                Monto de Contribución
              </label>
              <input
                type="number"
                step="0.01"
                className={`input w-full ${exceedsBalance ? 'border-danger-500' : ''}`}
                {...register('contribution_amount', { valueAsNumber: true })}
              />
              {exceedsBalance && (
                <p className="mt-1 text-sm text-danger-500">
                  El monto excede el saldo disponible
                </p>
              )}
            </div>
          )}

          <div>
            <label className="label" htmlFor="target_date">
              Fecha Objetivo
            </label>
            <input
              type="date"
              className="input w-full"
              {...register('target_date')}
            />
            {errors.target_date && (
              <p className="mt-1 text-sm text-danger-500">{errors.target_date.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="description">
              Descriccion 
            </label>
            <textarea
              className="input w-full"
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger-500">{errors.description.message}</p>
            )}
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
              disabled={isSubmitting || (selectedIncomeSourceId && exceedsBalance)}
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Add Goal' : 'Update Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSavingsGoalForm;