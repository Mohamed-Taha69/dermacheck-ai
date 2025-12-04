import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, User as UserIcon } from 'lucide-react';
import { DiseaseType } from '../types';

interface ProfileProps {
  view: 'PROFILE' | 'HISTORY';
}

const Profile: React.FC<ProfileProps> = ({ view }) => {
  const { user, history } = useAuth();

  const getDiagnosisBadge = (diagnosis: DiseaseType) => {
    switch (diagnosis) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'Chickenpox': return 'bg-yellow-100 text-yellow-800';
      case 'Measles': return 'bg-orange-100 text-orange-800';
      case 'Monkeypox': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Profile Header */}
      {view === 'PROFILE' && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-teal-600 h-24"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="flex items-end">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <UserIcon className="w-10 h-10" />
                  </div>
                </div>
                <div className="ml-4 mb-1">
                  <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
                  <p className="text-slate-500">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div className="text-3xl font-bold text-teal-600">{history.length}</div>
                <div className="text-sm text-slate-500 font-medium">Total Scans</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div className="text-3xl font-bold text-teal-600">
                  {history.filter(h => h.result.diagnosis !== 'Normal').length}
                </div>
                <div className="text-sm text-slate-500 font-medium">Disease Detections</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {history.filter(h => h.result.diagnosis === 'Monkeypox').length}
                </div>
                <div className="text-sm text-slate-500 font-medium">Monkeypox Cases</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-teal-600" />
          {view === 'PROFILE' ? 'Recent History' : 'Assessment History'}
        </h2>

        {history.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-slate-200">
            <div className="text-slate-400 text-lg">No history available yet.</div>
            <p className="text-slate-400 text-sm mt-1">Start by analyzing your first skin image.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row">
                <div className="w-full md:w-48 h-48 md:h-auto bg-slate-100 flex-shrink-0 relative">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt="Scan thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-2 left-2 md:hidden">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${getDiagnosisBadge(item.result.diagnosis)}`}>
                      {item.result.diagnosis}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <h3 className="text-lg font-bold text-slate-800 mt-1">{item.result.diagnosis}</h3>
                    </div>
                    <span className={`hidden md:inline-block px-3 py-1 rounded-full text-sm font-bold ${getDiagnosisBadge(item.result.diagnosis)}`}>
                      {item.result.diagnosis}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                    {item.result.assessment}
                  </p>
                  
                  <div className="mt-auto">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Top Recommendation</p>
                    <p className="text-sm text-teal-700 font-medium">
                      {item.result.recommendations[0]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;