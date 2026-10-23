"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 2500);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      className="fixed right-4 top-20 z-50 flex items-center gap-3 rounded-lg bg-green-600 px-4 py-3 text-white shadow-lg"
    >
      <CheckCircle2 size={20} />
      <span className="text-sm font-medium">{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="ml-2 rounded p-1 hover:bg-green-700"
      >
        <X size={16} />
      </button>
    </div>
  );
}