import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

type FeedbackType = 'success' | 'error' | 'info' | 'warning';

interface FeedbackToastProps {
  title: string;
  description?: string;
  type?: FeedbackType;
  duration?: number;
}

const getIcon = (type: 'success' | 'error' | 'info' | 'warning') => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
  };
  return icons[type];
};

// Styles for different toast types
const getToastStyles = (type: 'success' | 'error' | 'info' | 'warning') => {
  const styles = {
    success: 'border-l-4 border-green-500 bg-green-50',
    error: 'border-l-4 border-red-500 bg-red-50',
    info: 'border-l-4 border-blue-500 bg-blue-50',
    warning: 'border-l-4 border-amber-500 bg-amber-50',
  };
  return styles[type];
};

export function showFeedback({
  title,
  description = '',
  type = 'info',
  duration = 5000,
}: FeedbackToastProps) {
  switch (type) {
    case 'success':
      toast.success(title, {
        description,
        duration,
      });
      break;
    case 'error':
      toast.error(title, {
        description,
        duration,
      });
      break;
    case 'warning':
      toast.warning(title, {
        description,
        duration,
      });
      break;
    case 'info':
    default:
      toast.info(title, {
        description,
        duration,
      });
      break;
  }
}

// Funções de conveniência
export const showSuccess = (title: string, description?: string) =>
  showFeedback({ title, description, type: 'success' });

export const showError = (title: string, description?: string) =>
  showFeedback({ title, description, type: 'error' });

export const showInfo = (title: string, description?: string) =>
  showFeedback({ title, description, type: 'info' });

export const showWarning = (title: string, description?: string) =>
  showFeedback({ title, description, type: 'warning' });
