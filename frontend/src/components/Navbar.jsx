import { NavLink, useNavigate } from 'react-router-dom'
import { Activity } from 'lucide-react'

export default function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('token')

  function logout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-white font-bold text-base mr-4"
        >
          <Activity size={20} className="text-indigo-400" />
          PerformanceLab
        </NavLink>

        {isLoggedIn ? (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/habits"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`
              }
            >
              Habits
            </NavLink>
            <NavLink
              to="/workouts"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`
              }
            >
              Workouts
            </NavLink>
            <button
              onClick={logout}
              className="ml-auto text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Log out
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className="ml-auto text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Log in
          </NavLink>
        )}
      </div>
    </nav>
  )
}
