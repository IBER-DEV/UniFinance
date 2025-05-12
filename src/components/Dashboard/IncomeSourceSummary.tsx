import React, { useState } from 'react';
import { useTransactionStore } from '../../store/transactionStore';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
// Si usas react-router-dom para navegación, impórtalo
// import { useNavigate } from 'react-router-dom';

// Definimos las props para hacerlo reutilizable
interface IncomeSourceSummaryProps {
  /** Whether to show the main title 'Income Sources Summary' */
  showTitle?: boolean;
  /** Max number of income sources to display (shows all if undefined) */
  limit?: number;
  /** Callback function when 'View All' button is clicked (only appears if limit is set) */
  onViewAll?: () => void;
  /** Optional custom title for the list section */
  listTitle?: string;
}

// Marcamos el componente con las nuevas props
const IncomeSourceSummary: React.FC<IncomeSourceSummaryProps> = ({
  showTitle = true, // Por defecto muestra el título
  limit, // Por defecto no hay límite
  onViewAll,
  listTitle = 'Lista', // Título por defecto para la lista
}) => {
  const { transactions } = useTransactionStore();
  const [expandedSources, setExpandedSources] = useState<
    Record<string, boolean>
  >({});
  // const navigate = useNavigate(); // Si usas react-router-dom

  const incomeSources = transactions.filter((t) => t.type === 'income');

  // Lógica para calcular el resumen (se mantiene igual)
  const getSourceSummary = (sourceId: string) => {
    const source = incomeSources.find((s) => s.id === sourceId);
    const expenses = transactions.filter(
      (t) => t.type === 'expense' && t.income_source_id === sourceId
    );
    const totalExpenses = expenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );
    const totalIncome = Number(source?.amount || 0);
    const remainingBalance = totalIncome - totalExpenses;

    return {
      description: source?.description || 'Unknown Source',
      totalIncome,
      totalExpenses,
      remainingBalance,
      expenses,
    };
  };

  // Función para alternar el estado de expansión (se mantiene igual)
  const toggleExpand = (sourceId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [sourceId]: !prev[sourceId],
    }));
  };

  // Aplicar límite si está definido
  const displayedIncomeSources = limit
    ? incomeSources.slice(0, limit)
    : incomeSources;

  // Determinar si hay más fuentes de las que se muestran
  const hasMoreSources = limit !== undefined && incomeSources.length > limit;

  return (
    <div className="card p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Título principal - se muestra solo si showTitle es true */}
      {showTitle && (
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          Resumen de Fuentes de Ingreso
        </h2>
      )}

      {/* Título de la lista - se muestra si hay elementos */}
      {incomeSources.length > 0 && (
        <h3
          className={`text-md font-semibold text-gray-700 dark:text-gray-300 ${
            showTitle ? 'mt-6 mb-4' : 'mb-4'
          }`}
        >
          {listTitle}
        </h3>
      )}

      <div className="space-y-6">
        {incomeSources.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            No hay fuentes de ingreso registradas.
          </p>
        )}
        {/* Usamos displayedIncomeSources para mapear */}
        {displayedIncomeSources.map((source) => {
          const summary = getSourceSummary(source.id);
          const usagePercentage =
            summary.totalIncome > 0
              ? (summary.totalExpenses / summary.totalIncome) * 100
              : 0;

          const isExpanded = !!expandedSources[source.id];

          return (
            <div
              key={source.id}
              className={`space-y-2 border-b border-gray-200 dark:border-gray-700 pb-4 last:pb-0 last:border-b-0 cursor-pointer transition-colors duration-150 ${
                isExpanded ? 'bg-gray-50 dark:bg-gray-700' : ''
              }`}
              onClick={() => toggleExpand(source.id)}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  {' '}
                  {/* Cambiado h3 a h4 */}
                  {summary.description}
                  <span className="ml-2 text-gray-500 dark:text-gray-400">
                    {isExpanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </span>
                </h4>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {usagePercentage.toFixed(1)}% usado
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Total</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${summary.totalIncome.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Gastado</p>
                  <p className="font-medium text-red-600 dark:text-red-400">
                    ${summary.totalExpenses.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Restante</p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    ${summary.remainingBalance.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    usagePercentage >= 90
                      ? 'bg-red-500'
                      : usagePercentage >= 75
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>

              {/* Área expandible para mostrar los gastos */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h5 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Gastos vinculados:
                  </h5>{' '}
                  {/* Cambiado h4 a h5 */}
                  {summary.expenses.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No hay gastos vinculados a esta fuente.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {summary.expenses.map((expense) => (
                        <li
                          key={expense.id}
                          className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400"
                        >
                          <span className="flex-1 mr-2">
                            <span className="font-medium">
                              {format(new Date(expense.date), 'MMM d, yyyy')}
                            </span>{' '}
                            - {expense.description} (
                            <span className="capitalize">
                              {expense.category}
                            </span>
                            )
                          </span>
                          <span className="font-medium text-red-600 dark:text-red-400 flex-shrink-0">
                            -${Number(expense.amount).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botón 'View All' - se muestra si hay más fuentes y se proporcionó la función onViewAll */}
      {hasMoreSources && onViewAll && (
        <div className="mt-6 text-center">
          <button
            onClick={onViewAll}
            className="btn btn-secondary-outline" // Puedes usar una clase de botón adecuada
          >
            Ver todas las fuentes
          </button>
        </div>
      )}
    </div>
  );
};

export default IncomeSourceSummary;
