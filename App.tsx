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
import { 
  Activity, 
  Shield, 
  Zap, 
  FileText, 
  Upload, 
  Search, 
  FileCheck, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 via-white to-teal-50 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Skin Disease Detection
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
              Detect Skin Conditions
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                Instantly with AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant, accurate analysis of skin conditions including Monkeypox, Chickenpox, Measles, and more. 
              Powered by advanced AI technology for your peace of mind.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-teal-700 hover:to-teal-800 transition-all transform hover:-translate-y-0.5 flex items-center text-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/analyzer"
                    className="px-8 py-4 bg-white text-teal-700 font-bold rounded-xl shadow-md hover:shadow-lg border-2 border-teal-200 hover:border-teal-300 transition-all transform hover:-translate-y-0.5 flex items-center text-lg"
                  >
                    Try Demo
                  </Link>
                </>
              ) : (
                <Link
                  to="/analyzer"
                  className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-teal-700 hover:to-teal-800 transition-all transform hover:-translate-y-0.5 flex items-center text-lg"
                >
                  Start Analysis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              )}
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-600">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-teal-600 mr-2" />
                <span className="font-medium">Instant Results</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-teal-600 mr-2" />
                <span className="font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-teal-600 mr-2" />
                <span className="font-medium">No Credit Card</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Why Choose DermaCheck AI?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Advanced technology meets user-friendly design for accurate skin condition detection
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl border border-teal-100 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
              <p className="text-slate-600">
                Get results in seconds with our advanced AI-powered analysis engine
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl border border-teal-100 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Private</h3>
              <p className="text-slate-600">
                Your images and data are encrypted and stored securely with industry-standard protection
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl border border-teal-100 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center mb-4">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Accurate Detection</h3>
              <p className="text-slate-600">
                Advanced AI models trained to detect multiple skin conditions with high precision
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-2xl border border-teal-100 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Detailed Reports</h3>
              <p className="text-slate-600">
                Comprehensive analysis with key features and personalized recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple, fast, and reliable - get your skin analysis in three easy steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Upload Image</h3>
              <p className="text-slate-600">
                Take or upload a clear photo of the affected skin area. Ensure good lighting for best results.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Analysis</h3>
              <p className="text-slate-600">
                Our advanced AI analyzes your image using deep learning models trained on medical data.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileCheck className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Get Results</h3>
              <p className="text-slate-600">
                Receive detailed diagnosis, key features, and personalized recommendations instantly.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Stats/Trust Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">99%+</div>
              <div className="text-teal-100 text-lg">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">&lt;10s</div>
              <div className="text-teal-100 text-lg">Average Analysis Time</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2">24/7</div>
              <div className="text-teal-100 text-lg">Available Anytime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      {!user && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join thousands of users who trust DermaCheck AI for their skin health monitoring
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-teal-700 hover:to-teal-800 transition-all transform hover:-translate-y-0.5 flex items-center justify-center text-lg"
              >
                Create Free Account
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/analyzer"
                className="px-8 py-4 bg-white text-teal-700 font-bold rounded-xl shadow-md hover:shadow-lg border-2 border-teal-200 hover:border-teal-300 transition-all transform hover:-translate-y-0.5 flex items-center justify-center text-lg"
              >
                Try Analyzer
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const AnalyzerPage = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { user, refreshHistory } = useAuth();

  const handleAnalysisComplete = async (result: AnalysisResult, imageUrl: string) => {
    setAnalysisResult(result);
    
    // History is automatically saved by the backend, just refresh it
    if (user) {
      await refreshHistory();
    }
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('analysis-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setTimeout(() => {
      const analyzerElement = document.getElementById('analyzer-section');
      if (analyzerElement) {
        analyzerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
          Skin Disease Detection
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Upload a clear photo of the affected area to detect Monkeypox, Chickenpox, Measles, or Normal skin.
        </p>
      </div>

      {analysisResult ? (
        <div id="analysis-results">
          <ResultCard result={analysisResult} onReset={resetAnalysis} />
        </div>
      ) : (
        <div id="analyzer-section">
          <Analyzer onAnalysisComplete={handleAnalysisComplete} />
        </div>
      )}
      
      {!user && !analysisResult && (
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Save Your Analysis History</h3>
              <p className="text-teal-100">
                Create a free account to track your skin condition analysis over time and access your complete history.
              </p>
            </div>
            <Link 
              to="/register"
              className="px-8 py-3 bg-white text-teal-700 font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              Sign Up Free
            </Link>
          </div>
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
          <Route path="/analyzer" element={<AnalyzerPage />} />
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