import React from 'react';
import { CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { SaveStatus } from '../hooks/useAutoSave';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  lastSaved?: Date | null;
  errorMessage?: string | null;
  className?: string;
  onRetry?: () => void;
}

export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({
  status,
  lastSaved,
  errorMessage,
  className = '',
  onRetry
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Clock className="w-4 h-4 animate-spin" />,
          text: 'Сохраняю...',
          className: 'text-blue-600'
        };
      case 'saved':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Сохранено',
          className: 'text-green-600'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Ошибка сохранения',
          className: 'text-red-600'
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  
  if (!config) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={`flex flex-col gap-1 text-sm ${className}`}>
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 ${config.className}`}>
          {config.icon}
          <span>{config.text}</span>
        </div>
        
        {lastSaved && status === 'saved' && (
          <span className="text-gray-500 text-xs">
            в {formatTime(lastSaved)}
          </span>
        )}
        
        {status === 'error' && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            title="Повторить сохранение"
          >
            <RefreshCw className="w-3 h-3" />
            Повторить
          </button>
        )}
      </div>
      
      {status === 'error' && errorMessage && (
        <div className="text-xs text-red-500 max-w-xs">
          {errorMessage}
        </div>
      )}
    </div>
  );
};