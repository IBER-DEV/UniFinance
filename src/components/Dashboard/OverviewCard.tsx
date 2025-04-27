import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  prefix?: string;
  suffix?: string;
  className?: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  value,
  icon,
  change,
  trend,
  prefix = '$',
  suffix = '',
  className = '',
}) => {
  const formatValue = () => {
    if (typeof value === 'number') {
      return `${prefix}${value.toLocaleString()}${suffix}`;
    }
    return value;
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-700">
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-semibold">{formatValue()}</p>
        {trend && change !== undefined && (
          <div className="mt-2 flex items-center">
            {trend === 'up' ? (
              <TrendingUp className="mr-1 h-4 w-4 text-secondary-500" />
            ) : trend === 'down' ? (
              <TrendingDown className="mr-1 h-4 w-4 text-danger-500" />
            ) : (
              <ArrowRight className="mr-1 h-4 w-4 text-gray-500" />
            )}
            <span
              className={`text-sm ${
                trend === 'up'
                  ? 'text-secondary-500'
                  : trend === 'down'
                  ? 'text-danger-500'
                  : 'text-gray-500'
              }`}
            >
              {change > 0 && '+'}
              {change}%{' '}
              <span className="text-gray-500 dark:text-gray-400">vs last month</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewCard;