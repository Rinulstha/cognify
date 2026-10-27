import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp } from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({flashcardSet}) => {
      const navigate = useNavigate();

const handleStudyNow = () => {
  navigate(`/documents/${flashcardSet.documentId._id}/flashcards`);
};

const reviewedCount = flashcardSet.cards.filter(card => card.lastReviewed).length;
const totalCards = flashcardSet.cards.length;
const progressPercentage = totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0;
  return (
<div
  onClick={handleStudyNow}
  className="group flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl"
>
  {/* Top Content */}
  <div className="flex-1 space-y-6">
    {/* Header */}
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
          <BookOpen
            className="h-7 w-7 text-emerald-600"
            strokeWidth={2}
          />
        </div>

        <div className="min-w-0">
          <h3
            title={flashcardSet?.documentId?.title}
            className="truncate text-lg font-semibold text-slate-900"
          >
            {flashcardSet?.documentId?.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Created {moment(flashcardSet.createdAt).fromNow()}
          </p>
        </div>
      </div>

      <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
        {totalCards} {totalCards === 1 ? "Card" : "Cards"}
      </span>
    </div>

    {/* Progress */}
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">
          Progress
        </span>

        <span className="text-slate-500">
          {reviewedCount}/{totalCards}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {progressPercentage}% Complete
        </span>

        <TrendingUp
          className="h-5 w-5 text-emerald-600"
          strokeWidth={2}
        />
      </div>
    </div>
  </div>

  {/* Bottom Button */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleStudyNow();
    }}
    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
  >
    <Sparkles className="h-5 w-5" strokeWidth={2} />
    Study Now
  </button>
</div>
  )
}

export default FlashcardSetCard
