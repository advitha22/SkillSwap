import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import RequestsPage from './pages/RequestsPage';
import { fetchUsers, resetSampleUsers, checkServerHealth, fetchUserRequests } from './services/api';
import { ArrowLeftRight, Sparkles } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Show a notification toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load requests for current user
  const loadUserRequests = async (userId) => {
    if (!userId) return;
    try {
      const data = await fetchUserRequests(userId);
      setRequests({
        incoming: data.incoming || [],
        outgoing: data.outgoing || []
      });
    } catch (err) {
      console.warn('Could not load user requests:', err.message);
    }
  };

  // Initial data load
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [userList, health] = await Promise.all([
        fetchUsers(),
        checkServerHealth()
      ]);
      setUsers(userList || []);
      setServerStatus(health);
      if (userList && userList.length > 0) {
        const defaultUser = userList[0];
        setCurrentUser(defaultUser);
        await loadUserRequests(defaultUser.id);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
      showToast('Backend server connecting...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // When currentUser changes, reload their requests
  useEffect(() => {
    if (currentUser?.id) {
      loadUserRequests(currentUser.id);
    }
  }, [currentUser?.id]);

  // Reset to original 10 sample profiles and sample requests
  const handleResetData = async () => {
    if (window.confirm('Reset the database back to original 10 sample student profiles and requests?')) {
      try {
        const freshUsers = await resetSampleUsers();
        setUsers(freshUsers);
        if (freshUsers.length > 0) {
          setCurrentUser(freshUsers[0]);
          await loadUserRequests(freshUsers[0].id);
        }
        showToast('Database reset to initial sample state!');
      } catch (err) {
        showToast('Error resetting database: ' + err.message);
      }
    }
  };

  // Callback when a user updates or creates a profile
  const handleProfileSaved = (savedUser) => {
    setUsers(prev => {
      const existingIdx = prev.findIndex(u => u.id === savedUser.id);
      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx] = savedUser;
        return updated;
      }
      return [savedUser, ...prev];
    });
    setCurrentUser(savedUser);
    showToast(`Saved profile for ${savedUser.name}!`);
  };

  const pendingRequestsCount = requests.incoming.filter(r => r.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        users={users}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        onResetData={handleResetData}
        serverStatus={serverStatus}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {loading ? (
          <div className="text-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-600">
              Initializing SkillSwap Platform...
            </p>
          </div>
        ) : (
          <>
            {currentPage === 'landing' && (
              <LandingPage
                setCurrentPage={setCurrentPage}
              />
            )}

            {currentPage === 'dashboard' && (
              <DashboardPage
                currentUser={currentUser}
                setCurrentPage={setCurrentPage}
                onRequestSent={() => loadUserRequests(currentUser.id)}
              />
            )}

            {currentPage === 'requests' && (
              <RequestsPage
                currentUser={currentUser}
                requests={requests}
                onRefreshRequests={() => loadUserRequests(currentUser.id)}
                setCurrentPage={setCurrentPage}
              />
            )}

            {currentPage === 'profile' && (
              <ProfilePage
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                onProfileSaved={handleProfileSaved}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
            <span>SkillSwap AI</span>
            <span className="text-slate-400 font-normal">| Hackathon MVP</span>
          </div>

          <p className="text-slate-400">
            Powered by Google Gemini 1.5 Flash • Semantic Matching Architecture
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage('landing')}
              className="hover:text-slate-800 transition-colors"
            >
              Home
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="hover:text-slate-800 transition-colors"
            >
              Matches
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentPage('requests')}
              className="hover:text-slate-800 transition-colors"
            >
              Requests {pendingRequestsCount > 0 ? `(${pendingRequestsCount})` : ''}
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentPage('profile')}
              className="hover:text-slate-800 transition-colors"
            >
              Profile
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
