/**
 * API Client for SkillSwap Backend
 */

const BASE_URL = '/api';

/**
 * Handle API responses and standardized error messages
 */
async function handleResponse(res) {
  if (!res.ok) {
    let errMessage = `HTTP error ${res.status}`;
    try {
      const errData = await res.json();
      errMessage = errData.message || errData.error || errMessage;
    } catch {
      // ignore json parse error on response failure
    }
    throw new Error(errMessage);
  }
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  const data = await handleResponse(res);
  return data.users || [];
}

export async function fetchUserById(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  const data = await handleResponse(res);
  return data.user;
}

export async function createUser(userData) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await handleResponse(res);
  return data.user;
}

export async function updateUser(id, userData) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await handleResponse(res);
  return data.user;
}

export async function resetSampleUsers() {
  const res = await fetch(`${BASE_URL}/users/reset`, {
    method: 'POST'
  });
  const data = await handleResponse(res);
  return data.users || [];
}

export async function matchSkills({ userId, profile }) {
  const res = await fetch(`${BASE_URL}/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, profile })
  });
  return handleResponse(res);
}

export async function checkServerHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return await handleResponse(res);
  } catch (err) {
    return { status: 'error', message: err.message };
  }
}

export async function fetchUserRequests(userId) {
  const res = await fetch(`${BASE_URL}/requests/user/${userId}`);
  return await handleResponse(res);
}

export async function sendExchangeRequest({ fromUserId, toUserId, message, suggestedExchange, compatibility }) {
  const res = await fetch(`${BASE_URL}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fromUserId, toUserId, message, suggestedExchange, compatibility })
  });
  return await handleResponse(res);
}

export async function updateRequestStatus(requestId, status) {
  const res = await fetch(`${BASE_URL}/requests/${requestId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return await handleResponse(res);
}

