import React from 'react';

export default function SkillBadge({ skill, type = 'teach', onRemove }) {
  const skillName = typeof skill === 'string' ? skill : skill.skill;
  const level = typeof skill === 'object' ? skill.level : null;

  const isTeach = type === 'teach';

  const bgStyle = isTeach
    ? 'bg-teal-50 border-teal-200 text-teal-800'
    : 'bg-indigo-50 border-indigo-200 text-indigo-800';

  const dotColor = isTeach ? 'bg-teal-500' : 'bg-indigo-500';

  const levelBadge = level ? (
    <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
      isTeach ? 'bg-teal-100 text-teal-700' : 'bg-indigo-100 text-indigo-700'
    }`}>
      {level}
    </span>
  ) : null;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm ${bgStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      <span>{skillName}</span>
      {levelBadge}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
          title="Remove skill"
        >
          ×
        </button>
      )}
    </span>
  );
}
