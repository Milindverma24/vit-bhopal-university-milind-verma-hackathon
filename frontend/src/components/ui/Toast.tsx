import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          let icon = <Info className="w-4 h-4 text-black shrink-0" />;
          if (t.type === 'success') {
            icon = <CheckCircle2 className="w-4 h-4 text-black shrink-0" />;
          } else if (t.type === 'error') {
            icon = <AlertTriangle className="w-4 h-4 text-black shrink-0" />;
          }

          return (
            <div
              key={t.id}
              className="pointer-events-auto bg-white border border-[#d9d9d9] shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl p-4 flex items-center justify-between gap-3 text-sm text-black transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div className="flex items-center gap-2.5">
                {icon}
                <span className="font-medium text-xs leading-relaxed">{t.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-[#767676] hover:text-black p-1 rounded-full transition-colors"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: (msg: string) => console.log('Toast:', msg)
    };
  }
  return ctx;
};
