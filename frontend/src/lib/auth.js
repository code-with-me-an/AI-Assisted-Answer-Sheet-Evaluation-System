const TOKEN_KEY = 'autograde_auth_token'
const USER_KEY = 'autograde_auth_user'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

const listeners = new Set()

function notifyListeners(event, session) {
    listeners.forEach((listener) => {
        try {
            listener(event, session)
        } catch (e) {
            console.error('Auth listener error:', e)
        }
    })
}

export const auth = {
    getToken() {
        return localStorage.getItem(TOKEN_KEY)
    },

    getUser() {
        const stored = localStorage.getItem(USER_KEY)
        try {
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    },

    async getSession() {
        const token = this.getToken()
        const user = this.getUser()
        if (token && user) {
            return {
                data: {
                    session: {
                        access_token: token,
                        user,
                    },
                    user,
                },
                error: null,
            }
        }
        return { data: { session: null, user: null }, error: null }
    },

    async signUp({ email, password, name = '', options = {} }) {
        const teacherName = name || options?.data?.name || ''
        try {
            const res = await fetch(`${apiBaseUrl}/api/auth/signup/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name: teacherName }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                const message = data.detail || (typeof data === 'object' ? Object.values(data).flat().join(' ') : 'Sign up failed.')
                return { data: null, error: { message } }
            }

            const token = data.token
            const user = data.user || { email, name: teacherName }
            localStorage.setItem(TOKEN_KEY, token)
            localStorage.setItem(USER_KEY, JSON.stringify(user))

            const session = { access_token: token, user }
            notifyListeners('SIGNED_IN', session)
            return {
                data: {
                    user,
                    session,
                },
                error: null,
            }
        } catch (err) {
            return { data: null, error: { message: err.message || 'Network error during signup.' } }
        }
    },

    async signInWithPassword({ email, password }) {
        try {
            const res = await fetch(`${apiBaseUrl}/api/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                const message = data.detail || (typeof data === 'object' ? Object.values(data).flat().join(' ') : 'Invalid credentials.')
                return { data: null, error: { message } }
            }

            const token = data.token
            const user = data.user || { email, name: data.teacher?.name || '' }
            localStorage.setItem(TOKEN_KEY, token)
            localStorage.setItem(USER_KEY, JSON.stringify(user))

            const session = { access_token: token, user }
            notifyListeners('SIGNED_IN', session)
            return {
                data: {
                    user,
                    session,
                },
                error: null,
            }
        } catch (err) {
            return { data: null, error: { message: err.message || 'Network error during login.' } }
        }
    },

    async signOut() {
        const token = this.getToken()
        if (token) {
            try {
                await fetch(`${apiBaseUrl}/api/auth/logout/`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
            } catch {
                // Ignore network failure on logout
            }
        }
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        notifyListeners('SIGNED_OUT', null)
        return { error: null }
    },

    async updateUser({ password }) {
        const token = this.getToken()
        if (!token) {
            return { error: { message: 'Not authenticated.' } }
        }
        try {
            const res = await fetch(`${apiBaseUrl}/api/auth/change-password/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                const message = data.detail || (typeof data === 'object' ? Object.values(data).flat().join(' ') : 'Failed to update password.')
                return { error: { message } }
            }
            return { error: null }
        } catch (err) {
            return { error: { message: err.message || 'Failed to update password.' } }
        }
    },

    onAuthStateChange(callback) {
        listeners.add(callback)
        return {
            data: {
                subscription: {
                    unsubscribe: () => {
                        listeners.delete(callback)
                    },
                },
            },
        }
    },
}
