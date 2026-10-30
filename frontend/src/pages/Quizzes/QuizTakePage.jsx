import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import quizService from '../../services/quizService';
import PageHeader from '../../components/common/pageHeader';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

function QuizTakePage() {
  const { quizId } = useParams();
const navigate = useNavigate();
const [quiz, setQuiz] = useState(null);
const [loading, setLoading] = useState(true);
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [selectedAnswers, setSelectedAnswers] = useState({});
const [submitting, setSubmitting] = useState(false);

useEffect(() => {
  const fetchQuiz = async () => {
    try {
      const response = await quizService.getQuizById(quizId);
      setQuiz(response.data);
    } catch (error) {
      toast.error('Failed to fetch quiz.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchQuiz();
}, [quizId]);

const handleOptionChange = (questionId, optionIndex) => {
  setSelectedAnswers((prev) => ({
    ...prev,
    [questionId]: optionIndex,
  }));
};

const handleNextQuestion = () => {
  if (currentQuestionIndex < quiz.questions.length - 1) {
    setCurrentQuestionIndex((prev) => prev + 1);
  }
};

const handlePreviousQuestion = () => {
  if (currentQuestionIndex > 0) {
    setCurrentQuestionIndex((prev) => prev - 1);
  }
};

const handleSubmitQuiz = async () => {
setSubmitting(true);
try {
  const formattedAnswers = Object.keys(selectedAnswers).map(questionId => {
    const question = quiz.questions.find(q => q._id === questionId);
    const questionIndex = quiz.questions.findIndex(q => q._id === questionId);
    const optionIndex = selectedAnswers[questionId];
    const selectedAnswer = question.options[optionIndex];
    return { questionIndex, selectedAnswer };
  });

  await quizService.submitQuiz(quizId, formattedAnswers);
  toast.success('Quiz submitted successfully!');
  navigate(`/quizzes/${quizId}/results`);
} catch (error) {
  toast.error(error.message || 'Failed to submit quiz.');
} finally {
  setSubmitting(false);
}
};

if (loading) {
  return (
    <div className="flex min-h-100 items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <Spinner />
    </div>
  );
}

if (!quiz || quiz.questions.length === 0) {
  return (
    <div className="flex min-h-100 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-500" strokeWidth={2} />
        </div>

        <h2 className="text-xl font-semibold text-slate-900">
          Quiz Not Found
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
          This quiz doesn't exist or it doesn't contain any questions yet.
        </p>
      </div>
    </div>
  );
}

const currentQuestion = quiz.questions[currentQuestionIndex];
const isAnswered = selectedAnswers.hasOwnProperty(currentQuestion._id);
const answeredCount = Object.keys(selectedAnswers).length;

  return (
 <div className="space-y-8">
  <PageHeader title={quiz.title || "Take Quiz"} />

  {/* Progress Section */}
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium text-slate-600">
        Question <span className="font-semibold">{currentQuestionIndex + 1}</span> of{" "}
        <span className="font-semibold">{quiz.questions.length}</span>
      </span>

      <span className="text-sm font-medium text-emerald-600">
        {answeredCount} answered
      </span>
    </div>

    {/* Progress Bar */}
    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-emerald-600 transition-all duration-300"
        style={{
          width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
        }}
      />
    </div>
  </div>

  {/* Question Card */}
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-4">
      <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
        Question {currentQuestionIndex + 1}
      </span>
    </div>

    <h3 className="text-xl font-semibold leading-relaxed text-slate-900 sm:text-2xl">
      {currentQuestion.question}
    </h3>

{/* options*/}
<div className="mt-6 space-y-4">
  {currentQuestion.options.map((option, index) => {
    const isSelected = selectedAnswers[currentQuestion._id] === index;

    return (
      <label
        key={index}
        className={`group flex cursor-pointer items-center rounded-2xl border-2 p-4 transition-all duration-200
          ${
            isSelected
              ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
          }`}
      >
        {/* Hidden Radio */}
        <input
          type="radio"
          name={`question-${currentQuestion._id}`}
          value={index}
          checked={isSelected}
          onChange={() =>
            handleOptionChange(currentQuestion._id, index)
          }
          className="sr-only"
        />

        {/* Custom Radio */}
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200
            ${
              isSelected
                ? "border-emerald-500 bg-emerald-500"
                : "border-slate-300 bg-white group-hover:border-emerald-400"
            }`}
        >
          {isSelected && (
            <div className="h-2 w-2 rounded-full bg-white" />
          )}
        </div>

        {/* Option Text */}
        <span
          className={`ml-4 flex-1 text-sm font-medium sm:text-base
            ${
              isSelected
                ? "text-emerald-900"
                : "text-slate-800"
            }`}
        >
          {option}
        </span>

        {/* Selected Icon */}
        {isSelected && (
          <CheckCircle2
            className="ml-4 h-6 w-6 shrink-0 text-emerald-600"
            strokeWidth={2.5}
          />
        )}
      </label>
    );
  })}
</div>

  </div>

{/* Navigation Buttons */}
<div className="mt-6 flex justify-between">
  <button
    onClick={handlePreviousQuestion}
    disabled={currentQuestionIndex === 0 || submitting}
    className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <ChevronLeft className="h-5 w-5" />
    Previous
  </button>

  {currentQuestionIndex === quiz.questions.length - 1 ? (
    <button
      onClick={handleSubmitQuiz}
      disabled={submitting}
      className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span>
        {submitting ? "Submitting..." : "Submit Quiz"}
        </span>
    </button>
  ) : (
    <button
      onClick={handleNextQuestion}
      disabled={submitting}
      className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Next Question
      <ChevronRight className="h-5 w-5" />
    </button>
  )}
</div>

{/* nav dots */}
{/* Question Navigation */}
<div className="mt-8 flex flex-wrap justify-center gap-3">
  {quiz.questions.map((question, index) => {
    const isAnswered = selectedAnswers.hasOwnProperty(question._id);
    const isCurrent = index === currentQuestionIndex;

    return (
      <button
        key={question._id}
        onClick={() => setCurrentQuestionIndex(index)}
        disabled={submitting}
        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-200
          ${
            isCurrent
              ? "bg-emerald-600 text-white shadow-md"
              : isAnswered
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }
          disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {index + 1}
      </button>
    );
  })}
</div>
</div>
  )
}

export default QuizTakePage
