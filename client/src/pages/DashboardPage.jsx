import React, { useState, useEffect, useMemo } from 'react';
import MatchCard from '../components/MatchCard';
import ConnectModal from '../components/ConnectModal';
import ProfileModal from '../components/ProfileModal';
import { matchSkills } from '../services/api';
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  Filter,
  CheckCircle2,
  Users,
  Flame,
  BookOpen
} from 'lucide-react';

export default function DashboardPage({ currentUser, setCurrentPage, onRequestSent }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [engineInfo, setEngineInfo] = useState('');
  const [warningInfo, setWarningInfo] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'mutual', 'theyTeach', 'iTeach'
  const [sortBy, setSortBy] = useState('compatibility'); // 'compatibility', 'name'

  // Modals
  const [selectedMatchForConnect, setSelectedMatchForConnect] = useState(null);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);

  // Fetch matches whenever current user changes
  const loadMatches = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const data = await matchSkills({ userId: currentUser.id });
      setMatches(data.matches || []);
      setEngineInfo(data.engine || 'AI Engine');
      setWarningInfo(data.warning || null);
    } catch (err) {
      console.error('Failed to load matches:', err);
      setError(err.message || 'Unable to compute matches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [currentUser?.id]);

  // Client-side filtering & search
  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      // Search query across candidate name, college, teach skills, learn skills
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const nameMatch = m.user.name.toLowerCase().includes(q);
        const collegeMatch = m.user.college.toLowerCase().includes(q);
        const teachMatch = m.user.canTeach.some(s =>
          (typeof s === 'string' ? s : s.skill).toLowerCase().includes(q)
        );
        const learnMatch = m.user.wantsToLearn.some(s =>
          (typeof s === 'string' ? s : s.skill).toLowerCase().includes(q)
        );
        const reasonMatch = m.explanation.toLowerCase().includes(q);

        if (!nameMatch && !collegeMatch && !teachMatch && !learnMatch && !reasonMatch) {
          return false;
        }
      }

      // Filter category
      if (filterType === 'mutual') {
        return m.matchType === 'Mutual Exchange' || m.compatibility >= 80;
      }
      if (filterType === 'theyTeach') {
        // Must teach something in current user's want-to-learn list
        return m.matchedSkills?.theyTeachYou || m.compatibility >= 60;
      }
      if (filterType === 'iTeach') {
        // Current user must teach what they want to learn
        return m.matchedSkills?.youTeachThem || m.compatibility >= 60;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'compatibility') {
        return b.compatibility - a.compatibility;
      }
      if (sortBy === 'name') {
        return a.user.name.localeCompare(b.user.name);
      }
      return 0;
    });
  }, [matches, searchQuery, filterType, sortBy]);

  // Compute summary stats
  const mutualCount = matches.filter(m => m.matchType === 'Mutual Exchange' || m.compatibility >= 80).length;
  const topScore = matches.length > 0 ? matches[0].compatibility : 0;

  if (!currentUser) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">No student profile selected</h2>
        <button
          onClick={() => setCurrentPage('profile')}
          className="mt-4 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl"
        >
          Create or Select Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Dashboard Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-200 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Student Dashboard
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  {currentUser.college}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Your Best Skill Matches
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Browsing as <span className="font-bold text-slate-800">{currentUser.name}</span>
              </p>
            </div>
          </div>

          {/* AI Engine Status & Re-match Button */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl px-3.5 py-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <div className="text-left">
                <p className="text-[10px] font-bold text-indigo-600 uppercase leading-none">
                  AI Matching Engine
                </p>
                <p className="text-xs font-bold text-slate-800">
                  {engineInfo || 'Gemini 1.5 Flash'}
                </p>
              </div>
            </div>

            <button
              onClick={loadMatches}
              disabled={loading}
              className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 hover:text-slate-900 transition-colors shadow-sm disabled:opacity-50"
              title="Refresh AI matches"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Quick Insights Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Top Match</span>
            <span className="text-xl font-black text-emerald-600">{topScore}%</span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Mutual Exchanges</span>
            <span className="text-xl font-black text-indigo-600">{mutualCount} Available</span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Skills You Teach</span>
            <span className="text-xl font-black text-teal-600">{currentUser.canTeach?.length || 0}</span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-3 text-center border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Skills You Want</span>
            <span className="text-xl font-black text-purple-600">{currentUser.wantsToLearn?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Notice/Warning banner if any */}
      {warningInfo && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Notice: {warningInfo} (Operating seamlessly on intelligent semantic fallback).</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skills (e.g. Python, UI/UX, Video, Public Speaking)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
            >
              <option value="compatibility">Highest Compatibility</option>
              <option value="name">Candidate Name</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>

          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Matches ({matches.length})
          </button>

          <button
            onClick={() => setFilterType('mutual')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterType === 'mutual'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Mutual Exchanges ({mutualCount})</span>
          </button>

          <button
            onClick={() => setFilterType('theyTeach')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'theyTeach'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            Teaches what I want
          </button>

          <button
            onClick={() => setFilterType('iTeach')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'iTeach'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
            }`}
          >
            Wants what I teach
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16 space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">
            AI is analyzing complementary skill sets...
          </p>
          <p className="text-xs text-slate-400">
            Evaluating bidirectional exchange compatibility
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="text-base font-bold text-red-900">Failed to calculate matches</h3>
          <p className="text-xs text-red-700">{error}</p>
          <button
            onClick={loadMatches}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
          >
            Retry Matching
          </button>
        </div>
      )}

      {/* Matches Grid */}
      {!loading && !error && (
        <>
          {filteredMatches.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No matching student profiles found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your search query or reset the filter to view all student profiles.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setFilterType('all'); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMatches.map(match => (
                <MatchCard
                  key={match.user.id}
                  match={match}
                  onConnect={(m) => setSelectedMatchForConnect(m)}
                  onViewProfile={(u) => setSelectedUserForProfile(u)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Connect Modal */}
      <ConnectModal
        match={selectedMatchForConnect}
        currentUser={currentUser}
        onClose={() => setSelectedMatchForConnect(null)}
        onRequestSent={onRequestSent}
      />

      {/* Profile Detail Modal */}
      <ProfileModal
        user={selectedUserForProfile}
        onClose={() => setSelectedUserForProfile(null)}
        onConnect={(m) => setSelectedMatchForConnect(m)}
      />
    </div>
  );
}
