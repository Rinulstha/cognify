import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, ExternalLink } from "lucide-react";

import documentService from "../../services/documentService";
import Spinner from "../../components/common/Spinner";
import PageHeader from "../../components/common/pageHeader";
import Tabs from "../../components/common/Tabs";

import ChatInterface from "../../components/chat/ChatInterface";
import AIActions from "../../components/ai/AIActions";
import FlashcardManager from "../../components/flashcards/FlashcardManager";
import QuizManager from "../../components/quizzes/QuizManager";
function DocumentDetailPage() {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Content");

  /* =========================
     Fetch Document
  ========================= */
  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        setLoading(true);

        const response = await documentService.getDocumentById(id);
        const doc = response?.data ? response : { data: response };

        setDocument(doc);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch document details.");
        setDocument(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDocumentDetails();
  }, [id]);

  /* =========================
     PDF URL Builder
  ========================= */
  const getPdfUrl = () => {
    const filePath = document?.data?.filePath;

    if (!filePath) return null;

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    const baseUrl =
      process.env.REACT_APP_API_URL || "http://localhost:8000";

    return `${baseUrl}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  /* =========================
     Tab Renderers
  ========================= */
  const renderContent = () => {
    const pdfUrl = getPdfUrl();

    if (!pdfUrl) {
      return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center text-slate-500">
          PDF not available.
        </div>
      );
    }

    return (
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Viewer Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-b border-slate-200 bg-slate-50">
          <span className="text-sm font-semibold text-slate-700">
            Document Viewer
          </span>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>

        {/* PDF */}
        <div className="p-2 sm:p-3 bg-slate-100">
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            className="w-full h-[60vh] sm:h-[70vh] lg:h-[75vh] bg-white rounded-xl border border-slate-200"
          />
        </div>
      </div>
    );
  };

  const renderChat = () => {
    return <ChatInterface />
  };

  const renderAIActions = () => {
    return <AIActions />
  };

  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={id} />
};

    const renderQuizzesTab = () => { 
      return <QuizManager documentId={id} />
    };

  /* =========================
     Loading / Error State
  ========================= */
  if (loading) return <Spinner />;

  if (!document?.data) {
    return (
      <div className="text-center py-12 text-slate-500">
        Document not found.
      </div>
    );
  }

  /* =========================
     Tabs
  ========================= */
  const tabs = [
    { name: "Content", label: "Content", content: renderContent() },
    { name: "Chat", label: "Chat", content: renderChat() },
    {
      name: "AI Actions",
      label: "AI Actions",
      content: renderAIActions(),
    },
    {
      name: "Flashcards",
      label: "Flashcards",
      content: renderFlashcardsTab(),
    },
    {
      name: "Quizzes",
      label: "Quizzes",
      content: renderQuizzesTab(),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-5 lg:px-0">
      {/* Back Button */}
      <div>
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>

      {/* Header */}
      <PageHeader
        title={document?.data?.title || "Untitled Document"}
      />

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export default DocumentDetailPage;