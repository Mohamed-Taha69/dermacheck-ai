import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ViewState } from '../types';
import { Menu, X, User as UserIcon, LogOut, Activity, History } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleNav = (view: ViewState) => {
    setView(view);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setView('HOME');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => handleNav('HOME')}>
            <Activity className="h-8 w-8 text-teal-600" />
            <span className="ml-2 text-xl font-bold text-slate-800">DermaCheck</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => handleNav('HOME')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'HOME' ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-teal-600'}`}
            >
              Analyzer
            </button>
            
            {user ? (
              <>
                <button 
                  onClick={() => handleNav('HISTORY')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${currentView === 'HISTORY' ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-teal-600'}`}
                >
                  <History className="w-4 h-4 mr-1" /> History
                </button>
                <button 
                  onClick={() => handleNav('PROFILE')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${currentView === 'PROFILE' ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-teal-600'}`}
                >
                  <UserIcon className="w-4 h-4 mr-1" /> Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-1" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleNav('LOGIN')}
                  className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => handleNav('REGISTER')}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => handleNav('HOME')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-teal-50"
            >
              Analyzer
            </button>
            {user ? (
              <>
                 <button 
                  onClick={() => handleNav('HISTORY')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-teal-50"
                >
                  History
                </button>
                <button 
                  onClick={() => handleNav('PROFILE')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-teal-50"
                >
                  Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleNav('LOGIN')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-teal-600 hover:bg-teal-50"
                >
                  Log In
                </button>
                <button 
                  onClick={() => handleNav('REGISTER')}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-teal-600 font-semibold hover:bg-teal-50"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;