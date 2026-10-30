import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import flashcardService from "../../services/flashService";
import aiService from "../../services/aiService";
import PageHeader from "../../components/common/pageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Flashcard from "../../components/flashcards/Flashcard";

function FlashcardPage() {
  const { id: documentId } = useParams();
const [flashcardSets, setFlashcardSets] = useState([]);
const [flashcards, setFlashcards] = useState([]);
const [loading, setLoading] = useState(true);
const [generating, setGenerating] = useState(false);
const [currentCardIndex, setCurrentCardIndex] = useState(0);
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [deleting, setDeleting] = useState(false);

const fetchFlashcards = async () => {
  setLoading(true);
  try {
    const response = await flashcardService.getFlashcardsForDocument(
      documentId
    );
    setFlashcardSets(response.data[0]);
    setFlashcards(response.data[0]?.cards || []);
  } catch (error) {
    toast.error("Failed to fetch flashcards.");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchFlashcards();
}, [documentId]);

const handleGenerateFlashcards = async () => {
  setGenerating(true);
  try {
    await aiService.generateFlashcards(documentId);
    toast.success("Flashcards generated successfully!");
    fetchFlashcards();
  } catch (error) {
    toast.error(error.message || "Failed to generate flashcards.");
  } finally {
    setGenerating(false);
  }
};

const handleNextCard = () => {
  handleReview(currentCardIndex)
  setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
};

const handlePrevCard = () => {
  handleReview(currentCardIndex)
  setCurrentCardIndex(
    (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
  );
};

const handleReview = async (index) => {
  const currentCard = flashcards[currentCardIndex];
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
    setFlashcards((prevFlashcards) =>
      prevFlashcards.map((card) =>
        card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
      )
    );
    toast.success("Flashcard starred status updated!");
  } catch (error) {
    toast.error("Failed to update star status.");
  }
};

const handleDeleteFlashcardSet = async () => {
  setDeleting(true);
  try {
    await flashcardService.deleteFlashcardSet(flashcardSets._id);
    toast.success("Flashcard set deleted successfully!");
    setIsDeleteModalOpen(false);
    fetchFlashcards(); // Refetch to show empty state
  } catch (error) {
    toast.error(error.message || "Failed to delete flashcard set.");
  } finally {
    setDeleting(false);
  }
};

const renderFlashcardContent = () => {
  if (loading) {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Spinner />
    </div>
  );
}

  if (flashcards.length === 0) {
    return (
      <EmptyState
        title="No Flashcards Found"
        description="Generate a flashcard set to start studying."
      />
    );
  }

  const currentCard = flashcards[currentCardIndex];
  return (
<div className="space-y-8">
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
  <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
    <Button
      onClick={handlePrevCard}
      variant="secondary"
      disabled={flashcards.length <= 1}
      className="w-full sm:w-auto"
    >
      <ChevronLeft
        className="h-5 w-5"
        strokeWidth={2}
      />
      Previous
    </Button>

    <div className="rounded-xl bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm">
      {currentCardIndex + 1}
      <span className="mx-2 text-slate-400">/</span>
      {flashcards.length}
    </div>

    <Button
      onClick={handleNextCard}
      variant="secondary"
      disabled={flashcards.length <= 1}
      className="w-full sm:w-auto"
    >
      Next
      <ChevronRight
        className="h-5 w-5"
        strokeWidth={2}
      />
    </Button>
  </div>
</div>
  )
}
  return (
<div className="space-y-8">
  {/* Back Button */}
  <div>
    <Link
      to={`/documents/${documentId}`}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      <ArrowLeft
        className="h-5 w-5"
        strokeWidth={2}
      />
      <span>Back to Document</span>
    </Link>
  </div>

  {/* Header */}
  <PageHeader title="Flashcards">
    {!loading && flashcards.length > 0 ? (
      <Button
        onClick={() => setIsDeleteModalOpen(true)}
        disabled={deleting}
        className="w-full sm:w-auto"
      >
        <Trash2
          className="h-5 w-5"
          strokeWidth={2}
        />
        Delete Flashcard Set
      </Button>
    ) : (
      <Button
        onClick={handleGenerateFlashcards}
        disabled={generating}
        className="w-full sm:w-auto"
      >
        {generating ? (
          <>
            <Spinner />
            Generating...
          </>
        ) : (
          <>
            <Plus
              className="h-5 w-5"
              strokeWidth={2}
            />
            Generate Flashcards
          </>
        )}
      </Button>
    )}
  </PageHeader>

  {/* Flashcards */}
  {renderFlashcardContent()}

  {/* Delete Modal */}
  <Modal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    title="Delete Flashcard Set"
  >
    <div className="space-y-6">
      <p className="text-sm leading-6 text-slate-600 sm:text-base">
        Are you sure you want to delete this flashcard set?
        <br />
        <span className="mt-2 inline-block text-red-500">
          This action cannot be undone.
        </span>
      </p>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsDeleteModalOpen(false)}
          disabled={deleting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>

        <Button
          type="button"
          onClick={handleDeleteFlashcardSet}
          disabled={deleting}
          className="w-full sm:w-auto"
        >
          {deleting ? (
            <>
              <Spinner />
              Deleting...
            </>
          ) : (
            "Delete Flashcard Set"
          )}
        </Button>
      </div>
    </div>
  </Modal>
</div>
  )
}

export default FlashcardPage
