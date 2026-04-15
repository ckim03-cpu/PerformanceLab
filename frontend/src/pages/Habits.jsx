import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2, Check, Plus, AlertCircle } from 'lucide-react'
import { api } from '../api/api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'

export default function Habits() {
  const queryClient = useQueryClient()
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [logged, setLogged] = useState(new Set())

  const { data: habits = [], isLoading, error } = useQuery({
    queryKey: ['habits'],
    queryFn: () => api.getHabits().then(r => r.data || []),
  })

  const addMutation = useMutation({
    mutationFn: (name) => api.createHabit(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      setNewName('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, name }) => api.updateHabit(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteHabit(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  })

  const logMutation = useMutation({
    mutationFn: (id) => api.logHabit(id),
    onSuccess: (_, id) => setLogged(prev => new Set([...prev, id])),
  })

  function startEdit(habit) {
    setEditingId(habit.id)
    setEditName(habit.name)
  }

  function submitEdit(e) {
    e.preventDefault()
    if (!editName.trim()) return
    updateMutation.mutate({ id: editingId, name: editName.trim() })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Habits</h1>

      {/* Add habit */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add a habit</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (newName.trim()) addMutation.mutate(newName.trim())
            }}
            className="flex gap-3"
          >
            <Input
              placeholder="e.g. Morning run, Read 30 minutes..."
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={addMutation.isPending || !newName.trim()}
              className="gap-1.5 shrink-0"
            >
              <Plus size={16} />
              Add habit
            </Button>
          </form>
          {addMutation.isError && (
            <p className="text-red-500 text-sm mt-2">{addMutation.error.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Habits list */}
      <Card>
        <CardHeader>
          <CardTitle>Today's habits</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              Failed to load habits.
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : habits.length === 0 ? (
            <p className="text-gray-500 text-sm">No habits yet. Add one above to get started.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {habits.map(h => (
                <li key={h.id} className="flex items-center gap-3 py-3">
                  {editingId === h.id ? (
                    <form onSubmit={submitEdit} className="flex-1 flex items-center gap-2">
                      <Input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="flex-1"
                        autoFocus
                      />
                      <Button type="submit" size="sm" disabled={updateMutation.isPending}>
                        Save
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </form>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-gray-900">{h.name}</span>

                      <button
                        onClick={() => startEdit(h)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                        title="Rename"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() => deleteMutation.mutate(h.id)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>

                      <Button
                        size="sm"
                        variant={logged.has(h.id) ? 'success' : 'default'}
                        onClick={() => logMutation.mutate(h.id)}
                        disabled={logged.has(h.id) || logMutation.isPending}
                        className="gap-1.5 min-w-[100px]"
                      >
                        {logged.has(h.id) ? (
                          <><Check size={14} /> Done</>
                        ) : (
                          'Mark done'
                        )}
                      </Button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
