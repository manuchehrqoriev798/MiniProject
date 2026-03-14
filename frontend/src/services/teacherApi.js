const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch (_) {
    return null;
  }
}

function getTokenFromLoginResponse(data) {
  return data?.access_token || data?.token || data?.jwt || data?.accessToken || '';
}

function buildErrorMessage(status, data, fallback) {
  const fromBody = data?.detail || data?.message || data?.error;
  if (fromBody) {
    return String(fromBody);
  }

  if (status === 401) {
    return 'Invalid email or password.';
  }

  return fallback;
}

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

function normalizeQuestion(rawQuestion, index = 0) {
  const choices = rawQuestion?.choices || rawQuestion?.options || [];
  const correctAnswerRaw = rawQuestion?.correctAnswer ?? rawQuestion?.correct_answer ?? 0;

  let correctAnswer = Number(correctAnswerRaw);
  if (!Number.isFinite(correctAnswer)) {
    correctAnswer = choices.findIndex((choice) => choice === correctAnswerRaw);
    correctAnswer = correctAnswer >= 0 ? correctAnswer : 0;
  }

  return {
    id: String(rawQuestion?.id ?? rawQuestion?._id ?? `q-${index}`),
    questionText: rawQuestion?.questionText || rawQuestion?.question_text || rawQuestion?.text || '',
    choices: Array.isArray(choices) ? choices.slice(0, 4) : ['', '', '', ''],
    correctAnswer,
    order: Number(rawQuestion?.order ?? rawQuestion?.orderIndex ?? rawQuestion?.order_index ?? index + 1),
  };
}

export async function loginTeacherRequest({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(buildErrorMessage(response.status, data, 'Unable to login right now.'));
  }

  const token = getTokenFromLoginResponse(data);
  if (!token) {
    throw new Error('Login succeeded but JWT token was missing in response.');
  }

  return {
    token,
    email: data?.email || data?.user?.email || email,
  };
}

export async function getQuestionsRequest(token) {
  const response = await fetch(`${API_BASE_URL}/api/questions`, {
    method: 'GET',
    headers: authHeaders(token),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(buildErrorMessage(response.status, data, 'Failed to fetch questions.'));
  }

  const list = Array.isArray(data) ? data : data?.items || data?.questions || [];
  return list.map((question, index) => normalizeQuestion(question, index));
}

export async function createQuestionRequest(token, payload) {
  const response = await fetch(`${API_BASE_URL}/api/questions`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(buildErrorMessage(response.status, data, 'Failed to create question.'));
  }

  return normalizeQuestion(data || payload);
}

export async function updateQuestionRequest(token, questionId, payload) {
  const response = await fetch(`${API_BASE_URL}/api/questions/${questionId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(buildErrorMessage(response.status, data, 'Failed to update question.'));
  }

  return normalizeQuestion(data || { ...payload, id: questionId });
}

export async function deleteQuestionRequest(token, questionId) {
  const response = await fetch(`${API_BASE_URL}/api/questions/${questionId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(buildErrorMessage(response.status, data, 'Failed to delete question.'));
  }

  return true;
}
