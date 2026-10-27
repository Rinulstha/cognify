import React from 'react'
import { useState } from 'react'
import {Star, RotateCcw} from "lucide-react";

const Flashcard = ({flashcard , onToggleStar}) => {
    const [isFlipped, setisFlipped] = useState(false)

    const handleFlip = () => {
        setisFlipped(!isFlipped)
    }
  return <div
  className="w-full max-w-3xl mx-auto"
  style={{ perspective: "1000px" }}
>
  <div
    onClick={handleFlip}
    className="relative min-h-[420px] cursor-pointer transition-transform duration-500 transform-gpu"
    style={{
      transformStyle: "preserve-3d",
      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
    }}
  >
    {/* Front */}
    <div
      className="absolute inset-0 flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {flashcard?.difficulty}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(flashcard._id);
          }}
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200
            ${
              flashcard.isStarred
                ? "bg-yellow-100 text-yellow-500"
                : "text-slate-500 hover:bg-slate-100 hover:text-yellow-500"
            }`}
        >
          <Star
            size={18}
            strokeWidth={2}
            fill={flashcard.isStarred ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Question */}
      <div className="flex flex-1 items-center justify-center">
        <p className="text-center text-xl font-semibold leading-relaxed text-slate-800 sm:text-2xl">
          {flashcard.question}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
        <RotateCcw className="h-4 w-4" strokeWidth={2} />
        <span>Click to reveal answer</span>
      </div>
    </div>

 {/* Back */}
<div
  className="absolute inset-0 flex flex-col rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-lg"
  style={{
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transform: "rotateY(180deg)",
  }}
>
  {/* Header */}
  <div className="mb-8 flex items-center justify-between">
    <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
      Answer
    </span>

    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggleStar(flashcard._id);
      }}
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200
        ${
          flashcard.isStarred
            ? "bg-yellow-100 text-yellow-500"
            : "text-slate-500 hover:bg-white hover:text-yellow-500"
        }`}
    >
      <Star
        size={18}
        strokeWidth={2}
        fill={flashcard.isStarred ? "currentColor" : "none"}
      />
    </button>
  </div>

  {/* Answer */}
  <div className="flex flex-1 items-center justify-center">
    <p className="text-center text-lg leading-relaxed text-slate-700 sm:text-xl">
      {flashcard.answer}
    </p>
  </div>

  {/* Footer */}
  <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
    <RotateCcw className="h-4 w-4" strokeWidth={2} />
    <span>Click to see question</span>
  </div>
</div>
  </div>
  
</div>
}

export default Flashcard
