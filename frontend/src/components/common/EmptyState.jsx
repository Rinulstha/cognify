import React from 'react'
import { Plus, FileText } from 'lucide-react'
const EmptyState = ({title, description, buttonText, onActionClick}) => {
  return (
<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
  {/* Icon */}
  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100">
    <FileText
      className="h-8 w-8 text-emerald-600"
      strokeWidth={2}
    />
  </div>

  {/* Title */}
  <h3 className="text-xl font-semibold text-slate-900 sm:text-2xl">
    {title}
  </h3>

  {/* Description */}
  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
    {description}
  </p>

  {/* Action Button */}
  {buttonText && onActionClick && (
    <button
      onClick={onActionClick}
      className="group mt-8 inline-flex items-center justify-center overflow-hidden rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg"
    >
      <span className="flex items-center gap-2">
        <Plus
          className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90"
          strokeWidth={2.5}
        />
        {buttonText}
      </span>
    </button>
  )}
</div>
  )
}

export default EmptyState
