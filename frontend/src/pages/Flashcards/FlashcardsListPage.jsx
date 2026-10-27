import React, { useState, useEffect } from 'react';
import flashcardService from '../../services/flashService';
import PageHeader from '../../components/common/PageHeader';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard';
import toast from 'react-hot-toast';

function FlashcardsListPage() {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchFlashcardSets = async () => {
    try {
      const response = await flashcardService.getAllFlashcardSets();

      console.log("fetchFlashcardSets__", response.data);

      setFlashcardSets(response.data);
    } catch (error) {
      toast.error('Failed to fetch flashcard sets.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchFlashcardSets();
}, []);

const renderContent = () => {
if (loading) {
  return (
    <div className="flex min-h-100 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Spinner />
    </div>
  );
}

if (flashcardSets.length === 0) {
  return (
    <EmptyState
      title="No Flashcard Sets Found"
      description="Generate a flashcard set to start studying."
    />
  );
}

return (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {flashcardSets.map((set) => (
      <FlashcardSetCard
        key={set._id}
        flashcardSet={set}
      />
    ))}
  </div>
);
}

return (
    <div>
      <PageHeader
        title="Flashcard Sets"/>
      {renderContent()}
    </div>
  )
}

export default FlashcardsListPage
