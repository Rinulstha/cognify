import { useState, useEffect } from "react";
import { Plus, Upload, Trash2, FileText, X } from "lucide-react";
import documentService from "../../services/documentService";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";
function DocumentListPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error("Failed to fetch documents.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("Please provide a title and select a file.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);
    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    setDeleting(true);
    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`'${selectedDoc.title}' deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((d) => d._id !== selectedDoc._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 reounded-2xl bg-linear-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 ">
              <FileText className="w-10 h-10" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2">
              No Documents Yet
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Get started by Uploading PDF Document
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:bg-emerald-600 hover:to-teal-600 font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Upload Document
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {documents?.map((doc) => (
          <DocumentCard
            key={doc._id}
            document={doc}
            onDelete={handleDeleteRequest}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-slate-50 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 pointer-events-none" />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8">
          {/* Left Text */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mb-2">
              My Documents
            </h1>

            <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
              Manage and organize your learning
              <br className="hidden sm:block" />
              materials
            </p>
          </div>

          {/* Upload Button */}
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full sm:w-auto justify-center shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Upload Document
          </Button>
        </div>

        {/* Keep renderContent same */}
        {renderContent()}
      </div>


{/*upload modal*/}
    { isUploadModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-8">
          {/*close button*/}
          <button onClick={() => setIsUploadModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
            <X className="w-5 h-5" strokeWidth={2} />
          </button>

          {/*modal Header*/}
          <div className="mb-6">
            <h2 className="text-xl font-medium text-slate-900 tracking-tight"> Upload New Document</h2>
            <p className="text-sm text-slate-500 mt-1">Add a pdf document to your library</p>
          </div>

          {/* Form */}
          <form onSubmit={handleUpload} className="space-y-5">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">Document Title</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                required
                className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
                placeholder="e.g., React Interview Prep"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">PDF File</label>
              <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-200">
                <input
                  id="file-upload"
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                  accept=".pdf"
                />
                <div className="flex flex-col items-center justify-center py-10 px-6">
                  <div className="w-14 h-14 rounded-xl bg-linear-to-r from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
                    <Upload
                    className="w-7 h-7 text-emerald-600" strokeWidth={2}/>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-1">
  {uploadFile ? (
    <span className="text-emerald-600">
      {uploadFile.name}
    </span>
  ) : (
    <>
      <span className="text-emerald-600">
        Click to upload
      </span>{" "}
      or drag and drop
    </>
  )}
</p>
<p className="text-xs text-slate-500">PDF up to 10MB</p>

                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
  <button
    type="button"
    onClick={() => setIsUploadModalOpen(false)}
    disabled={uploading}
    className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Cancel
  </button>
  <button
    type="submit"
    disabled={uploading}
    className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg--linear-to-r  bg-emerald-400 text-slate-700 text-sm font-semibold hover:from-emerald-600 hover:to-teal-600  hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {uploading ? (
      <span className="flex items-center justify-center gap-2">
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        Uploading...
      </span>
    ) : (
      "Upload"
    )}
  </button>
</div>
          </form>
        </div>
    </div>}

{/* Delete Modal */}
{isDeleteModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
    
    <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-8">

      {/* Close Button */}
      <button
        onClick={() => setIsDeleteModalOpen(false)}
        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
      >
        <X className="w-5 h-5" strokeWidth={2} />
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center mb-4">
          <Trash2 className="w-7 h-7 text-red-500" strokeWidth={2} />
        </div>

        <h2 className="text-xl font-medium text-slate-900 tracking-tight">
          Confirm Deletion
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          This action cannot be undone.
        </p>
      </div>

      {/* Content */}
      <div className="p-4 rounded-xl bg-red-50 border border-red-100 mb-6">
        <p className="text-sm text-slate-700 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-600">
            {selectedDoc?.title}
          </span>
          ?
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(false)}
          disabled={deleting}
          className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          onClick={handleConfirmDelete}
          disabled={deleting}
          className="flex-1 h-11 px-4 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Deleting...
            </span>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default DocumentListPage;
