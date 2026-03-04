import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('token')

  function logout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav>
      <NavLink to="/" className="brand">PerformanceLab</NavLink>
      {isLoggedIn ? (
        <>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/habits">Habits</NavLink>
          <NavLink to="/workouts">Workouts</NavLink>
          <button className="btn btn-primary" onClick={logout} style={{ marginLeft: 'auto' }}>
            Log out
          </button>
        </>
      ) : (
        <NavLink to="/login">Log in</NavLink>
      )}
    </nav>
  )
}
