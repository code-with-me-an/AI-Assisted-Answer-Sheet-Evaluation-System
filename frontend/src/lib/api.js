import { supabase } from './supabase'

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export class ApiError extends Error {
    constructor(message, status, body) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.body = body
    }
}

async function request(path, options = {}) {
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session?.access_token) {
        throw new ApiError('Your session has expired. Please sign in again.', 401)
    }

    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${data.session.access_token}`,
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...options.headers,
        },
    })
    const body = response.status === 204 ? null : await response.json().catch(() => null)

    if (!response.ok) {
        const errorMsg = body?.detail || (typeof body === 'object' && body !== null ? Object.values(body).flat().join(' ') : null) || 'The API request failed.'
        throw new ApiError(errorMsg, response.status, body)
    }
    return body
}

export const api = {
    get: (path, options) => request(path, { ...options, method: 'GET' }),
    post: (path, payload, options) => request(path, {
        ...options,
        method: 'POST',
        body: payload ? JSON.stringify(payload) : undefined,
    }),
    patch: (path, payload, options) => request(path, {
        ...options,
        method: 'PATCH',
        body: payload ? JSON.stringify(payload) : undefined,
    }),
    delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
}

export const syncTeacherProfile = (profile = {}) => api.post('/api/auth/profile/', profile)
