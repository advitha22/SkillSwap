import React, { useState, useEffect } from 'react';
import SkillBadge from '../components/SkillBadge';
import { createUser, updateUser } from '../services/api';
import {
  NEUTRAL_AVATARS,
  generateAvatar
} from '../utils/avatar';
import {
  User,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Mail,
  UserPlus,
  Smile
} from 'lucide-react';

export default function ProfilePage({ currentUser, setCurrentUser, onProfileSaved, setCurrentPage }) {
  const [isEditingExisting, setIsEditingExisting] = useState(true);

  // Form fields
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Female'); // 'Male', 'Female', 'Other'
  const [college, setCollege] = useState('');
  const [bio, setBio] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Selected Profile Picture / Avatar
  const [selectedAvatar, setSelectedAvatar] = useState(
    currentUser?.avatar || NEUTRAL_AVATARS[0].url
  );

  // Skills lists
  const [canTeach, setCanTeach] = useState([]);
  const [wantsToLearn, setWantsToLearn] = useState([]);

  // New skill input temporary fields
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newTeachLevel, setNewTeachLevel] = useState('Intermediate');
  const [newTeachDesc, setNewTeachDesc] = useState('');

  const [newLearnSkill, setNewLearnSkill] = useState('');
  const [newLearnLevel, setNewLearnLevel] = useState('Beginner');
  const [newLearnDesc, setNewLearnDesc] = useState('');

  // Status
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Populate from currentUser on load
  useEffect(() => {
    if (currentUser && isEditingExisting) {
      setName(currentUser.name || '');
      const userGender = currentUser.gender === 'Male' ? 'Male' : currentUser.gender === 'Other' ? 'Other' : 'Female';
      setGender(userGender);
      setCollege(currentUser.college || '');
      setBio(currentUser.bio || '');
      setContactEmail(currentUser.contactEmail || '');
      setCanTeach(currentUser.canTeach || []);
      setWantsToLearn(currentUser.wantsToLearn || []);
      setSelectedAvatar(currentUser.avatar || NEUTRAL_AVATARS[0].url);
    }
  }, [currentUser, isEditingExisting]);

  const handleStartNewProfile = () => {
    setIsEditingExisting(false);
    setName('');
    setGender('Female');
    setCollege('');
    setBio('');
    setContactEmail('');
    setCanTeach([]);
    setWantsToLearn([]);
    setSelectedAvatar(NEUTRAL_AVATARS[0].url);
    setFormError(null);
    setSuccessMessage(null);
  };

  const handleSwitchToCurrent = () => {
    setIsEditingExisting(true);
    if (currentUser) {
      setName(currentUser.name);
      const userGender = currentUser.gender === 'Male' ? 'Male' : currentUser.gender === 'Other' ? 'Other' : 'Female';
      setGender(userGender);
      setCollege(currentUser.college);
      setBio(currentUser.bio);
      setContactEmail(currentUser.contactEmail);
      setCanTeach(currentUser.canTeach || []);
      setWantsToLearn(currentUser.wantsToLearn || []);
      setSelectedAvatar(currentUser.avatar || NEUTRAL_AVATARS[0].url);
    }
  };

  // Add teach skill
  const handleAddTeachSkill = (e) => {
    e.preventDefault();
    if (!newTeachSkill.trim()) return;
    setCanTeach(prev => [
      ...prev,
      {
        skill: newTeachSkill.trim(),
        level: newTeachLevel,
        description: newTeachDesc.trim() || undefined
      }
    ]);
    setNewTeachSkill('');
    setNewTeachDesc('');
  };

  // Add learn skill
  const handleAddLearnSkill = (e) => {
    e.preventDefault();
    if (!newLearnSkill.trim()) return;
    setWantsToLearn(prev => [
      ...prev,
      {
        skill: newLearnSkill.trim(),
        level: newLearnLevel,
        description: newLearnDesc.trim() || undefined
      }
    ]);
    setNewLearnSkill('');
    setNewLearnDesc('');
  };

  // Submit profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!college.trim()) {
      setFormError('Please enter your college or university.');
      return;
    }
    if (canTeach.length === 0) {
      setFormError('Please add at least one skill you can teach.');
      return;
    }
    if (wantsToLearn.length === 0) {
      setFormError('Please add at least one skill you want to learn.');
      return;
    }

    setIsSaving(true);
    try {
      const profileData = {
        name: name.trim(),
        gender,
        college: college.trim(),
        avatar: selectedAvatar,
        bio: bio.trim(),
        contactEmail: contactEmail.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@student.edu`,
        canTeach,
        wantsToLearn
      };

      let savedUser = null;
      if (isEditingExisting && currentUser?.id) {
        savedUser = await updateUser(currentUser.id, profileData);
      } else {
        savedUser = await createUser(profileData);
      }

      setSuccessMessage('Profile saved successfully! Redirecting to your matches...');
      onProfileSaved(savedUser);

      // Auto redirect to dashboard after 1 second
      setTimeout(() => {
        setCurrentPage('dashboard');
      }, 1000);
    } catch (err) {
      setFormError(err.message || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // Find character name of active avatar
  const activeCharacter = NEUTRAL_AVATARS.find(av => av.url === selectedAvatar);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Profile Setup
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {isEditingExisting ? `Edit Profile: ${currentUser?.name || ''}` : 'Create New Student Profile'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify your details, select your gender, and choose a neutral character avatar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isEditingExisting ? (
              <button
                type="button"
                onClick={handleStartNewProfile}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create New Persona</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSwitchToCurrent}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Back to {currentUser?.name || 'Current'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Success or Error banners */}
        {formError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-2 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2 text-xs text-emerald-800">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Basic Information</span>
          </h2>

          {/* Active Selected Avatar Hero Card */}
          <div className="bg-gradient-to-r from-slate-50 via-indigo-50/40 to-teal-50/30 border border-slate-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <img
                src={selectedAvatar}
                alt="Selected Avatar"
                className="w-20 h-20 rounded-2xl bg-white border-2 border-indigo-300 shadow-md object-cover p-1"
              />
              <span className="absolute -bottom-2 -right-2 text-xs bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full shadow-sm">
                Active
              </span>
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h4 className="text-sm font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
                <span>{activeCharacter ? activeCharacter.name : 'Selected Avatar'}</span>
                {activeCharacter && (
                  <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full">
                    {activeCharacter.badge}
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500">
                Choose any of the 5 neutral character avatars below to represent your profile picture.
              </p>
            </div>
          </div>

          {/* Name & Gender inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Taylor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Gender Selection: Male, Female, Other */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* College & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College or University *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Institute of Technology"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student Email (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. student@college.edu"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Bio / Major
            </label>
            <input
              type="text"
              placeholder="e.g. Sophomore CS major, love hackathons & debate club"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* NEUTRAL CHARACTER AVATAR PICKER (5 Choices) */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-indigo-600" />
                <span>Select Profile Picture (5 Neutral Characters)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose one of the 5 character avatars below to set as your profile picture:
              </p>
            </div>

            {/* Grid of the 5 Neutral Avatars */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              {NEUTRAL_AVATARS.map(av => {
                const isSelected = selectedAvatar === av.url;
                return (
                  <div
                    key={av.id}
                    onClick={() => setSelectedAvatar(av.url)}
                    className={`relative p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 group ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-md ring-2 ring-indigo-500/20'
                        : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-100/80'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                    <img
                      src={av.url}
                      alt={av.name}
                      className="w-14 h-14 rounded-xl bg-white shadow-sm object-cover group-hover:scale-105 transition-transform p-1"
                    />
                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-800 block leading-tight">
                        {av.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {av.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Skills I Can Teach Section */}
        <div className="bg-white rounded-3xl border border-teal-200/80 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-teal-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-teal-600" />
                <span>Skills I Can Teach ({canTeach.length})</span>
              </h2>
              <p className="text-xs text-teal-700/80 mt-0.5">
                Add skills you feel comfortable sharing or tutoring others in.
              </p>
            </div>
          </div>

          {/* Current Teach Skill Badges */}
          <div className="flex flex-wrap gap-2 min-h-10 p-3 bg-teal-50/50 rounded-2xl border border-teal-100">
            {canTeach.length === 0 ? (
              <span className="text-xs text-teal-600/70 italic">No skills added yet. Use the input below to add at least one!</span>
            ) : (
              canTeach.map((s, idx) => (
                <SkillBadge
                  key={idx}
                  skill={s}
                  type="teach"
                  onRemove={() => setCanTeach(canTeach.filter((_, i) => i !== idx))}
                />
              ))
            )}
          </div>

          {/* Add Teach Skill Sub-Form */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">
              + Add a Skill You Can Teach
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="e.g. Python Programming, Canva Design, Public Speaking..."
                  value={newTeachSkill}
                  onChange={(e) => setNewTeachSkill(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <select
                  value={newTeachLevel}
                  onChange={(e) => setNewTeachLevel(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Optional notes: e.g. Data structures, scripting, clean code basics"
                value={newTeachDesc}
                onChange={(e) => setNewTeachDesc(e.target.value)}
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-teal-500"
              />

              <button
                type="button"
                onClick={handleAddTeachSkill}
                className="shrink-0 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>

        {/* Skills I Want To Learn Section */}
        <div className="bg-white rounded-3xl border border-indigo-200/80 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-indigo-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Skills I Want to Learn ({wantsToLearn.length})</span>
              </h2>
              <p className="text-xs text-indigo-700/80 mt-0.5">
                Skills, tools, or subjects you are looking for a peer to mentor you in.
              </p>
            </div>
          </div>

          {/* Current Learn Skill Badges */}
          <div className="flex flex-wrap gap-2 min-h-10 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100">
            {wantsToLearn.length === 0 ? (
              <span className="text-xs text-indigo-600/70 italic">No learning goals added yet. Use the input below to add at least one!</span>
            ) : (
              wantsToLearn.map((s, idx) => (
                <SkillBadge
                  key={idx}
                  skill={s}
                  type="learn"
                  onRemove={() => setWantsToLearn(wantsToLearn.filter((_, i) => i !== idx))}
                />
              ))
            )}
          </div>

          {/* Add Learn Skill Sub-Form */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">
              + Add a Skill You Want to Learn
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="e.g. UI/UX Design with Figma, Video Editing, Guitar..."
                  value={newLearnSkill}
                  onChange={(e) => setNewLearnSkill(e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <select
                  value={newLearnLevel}
                  onChange={(e) => setNewLearnLevel(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="Beginner">Beginner (Starting out)</option>
                  <option value="Intermediate">Intermediate (Leveling up)</option>
                  <option value="Advanced">Advanced (Mastery)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Optional notes: e.g. Want to learn wireframing and interactive prototypes"
                value={newLearnDesc}
                onChange={(e) => setNewLearnDesc(e.target.value)}
                className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={handleAddLearnSkill}
                className="shrink-0 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => setCurrentPage('dashboard')}
            className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSaving ? 'Saving Profile...' : 'Save Profile & Find Matches'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
