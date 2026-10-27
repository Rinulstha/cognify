import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import DocumentsPage from './pages/Documents/DocumentListPage';
import DocumentDetailPage from './pages/Documents/DocumentDetailPage';
import FlashcardsListPage from './pages/Flashcards/FlashcardsListPage';
import FlashcardPage from './pages/Flashcards/FlashcardPage';
import ProfilePage from './pages/Profile/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import QuizTakePage from './pages/Quizzes/QuizTakePage';
import QuizResultPage from './pages/Quizzes/QuizResultPage';
import { useAuth } from './context/AuthContext';
import VerifyEmail from "./pages/Auth/VerifyEmail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  const { isAuthenticated, loading } = useAuth();
   

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading....</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashcardsListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />     
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;