import React from "react";
import { X } from "lucide-react";

function Modal({ isOpen, onClose, title, children }) {
  // Don't render the modal when it is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">

        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Card */}
        <div className="relative z-10 w-full max-w-2xl bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
            <h3 className="text-lg font-semibold text-slate-900">
              {title}
            </h3>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 text-sm text-slate-700 leading-relaxed">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Modal;