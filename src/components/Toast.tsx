import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg border text-sm max-w-md ${
        toast.type === 'success' 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
          : toast.type === 'error'
          ? 'bg-rose-50 border-rose-200 text-rose-900'
          : 'bg-blue-50 border-blue-200 text-blue-900'
      }`}>
        {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />}
        {toast.type === 'info' && <Info className="h-5 w-5 text-blue-600 shrink-0" />}
        <span className="font-medium">{toast.text}</span>
        <button 
          onClick={onClose}
          className="ml-auto p-1 hover:bg-black/5 rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
