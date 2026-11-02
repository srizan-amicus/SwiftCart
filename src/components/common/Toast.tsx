"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
  variant?: "success" | "error";
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Toast({
  message,
  onClose,
  variant = "success",
}: ToastProps) {
  const onCloseRef = useRef(onClose);

  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      onCloseRef.current();
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [message]);

  if (!mounted || !message) return null;

  const isSuccess = variant === "success";

  return createPortal(
    <div
      role={isSuccess ? "status" : "alert"}
      className={`fixed right-5 top-5 z-[9999] flex max-w-sm items-center gap-3 rounded-lg px-4 py-3 text-white shadow-xl ${
        isSuccess ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {isSuccess && <CheckCircle2 size={20} className="shrink-0" />}

      <span className="text-sm font-medium">{message}</span>

      <button
        type="button"
        onClick={() => onCloseRef.current()}
        aria-label="Close notification"
        className={`ml-2 shrink-0 rounded p-1 transition ${
          isSuccess ? "hover:bg-green-700" : "hover:bg-red-700"
        }`}
      >
        <X size={18} />
      </button>
    </div>,
    document.body,
  );
}
