import { useState } from 'react'
import icon from '../assets/Icon.svg'
import '../style/Login.css'
import { supabase } from '../lib/supabase'

function EyeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
            <circle cx="12" cy="12" r="2.5" />
        </svg>
    )
}

function EyeOffIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M17.94 17.94A10.6 10.6 0 0 1 12 20c-6.5 0-10-8-10-8a17.8 17.8 0 0 1 4.06-5.06" />
            <path d="M9.9 4.24A10.6 10.6 0 0 1 12 4c6.5 0 10 8 10 8a17.8 17.8 0 0 1-3.17 4.19" />
            <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
            <line x1="2" y1="2" x2="22" y2="22" />
        </svg>
    )
}

function Login({ onLogin }) {
    const [showPassword, setShowPassword] = useState(false)
    const [isSignup, setIsSignup] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        setError('')
        setNotice('')

        if (!email.trim() || !password || (isSignup && !name.trim())) {
            setError(isSignup ? 'Please enter your name, email, and password.' : 'Please enter your email and password.')
            return
        }

        try {
            setLoading(true)

            const { data, error: loginError } = isSignup
                ? await supabase.auth.signUp({
                    email: email.trim(),
                    password,
                    options: { data: { name: name.trim() } },
                })
                : await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                })

            if (loginError) {
                setError(loginError.message)
                return
            }

            if (data?.session?.user) {
                onLogin(data.user)
            } else if (data?.user) {
                setNotice('Account created. Check your email to confirm your account, then sign in.')
                setIsSignup(false)
            }
        } catch (err) {
            console.error('Login error:', err)
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <header className="login-header">
                <div className="brand">
                    <span className="brand-icon">
                        <img src={icon} alt="AutoGrade" />
                    </span>

                    <span>AutoGrade</span>
                </div>
            </header>

            <main className="login-main">
                <section className="login-card">
                    <div className="login-card-header">
                        <h1>{isSignup ? 'Create your account' : 'Welcome back'}</h1>

                        <p>
                            {isSignup ? 'Start using your teaching workspace.' : 'Sign in to your teaching workspace and continue evaluating.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">👤</span>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        autoComplete="name"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="email">
                                Email
                            </label>

                            <div className="input-wrapper">
                                <span className="input-icon">
                                    ✉
                                </span>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="password-label-row">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="forgot-password"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <div className="input-wrapper">
                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) => !value
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                    aria-pressed={showPassword}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon />
                                    ) : (
                                        <EyeIcon />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="remember-row">
                            <input
                                type="checkbox"
                                id="remember"
                            />

                            <label htmlFor="remember">
                                Remember this device
                            </label>
                        </div>

                        {error && (
                            <p className="login-error">
                                {error}
                            </p>
                        )}

                        {notice && <p className="login-error">{notice}</p>}

                        <button
                            type="submit"
                            className="sign-in-button"
                            disabled={loading}
                        >
                            {loading ? (isSignup ? 'Creating Account...' : 'Signing In...') : (isSignup ? 'Create Account' : 'Sign In')}
                        </button>

                        <p className="signup-prompt">
                            {isSignup ? 'Already have an account? ' : "Don't have an account? "}

                            <button
                                type="button"
                                className="signup-link"
                                onClick={() => {
                                    setIsSignup((value) => !value)
                                    setError('')
                                    setNotice('')
                                }}
                            >
                                {isSignup ? 'Sign in' : 'Create one'}
                            </button>
                        </p>
                    </form>
                </section>
            </main>
        </div>
    )
}

export default Login
