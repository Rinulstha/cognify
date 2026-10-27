import React from 'react'
import {Link} from 'react-router-dom'
import {Play, Trash2 , BarChart2 , Award} from 'lucide-react'
import moment from 'moment'
const QuizCard = ({quiz , onDelete}) => {
  return (
<div className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
  {/* Delete Button */}
  <button
    onClick={(e) => {
      e.stopPropagation();
      onDelete(quiz);
    }}
    className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
  >
    <Trash2 className="h-5 w-5" strokeWidth={2} />
  </button>

  {/* Card Content */}
  <div className="flex flex-col gap-5">
    {/* Score Badge */}
    <div className="flex items-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
        <Award className="h-4 w-4" strokeWidth={2.5} />
        <span>Score: {quiz?.score ?? 0}%</span>
      </div>
    </div>

    {/* Title */}
    <div>
      <h3
        title={quiz.title}
        className="truncate text-lg font-semibold text-slate-900"
      >
        {quiz.title || `Quiz - ${moment(quiz.createdAt).format("DD-MM-YYYY")}`}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Created {moment(quiz.createdAt).format("DD-MM-YYYY")}
      </p>
    </div>

    {/* Questions Count */}
    <div>
      <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
        {quiz.questions.length}{" "}
        {quiz.questions.length === 1 ? "Question" : "Questions"}
      </span>
    </div>

    {/* Action Button */}
    <div className="pt-2">
      {quiz?.userAnswers?.length > 0 ? (
        <Link to={`/quizzes/${quiz._id}/results`}>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700">
            <BarChart2 className="h-5 w-5" strokeWidth={2.5} />
            View Results
          </button>
        </Link>
      ) : (
        <Link to={`/quizzes/${quiz._id}`}>
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-700">
            <Play className="h-5 w-5" strokeWidth={2.5} />
            Start Quiz
          </button>
        </Link>
      )}
    </div>
  </div>
</div>
  )
}

export default QuizCard
