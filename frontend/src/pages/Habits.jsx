import { useEffect, useState } from 'react'
import { api } from '../api/api'

export default function Habits() {
  const [habits, setHabits] = useState([])
  const [logged, setLogged] = useState(new Set())
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.getHabits().then(r => setHabits(r.data || [])).catch(() => {})
  }, [])

  async function addHabit(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setError('')
    try {
      const res = await api.createHabit(newName.trim())
      setHabits(prev => [res.data, ...prev])
      setNewName('')
    } catch (err) {
      setError(err.message)
    }
  }

  async function markDone(habit) {
    if (logged.has(habit.id)) return
    try {
      await api.logHabit(habit.id)
      setLogged(prev => new Set([...prev, habit.id]))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <h1>Habits</h1>

      <div className="card">
        <h2>Add a habit</h2>
        {error && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</p>}
        <form onSubmit={addHabit} className="form-row">
          <input
            placeholder="e.g. Morning run"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
      </div>

      <div className="card">
        <h2>Today's habits</h2>
        {habits.length === 0
          ? <p style={{ color: '#888' }}>No habits yet. Add one above.</p>
          : (
            <ul className="habit-list">
              {habits.map(h => (
                <li key={h.id}>
                  <span style={{ flex: 1 }}>{h.name}</span>
                  <button
                    className={`btn ${logged.has(h.id) ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => markDone(h)}
                    disabled={logged.has(h.id)}
                  >
                    {logged.has(h.id) ? 'Done ✓' : 'Mark done'}
                  </button>
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </div>
  )
}
