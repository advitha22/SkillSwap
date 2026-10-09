import React from 'react';
import { ArrowLeftRight, User, RotateCcw, Sparkles } from 'lucide-react';

export default function Navbar({
  currentPage,
  setCurrentPage,
  users,
  currentUser,
  setCurrentUser,
  onResetData,
  serverStatus,
  pendingRequestsCount = 0
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                Skill<span className="text-indigo-600">Swap</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                  AI MVP
                </span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentPage('landing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                currentPage === 'landing'
                  ? 'text-indigo-600 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                currentPage === 'dashboard'
                  ? 'text-indigo-600 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Best Matches
            </button>
            <button
              onClick={() => setCurrentPage('requests')}
              className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                currentPage === 'requests'
                  ? 'text-indigo-600 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Requests</span>
              {pendingRequestsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentPage('profile')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                currentPage === 'profile'
                  ? 'text-indigo-600 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              My Profile
            </button>
          </nav>

          {/* User Profile Switcher & Actions */}
          <div className="flex items-center gap-3">
            {/* Active User Switcher for demo */}
            {currentUser && users && users.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-100/90 rounded-2xl px-2.5 py-1.5 border border-slate-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full bg-white border border-slate-300"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase leading-none">
                    Logged in as
                  </p>
                  <select
                    value={currentUser.id}
                    onChange={(e) => {
                      const sel = users.find(u => u.id === e.target.value);
                      if (sel) setCurrentUser(sel);
                    }}
                    className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer pr-1"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.college.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Reset Sample Data Button */}
            <button
              onClick={onResetData}
              title="Reset to 10 sample student profiles"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors border border-transparent hover:border-slate-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Mobile action */}
            <button
              onClick={() => setCurrentPage(currentPage === 'dashboard' ? 'profile' : 'dashboard')}
              className="md:hidden px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl"
            >
              {currentPage === 'dashboard' ? 'Profile' : 'Matches'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
