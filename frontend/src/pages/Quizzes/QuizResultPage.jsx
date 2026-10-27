import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import quizService from '../../services/quizService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import {X,Check, ArrowLeft, CheckCircle2, XCircle, Trophy, Target, BookOpen } from 'lucide-react';

function QuizResultPage() {
  const { quizId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error('Failed to fetch quiz results.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

if (loading) {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Spinner />
    </div>
  );
}

if (!results || !results.data) {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 shadow-sm">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
          <BarChart2
            className="h-8 w-8 text-red-500"
            strokeWidth={2}
          />
        </div>

        <h2 className="text-xl font-semibold text-slate-900">
          No Quiz Results
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
          We couldn't find the results for this quiz. It may have been deleted
          or hasn't been completed yet.
        </p>
      </div>
    </div>
  );
}

  const { data: { quiz, results: detailedResults } } = results;
const score = quiz.score;
const totalQuestions = detailedResults.length;
const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
const incorrectAnswers = totalQuestions - correctAnswers;

const getScoreColor = (score) => {
  if (score >= 80) return 'from-emerald-500 to-teal-500';
  if (score >= 60) return 'from-amber-500 to-orange-500';
  return 'from-rose-500 to-red-500';
};

const getScoreMessage = (score) => {
  if (score >= 90) return 'Outstanding! ';
  if (score >= 80) return 'Great job! ';
  if (score >= 70) return 'Good work! ';
  if (score >= 60) return 'Not bad! ';
  return 'Keep practicing! ';
};

  return (
<div className="space-y-8">
  {/* Back Button */}
  <div>
    <Link
      to={`/documents/${quiz.documentId}`}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      <ArrowLeft className="h-5 w-5" strokeWidth={2} />
      <span>Back to Document</span>
    </Link>
  </div>

  {/* Header */}
  <PageHeader title={`${quiz.title || "Quiz"} Results`} />

  {/* Score Card */}
  <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
    <div className="flex flex-col items-center text-center">
      {/* Trophy */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-yellow-200">
        <Trophy
          className="h-10 w-10 text-amber-500"
          strokeWidth={2}
        />
      </div>

      {/* Label */}
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
        Your Score
      </p>

      {/* Percentage */}
      <h2
        className={`mt-3 bg-linear-to-r ${getScoreColor(
          score
        )} bg-clip-text text-5xl font-bold text-transparent sm:text-6xl`}
      >
        {score}%
      </h2>

      {/* Message */}
      <p className="mt-4 max-w-md text-base text-slate-600">
        {getScoreMessage(score)}
      </p>
    </div>
    

    {/* stats */}
<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
  {/* Total */}
  <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
      <Target
        className="h-7 w-7 text-indigo-600"
        strokeWidth={2}
      />
    </div>

    <div className="text-center sm:text-left">
      <p className="text-sm font-medium text-slate-500">
        Total Questions
      </p>
      <p className="mt-1 text-3xl font-bold text-slate-900">
        {totalQuestions}
      </p>
    </div>
  </div>

  {/* Correct */}
  <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
      <CheckCircle2
        className="h-7 w-7 text-emerald-600"
        strokeWidth={2}
      />
    </div>

    <div className="text-center sm:text-left">
      <p className="text-sm font-medium text-slate-500">
        Correct Answers
      </p>
      <p className="mt-1 text-3xl font-bold text-emerald-600">
        {correctAnswers}
      </p>
    </div>
  </div>

  {/* Incorrect */}
  <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-100">
      <XCircle
        className="h-7 w-7 text-red-600"
        strokeWidth={2}
      />
    </div>

    <div className="text-center sm:text-left">
      <p className="text-sm font-medium text-slate-500">
        Incorrect Answers
      </p>
      <p className="mt-1 text-3xl font-bold text-red-600">
        {incorrectAnswers}
      </p>
    </div>
  </div>
</div>

  </div>

  {/* review */}
<div className="space-y-6">
  {/* Header */}
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
      <BookOpen
        className="h-5 w-5 text-indigo-600"
        strokeWidth={2}
      />
    </div>

    <h3 className="text-2xl font-bold text-slate-900">
      Review
    </h3>
  </div>

  {detailedResults.map((result, index) => {
    const userAnswerIndex = result.options.findIndex(
      (opt) => opt === result.selectedAnswer
    );

    const correctAnswerIndex = result.correctAnswer.startsWith("0")
      ? parseInt(result.correctAnswer.substring(1)) - 1
      : result.options.findIndex(
          (opt) => opt === result.correctAnswer
        );

    const isCorrect = result.isCorrect;

    return (
      <div
        key={index}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {/* Question */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              Question {index + 1}
            </span>

            <h4 className="mt-3 text-lg font-semibold text-slate-900">
              {result.question}
            </h4>
          </div>

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              isCorrect
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isCorrect ? (
              <Check className="h-6 w-6" strokeWidth={2} />
            ) : (
              <X className="h-6 w-6" strokeWidth={2} />
            )}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {result.options.map((option, optIndex) => {
            const isCorrectOption =
              optIndex === correctAnswerIndex;

            const isUserAnswer =
              optIndex === userAnswerIndex;

            const isWrongAnswer =
              isUserAnswer && !isCorrect;

            return (
              <div
                key={optIndex}
                className={`flex items-center justify-between rounded-xl border p-4 transition-colors
                  ${
                    isCorrectOption
                      ? "border-emerald-200 bg-emerald-50"
                      : isWrongAnswer
                      ? "border-red-200 bg-red-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
              >
                <span
                  className={`font-medium
                    ${
                      isCorrectOption
                        ? "text-emerald-700"
                        : isWrongAnswer
                        ? "text-red-700"
                        : "text-slate-700"
                    }`}
                >
                  {option}
                </span>

                <div className="flex items-center gap-2">
                  {isCorrectOption && (
                    <>
                      <CheckCircle2
                        className="h-5 w-5 text-emerald-600"
                        strokeWidth={2}
                      />
                      <span className="text-sm font-medium text-emerald-600">
                        Correct
                      </span>
                    </>
                  )}

                  {isWrongAnswer && (
                    <>
                      <XCircle
                        className="h-5 w-5 text-red-600"
                        strokeWidth={2}
                      />
                      <span className="text-sm font-medium text-red-600">
                        Your Answer
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {result.explanation && (
          <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                <BookOpen
                  className="h-5 w-5 text-indigo-600"
                  strokeWidth={2}
                />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Explanation
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {result.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  })}
</div>

{/*action button*/}
<div className="mt-8 flex justify-center sm:justify-start">
  <Link to={`/documents/${quiz.document._id}`}>
    <button
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md"
    >
      <ArrowLeft
        className="h-5 w-5"
        strokeWidth={2.5}
      />

      <span>Return to Document</span>
    </button>
  </Link>
</div>
</div>
  );
}

export default QuizResultPage;
