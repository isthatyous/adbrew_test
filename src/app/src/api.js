const API_BASE_URL = 'http://localhost:8000';

async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export function fetchTodos() {
  return fetch(`${API_BASE_URL}/todos/`).then(handleResponse);
}

export function createTodo(text) {
  return fetch(`${API_BASE_URL}/todos/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  }).then(handleResponse);
}