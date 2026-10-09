import React, { useState } from 'react';
import {
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowLeftRight,
  Mail,
  UserCheck,
  Calendar
} from 'lucide-react';
import { updateRequestStatus } from '../services/api';

export default function RequestsPage({
  currentUser,
  requests,
  onRefreshRequests,
  setCurrentPage
}) {
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'outgoing'
  const [updatingId, setUpdatingId] = useState(null);

  const incoming = requests?.incoming || [];
  const outgoing = requests?.outgoing || [];
  const pendingCount = incoming.filter(r => r.status === 'pending').length;

  const handleStatusChange = async (requestId, newStatus) => {
    setUpdatingId(requestId);
    try {
      await updateRequestStatus(requestId, newStatus);
      if (onRefreshRequests) {
        await onRefreshRequests();
      }
    } catch (err) {
      alert('Failed to update request: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Peer Inquiries
              </span>
              {pendingCount > 0 && (
                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {pendingCount} Pending Action
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Skill Exchange Requests
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and manage incoming swap invitations and track requests you've sent.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('dashboard')}
            className="self-start sm:self-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            ← Back to Matches
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'incoming'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Incoming Invitations ({incoming.length})</span>
            {pendingCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'outgoing'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Sent Requests ({outgoing.length})</span>
          </button>
        </div>
      </div>

      {/* INCOMING REQUESTS TAB */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          {incoming.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No incoming skill swap requests yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When other students discover your profile and want to exchange skills, their invitations will appear here.
              </p>
            </div>
          ) : (
            incoming.map(req => {
              const sender = req.sender || {};
              const isPending = req.status === 'pending';
              const isAccepted = req.status === 'accepted';
              const isDeclined = req.status === 'declined';

              return (
                <div
                  key={req.id}
                  className={`bg-white rounded-2xl border p-6 transition-all ${
                    isAccepted
                      ? 'border-emerald-200 shadow-sm bg-emerald-50/20'
                      : isDeclined
                      ? 'border-slate-200 opacity-60'
                      : 'border-slate-200/90 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={sender.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender.name || 'User'}`}
                        alt={sender.name}
                        className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">
                          {sender.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {sender.college}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.compatibility && (
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl">
                          {req.compatibility}% Match
                        </span>
                      )}

                      {/* Status Tag */}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      )}
                      {isAccepted && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Accepted</span>
                        </span>
                      )}
                      {isDeclined && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl">
                          <XCircle className="w-3 h-3" />
                          <span>Declined</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Proposed Exchange Banner */}
                  <div className="bg-gradient-to-r from-teal-50 to-indigo-50 border border-indigo-100/90 rounded-xl p-3.5 mb-4">
                    <div className="flex items-center gap-2 text-indigo-900 text-xs font-bold uppercase tracking-wider mb-1">
                      <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Proposed Skill Swap</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {req.suggestedExchange}
                    </p>
                  </div>

                  {/* Sender's Message */}
                  {req.message && (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 mb-4">
                      <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                        {req.message}
                      </p>
                    </div>
                  )}

                  {/* Accepted State Notification */}
                  {isAccepted && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Swap Confirmed! Contact {sender.name} to schedule your session:</span>
                      </div>
                      <a
                        href={`mailto:${sender.contactEmail || 'student@univ.edu'}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{sender.contactEmail || 'Send Email'}</span>
                      </a>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {isPending && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleStatusChange(req.id, 'declined')}
                        disabled={updatingId === req.id}
                        className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleStatusChange(req.id, 'accepted')}
                        disabled={updatingId === req.id}
                        className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all disabled:opacity-50"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Accept Swap</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* OUTGOING / SENT REQUESTS TAB */}
      {activeTab === 'outgoing' && (
        <div className="space-y-4">
          {outgoing.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Send className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                You haven't sent any skill swap requests yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore your match dashboard, find a peer with complementary skills, and click "Connect" to send an invitation!
              </p>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                Find Matches Now
              </button>
            </div>
          ) : (
            outgoing.map(req => {
              const recipient = req.recipient || {};
              const isAccepted = req.status === 'accepted';
              const isPending = req.status === 'pending';

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={recipient.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${recipient.name || 'Recipient'}`}
                        alt={recipient.name}
                        className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          Sent to {recipient.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {recipient.college}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.status === 'pending' && (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Waiting for response</span>
                        </span>
                      )}
                      {req.status === 'accepted' && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Accepted!</span>
                        </span>
                      )}
                      {req.status === 'declined' && (
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl">
                          Declined
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Proposal */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-700">
                    <span className="font-bold text-slate-900">Exchange: </span>
                    {req.suggestedExchange}
                  </div>

                  {/* Contact info if accepted */}
                  {isAccepted && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center justify-between gap-2">
                      <span>Great news! {recipient.name} accepted your skill swap invitation.</span>
                      <a
                        href={`mailto:${recipient.contactEmail || 'student@univ.edu'}`}
                        className="font-bold text-emerald-700 underline"
                      >
                        {recipient.contactEmail || 'Email Recipient'}
                      </a>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
