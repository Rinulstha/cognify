import { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles , BookOpen , Lightbulb } from "lucide-react";
import toast from "react-hot-toast";
import MarkdownRenderer from "../common/MarkdownRenderer";
import aiService from "../../services/aiService";
import Modal from "../common/Modal";
function AIActions() {

  const { id: documentId } = useParams();
  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    try {
      const { summary } = await aiService.generateSummary(documentId);
      setModalTitle("Generated Summary");
      setModalContent(summary);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to generate summary.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
  e.preventDefault();
  if (!concept.trim()) {
    toast.error("Please enter a concept to explain.");
    return;
  }
  setLoadingAction("explain");
  try {
    const { explanation } = await aiService.explainConcept(
      documentId,
      concept
    );
    setModalTitle(`Explanation of "${concept}"`);
    setModalContent(explanation);
    setIsModalOpen(true);
    setConcept("");
  } catch (error) {
    toast.error("Failed to explain concept.");
  } finally {
    setLoadingAction(null);
  }
};

  return (
    <>
<div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
  
  {/* Header */}
  <div className="px-6 py-5 border-b border-slate-200/60 bg-gradient-to-br from-slate-50 to-white">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
        <Sparkles className="w-5 h-5" strokeWidth={2} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900">AI Assistant</h3>
        <p className="text-sm text-slate-500">Powered by advanced AI</p>
      </div>
    </div>
  </div>

  <div className="p-6 flex flex-col gap-4">

    {/* Summary Card */}
    <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <BookOpen className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Generate Summary</h4>
            <p className="text-xs text-slate-500 mt-0.5">Get a summary of the document</p>
          </div>
        </div>
        <button
          onClick={handleGenerateSummary}
          disabled={loadingAction === "summary"}
          className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-sm hover:from-violet-600 hover:to-violet-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loadingAction === "summary" ? "Generating..." : "Generate Summary"}
        </button>
      </div>
    </div>

    {/* Explain Concept Card */}
    <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4">
      <form onSubmit={handleExplainConcept}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Lightbulb className="w-5 h-5" strokeWidth={2} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Explain a Concept</h4>
            <p className="text-xs text-slate-500 mt-0.5">Enter a concept and get an explanation from the document</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="e.g. 'AI', 'Machine Learning'"
            disabled={loadingAction === "explain"}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 disabled:opacity-60 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={loadingAction === "explain" || !concept.trim()}
            className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-sm hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingAction === "explain" ? "Explaining..." : "Explain"}
          </button>
        </div>
      </form>
    </div>

  </div>
</div>

{/* Result modal */}
    <Modal isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    title={modalTitle}
    >
        <div className="max-h-[60vh] overflow-y-auto prose-sm max-w-none prose-slate">
            <MarkdownRenderer content={modalContent}/>
        </div>
    </Modal>
    </>
  );
}

export default AIActions;
