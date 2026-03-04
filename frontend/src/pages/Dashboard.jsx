import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/api'

export default function Dashboard() {
  const [habits, setHabits] = useState([])
  const [workouts, setWorkouts] = useState([])

  useEffect(() => {
    api.getHabits().then(r => setHabits(r.data || [])).catch(() => {})
    api.getWorkouts().then(r => setWorkouts(r.data || [])).catch(() => {})
  }, [])

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p style={{ color: '#555', marginBottom: '2rem' }}>{today}</p>

      <div className="grid-2">
        <div className="card">
          <h2>Habits</h2>
          <div className="stat">{habits.length}</div>
          <div className="stat-label">active habits</div>
          <Link to="/habits" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Manage habits →
          </Link>
        </div>

        <div className="card">
          <h2>Workouts</h2>
          <div className="stat">{workouts.length}</div>
          <div className="stat-label">sets logged</div>
          <Link to="/workouts" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Log workout →
          </Link>
        </div>
      </div>

      <div className="card">
        <h2>Recent workouts</h2>
        {workouts.length === 0
          ? <p style={{ color: '#888' }}>No workouts yet. <Link to="/workouts">Log one →</Link></p>
          : (
            <ul className="workout-list">
              {workouts.slice(0, 5).map(w => (
                <li key={w.id}>
                  <span style={{ flex: 1 }}>{w.exercise}</span>
                  <span className="tag">{w.reps} reps</span>
                  <span className="tag">{w.weight} lbs</span>
                </li>
              ))}
            </ul>
          )
        }
      </div>
    </div>
  )
}
