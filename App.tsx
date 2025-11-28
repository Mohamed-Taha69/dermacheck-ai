import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Analyzer from './components/Analyzer';
import ResultCard from './components/ResultCard';
import AuthForms from './components/AuthForms';
import Profile from './components/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ViewState, AnalysisResult, HistoryItem } from './types';

// Helper for unique ID since we might not have uuid lib
const generateId = () => Math.random().toString(36).substring(2, 15);

const AppContent = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  const { user, addToHistory, refreshHistory } = useAuth();

  const handleAnalysisComplete = async (result: AnalysisResult, imageUrl: string) => {
    setAnalysisResult(result);
    setCurrentImage(imageUrl);
    
    // History is automatically saved by the backend, just refresh it
    if (user && result.isAcne) {
      await refreshHistory();
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setCurrentImage(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'LOGIN':
      case 'REGISTER':
        return (
          <AuthForms 
            initialView={currentView} 
            onSuccess={() => setCurrentView('HOME')} 
            onSwitch={setCurrentView}
          />
        );
      
      case 'PROFILE':
        if (!user) {
          setCurrentView('LOGIN');
          return null;
        }
        return <Profile view="PROFILE" />;
        
      case 'HISTORY':
        if (!user) {
          setCurrentView('LOGIN');
          return null;
        }
        return <Profile view="HISTORY" />;

      case 'HOME':
      default:
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
                  <p className="text-teal-200 text-sm">Create an account to track your skin progress over time.</p>
                </div>
                <button 
                  onClick={() => setCurrentView('REGISTER')}
                  className="px-6 py-2 bg-white text-teal-900 font-bold rounded-lg hover:bg-teal-50 transition-colors"
                >
                  Sign Up Now
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentView={currentView} setView={setCurrentView} />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {renderContent()}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} DermaCheck AI. All rights reserved.</p>
          <p className="mt-2">Disclaimer: This tool provides information based on AI analysis and is not a substitute for professional medical advice, diagnosis, or treatment.</p>
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