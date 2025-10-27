import { Status } from '../types';

interface StatusIconProps {
  status: Status;
  className?: string;
}

export function StatusIcon({ status, className = "" }: StatusIconProps) {
  const icons = {
    draft: '●',
    hidden: '◎', 
    published: '✔'
  };

  const colors = {
    draft: 'text-yellow-600',
    hidden: 'text-muted-foreground',
    published: 'text-green-600'
  };

  return (
    <span className={`${colors[status]} ${className}`} title={status}>
      {icons[status]}
    </span>
  );
}