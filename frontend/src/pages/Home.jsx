import { Link } from 'react-router-dom'
import { Activity, CheckSquare, Dumbbell, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/button'

const features = [
  {
    icon: CheckSquare,
    title: 'Track Daily Habits',
    description: 'Build streaks by logging your daily habits with one tap.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
  },
  {
    icon: Dumbbell,
    title: 'Log Workouts',
    description: 'Record every set — exercise, reps, and weight — in seconds.',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  {
    icon: TrendingUp,
    title: 'See Your Progress',
    description: 'A dashboard that shows everything you\'ve accomplished.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
]

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-56px)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 py-24 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          <Activity size={12} />
          Your personal performance tracker
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 max-w-xl mx-auto leading-tight">
          Track every rep.<br />Build every habit.
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
          Log daily habits, workout sessions, and productivity metrics — all in one clean dashboard.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/login">Get started free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
          Everything you need to perform at your best
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${bg} mb-4`}>
                <Icon size={20} className={color} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
