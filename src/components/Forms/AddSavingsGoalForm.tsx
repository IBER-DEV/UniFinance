import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const savingsGoalSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  target_amount: z.number().min(1, 'Target amount must be greater than 0'),
  current_amount: z.number().min(0, 'Current amount must be at least 0'),
  target_date: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Target date must be in the future',
  }),
  description: z.string().min(3, 'Description must be at least 3 characters'),
});

export type SavingsGoalFormData = z.infer<typeof savingsGoalSchema>;

interface AddSavingsGoalFormProps {
  onClose: () => void;
  onSubmit: (data: SavingsGoalFormData) => void;
}

const AddSavingsGoalForm: React.FC<AddSavingsGoalFormProps> = ({ onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SavingsGoalFormData>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      current_amount: 0,
      target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

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
          Add New Savings Goal
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">
              Goal Name
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
              Target Amount
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
              Current Amount
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
            <label className="label" htmlFor="target_date">
              Target Date
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
              Description
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
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSavingsGoalForm;