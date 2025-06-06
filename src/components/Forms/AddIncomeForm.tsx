import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

export const incomeSchema = z.object({
  amount: z.number().min(0.01, 'La cantidad debe ser mayor que 0'),
  source: z.enum(['scholarship', 'family', 'job', 'other'], {
    required_error: 'Selecciona una fuente',
  }),
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
  date: z.string({ required_error: 'La fecha es obligatoria' }),
  recurring: z.boolean(),
  recurringPeriod: z.enum(['weekly', 'biweekly', 'monthly'], {
    required_error: 'Selecciona un periodo recurrente',
  }).optional(),
});

export type IncomeFormData = z.infer<typeof incomeSchema>;

interface AddIncomeFormProps {
  onClose: () => void;
  onSubmit: (data: IncomeFormData) => void;
}

const AddIncomeForm: React.FC<AddIncomeFormProps> = ({ onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      recurring: false,
    },
  });

  const isRecurring = watch('recurring');

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
          Añadir Ingreso
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label" htmlFor="amount">
              Cantidad
            </label>
            <input
              type="number"
              step="0.01"
              className="input w-full"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-danger-500">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="source">
              Fuente
            </label>
            <select className="select w-full" {...register('source')}>
              <option value="scholarship">Ingresos Educativos</option>
              <option value="family">Familiares</option>
              <option value="job">trabajo</option>
              <option value="other">otro</option>
            </select>
            {errors.source && (
              <p className="mt-1 text-sm text-danger-500">{errors.source.message}</p>
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
              {...register('recurring')}
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Ingreso recurrente
            </label>
          </div>

          {isRecurring && (
            <div>
              <label className="label" htmlFor="recurringPeriod">
                Periodo Recurrente
              </label>
              <select
                className="select w-full"
                {...register('recurringPeriod')}
              >
                <option value="weekly">Semanal</option>
                <option value="biweekly">Quincenal</option>
                <option value="monthly">Mensual</option>
              </select>
              {errors.recurringPeriod && (
                <p className="mt-1 text-sm text-danger-500">
                  {errors.recurringPeriod.message}
                </p>
              )}
            </div>
          )}

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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Añadir Ingreso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncomeForm;