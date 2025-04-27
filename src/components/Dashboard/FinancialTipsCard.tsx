import React from 'react';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockFinancialTips } from '../../data/mockData';
import { useState } from 'react';

const FinancialTipsCard: React.FC = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  
  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % mockFinancialTips.length);
  };
  
  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + mockFinancialTips.length) % mockFinancialTips.length);
  };
  
  const currentTip = mockFinancialTips[currentTipIndex];
  
  return (
    <div className="card h-full">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Financial Tips
      </h3>
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-center rounded-t-lg bg-primary-50 p-4 dark:bg-gray-700">
          <Lightbulb className="mr-2 h-5 w-5 text-warning-500" />
          <h4 className="text-sm font-semibold">{currentTip.title}</h4>
        </div>
        <div className="flex-1 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">{currentTip.content}</p>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-gray-700">
          <span className={`badge ${
            currentTip.difficulty === 'beginner'
              ? 'badge-secondary'
              : currentTip.difficulty === 'intermediate'
              ? 'badge-primary'
              : 'badge-danger'
          }`}>
            {currentTip.difficulty}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={prevTip}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextTip}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialTipsCard;