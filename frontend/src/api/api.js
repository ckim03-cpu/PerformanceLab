const BASE = '/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  register: (email, password) =>
    request('POST', '/users', { email, password }),

  login: (email, password) =>
    request('POST', '/login', { email, password }),

  getHabits: () => request('GET', '/habits'),
  createHabit: (name) => request('POST', '/habits', { name }),
  updateHabit: (id, name) => request('PUT', `/habits/${id}`, { name }),
  deleteHabit: (id) => request('DELETE', `/habits/${id}`),
  logHabit: (habit_id) => request('POST', '/habit-log', { habit_id }),

  getWorkouts: () => request('GET', '/workouts'),
  createWorkout: (exercise, reps, weight) =>
    request('POST', '/workouts', { exercise, reps: Number(reps), weight: Number(weight) }),
  deleteWorkout: (id) => request('DELETE', `/workouts/${id}`),
}
