import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SAMPLE_USERS_FILE = path.join(DATA_DIR, 'sampleUsers.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'requests.json');

const INITIAL_SAMPLE_REQUESTS = [
  {
    id: "req-1",
    fromUserId: "user-2",
    toUserId: "user-1",
    suggestedExchange: "Rahul teaches you UI/UX Design & Figma ↔ You teach Rahul Python Programming",
    compatibility: 94,
    message: "Hi Ananya! 👋 I saw on SkillSwap that you are proficient in Python and want to learn UI/UX design. I'd love to teach you Figma prototyping in exchange for some Python lessons. Let's do an exchange session this week!",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

/**
 * Ensure data directory and files exist.
 */
export async function initializeDataStore() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(USERS_FILE);
    } catch {
      const sampleData = await fs.readFile(SAMPLE_USERS_FILE, 'utf-8');
      await fs.writeFile(USERS_FILE, sampleData, 'utf-8');
      console.log('🌱 Initialized users.json from sample data.');
    }

    try {
      await fs.access(REQUESTS_FILE);
    } catch {
      await fs.writeFile(REQUESTS_FILE, JSON.stringify(INITIAL_SAMPLE_REQUESTS, null, 2), 'utf-8');
      console.log('🌱 Initialized requests.json.');
    }
  } catch (err) {
    console.error('Error initializing data store:', err);
  }
}

/**
 * Get all users from the JSON database.
 */
export async function getAllUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading users.json, falling back to sample:', err);
    const rawSample = await fs.readFile(SAMPLE_USERS_FILE, 'utf-8');
    return JSON.parse(rawSample);
  }
}

/**
 * Get single user by ID.
 */
export async function getUserById(id) {
  const users = await getAllUsers();
  return users.find(u => u.id === id) || null;
}

/**
 * Save user list safely to disk.
 */
export async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export function generateAvatar(name, gender) {
  const seed = encodeURIComponent((name || 'Student').trim());
  if (gender === 'Female') {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&facialHairProbability=0&top=longHairCurly,longHairBob,longHairStraight,longHairCurvy,longHairMia,longHairNotTooLong,longHairStraight2`;
  }
  if (gender === 'Male') {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&top=shortHairShortFlat,shortHairTheCaesar,shortHairShortWaved,shortHairSides,shortHairShortCurly`;
  }
  // Neutral character avatar for 'Other'
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&colors=indigo,teal,amber`;
}

/**
 * Create a new user profile.
 */
export async function createUser(userData) {
  const users = await getAllUsers();
  const newId = `user-${Date.now()}`;
  const gender = userData.gender || 'Other';
  const avatar = userData.avatar || generateAvatar(userData.name, gender);

  const newUser = {
    id: newId,
    name: userData.name || 'Anonymous Student',
    gender,
    college: userData.college || 'University',
    avatar,
    bio: userData.bio || '',
    canTeach: userData.canTeach || [],
    wantsToLearn: userData.wantsToLearn || [],
    contactEmail: userData.contactEmail || '',
    createdAt: new Date().toISOString()
  };

  users.unshift(newUser);
  await saveUsers(users);
  return newUser;
}

/**
 * Update an existing user profile.
 */
export async function updateUser(id, updateData) {
  const users = await getAllUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;

  const current = users[index];
  const updatedGender = updateData.gender !== undefined ? updateData.gender : current.gender;
  
  // Use explicitly provided avatar, or regenerate if gender changed without explicit avatar
  let updatedAvatar = updateData.avatar;
  if (!updatedAvatar) {
    if (updateData.gender && updateData.gender !== current.gender) {
      updatedAvatar = generateAvatar(updateData.name || current.name, updatedGender);
    } else {
      updatedAvatar = current.avatar;
    }
  }

  users[index] = {
    ...current,
    ...updateData,
    gender: updatedGender,
    avatar: updatedAvatar,
    id // preserve original ID
  };

  await saveUsers(users);
  return users[index];
}

/**
 * Reset users.json back to the pristine sample set.
 */
export async function resetToSample() {
  const sampleData = await fs.readFile(SAMPLE_USERS_FILE, 'utf-8');
  await fs.writeFile(USERS_FILE, sampleData, 'utf-8');
  await fs.writeFile(REQUESTS_FILE, JSON.stringify(INITIAL_SAMPLE_REQUESTS, null, 2), 'utf-8');
  return JSON.parse(sampleData);
}

// ==========================================
// EXCHANGE REQUESTS METHODS
// ==========================================

export async function getAllRequests() {
  try {
    const raw = await fs.readFile(REQUESTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export async function saveRequests(requests) {
  await fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2), 'utf-8');
}

/**
 * Get all incoming and outgoing requests for a specific user,
 * enriched with sender and receiver details.
 */
export async function getRequestsForUser(userId) {
  const [requests, users] = await Promise.all([
    getAllRequests(),
    getAllUsers()
  ]);

  const userMap = new Map(users.map(u => [u.id, u]));

  const incoming = requests
    .filter(r => r.toUserId === userId)
    .map(r => ({
      ...r,
      sender: userMap.get(r.fromUserId) || { name: 'Unknown Student', college: 'Campus' }
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const outgoing = requests
    .filter(r => r.fromUserId === userId)
    .map(r => ({
      ...r,
      recipient: userMap.get(r.toUserId) || { name: 'Unknown Student', college: 'Campus' }
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return { incoming, outgoing };
}

/**
 * Create a new skill exchange request.
 */
export async function createRequest({ fromUserId, toUserId, message, suggestedExchange, compatibility }) {
  const requests = await getAllRequests();
  
  // Check if a pending request already exists between these two
  const existing = requests.find(r => r.fromUserId === fromUserId && r.toUserId === toUserId && r.status === 'pending');
  if (existing) {
    return existing;
  }

  const newReq = {
    id: `req-${Date.now()}`,
    fromUserId,
    toUserId,
    message: message || 'I would love to connect for a skill exchange!',
    suggestedExchange: suggestedExchange || 'Skill Exchange',
    compatibility: compatibility || 85,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  requests.unshift(newReq);
  await saveRequests(requests);
  return newReq;
}

/**
 * Update request status ('accepted' or 'declined').
 */
export async function updateRequestStatus(requestId, status) {
  const requests = await getAllRequests();
  const index = requests.findIndex(r => r.id === requestId);
  if (index === -1) return null;

  requests[index].status = status;
  requests[index].updatedAt = new Date().toISOString();
  await saveRequests(requests);
  return requests[index];
}
