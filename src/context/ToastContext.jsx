import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info')
  };

  const getToastStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-450 dark:bg-emerald-950/30',
          icon: CheckCircle,
          color: 'text-emerald-500'
        };
      case 'error':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-405 dark:bg-rose-950/30',
          icon: AlertCircle,
          color: 'text-rose-500'
        };
      default:
        return {
          bg: 'bg-sky-500/10 border-sky-500/30 text-sky-400 dark:bg-sky-950/30',
          icon: Info,
          color: 'text-sky-500'
        };
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const { bg, icon: Icon, color } = getToastStyle(t.type);
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-start gap-3 pointer-events-auto ${bg}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                <span className="text-xs font-semibold flex-1 leading-normal text-left">{t.message}</span>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-slate-400 hover:text-white shrink-0 p-0.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
