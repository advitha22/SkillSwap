import React from 'react';
import SkillBadge from './SkillBadge';
import { Sparkles, ArrowLeftRight, UserCheck, Eye, ExternalLink } from 'lucide-react';

export default function MatchCard({ match, onConnect, onViewProfile }) {
  const { user, compatibility, matchType, suggestedExchange, explanation } = match;

  // Compatibility color coding
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-300 ring-emerald-500/20';
    if (score >= 65) return 'text-indigo-700 bg-indigo-50 border-indigo-300 ring-indigo-500/20';
    return 'text-amber-700 bg-amber-50 border-amber-300 ring-amber-500/20';
  };

  const getScoreBarColor = (score) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 65) return 'bg-indigo-500';
    return 'bg-amber-500';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-card overflow-hidden flex flex-col justify-between">
      {/* Top Header Card */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-13 h-13 rounded-full bg-slate-100 border border-slate-200 object-cover"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-lg hover:text-indigo-600 transition-colors">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {user.college}
              </p>
            </div>
          </div>

          {/* Compatibility Score Badge */}
          <div className="text-right">
            <div className={`inline-flex items-baseline px-3 py-1.5 rounded-xl border ring-2 font-bold text-lg ${getScoreColor(compatibility)}`}>
              <span>{compatibility}%</span>
              <span className="text-[10px] ml-1 uppercase tracking-wide opacity-80">Match</span>
            </div>
          </div>
        </div>

        {/* Compatibility progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-1.5 mb-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(compatibility)}`}
            style={{ width: `${compatibility}%` }}
          />
        </div>

        {/* Suggested Exchange Banner */}
        <div className="bg-gradient-to-r from-teal-50 to-indigo-50 border border-indigo-100/80 rounded-xl p-3.5 mb-4">
          <div className="flex items-center gap-2 text-indigo-900 text-xs font-semibold mb-1 uppercase tracking-wider">
            <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
            <span>Suggested Skill Exchange</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 leading-snug">
            {suggestedExchange}
          </p>
        </div>

        {/* AI Reasoning / Explanation */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 mb-5">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "{explanation}"
            </p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 mb-1.5 flex items-center justify-between">
              <span>Can Teach ({user.canTeach?.length || 0})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.canTeach?.map((skill, idx) => (
                <SkillBadge key={idx} skill={skill} type="teach" />
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1.5">
              <span>Wants to Learn ({user.wantsToLearn?.length || 0})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.wantsToLearn?.map((skill, idx) => (
                <SkillBadge key={idx} skill={skill} type="learn" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          onClick={() => onViewProfile(user)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Profile</span>
        </button>

        <button
          onClick={() => onConnect(match)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Connect</span>
        </button>
      </div>
    </div>
  );
}
