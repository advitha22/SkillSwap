import React, { useState } from 'react';
import { X, Send, Copy, Check, Sparkles, Mail, Loader2 } from 'lucide-react';
import { sendExchangeRequest } from '../services/api';

export default function ConnectModal({ match, currentUser, onClose, onRequestSent }) {
  if (!match) return null;

  const { user, suggestedExchange, compatibility } = match;
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState(null);

  // Generate personalized greeting
  const defaultMessage = `Hi ${user.name}! 👋\n\nI discovered your profile on SkillSwap (we have a ${compatibility}% match!).\n\n${suggestedExchange}.\n\nWould you be open to setting up a 30-minute peer exchange session sometime this week?\n\nBest,\n${currentUser?.name || 'A fellow student'}`;

  const [message, setMessage] = useState(defaultMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    if (!currentUser?.id) {
      setSendError('Please make sure you have an active profile.');
      return;
    }
    setSending(true);
    setSendError(null);
    try {
      await sendExchangeRequest({
        fromUserId: currentUser.id,
        toUserId: user.id,
        message,
        suggestedExchange,
        compatibility
      });
      setSent(true);
      if (onRequestSent) onRequestSent();
    } catch (err) {
      setSendError(err.message || 'Failed to send request.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full bg-white border border-slate-200"
            />
            <div>
              <h3 className="font-bold text-slate-900 leading-tight">
                Connect with {user.name}
              </h3>
              <p className="text-xs text-slate-500">
                {user.college} • {compatibility}% Compatibility
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {sent ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">
                Exchange Request Sent!
              </h4>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                We've simulated notifying {user.name} at <span className="font-semibold text-slate-800">{user.contactEmail}</span>. They'll receive your proposed skill swap!
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Exchange Highlight */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-950 font-medium">
                <div className="flex items-center gap-1.5 text-indigo-700 font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Proposed Skill Swap</span>
                </div>
                {suggestedExchange}
              </div>

              {/* Message Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Personalized Message
                </label>
                <textarea
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs text-slate-800 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 resize-none font-sans"
                />
              </div>

              {/* Direct email display */}
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact Email:</span>
                <span className="font-medium text-slate-700">{user.contactEmail || `${user.name.toLowerCase().replace(/\s+/g, '.')}@college.edu`}</span>
              </div>

              {/* Error display if any */}
              {sendError && (
                <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {sendError}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={sending}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{sending ? 'Sending...' : 'Send Request'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
