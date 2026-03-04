import { useEffect, useState } from 'react'
import { api } from '../api/api'

export default function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [exercise, setExercise] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.getWorkouts().then(r => setWorkouts(r.data || [])).catch(() => {})
  }, [])

  async function logWorkout(e) {
    e.preventDefault()
    if (!exercise.trim() || !reps) return
    setError('')
    try {
      const res = await api.createWorkout(exercise.trim(), reps, weight || 0)
      setWorkouts(prev => [res.data, ...prev])
      setExercise('')
      setReps('')
      setWeight('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <h1>Workouts</h1>

      <div className="card">
        <h2>Log a set</h2>
        {error && <p style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</p>}
        <form onSubmit={logWorkout}>
          <input
            placeholder="Exercise (e.g. Squat)"
            value={exercise}
            onChange={e => setExercise(e.target.value)}
            required
          />
          <div className="form-row">
            <input
              type="number"
              placeholder="Reps"
              value={reps}
              onChange={e => setReps(e.target.value)}
              min="1"
              required
            />
            <input
              type="number"
              placeholder="Weight (lbs)"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              min="0"
              step="0.5"
            />
          </div>
          <button type="submit" className="btn btn-primary">Log set</button>
        </form>
      </div>

      <div className="card">
        <h2>History</h2>
        {workouts.length === 0
          ? <p style={{ color: '#888' }}>No workouts logged yet.</p>
          : (
            <ul className="workout-list">
              {workouts.map(w => (
                <li key={w.id}>
                  <span style={{ flex: 1 }}>{w.exercise}</span>
                  <span className="tag">{w.reps} reps</span>
                  <span className="tag">{w.weight} lbs</span>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>
                    {new Date(w.created_at || w.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </div>
  )
}
