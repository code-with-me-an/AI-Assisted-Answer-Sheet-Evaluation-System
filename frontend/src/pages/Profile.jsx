import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { supabase } from '../lib/supabase'
import { PageLoader, ErrorState } from '../components/PageLoader'
import '../style/Profile.css'

/* ============================================================
   ICONS
   ============================================================ */

function Icon({ name, size = 18 }) {
    const props = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
    }

    const paths = {
        profile: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
            </>
        ),
        lock: (
            <>
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </>
        ),
        shield: (
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        ),
        checkCircle: (
            <>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </>
        ),
        calendar: (
            <>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </>
        ),
        edit: (
            <>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </>
        ),
        save: (
            <>
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
            </>
        ),
        info: (
            <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </>
        ),
        logout: (
            <>
                <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
                <path d="M14 8l4 4-4 4M8 12h10" />
            </>
        ),
    }

    return <svg {...props}>{paths[name] || null}</svg>
}

/* ============================================================
   CONSTANTS
   ============================================================ */

const SETTINGS_TABS = [
    { id: 'profile', label: 'Teacher Profile', icon: 'profile' },
    { id: 'security', label: 'Security & Password', icon: 'lock' },
]

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

function Profile() {
    const [activeTab, setActiveTab] = useState('profile')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [saving, setSaving] = useState(false)
    const [passwordSaving, setPasswordSaving] = useState(false)

    /* ---------- Profile Data ---------- */
    const [profile, setProfile] = useState({
        teacher_id: null,
        supabase_user_id: '',
        name: '',
        email: '',
        created_at: null,
        exams_count: 0,
        students_count: 0,
        evaluations_count: 0,
    })

    /* ---------- Form state ---------- */
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')

    const [passwords, setPasswords] = useState({
        new: '',
        confirm: '',
    })

    /* ---------- Toast ---------- */
    const [toast, setToast] = useState({ message: '', error: false })

    const showToast = (message, isError = false) => {
        setToast({ message, error: isError })
    }

    useEffect(() => {
        if (!toast.message) return undefined
        const t = setTimeout(() => setToast({ message: '', error: false }), 3200)
        return () => clearTimeout(t)
    }, [toast])

    const fetchProfile = async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await api.get('/api/auth/profile/')
            setProfile(data)
            const parts = (data.name || '').trim().split(' ')
            if (parts.length > 1) {
                setFirstName(parts.slice(0, -1).join(' '))
                setLastName(parts[parts.length - 1])
            } else {
                setFirstName(parts[0] || '')
                setLastName('')
            }
        } catch (err) {
            setError(err.message || 'Unable to load profile.')
            showToast(err.message || 'Unable to load profile.', true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    /* ============================================================
       HANDLERS
       ============================================================ */

    const saveProfile = async (e) => {
        e?.preventDefault()
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
        if (!fullName) {
            showToast('Please enter your full name.', true)
            return
        }

        setSaving(true)
        try {
            const updated = await api.post('/api/auth/profile/', {
                name: fullName,
            })
            setProfile(updated)
            const parts = (updated.name || '').trim().split(' ')
            if (parts.length > 1) {
                setFirstName(parts.slice(0, -1).join(' '))
                setLastName(parts[parts.length - 1])
            } else {
                setFirstName(parts[0] || '')
                setLastName('')
            }
            showToast('✓ Profile updated successfully')
        } catch (error) {
            showToast(error.message || 'Unable to update profile.', true)
        } finally {
            setSaving(false)
        }
    }

    const handleUpdatePassword = async (e) => {
        e?.preventDefault()
        if (!passwords.new) {
            showToast('Please enter a new password.', true)
            return
        }
        if (passwords.new.length < 6) {
            showToast('Password must be at least 6 characters long.', true)
            return
        }
        if (passwords.new !== passwords.confirm) {
            showToast('Passwords do not match.', true)
            return
        }

        setPasswordSaving(true)
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.new,
            })
            if (error) {
                showToast(error.message || 'Failed to update password.', true)
            } else {
                showToast('✓ Password updated successfully')
                setPasswords({ new: '', confirm: '' })
            }
        } catch (err) {
            showToast(err.message || 'Error updating password.', true)
        } finally {
            setPasswordSaving(false)
        }
    }

    const handleResetForm = () => {
        const parts = (profile.name || '').trim().split(' ')
        if (parts.length > 1) {
            setFirstName(parts.slice(0, -1).join(' '))
            setLastName(parts[parts.length - 1])
        } else {
            setFirstName(parts[0] || '')
            setLastName('')
        }
    }

    /* ============================================================
       COMPUTED VALUES
       ============================================================ */

    const teacherFullName = (profile.name || `${firstName} ${lastName}`).trim() || 'Teacher'
    const initials = teacherFullName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'T'

    const memberSinceDate = profile.created_at
        ? new Date(profile.created_at).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
          })
        : 'Active'

    /* ============================================================
       TAB RENDERERS
       ============================================================ */

    const renderProfileTab = () => (
        <>
            <div className="profile-header-card">
                <div className="profile-header-top">
                    <div className="profile-avatar-large">
                        {initials}
                    </div>
                    <div className="profile-header-info">
                        <h2>{teacherFullName}</h2>
                        <div className="role">
                            Instructor · {profile.email || 'Teacher Account'}
                        </div>
                        <div className="profile-badges">
                            <span className="profile-badge verified">
                                <Icon name="checkCircle" size={13} />
                                Authenticated Teacher
                            </span>
                            <span className="profile-badge">
                                <Icon name="calendar" size={13} />
                                Member since {memberSinceDate}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="profile-stat">
                        <div className="label">Exams Created</div>
                        <div className="value">{profile.exams_count || 0}</div>
                    </div>
                    <div className="profile-stat">
                        <div className="label">Students Registered</div>
                        <div className="value">{profile.students_count || 0}</div>
                    </div>
                    <div className="profile-stat">
                        <div className="label">Evaluations Done</div>
                        <div className="value">{profile.evaluations_count || 0}</div>
                    </div>
                    <div className="profile-stat">
                        <div className="label">System Status</div>
                        <div className="value" style={{ fontSize: '18px', color: 'var(--green)' }}>Active</div>
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="profile" size={20} />
                        Personal Information
                    </h3>
                    <p>Update your display name and view your registered profile details.</p>
                </div>

                <form onSubmit={saveProfile}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>
                                First Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter first name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter last name"
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>
                                Email Address <span className="required">*</span>
                            </label>
                            <input
                                type="email"
                                value={profile.email || ''}
                                readOnly
                                placeholder="Teacher email"
                            />
                            <span className="hint">
                                Email is managed and authenticated securely via Supabase Auth.
                            </span>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={handleResetForm}
                            disabled={saving || loading}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving || loading}
                        >
                            <Icon name="save" size={16} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )

    const renderSecurityTab = () => (
        <>
            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="lock" size={20} />
                        Change Password
                    </h3>
                    <p>Update your password directly through Supabase Authentication.</p>
                </div>

                <form onSubmit={handleUpdatePassword}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>
                                New Password <span className="required">*</span>
                            </label>
                            <input
                                type="password"
                                value={passwords.new}
                                onChange={(e) =>
                                    setPasswords({ ...passwords, new: e.target.value })
                                }
                                placeholder="Enter new password"
                                required
                            />
                            <span className="hint">Minimum 6 characters</span>
                        </div>
                        <div className="form-group">
                            <label>
                                Confirm New Password <span className="required">*</span>
                            </label>
                            <input
                                type="password"
                                value={passwords.confirm}
                                onChange={(e) =>
                                    setPasswords({ ...passwords, confirm: e.target.value })
                                }
                                placeholder="Confirm new password"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => setPasswords({ new: '', confirm: '' })}
                            disabled={passwordSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={passwordSaving}
                        >
                            <Icon name="lock" size={16} />
                            {passwordSaving ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="shield" size={20} />
                        Security Information
                    </h3>
                    <p>Your authentication is secured by Supabase Auth with JWT bearer tokens.</p>
                </div>

                <div className="toggle-row">
                    <div className="toggle-row-info">
                        <h4>Supabase User ID</h4>
                        <p style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--g700)' }}>
                            {profile.supabase_user_id || 'Connected'}
                        </p>
                    </div>
                </div>

                <div className="toggle-row">
                    <div className="toggle-row-info">
                        <h4>Token Authentication</h4>
                        <p>All REST API requests to Django are signed with your Supabase JWT.</p>
                    </div>
                    <span className="current-badge">Active</span>
                </div>
            </div>
        </>
    )

    const renderTabContent = () => {
        if (loading) {
            return <PageLoader message="Loading teacher profile..." />
        }
        if (error) {
            return <ErrorState message={error} onRetry={fetchProfile} />
        }
        switch (activeTab) {
            case 'profile':
                return renderProfileTab()
            case 'security':
                return renderSecurityTab()
            default:
                return renderProfileTab()
        }
    }

    /* ============================================================
       MAIN RENDER
       ============================================================ */

    return (
        <div className="settings-page">
            <div className="page-header">
                <p>Manage your teacher profile and account security settings.</p>
            </div>

            <div className="settings-layout">
                <nav className="settings-sidebar">
                    {SETTINGS_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`settings-nav-item ${
                                activeTab === tab.id ? 'active' : ''
                            }`}
                            onClick={() => {
                                setActiveTab(tab.id)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                        >
                            <Icon name={tab.icon} size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="settings-content">
                    <div className="tab-content" key={activeTab}>
                        {renderTabContent()}
                    </div>
                </div>
            </div>

            {/* Toast */}
            <div
                className={`toast ${toast.message ? 'show' : ''} ${
                    toast.error ? 'error' : ''
                }`}
            >
                <Icon name={toast.error ? 'info' : 'checkCircle'} size={16} />
                <span>{toast.message}</span>
            </div>
        </div>
    )
}

export default Profile
