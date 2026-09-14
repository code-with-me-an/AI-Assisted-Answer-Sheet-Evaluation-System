import icon from '../assets/Icon.svg'
import '../style/Login.css'

function Login({ onLogin }) {
    return (
        <div className="login-page">

            <header className="login-header">
                <div className="brand">
                    <span className="brand-icon">
                        <img src={icon} alt="AutoGrade" />
                    </span>

                    <span>AutoGrade</span>
                </div>

                <p className="tagline">
                    Precision in every evaluation.
                </p>
            </header>

            <main className="login-main">
                <section className="login-card">

                    <div className="login-card-header">
                        <h1>Welcome back</h1>

                        <p>
                            Access your teacher dashboard
                            and start evaluating.
                        </p>
                    </div>

                    <form
                        onSubmit={(event) => {
                            event.preventDefault()
                            onLogin()
                        }}
                    >

                        <div className="form-group">
                            <label htmlFor="email">
                                Institutional Email
                            </label>

                            <div className="input-wrapper">
                                <span className="input-icon">
                                    ✉
                                </span>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@university.edu"
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
                                    type="password"
                                    placeholder="••••••••"
                                />
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

                        <button
                            type="submit"
                            className="sign-in-button"
                        >
                            Sign In
                        </button>

                        <div className="divider">
                            <span></span>
                            <p>Or continue with</p>
                            <span></span>
                        </div>

                        <button
                            type="button"
                            className="sso-button"
                        >
                            <span>▦</span>
                            University ID (SSO)
                        </button>

                    </form>
                </section>
            </main>

            <footer className="login-footer">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#help">Help Center</a>
            </footer>

        </div>
    )
}

export default Login