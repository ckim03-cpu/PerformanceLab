import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="hero">
      <h1>Track your performance.</h1>
      <p>
        Log daily habits, workout sessions, and productivity metrics — all in one simple dashboard.
      </p>
      <div className="cta-row">
        <Link to="/login" className="btn btn-primary">Get started</Link>
      </div>
    </div>
  )
}
