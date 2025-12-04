import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Analyzer from './components/Analyzer';
import ResultCard from './components/ResultCard';
import AuthForms from './components/AuthForms';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnalysisResult } from './types';

const HomePage = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { user, refreshHistory } = useAuth();

  const handleAnalysisComplete = async (result: AnalysisResult, imageUrl: string) => {
    setAnalysisResult(result);
    
    // History is automatically saved by the backend, just refresh it
    if (user) {
      await refreshHistory();
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="space-y-8">
      {analysisResult ? (
        <ResultCard result={analysisResult} onReset={resetAnalysis} />
      ) : (
        <Analyzer onAnalysisComplete={handleAnalysisComplete} />
      )}
      
      {!user && analysisResult && (
        <div className="max-w-4xl mx-auto bg-teal-900 text-teal-50 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="font-bold text-lg">Save your results?</h3>
            <p className="text-teal-200 text-sm">Create an account to track your skin disease detection history.</p>
          </div>
          <Link 
            to="/register"
            className="px-6 py-2 bg-white text-teal-900 font-bold rounded-lg hover:bg-teal-50 transition-colors inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      )}
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthForms initialView="LOGIN" />} />
          <Route path="/register" element={<AuthForms initialView="REGISTER" />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile view="PROFILE" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <Profile view="HISTORY" />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Skin Disease Detection AI. All rights reserved.</p>
          <p className="mt-2">Disclaimer: This tool provides information based on AI analysis and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a healthcare provider for accurate diagnosis.</p>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;