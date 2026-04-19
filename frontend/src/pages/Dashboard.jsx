import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Activity, Dumbbell, ChevronRight, AlertCircle } from 'lucide-react'
import { api } from '../api/api'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default function Dashboard() {
  const { data: habits = [], isLoading: habitsLoading, error: habitsError } = useQuery({
    queryKey: ['habits'],
    queryFn: () => api.getHabits().then(r => r.data || []),
  })

  const { data: workouts = [], isLoading: workoutsLoading, error: workoutsError } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => api.getWorkouts().then(r => r.data || []),
  })

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">{today}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">Active Habits</span>
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Activity size={16} className="text-indigo-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-3">
              {habitsLoading ? <span className="text-gray-300">—</span> : habits.length}
            </div>
            <Link
              to="/habits"
              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Manage habits <ChevronRight size={14} />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">Sets Logged</span>
              <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center">
                <Dumbbell size={16} className="text-violet-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-3">
              {workoutsLoading ? <span className="text-gray-300">—</span> : workouts.length}
            </div>
            <Link
              to="/workouts"
              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Log workout <ChevronRight size={14} />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent workouts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent workouts</CardTitle>
            <Link to="/workouts" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View all →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {workoutsError ? (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              Failed to load workouts.
            </div>
          ) : workoutsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : workouts.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No workouts yet.{' '}
              <Link to="/workouts" className="text-indigo-600 hover:underline">Log one →</Link>
            </p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {workouts.slice(0, 5).map(w => (
                <li key={w.id} className="flex items-center gap-3 py-3">
                  <span className="flex-1 text-sm font-medium text-gray-900">{w.exercise}</span>
                  <Badge>{w.reps} reps</Badge>
                  {w.weight > 0 && <Badge>{w.weight} lbs</Badge>}
                  <span className="text-xs text-gray-400">
                    {new Date(w.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
