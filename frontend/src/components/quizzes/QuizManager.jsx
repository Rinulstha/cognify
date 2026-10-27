
import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import quizService from '../../services/quizService';
import aiService from '../../services/aiService';
import Spinner from '../common/Spinner';
import Button from '../common/Button';
import Modal from '../common/Modal';
import QuizCard from './QuizCard';
import EmptyState from '../common/EmptyState';


const QuizManager = ({documentId}) => {

const [quizzes, setQuizzes] = useState([]);
const [loading, setLoading] = useState(true);
const [generating, setGenerating] = useState(false);
const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
const [numQuestions, setNumQuestions] = useState(5);

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [deleting, setDeleting] = useState(false);
const [selectedQuiz, setSelectedQuiz] = useState(null);


const fetchQuizzes = async () => {
  setLoading(true);
  try {
    const data = await quizService.getQuizzesForDocument(documentId);
    setQuizzes(data.data);
  } catch (error) {
    toast.error('Failed to fetch quizzes.');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
    if (documentId) {
      fetchQuizzes();
    }
}, [documentId]);

const handleGenerateQuiz = async (e) => {
  e.preventDefault();
  setGenerating(true);
  try {
    await aiService.generateQuiz(documentId, { numQuestions });
    toast.success('Quiz generated successfully!');
    setIsGenerateModalOpen(false);
    fetchQuizzes();
  } catch (error) {
    toast.error(error.message || 'Failed to generate quiz.');
  } finally {
    setGenerating(false);
  }
};

const handleDeleteRequest = (quiz) => {
  setSelectedQuiz(quiz);
  setIsDeleteModalOpen(true);
};

const handleConfirmDelete = async () => {
  if (!selectedQuiz) return;
setDeleting(true);
try {
  await quizService.deleteQuiz(selectedQuiz._id);
  toast.success(`'${selectedQuiz.title || 'Quiz'}' deleted.`);
  setIsDeleteModalOpen(false);
  setSelectedQuiz(null);
  setQuizzes(quizzes.filter(q => q._id !== selectedQuiz._id));
} catch (error) {
  toast.error(error.message || 'Failed to delete quiz.');
} finally {
  setDeleting(false);
}
};

const renderQuizContent = () => {
  if (loading) {
    return <Spinner />;
  }

  if (quizzes.length === 0) {
    return (
      <EmptyState
        title="No quizzes found for this document."
        description="Generate a quiz to get started."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz._id}
          quiz={quiz}
          onDelete={handleDeleteRequest}
        />
      ))}
    </div>
  );
};

  return (
    <div className='bg-white border border-neutral-200 rounded-lg p-6'>
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={()=> {console.log("clicked"); setIsGenerateModalOpen(true)}}>Generate <Plus className="h-4 w-4" strokeWidth={2} /></Button>
        </div>
        {renderQuizContent()}

<Modal
  isOpen={isGenerateModalOpen}
  onClose={() => setIsGenerateModalOpen(false)}
  title="Generate Quiz"
>
  <form onSubmit={handleGenerateQuiz} className="space-y-6">
    {/* Input */}
    <div>
      <label
        htmlFor="numQuestions"
        className="block text-sm font-medium text-slate-700"
      >
        Number of Questions
      </label>

      <input
        type="number"
        id="numQuestions"
        value={numQuestions}
        onChange={(e) =>
          setNumQuestions(Math.max(1, parseInt(e.target.value || 1)))
        }
        min="1"
        required
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
      />

      <p className="mt-2 text-sm text-slate-500">
        Choose how many questions you'd like the AI to generate.
      </p>
    </div>

    {/* Buttons */}
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <Button
        type="button"
        variant="secondary"
        onClick={() => setIsGenerateModalOpen(false)}
        disabled={generating}
        className="w-full sm:w-auto"
      >
        Cancel
      </Button>

      <Button
        type="submit"
        disabled={generating}
        className="w-full sm:w-auto"
      >
        {generating ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner className="h-5 w-5" />
            Generating...
          </span>
        ) : (
          "Generate Quiz"
        )}
      </Button>
    </div>
  </form>
</Modal>  


{/* Delete confirmation Modal */}
<Modal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  title="Delete Quiz"
>
  <div className="space-y-6">
    <p className="text-sm sm:text-base leading-relaxed text-slate-600">
      Are you sure you want to delete{" "}
      <span className="font-semibold text-slate-900">
        {selectedQuiz?.title || "this quiz"}
      </span>
      ?
      <br />
      <span className="mt-1 inline-block text-red-500">
        This action cannot be undone.
      </span>
    </p>

    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={() => setIsDeleteModalOpen(false)}
        disabled={deleting}
        className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={handleConfirmDelete}
        disabled={deleting}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleting ? (
          <>
            <Spinner className="h-5 w-5" />
            Deleting...
          </>
        ) : (
          "Delete Quiz"
        )}
      </button>
    </div>
  </div>
</Modal>
</div>

  )
}

export default QuizManager
