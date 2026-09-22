/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Component hiển thị thông báo phản hồi (Toast notifications)
 */

import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      id="toast-container" 
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-sm transition-all animate-in slide-in-from-bottom-3 duration-200 ${
              isSuccess
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-100'
                : isError
                ? 'bg-rose-50/95 border-rose-200 text-rose-900 dark:bg-rose-950/90 dark:border-rose-800 dark:text-rose-100'
                : isWarning
                ? 'bg-amber-50/95 border-amber-200 text-amber-900 dark:bg-amber-950/90 dark:border-amber-800 dark:text-amber-100'
                : 'bg-blue-50/95 border-blue-200 text-blue-900 dark:bg-blue-950/90 dark:border-blue-800 dark:text-blue-100'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            </div>

            <p className="text-sm font-medium leading-relaxed flex-1">{toast.message}</p>

            <button
              id={`toast-close-${toast.id}`}
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4 opacity-60 hover:opacity-100" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
