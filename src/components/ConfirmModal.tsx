/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Hộp thoại xác nhận thao tác (Xóa, Đặt lại dữ liệu)
 */

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Đồng ý',
  cancelText = 'Hủy bỏ',
  isDanger = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="confirm-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <div
        id="confirm-modal-content"
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isDanger ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          </div>
          <button
            id="confirm-modal-close"
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            id="confirm-modal-cancel"
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            {cancelText}
          </button>
          <button
            id="confirm-modal-action"
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl font-semibold text-white transition-all shadow-sm text-sm ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 active:scale-95'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
