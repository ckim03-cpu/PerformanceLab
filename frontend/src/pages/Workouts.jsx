import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2, Plus, AlertCircle } from 'lucide-react'
import { api } from '../api/api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default function Workouts() {
  const queryClient = useQueryClient()
  const [exercise, setExercise] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const { data: workouts = [], isLoading, error } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => api.getWorkouts().then(r => r.data || []),
  })

  const logMutation = useMutation({
    mutationFn: () => api.createWorkout(exercise.trim(), reps, weight || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
      setExercise('')
      setReps('')
      setWeight('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteWorkout(id),
    onMutate: (id) => setDeletingId(id),
    onSettled: () => {
      setDeletingId(null)
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (!exercise.trim() || !reps) return
    logMutation.mutate()
  }

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Workouts</h1>

      {/* Log a set */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Log a set</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="exercise" className="block text-sm font-medium text-gray-700 mb-1">
                Exercise
              </label>
              <Input
                id="exercise"
                placeholder="e.g. Squat, Bench Press, Deadlift..."
                value={exercise}
                onChange={e => setExercise(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="reps" className="block text-sm font-medium text-gray-700 mb-1">
                  Reps
                </label>
                <Input
                  id="reps"
                  type="number"
                  placeholder="0"
                  value={reps}
                  onChange={e => setReps(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight{' '}
                  <span className="text-gray-400 font-normal">(lbs, optional)</span>
                </label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="0"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={logMutation.isPending || !exercise.trim() || !reps}
              className="gap-1.5"
            >
              <Plus size={16} aria-hidden="true" />
              {logMutation.isPending ? 'Saving...' : 'Log set'}
            </Button>
            {logMutation.isError && (
              <p role="alert" className="text-red-500 text-sm">{logMutation.error.message}</p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div role="alert" className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} aria-hidden="true" />
              Failed to load workouts.
            </div>
          ) : isLoading ? (
            <div aria-label="Loading workouts" className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : workouts.length === 0 ? (
            <p className="text-gray-500 text-sm">No workouts logged yet. Log your first set above.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {workouts.map(w => (
                <li key={w.id} className="flex items-center gap-3 py-3">
                  <span className="flex-1 text-sm font-medium text-gray-900">{w.exercise}</span>
                  <Badge>{w.reps} reps</Badge>
                  {w.weight > 0 && <Badge>{w.weight} lbs</Badge>}
                  <span className="text-xs text-gray-400 min-w-[72px] text-right">
                    {new Date(w.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => deleteMutation.mutate(w.id)}
                    disabled={deletingId === w.id}
                    aria-label={`Delete ${w.exercise} set`}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
