import React from 'react';
import { X, GraduationCap, Mail, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import SkillBadge from './SkillBadge';

export default function ProfileModal({ user, onClose, onConnect }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Banner with gradient */}
        <div className="h-28 bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-600 relative p-4 flex justify-end">
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-sm transition-colors h-9 w-9 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 pt-0 overflow-y-auto">
          {/* Avatar & Header */}
          <div className="flex items-end justify-between -mt-12 mb-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md object-cover"
            />
            {onConnect && (
              <button
                onClick={() => {
                  onClose();
                  onConnect({ user, compatibility: 90, suggestedExchange: 'Connect for peer learning' });
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition-all"
              >
                Connect with {user.name.split(' ')[0]}
              </button>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900">{user.name}</h2>
              {user.gender && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {user.gender === 'Female' ? '👩 Female' : user.gender === 'Male' ? '👨 Male' : '✨ Other'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-xs font-medium mt-1">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <span>{user.college}</span>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              About
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {user.bio || 'Student at ' + user.college}
            </p>
          </div>

          {/* Skills Breakdown */}
          <div className="mt-6 space-y-5">
            {/* Can Teach */}
            <div>
              <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2.5">
                <Lightbulb className="w-4 h-4 text-teal-600" />
                <span>Skills I Can Teach</span>
              </div>
              <div className="space-y-2">
                {user.canTeach?.map((s, idx) => (
                  <div key={idx} className="bg-teal-50/60 border border-teal-100 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-teal-950">
                        {typeof s === 'string' ? s : s.skill}
                      </span>
                      {typeof s === 'object' && s.level && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-200/60 text-teal-800 px-2 py-0.5 rounded">
                          {s.level}
                        </span>
                      )}
                    </div>
                    {typeof s === 'object' && s.description && (
                      <p className="text-xs text-teal-800/80 leading-relaxed">
                        {s.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Wants to Learn */}
            <div>
              <div className="flex items-center gap-2 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Skills I Want to Learn</span>
              </div>
              <div className="space-y-2">
                {user.wantsToLearn?.map((s, idx) => (
                  <div key={idx} className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-indigo-950">
                        {typeof s === 'string' ? s : s.skill}
                      </span>
                      {typeof s === 'object' && s.level && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-200/60 text-indigo-800 px-2 py-0.5 rounded">
                          {s.level}
                        </span>
                      )}
                    </div>
                    {typeof s === 'object' && s.description && (
                      <p className="text-xs text-indigo-800/80 leading-relaxed">
                        {s.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Campus Contact: </span>
              <span className="font-medium text-slate-800">{user.contactEmail || `${user.name.toLowerCase().replace(/\s+/g, '.')}@univ.edu`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
