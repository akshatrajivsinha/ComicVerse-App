import { useState, useCallback } from 'react';

export interface ToastData {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastData>({
    message: '',
    type: 'error',
    visible: false,
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'error') => {
    setToast({ message, type, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toast, showToast, hideToast };
};
