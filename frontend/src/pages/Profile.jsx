import { useEffect, useState } from 'react'
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
        account: (
            <>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 10h18" />
                <path d="M7 15h3" />
            </>
        ),
        bell: (
            <>
                <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
            </>
        ),
        lock: (
            <>
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </>
        ),
        sun: (
            <>
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </>
        ),
        shield: (
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        ),
        link: (
            <>
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </>
        ),
        check: <polyline points="20 6 9 17 4 12" />,
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
        star: (
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
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
        monitor: (
            <>
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </>
        ),
        phone: (
            <>
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
            </>
        ),
        info: (
            <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </>
        ),
        key: (
            <>
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </>
        ),
        trash: (
            <>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </>
        ),
        logout: (
            <>
                <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
                <path d="M14 8l4 4-4 4M8 12h10" />
            </>
        ),
        plus: (
            <>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </>
        ),
        x: (
            <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </>
        ),
        download: (
            <>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </>
        ),
    }

    return <svg {...props}>{paths[name]}</svg>
}

/* ============================================================
   CONSTANTS
   ============================================================ */

const SETTINGS_TABS = [
    { id: 'profile', label: 'Profile', icon: 'profile' },
    { id: 'account', label: 'Account', icon: 'account' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'security', label: 'Security', icon: 'lock' },
    { id: 'appearance', label: 'Appearance', icon: 'sun' },
    { id: 'privacy', label: 'Privacy', icon: 'shield' },
    { id: 'connected', label: 'Connected Apps', icon: 'link' },
]

const INITIAL_PROFILE = {
    firstName: 'Anderson',
    lastName: 'Prof.',
    email: 'anderson@university.edu',
    phone: '+1 (555) 123-4567',
    department: 'Department of Science',
    designation: 'Senior Lecturer',
    employeeId: 'EMP-2023-045',
    officeLocation: 'Science Block, Room 305',
    bio:
        'Passionate educator with 15+ years of experience in biological sciences. Specializing in molecular biology and genetics research.',
}

const INITIAL_ACCOUNT = {
    username: 'prof.anderson',
    language: 'English (US)',
    timezone: 'UTC-5 (Eastern Time)',
    dateFormat: 'MM/DD/YYYY',
}

const INITIAL_NOTIFICATIONS = {
    evalCompleted: true,
    newSubmissions: true,
    weeklySummary: true,
    systemUpdates: false,
    inAppRealtime: true,
    soundAlerts: false,
    desktop: true,
    productUpdates: true,
    tips: false,
}

const INITIAL_SECURITY = {
    twoFactor: 'app',
    newDeviceAlerts: true,
    unusualLocation: true,
    failedAttempts: true,
}

const INITIAL_APPEARANCE = {
    theme: 'light',
    dateFormat: 'September 16, 2026',
    timeFormat: '12-hour (2:30 PM)',
    density: 'comfortable',
}

const INITIAL_PRIVACY = {
    profileVisibility: 'Students Only',
    showEmail: 'Students Only',
    showPhone: 'Hidden',
    showOffice: 'Public',
    analyticsCookies: true,
    personalizedRecs: true,
    shareAnonymous: false,
}

const INITIAL_CONNECTED = {
    google: true,
    microsoft: false,
    github: false,
    canvas: true,
    googleClassroom: false,
    teams: false,
}

const SESSIONS = [
    {
        id: 1,
        device: 'Chrome on Windows',
        ip: '192.168.1.45',
        meta: 'Current session',
        time: 'Active now',
        location: 'New York, US',
        icon: 'monitor',
        current: true,
    },
    {
        id: 2,
        device: 'Safari on iPhone',
        ip: '192.168.1.52',
        time: '2 hours ago',
        location: 'New York, US',
        icon: 'phone',
        current: false,
    },
    {
        id: 3,
        device: 'Firefox on macOS',
        ip: '10.0.0.15',
        time: 'Yesterday',
        location: 'Boston, US',
        icon: 'monitor',
        current: false,
    },
]

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

function Profile() {
    const [activeTab, setActiveTab] = useState('profile')

    /* ---------- Form state ---------- */
    const [profileForm, setProfileForm] = useState(INITIAL_PROFILE)
    const [accountForm, setAccountForm] = useState(INITIAL_ACCOUNT)
    const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
    const [security, setSecurity] = useState(INITIAL_SECURITY)
    const [appearance, setAppearance] = useState(INITIAL_APPEARANCE)
    const [privacy, setPrivacy] = useState(INITIAL_PRIVACY)
    const [connected, setConnected] = useState(INITIAL_CONNECTED)

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    })

    const [sessions, setSessions] = useState(SESSIONS)

    /* ---------- Toast ---------- */
    const [toast, setToast] = useState({ message: '', error: false })

    /* ---------- Modal ---------- */
    const [modal, setModal] = useState(null) // null | 'deleteAccount' | 'revokeAll'

    useEffect(() => {
        if (!toast.message) return undefined
        const t = setTimeout(() => setToast({ message: '', error: false }), 2800)
        return () => clearTimeout(t)
    }, [toast])

    const showToast = (message, isError = false) => {
        setToast({ message, error: isError })
    }

    /* ---------- Escape closes modal ---------- */
    useEffect(() => {
        if (!modal) return undefined
        function onKey(e) {
            if (e.key === 'Escape') setModal(null)
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [modal])

    /* ============================================================
       HANDLERS
       ============================================================ */

    const saveProfile = () => {
        showToast('✓ Profile updated successfully')
    }

    const saveAccount = () => {
        showToast('✓ Account settings saved')
    }

    const validatePassword = () => {
        if (passwords.new.length < 8) {
            showToast('Password must be at least 8 characters', true)
            return
        }
        if (passwords.new !== passwords.confirm) {
            showToast('Passwords do not match', true)
            return
        }
        showToast('✓ Password updated successfully')
        setPasswords({ current: '', new: '', confirm: '' })
    }

    const saveNotifications = () => {
        showToast('✓ Notification preferences saved')
    }

    const saveAppearance = () => {
        showToast('✓ Appearance settings saved')
    }

    const savePrivacy = () => {
        showToast('✓ Privacy settings saved')
    }

    const revokeSession = (id) => {
        setSessions((prev) => prev.filter((s) => s.id !== id))
        showToast('Session revoked')
    }

    const toggleConnected = (key, label) => {
        setConnected((prev) => {
            const next = { ...prev, [key]: !prev[key] }
            showToast(
                next[key] ? `${label} connected` : `${label} disconnected`,
                !next[key]
            )
            return next
        })
    }

    const confirmModalAction = () => {
        if (modal === 'deleteAccount') {
            showToast('Account deletion request submitted', true)
        } else if (modal === 'revokeAll') {
            setSessions((prev) => prev.filter((s) => s.current))
            showToast('✓ All other sessions revoked')
        }
        setModal(null)
    }

    const modalContent = {
        deleteAccount: {
            title: 'Delete Account',
            message:
                'This action cannot be undone. All your data, exams, and student records will be permanently deleted. Are you absolutely sure?',
            confirmText: 'Delete Account',
            confirmClass: 'btn-danger',
        },
        revokeAll: {
            title: 'Revoke All Sessions',
            message:
                'This will log you out of all devices except this one. You will need to sign in again on other devices.',
            confirmText: 'Revoke All',
            confirmClass: 'btn-primary',
        },
    }

    /* ============================================================
       RENDER HELPERS
       ============================================================ */

    const renderRadioGroup = (name, options, value, onChange) => (
        <div className="radio-group">
            {options.map((opt) => (
                <label
                    key={opt.value}
                    className={`radio-option ${value === opt.value ? 'selected' : ''}`}
                >
                    <input
                        type="radio"
                        name={name}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={() => onChange(opt.value)}
                    />
                    <div className="radio-option-content">
                        <h4>{opt.title}</h4>
                        <p>{opt.desc}</p>
                    </div>
                </label>
            ))}
        </div>
    )

    const renderToggle = (key, title, desc, stateKey, setState) => (
        <div className="toggle-row" key={key}>
            <div className="toggle-row-info">
                <h4>{title}</h4>
                <p>{desc}</p>
            </div>
            <label className="toggle-switch">
                <input
                    type="checkbox"
                    checked={stateKey}
                    onChange={() => setState((prev) => ({ ...prev, [key]: !prev[key] }))}
                />
                <span className="toggle-slider" />
            </label>
        </div>
    )

    /* ============================================================
       TAB RENDERERS
       ============================================================ */

    const renderProfileTab = () => (
        <>
            <div className="profile-header-card">
                <div className="profile-header-top">
                    <div className="profile-avatar-large">
                        PA
                        <button
                            className="edit-avatar"
                            onClick={() => showToast('Upload avatar feature coming soon')}
                            aria-label="Change avatar"
                        >
                            <Icon name="edit" size={14} />
                        </button>
                    </div>
                    <div className="profile-header-info">
                        <h2>Prof. Anderson</h2>
                        <div className="role">Senior Lecturer · Department of Science</div>
                        <div className="profile-badges">
                            <span className="profile-badge verified">
                                <Icon name="checkCircle" size={13} />
                                Verified Account
                            </span>
                            <span className="profile-badge">
                                <Icon name="calendar" size={13} />
                                Member since Sep 2023
                            </span>
                            <span className="profile-badge">
                                <Icon name="star" size={13} />
                                Pro Plan
                            </span>
                        </div>
                    </div>
                    <div className="profile-header-actions">
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => showToast('Profile link copied to clipboard')}
                        >
                            <Icon name="link" size={16} />
                            Share Profile
                        </button>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setActiveTab('account')}
                        >
                            <Icon name="edit" size={16} />
                            Edit Profile
                        </button>
                    </div>
                </div>
                <div className="profile-stats">
                    <div className="profile-stat">
                        <div className="label">Exams Created</div>
                        <div className="value">42</div>
                    </div>
                    <div className="profile-stat">
                        <div className="label">Students Taught</div>
                        <div className="value">248</div>
                    </div>
                    <div className="profile-stat">
                        <div className="label">Evaluations Done</div>
                        <div className="value">1,204</div>
                    </div>
                    <div className="profile-stat">
                        <div className="label">Avg. Rating</div>
                        <div className="value">4.8</div>
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="profile" size={20} />
                        Personal Information
                    </h3>
                    <p>Your basic profile information visible to students and colleagues.</p>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label>
                            First Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            value={profileForm.firstName}
                            onChange={(e) =>
                                setProfileForm({ ...profileForm, firstName: e.target.value })
                            }
                            placeholder="Enter first name"
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            Last Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            value={profileForm.lastName}
                            onChange={(e) =>
                                setProfileForm({ ...profileForm, lastName: e.target.value })
                            }
                            placeholder="Enter last name"
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            Email Address <span className="required">*</span>
                        </label>
                        <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) =>
                                setProfileForm({ ...profileForm, email: e.target.value })
                            }
                            placeholder="Enter email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) =>
                                setProfileForm({ ...profileForm, phone: e.target.value })
                            }
                            placeholder="Enter phone"
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            Department <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            value={profileForm.department}
                            onChange={(e) =>
                                setProfileForm({ ...profileForm, department: e.target.value })
                            }
                            placeholder="Enter department"
                        />
                    </div>
                    <div className="form-group">
                        <label>Designation</label>
                        <input
                            type="text"
                            value={profileForm.designation}
                            onChange={(e) =>
                                setProfileForm({ ...profileForm, designation: e.target.value })
                            }
                            placeholder="Enter designation"
                        />
                    </div>
                    <div className="form-group">
                        <label>Employee ID</label>
                        <input
                            type="text"
                            value={profileForm.employeeId}
                            readOnly
                            placeholder="Enter employee ID"
                        />
                    </div>
                    <div className="form-group">
                        <label>Office Location</label>
                        <input
                            type="text"
                            value={profileForm.officeLocation}
                            onChange={(e) =>
                                setProfileForm({
                                    ...profileForm,
                                    officeLocation: e.target.value,
                                })
                            }
                            placeholder="Enter office location"
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Bio</label>
                        <textarea
                            value={profileForm.bio}
                            onChange={(e) =>
                                setProfileForm({ ...profileForm, bio: e.target.value })
                            }
                            placeholder="Tell students and colleagues about yourself..."
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        className="btn btn-ghost"
                        onClick={() => setProfileForm(INITIAL_PROFILE)}
                    >
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={saveProfile}>
                        <Icon name="save" size={16} />
                        Save Changes
                    </button>
                </div>
            </div>
        </>
    )

    const renderAccountTab = () => (
        <>
            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="account" size={20} />
                        Account Information
                    </h3>
                    <p>Manage your account credentials and preferences.</p>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={accountForm.username}
                            onChange={(e) =>
                                setAccountForm({ ...accountForm, username: e.target.value })
                            }
                            placeholder="Enter username"
                        />
                    </div>
                    <div className="form-group">
                        <label>Language</label>
                        <select
                            value={accountForm.language}
                            onChange={(e) =>
                                setAccountForm({ ...accountForm, language: e.target.value })
                            }
                        >
                            <option>English (US)</option>
                            <option>English (UK)</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Timezone</label>
                        <select
                            value={accountForm.timezone}
                            onChange={(e) =>
                                setAccountForm({ ...accountForm, timezone: e.target.value })
                            }
                        >
                            <option>UTC-5 (Eastern Time)</option>
                            <option>UTC-6 (Central Time)</option>
                            <option>UTC-7 (Mountain Time)</option>
                            <option>UTC-8 (Pacific Time)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Date Format</label>
                        <select
                            value={accountForm.dateFormat}
                            onChange={(e) =>
                                setAccountForm({ ...accountForm, dateFormat: e.target.value })
                            }
                        >
                            <option>MM/DD/YYYY</option>
                            <option>DD/MM/YYYY</option>
                            <option>YYYY-MM-DD</option>
                        </select>
                    </div>
                </div>
                <div className="form-actions">
                    <button
                        className="btn btn-ghost"
                        onClick={() => setAccountForm(INITIAL_ACCOUNT)}
                    >
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={saveAccount}>
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="lock" size={20} />
                        Change Password
                    </h3>
                    <p>Update your password to keep your account secure.</p>
                </div>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label>
                            Current Password <span className="required">*</span>
                        </label>
                        <input
                            type="password"
                            value={passwords.current}
                            onChange={(e) =>
                                setPasswords({ ...passwords, current: e.target.value })
                            }
                            placeholder="Enter current password"
                        />
                    </div>
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
                        />
                        <span className="hint">
                            Minimum 8 characters with uppercase, lowercase, number, and
                            special character
                        </span>
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
                        />
                    </div>
                </div>
                <div className="form-actions">
                    <button
                        className="btn btn-ghost"
                        onClick={() =>
                            setPasswords({ current: '', new: '', confirm: '' })
                        }
                    >
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={validatePassword}>
                        Update Password
                    </button>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="info" size={20} />
                        Account Activity
                    </h3>
                    <p>Manage your active sessions and login history.</p>
                </div>

                <div className="session-list">
                    {sessions.map((s) => (
                        <div
                            className={`session-item ${s.current ? 'current' : ''}`}
                            key={s.id}
                        >
                            <div className="session-info">
                                <div className="session-icon">
                                    <Icon name={s.icon} size={20} />
                                </div>
                                <div className="session-details">
                                    <h4>{s.device}</h4>
                                    <p>
                                        {s.ip}
                                        {s.meta ? ` · ${s.meta}` : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="session-meta">
                                <div className="time">{s.time}</div>
                                <div className="location">{s.location}</div>
                            </div>
                            {s.current ? (
                                <span className="current-badge">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                        <circle cx="12" cy="12" r="8" />
                                    </svg>
                                    Current
                                </span>
                            ) : (
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => revokeSession(s.id)}
                                >
                                    Revoke
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="form-actions">
                    <button
                        className="btn btn-danger"
                        onClick={() => setModal('revokeAll')}
                    >
                        <Icon name="logout" size={16} />
                        Revoke All Other Sessions
                    </button>
                </div>
            </div>
        </>
    )

    const renderNotificationsTab = () => (
        <div className="settings-card">
            <div className="settings-card-header">
                <h3>
                    <Icon name="bell" size={20} />
                    Notification Preferences
                </h3>
                <p>Choose how and when you want to be notified.</p>
            </div>

            <h4 className="toggle-group-heading">Email Notifications</h4>
            {renderToggle('evalCompleted', 'Evaluation Completed', 'Receive email when AI finishes evaluating answer sheets', notifications.evalCompleted, setNotifications)}
            {renderToggle('newSubmissions', 'New Student Submissions', 'Get notified when students submit their answer sheets', notifications.newSubmissions, setNotifications)}
            {renderToggle('weeklySummary', 'Weekly Summary Report', 'Receive a weekly digest of your evaluation activity', notifications.weeklySummary, setNotifications)}
            {renderToggle('systemUpdates', 'System Updates', 'Important announcements about AutoGrade features', notifications.systemUpdates, setNotifications)}

            <h4 className="toggle-group-heading">In-App Notifications</h4>
            {renderToggle('inAppRealtime', 'Real-time Updates', 'Show notifications in the app notification center', notifications.inAppRealtime, setNotifications)}
            {renderToggle('soundAlerts', 'Sound Alerts', 'Play sound when new notifications arrive', notifications.soundAlerts, setNotifications)}
            {renderToggle('desktop', 'Desktop Notifications', 'Show browser push notifications', notifications.desktop, setNotifications)}

            <h4 className="toggle-group-heading">Marketing</h4>
            {renderToggle('productUpdates', 'Product Updates', 'Learn about new features and improvements', notifications.productUpdates, setNotifications)}
            {renderToggle('tips', 'Tips & Tutorials', 'Get helpful tips to make the most of AutoGrade', notifications.tips, setNotifications)}

            <div className="form-actions">
                <button
                    className="btn btn-ghost"
                    onClick={() => setNotifications(INITIAL_NOTIFICATIONS)}
                >
                    Reset to Default
                </button>
                <button className="btn btn-primary" onClick={saveNotifications}>
                    Save Preferences
                </button>
            </div>
        </div>
    )

    const renderSecurityTab = () => (
        <>
            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="shield" size={20} />
                        Two-Factor Authentication
                    </h3>
                    <p>Add an extra layer of security to your account.</p>
                </div>
                {renderRadioGroup(
                    '2fa',
                    [
                        { value: 'app', title: 'Authenticator App (Recommended)', desc: 'Use Google Authenticator, Authy, or similar apps' },
                        { value: 'sms', title: 'SMS Authentication', desc: 'Receive codes via text message' },
                        { value: 'email', title: 'Email Authentication', desc: 'Receive codes via email' },
                        { value: 'disabled', title: 'Disabled', desc: 'Two-factor authentication is turned off' },
                    ],
                    security.twoFactor,
                    (v) => setSecurity({ ...security, twoFactor: v })
                )}
                <div className="form-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => showToast('2FA setup initiated')}
                    >
                        Configure 2FA
                    </button>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="info" size={20} />
                        Login Alerts
                    </h3>
                    <p>Get notified of suspicious login attempts.</p>
                </div>
                {renderToggle('newDeviceAlerts', 'New Device Login Alerts', 'Receive email when login occurs from a new device', security.newDeviceAlerts, setSecurity)}
                {renderToggle('unusualLocation', 'Unusual Location Alerts', 'Get notified of logins from unusual locations', security.unusualLocation, setSecurity)}
                {renderToggle('failedAttempts', 'Failed Login Attempts', 'Alert after 3+ failed login attempts', security.failedAttempts, setSecurity)}
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="key" size={20} />
                        API Keys
                    </h3>
                    <p>Manage API keys for third-party integrations.</p>
                </div>
                <div className="api-key-block">
                    <div className="api-key-header">
                        <div>
                            <div className="api-key-name">Production API Key</div>
                            <div className="api-key-value">
                                sk_live_••••••••••••••••••••4f2a
                            </div>
                        </div>
                        <div className="api-key-actions">
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => showToast('API key copied')}
                            >
                                Copy
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => showToast('API key regenerated', true)}
                            >
                                Regenerate
                            </button>
                        </div>
                    </div>
                    <div className="api-key-meta">
                        Created: Sep 15, 2023 · Last used: 2 hours ago
                    </div>
                </div>
                <div className="form-actions">
                    <button className="btn btn-outline">
                        <Icon name="plus" size={16} />
                        Create New Key
                    </button>
                </div>
            </div>

            <div className="settings-card danger">
                <div className="settings-card-header">
                    <h3 className="danger">
                        <Icon name="trash" size={20} />
                        Danger Zone
                    </h3>
                    <p>Irreversible and destructive actions.</p>
                </div>
                <div className="danger-zone-row">
                    <div>
                        <h4>Delete Account</h4>
                        <p>Permanently delete your account and all associated data</p>
                    </div>
                    <button
                        className="btn btn-danger"
                        onClick={() => setModal('deleteAccount')}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </>
    )

    const renderAppearanceTab = () => (
        <>
            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="sun" size={20} />
                        Theme
                    </h3>
                    <p>Choose your preferred appearance.</p>
                </div>
                {renderRadioGroup(
                    'theme',
                    [
                        { value: 'light', title: '☀️ Light Mode', desc: 'Clean and bright interface for daytime use' },
                        { value: 'dark', title: '🌙 Dark Mode', desc: 'Easy on the eyes for nighttime use' },
                        { value: 'system', title: '💻 System Default', desc: 'Automatically match your system preference' },
                    ],
                    appearance.theme,
                    (v) => setAppearance({ ...appearance, theme: v })
                )}
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="calendar" size={20} />
                        Date &amp; Time Format
                    </h3>
                    <p>Customize how dates and times are displayed.</p>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Date Format</label>
                        <select
                            value={appearance.dateFormat}
                            onChange={(e) =>
                                setAppearance({ ...appearance, dateFormat: e.target.value })
                            }
                        >
                            <option>September 16, 2026</option>
                            <option>16/09/2026</option>
                            <option>09/16/2026</option>
                            <option>2026-09-16</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Time Format</label>
                        <select
                            value={appearance.timeFormat}
                            onChange={(e) =>
                                setAppearance({ ...appearance, timeFormat: e.target.value })
                            }
                        >
                            <option>12-hour (2:30 PM)</option>
                            <option>24-hour (14:30)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="info" size={20} />
                        Density
                    </h3>
                    <p>Adjust the spacing of interface elements.</p>
                </div>
                {renderRadioGroup(
                    'density',
                    [
                        { value: 'compact', title: 'Compact', desc: 'Show more content with less spacing' },
                        { value: 'comfortable', title: 'Comfortable (Default)', desc: 'Balanced spacing for readability' },
                        { value: 'spacious', title: 'Spacious', desc: 'More breathing room between elements' },
                    ],
                    appearance.density,
                    (v) => setAppearance({ ...appearance, density: v })
                )}
                <div className="form-actions">
                    <button
                        className="btn btn-ghost"
                        onClick={() => setAppearance(INITIAL_APPEARANCE)}
                    >
                        Reset to Default
                    </button>
                    <button className="btn btn-primary" onClick={saveAppearance}>
                        Save Preferences
                    </button>
                </div>
            </div>
        </>
    )

    const renderPrivacyTab = () => (
        <>
            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="profile" size={20} />
                        Profile Visibility
                    </h3>
                    <p>Control who can see your profile information.</p>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Profile Visibility</label>
                        <select
                            value={privacy.profileVisibility}
                            onChange={(e) =>
                                setPrivacy({ ...privacy, profileVisibility: e.target.value })
                            }
                        >
                            <option>Public - Anyone can view</option>
                            <option>Students Only</option>
                            <option>Colleagues Only</option>
                            <option>Private - Only me</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Show Email Address</label>
                        <select
                            value={privacy.showEmail}
                            onChange={(e) =>
                                setPrivacy({ ...privacy, showEmail: e.target.value })
                            }
                        >
                            <option>Public</option>
                            <option>Students Only</option>
                            <option>Hidden</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Show Phone Number</label>
                        <select
                            value={privacy.showPhone}
                            onChange={(e) =>
                                setPrivacy({ ...privacy, showPhone: e.target.value })
                            }
                        >
                            <option>Public</option>
                            <option>Students Only</option>
                            <option>Hidden</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Show Office Location</label>
                        <select
                            value={privacy.showOffice}
                            onChange={(e) =>
                                setPrivacy({ ...privacy, showOffice: e.target.value })
                            }
                        >
                            <option>Public</option>
                            <option>Students Only</option>
                            <option>Hidden</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="shield" size={20} />
                        Data &amp; Privacy
                    </h3>
                    <p>Manage your data and privacy preferences.</p>
                </div>
                {renderToggle('analyticsCookies', 'Analytics Cookies', 'Allow us to collect usage data to improve the platform', privacy.analyticsCookies, setPrivacy)}
                {renderToggle('personalizedRecs', 'Personalized Recommendations', 'Use your activity to suggest relevant features', privacy.personalizedRecs, setPrivacy)}
                {renderToggle('shareAnonymous', 'Share Anonymous Usage Data', 'Help us improve by sharing anonymized usage patterns', privacy.shareAnonymous, setPrivacy)}
                <div className="form-actions">
                    <button
                        className="btn btn-outline"
                        onClick={() => showToast('Your data export is being prepared')}
                    >
                        <Icon name="download" size={16} />
                        Download My Data
                    </button>
                    <button className="btn btn-primary" onClick={savePrivacy}>
                        Save Preferences
                    </button>
                </div>
            </div>
        </>
    )

    const renderConnectedTab = () => (
        <>
            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="link" size={20} />
                        Connected Accounts
                    </h3>
                    <p>Manage your linked third-party accounts.</p>
                </div>
                <div className="connected-accounts">
                    <div className="account-item">
                        <div className="account-icon google">G</div>
                        <div className="account-info">
                            <h4>Google Account</h4>
                            <p>
                                {connected.google
                                    ? 'anderson.prof@gmail.com'
                                    : 'Not connected'}
                            </p>
                        </div>
                        <span
                            className={`account-status ${
                                connected.google ? 'connected' : 'disconnected'
                            }`}
                        >
                            {connected.google ? 'Connected' : 'Not Connected'}
                        </span>
                        <button
                            className={`btn ${
                                connected.google ? 'btn-ghost' : 'btn-outline'
                            } btn-sm`}
                            onClick={() => toggleConnected('google', 'Google account')}
                        >
                            {connected.google ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>

                    <div className="account-item">
                        <div className="account-icon microsoft">M</div>
                        <div className="account-info">
                            <h4>Microsoft Account</h4>
                            <p>{connected.microsoft ? 'anderson@outlook.com' : 'Not connected'}</p>
                        </div>
                        <span
                            className={`account-status ${
                                connected.microsoft ? 'connected' : 'disconnected'
                            }`}
                        >
                            {connected.microsoft ? 'Connected' : 'Not Connected'}
                        </span>
                        <button
                            className={`btn ${
                                connected.microsoft ? 'btn-ghost' : 'btn-outline'
                            } btn-sm`}
                            onClick={() => toggleConnected('microsoft', 'Microsoft account')}
                        >
                            {connected.microsoft ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>

                    <div className="account-item">
                        <div className="account-icon github">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </div>
                        <div className="account-info">
                            <h4>GitHub</h4>
                            <p>{connected.github ? '@anderson' : 'Not connected'}</p>
                        </div>
                        <span
                            className={`account-status ${
                                connected.github ? 'connected' : 'disconnected'
                            }`}
                        >
                            {connected.github ? 'Connected' : 'Not Connected'}
                        </span>
                        <button
                            className={`btn ${
                                connected.github ? 'btn-ghost' : 'btn-outline'
                            } btn-sm`}
                            onClick={() => toggleConnected('github', 'GitHub account')}
                        >
                            {connected.github ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="settings-card">
                <div className="settings-card-header">
                    <h3>
                        <Icon name="link" size={20} />
                        Integrations
                    </h3>
                    <p>Connect AutoGrade with other tools you use.</p>
                </div>
                <div className="connected-accounts">
                    <div className="account-item">
                        <div
                            className="account-icon"
                            style={{ background: '#7c3aed', color: '#fff' }}
                        >
                            C
                        </div>
                        <div className="account-info">
                            <h4>Canvas LMS</h4>
                            <p>Sync grades and student data</p>
                        </div>
                        <span
                            className={`account-status ${
                                connected.canvas ? 'connected' : 'disconnected'
                            }`}
                        >
                            {connected.canvas ? 'Connected' : 'Not Connected'}
                        </span>
                        <button
                            className={`btn ${
                                connected.canvas ? 'btn-ghost' : 'btn-outline'
                            } btn-sm`}
                            onClick={() => toggleConnected('canvas', 'Canvas LMS')}
                        >
                            {connected.canvas ? 'Configure' : 'Connect'}
                        </button>
                    </div>

                    <div className="account-item">
                        <div
                            className="account-icon"
                            style={{ background: '#059669', color: '#fff' }}
                        >
                            G
                        </div>
                        <div className="account-info">
                            <h4>Google Classroom</h4>
                            <p>Import classes and assignments</p>
                        </div>
                        <span
                            className={`account-status ${
                                connected.googleClassroom ? 'connected' : 'disconnected'
                            }`}
                        >
                            {connected.googleClassroom ? 'Connected' : 'Not Connected'}
                        </span>
                        <button
                            className={`btn ${
                                connected.googleClassroom ? 'btn-ghost' : 'btn-outline'
                            } btn-sm`}
                            onClick={() =>
                                toggleConnected('googleClassroom', 'Google Classroom')
                            }
                        >
                            {connected.googleClassroom ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>

                    <div className="account-item">
                        <div
                            className="account-icon"
                            style={{ background: '#2563eb', color: '#fff' }}
                        >
                            M
                        </div>
                        <div className="account-info">
                            <h4>Microsoft Teams</h4>
                            <p>Share results with students</p>
                        </div>
                        <span
                            className={`account-status ${
                                connected.teams ? 'connected' : 'disconnected'
                            }`}
                        >
                            {connected.teams ? 'Connected' : 'Not Connected'}
                        </span>
                        <button
                            className={`btn ${
                                connected.teams ? 'btn-ghost' : 'btn-outline'
                            } btn-sm`}
                            onClick={() => toggleConnected('teams', 'Microsoft Teams')}
                        >
                            {connected.teams ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return renderProfileTab()
            case 'account':
                return renderAccountTab()
            case 'notifications':
                return renderNotificationsTab()
            case 'security':
                return renderSecurityTab()
            case 'appearance':
                return renderAppearanceTab()
            case 'privacy':
                return renderPrivacyTab()
            case 'connected':
                return renderConnectedTab()
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
                <h1>Profile &amp; Settings</h1>
                <p>Manage your account information and application preferences.</p>
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

            {/* Modal */}
            <div
                className={`modal-overlay ${modal ? 'open' : ''}`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) setModal(null)
                }}
            >
                {modal && modalContent[modal] && (
                    <div className="modal">
                        <h3>{modalContent[modal].title}</h3>
                        <p>{modalContent[modal].message}</p>
                        <div className="modal-footer">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setModal(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`btn ${modalContent[modal].confirmClass}`}
                                onClick={confirmModalAction}
                            >
                                {modalContent[modal].confirmText}
                            </button>
                        </div>
                    </div>
                )}
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