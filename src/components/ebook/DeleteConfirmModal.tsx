import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { Ebook } from '../../types/ebook';

interface DeleteConfirmModalProps {
  ebook: Ebook;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({ ebook, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Delete Ebook</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete "{ebook.title}"? This action cannot be undone.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="flex-shrink-0 text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Delete Ebook
          </button>
        </div>
      </div>
    </div>
  );
}