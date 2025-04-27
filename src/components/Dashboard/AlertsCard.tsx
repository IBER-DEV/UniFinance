import React from 'react';
import { Bell, CreditCard, PiggyBank } from 'lucide-react';
import { mockAlerts } from '../../data/mockData';

const AlertsCard: React.FC = () => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'budget':
        return <Bell className="h-5 w-5 text-warning-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-danger-500" />;
      case 'savings':
        return <PiggyBank className="h-5 w-5 text-secondary-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="card h-full">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Alerts & Reminders
      </h3>
      {mockAlerts.length > 0 ? (
        <div className="space-y-3">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`relative rounded-lg border p-3 ${
                alert.read
                  ? 'border-gray-200 dark:border-gray-700'
                  : 'border-l-4 border-l-primary-500 border-r border-r-gray-200 border-t border-t-gray-200 border-b border-b-gray-200 bg-primary-50 dark:border-r-gray-700 dark:border-t-gray-700 dark:border-b-gray-700 dark:bg-gray-800'
              }`}
            >
              <div className="flex">
                <div className="mr-3 flex-shrink-0">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(alert.date)}
                  </p>
                </div>
              </div>
              {!alert.read && (
                <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary-500"></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
          <Bell className="mx-auto mb-2 h-8 w-8 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">No alerts at the moment</p>
        </div>
      )}
    </div>
  );
};

export default AlertsCard;