import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/api'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const res = mode === 'login'
        ? await api.login(email, password)
        : await api.register(email, password)
      localStorage.setItem('token', res.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 420 }}>
      <div className="card">
        <h2>{mode === 'login' ? 'Log in' : 'Create account'}</h2>
        {error && <p style={{ color: 'red', marginBottom: '0.75rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            {mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#555' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            className="btn"
            style={{ background: 'none', padding: 0, color: '#111', textDecoration: 'underline' }}
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  )
}
