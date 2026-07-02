import { useState } from 'react'
import './App.css'

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
const LOGIN_URL = API_BASE_URL ? `${API_BASE_URL}/api/login` : '/api/login'

async function hashPassword(value) {
  const encoder = new TextEncoder()
  const data = encoder.encode(value)
  const digest = await crypto.subtle.digest('SHA-256', data)

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function App() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [view, setView] = useState('login')

  const validate = () => {
    const nextErrors = {}

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email.'
    }

    if (!form.password.trim()) {
      nextErrors.password = 'Password is required.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (!validate()) {
      return
    }

    try {
      const passwordHash = await hashPassword(form.password)
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), password: passwordHash })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setMessage(data.message || 'Login failed.')
        setView('login')
        return
      }

      setView('dashboard')
      setMessage(data.message)
    } catch (error) {
      setView('login')
      setMessage('Unable to reach the server. Please try again.')
    }
  }

  if (view === 'dashboard') {
    return (
      <div className="page-shell dashboard-shell">
        <div className="dashboard-card">
          <p className="eyebrow">Netflix Clone</p>
          <h1>Welcome back</h1>
          <p className="dashboard-copy">You have successfully signed in to your dashboard.</p>
          <button
            type="button"
            onClick={() => {
              setView('login')
              setForm({ email: '', password: '' })
              setErrors({})
              setMessage('')
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="overlay" />
      <div className="login-card">
        <h1>Sign In</h1>
        <p className="subtitle">Watch anywhere. Cancel anytime.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => {
                setForm({ ...form, email: event.target.value })
                if (errors.email) setErrors({ ...errors, email: '' })
              }}
              placeholder="Enter your email"
            />
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => {
                setForm({ ...form, password: event.target.value })
                if (errors.password) setErrors({ ...errors, password: '' })
              }}
              placeholder="Enter your password"
            />
            {errors.password && <small>{errors.password}</small>}
          </label>

          <button type="submit">Sign In</button>
        </form>

        {message && <p className={`feedback ${view === 'dashboard' ? 'success' : 'error'}`}>{message}</p>}
      
      </div>
    </div>
  )
}

export default App
