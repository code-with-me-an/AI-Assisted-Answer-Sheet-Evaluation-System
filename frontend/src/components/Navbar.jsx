import { useState } from 'react'
import '../style/Navbar.css'
import icon from '../assets/Icon.svg'

function DashboardIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    )
}

function CreateIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 8v8M8 12h8" />
        </svg>
    )
}

function PastExamsIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7v5l3 2" />
        </svg>
    )
}

function ResultsIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
    )
}

function StudentsIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="9" cy="8" r="3" />
            <circle cx="17" cy="9" r="2.5" />
            <path d="M3.5 19c.5-3.2 2.4-5 5.5-5s5 1.8 5.5 5" />
            <path d="M14.5 14.5c2.8-.1 4.8 1.4 5.3 4.5" />
        </svg>
    )
}

function SettingsIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19 13.5a7.8 7.8 0 0 0 .1-1.5 7.8 7.8 0 0 0-.1-1.5l2-1.5-2-3.4-2.4 1a8 8 0 0 0-2.5-1.5L13.8 3H10.2L9.9 5.1a8 8 0 0 0-2.5 1.5L5 5.6 3 9l2 1.5A7.8 7.8 0 0 0 4.9 12c0 .5 0 1 .1 1.5L3 15l2 3.4 2.4-1a8 8 0 0 0 2.5 1.5l.3 2.1h3.6l.3-2.1a8 8 0 0 0 2.5-1.5l2.4 1 2-3.4z" />
        </svg>
    )
}

function HelpIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.7 9a2.5 2.5 0 1 1 4.3 1.8c-.9.8-2 1.3-2 2.7" />
            <path d="M12 17h.01" />
        </svg>
    )
}

function LogoutIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
            <path d="M14 8l4 4-4 4M8 12h10" />
        </svg>
    )
}

function Navbar({ activePage, onNavigate }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navigationItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <DashboardIcon />
        },
        {
            id: 'create-exam',
            label: 'Create Exam',
            icon: <CreateIcon />
        },
        {
            id: 'past-exams',
            label: 'Past Exams',
            icon: <PastExamsIcon />
        },
        {
            id: 'results',
            label: 'Results',
            icon: <ResultsIcon />
        },
        {
            id: 'students',
            label: 'Students',
            icon: <StudentsIcon />
        },
        {
            id: 'settings',
            label: 'Profile / Settings',
            icon: <SettingsIcon />
        }
    ]

    const navigate = (page) => {
        onNavigate(page)
        setSidebarOpen(false)
    }

    return (
        <>
            <header className="mobile-header">
                <div className="mobile-brand">
                    <span className="mobile-brand-icon"><img src={icon} alt="AutoGrade" /></span>
                    <span>AutoGrade</span>
                </div>

                <button
                    className="menu-button"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle navigation"
                    aria-expanded={sidebarOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            {sidebarOpen && (
                <button
                    className="sidebar-overlay"
                    aria-label="Close navigation"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>

                <div className="sidebar-logo">
                    <span className="sidebar-logo-mark"><img src={icon} alt="AutoGrade" /></span>
                    <span>AutoGrade</span>
                </div>

                <div className="sidebar-profile">

                    <div className="sidebar-avatar">
                        AN
                    </div>

                    <div className="sidebar-profile-info">
                        <h4>prof. ananthu</h4>
                        <p>Department of computer science</p>
                    </div>

                </div>

                <nav className="sidebar-nav">

                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            className={`nav-item ${
                                activePage === item.id ? 'active' : ''
                            }`}
                            onClick={() => navigate(item.id)}
                        >
                            <span className="nav-icon">
                                {item.icon}
                            </span>

                            <span>{item.label}</span>
                        </button>
                    ))}

                </nav>

                <div className="sidebar-bottom">

                    <button
                        className="nav-item"
                        onClick={() => navigate('help')}
                    >
                        <span className="nav-icon">
                            <HelpIcon />
                        </span>

                        <span>Help Center</span>
                    </button>

                    <button
                        className="nav-item"
                        onClick={() => navigate('logout')}
                    >
                        <span className="nav-icon">
                            <LogoutIcon />
                        </span>

                        <span>Log Out</span>
                    </button>

                </div>

            </aside>
        </>
    )
}

export default Navbar