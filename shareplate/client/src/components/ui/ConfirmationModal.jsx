// src/components/ui/ConfirmationModal.jsx
import React from "react";

export default function ConfirmationModal({ open, onClose, onConfirm, title = "Confirm Donation", children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white/90 backdrop-blur rounded-xl p-6 w-full max-w-lg shadow-lg z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-600">✕</button>
        </div>
        <div className="space-y-4">{children}</div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-blue-500 text-white">Confirm</button>
        </div>
      </div>
    </div>
  );
}
