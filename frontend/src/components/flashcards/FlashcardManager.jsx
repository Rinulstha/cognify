import React, { useState, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ArrowLeft,
  Sparkles,
  Brain,
} from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";
import Flashcard from "./Flashcard";

function FlashcardManager({documentId}) {

const [flashcardSets, setFlashcardSets] = useState([]);
const [selectedSet, setSelectedSet] = useState(null);
const [loading, setLoading] = useState(true);
const [generating, setGenerating] = useState(false);
const [currentCardIndex, setCurrentCardIndex] = useState(0);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [deleting, setDeleting] = useState(false);
const [setToDelete, setSetToDelete] = useState(null);

const fetchFlashcardSets = async () => {
  setLoading(true);
  try {
    const response = await flashcardService.getFlashcardsForDocument(
      documentId
    );
    setFlashcardSets(response.data);
  } catch (error) {
    toast.error("Failed to fetch flashcard sets.");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (documentId) {
    fetchFlashcardSets();
  }
}, [documentId]);

const handleGenerateFlashcards = async () => {
  setGenerating(true);
  try {
    await aiService.generateFlashcards(documentId);
    toast.success("Flashcards generated successfully!");
    fetchFlashcardSets();
  } catch (error) {
    toast.error(error.message || "Failed to generate flashcards.");
  } finally {
    setGenerating(false);
  }
};

const handleNextCard = () => {
  if (selectedSet) {
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prevIndex) => (prevIndex + 1) % selectedSet.cards.length
    );
  }
};

const handlePrevCard = () => {
  if (selectedSet) {
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prevIndex) =>
        (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length
    );
  }
};

const handleReview = async (index) => {
  const currentCard = selectedSet?.cards[currentCardIndex];
  if (!currentCard) return;

  try {
    await flashcardService.reviewFlashcard(currentCard._id, index);
    toast.success("Flashcard reviewed!");
  } catch (error) {
    toast.error("Failed to review flashcard.");
  }
};

 const handleToggleStar = async (cardId) => {
     try {
  await flashcardService.toggleStar(cardId);
  const updatedSets = flashcardSets.map((set) => {
    if (set._id === selectedSet._id) {
      const updatedCards = set.cards.map((card) =>
        card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
      );
      return { ...set, cards: updatedCards };
    }
    return set;
  });
  setFlashcardSets(updatedSets);
  setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
  toast.success("Flashcard starred status updated!");
} catch (error) {
  toast.error("Failed to update star status.");
}
};


 const handleDeleteRequest = (e, set) => {
  e.stopPropagation();
  setSetToDelete(set);
  setIsDeleteModalOpen(true);
};

const handleConfirmDelete = async () => {
  if (!setToDelete) return;
  setDeleting(true);
  try {
    await flashcardService.deleteFlashcardSet(setToDelete._id);
    toast.success("Flashcard set deleted successfully!");
    setIsDeleteModalOpen(false);
    setSetToDelete(null);
    fetchFlashcardSets();
  } catch (error) {
    toast.error(error.message || "Failed to delete flashcard set.");
  } finally {
    setDeleting(false);
  }
};

const handleSelectSet = (set) => {
  setSelectedSet(set);
  setCurrentCardIndex(0);
};

const renderFlashcardViewer = () => {
  const currentCard = selectedSet.cards[currentCardIndex];

  return (
<div className="space-y-8">
  {/* Back Button */}
<button
  onClick={() => setSelectedSet(null)}
  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
>
  <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
  <span>Back to Sets</span>
</button>

  {/* Flashcard */}
  <div className="flex justify-center">
    <div className="w-full max-w-4xl">
      <Flashcard
        flashcard={currentCard}
        onToggleStar={handleToggleStar}
      />
    </div>
  </div>

  {/* Navigation */}
  <div className="flex flex-wrap items-center justify-center gap-4">
    {/* Previous */}
    <button
      onClick={handlePrevCard}
      disabled={selectedSet.cards.length <= 1}
      className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-100 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ChevronLeft className="h-5 w-5" strokeWidth={2} />
      <span>Previous</span>
    </button>

    {/* Card Counter */}
    <div className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700">
      <span>{currentCardIndex + 1}</span>
      <span className="mx-2 text-slate-400">/</span>
      <span>{selectedSet.cards.length}</span>
    </div>

    {/* Next */}
    <button
      onClick={handleNextCard}
      disabled={selectedSet.cards.length <= 1}
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span>Next</span>
      <ChevronRight className="h-5 w-5" strokeWidth={2} />
    </button>
  </div>
</div>
  )
};

const renderSetList = () => {
  if (loading) {
    return (
        <div className="flex items-center justify-center py-28">
<Spinner />
        </div>
        
    )
  }

  
  if (flashcardSets.length === 0) {
     return (
   <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 mb-6">
    <Brain strokeWidth={2} className="w-8 h-8 text-emerald-600" />
  </div>

  <h3 className="text-2xl font-bold text-gray-900">
    No Flashcards Available
  </h3>

  <p className="mt-2 max-w-md text-gray-500">
    Get started by generating AI-powered flashcards from your document to make
    studying easier and faster.
  </p>

  <button
    onClick={handleGenerateFlashcards}
    disabled={generating}
    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
  >
    {generating ? (
      <>
        <svg
          className="h-5 w-5 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        Generating...
      </>
    ) : (
      <>
        <Sparkles strokeWidth={2} className="w-5 h-5" />
        Generate Flashcards
      </>
    )}
  </button>
</div> 
  )
  }

  return (
<div className="space-y-8">
  {/* Header */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
        Your Flashcard Sets
      </h3>

      <p className="mt-1 text-sm sm:text-base text-gray-500">
        <span className="font-semibold text-emerald-600">
          {flashcardSets.length}
        </span>{" "}
        {flashcardSets.length === 1 ? "Flashcard Set" : "Flashcard Sets"} available
      </p>
    </div>

    <button
      onClick={handleGenerateFlashcards}
      disabled={generating}
      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white shadow-md transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
    >
      {generating ? (
        <>
          <Spinner />
          Generating...
        </>
      ) : (
        <>
          <Plus className="w-5 h-5" />
          Generate New Set
        </>
      )}
    </button>
  </div>

  {/* Cards */}
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
    {flashcardSets.map((set) => (
      <div
        key={set._id}
        onClick={() => handleSelectSet(set)}
        className="group relative cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
      >
        {/* Delete */}
        <button
          onClick={(e) => handleDeleteRequest(e, set)}
          className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100">
            <Brain className="w-6 h-6 text-emerald-600" />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="truncate text-lg font-semibold text-gray-900">
              Flashcard Set
            </h4>

            <p className="mt-1 text-sm text-gray-500">
              Created {moment(set.createdAt).format("DD/MM/YYYY")}
            </p>

            <div className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
              {set.cards.length}{" "}
              {set.cards.length === 1 ? "Card" : "Cards"}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
  )
};

  return (
    <>
    <div className="bg-white/80 backdrop-blur-xl border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8 ">
      {selectedSet ? (
        renderFlashcardViewer()
      ) : (
        renderSetList()
      )}
    </div>

<Modal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  title="Delete Flashcard Set"
>
  <div className="space-y-6">
    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
      Are you sure you want to delete this flashcard set?
      <br />
      <span className="font-medium text-red-500">
        This action cannot be undone.
      </span>
    </p>

    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={() => setIsDeleteModalOpen(false)}
        disabled={deleting}
        className="w-full sm:w-auto rounded-xl border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Cancel
      </button>

      <button
        onClick={handleConfirmDelete}
        disabled={deleting}
        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleting ? (
          <>
            <Spinner className="w-5 h-5" />
            Deleting...
          </>
        ) : (
          "Delete Set"
        )}
      </button>
    </div>
  </div>
</Modal>
    </>
  )
}

export default FlashcardManager
