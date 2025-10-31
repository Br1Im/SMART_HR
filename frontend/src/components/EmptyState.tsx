import { Button } from './ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-gray-300 dark:border-gray-500">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
      </div>
      <h3 className="mb-2 text-lg font-semibold empty-state-title">
        {title}
      </h3>
      <p className="mb-6 max-w-sm empty-state-description">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}