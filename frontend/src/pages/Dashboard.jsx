import { useEffect, useState } from 'react'
import { useNavigate } from '../lib/router'
import { api } from '../lib/api'
import { PageLoader, ErrorState } from '../components/PageLoader'
import '../style/Dashboard.css'

function CreateExamIcon() {
    return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="20" />
            <path d="M24 15v18M15 24h18" />
        </svg>
    )
}

function ArchiveIcon() {
    return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
            <rect x="8" y="12" width="32" height="28" rx="3" />
            <path d="M8 18h32M18 26h12" />
        </svg>
    )
}

function RecentExams({ onNavigate, exams }) {
    const navigate = useNavigate()
    const rows = (exams || []).map((exam) => ({
        id: exam.examination_id,
        name: exam.exam_name,
        date: new Date(exam.exam_date).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        }),
        students: exam.student_count,
        status: exam.status === 'completed' ? 'Completed' : (exam.status === 'partial' ? 'In Progress' : 'Created'),
        statusType: exam.status === 'completed' ? 'completed' : (exam.status === 'partial' ? 'progress' : 'review'),
    }))

    const handleViewAll = () => {
        navigate('/PastExams')
        if (onNavigate) {
            onNavigate('past-exams')
        }
    }

    return (
        <section className="dashboard-panel exams-panel">
            <div className="panel-header">
                <div>
                    <h2>Recent Exams</h2>
                    <p>Your latest assessment activity</p>
                </div>

                <button
                    className="text-button"
                    onClick={handleViewAll}
                >
                    View all →
                </button>
            </div>

            <div className="table-wrapper">
                <table className="exams-table">
                    <thead>
                        <tr>
                            <th>Exam</th>
                            <th>Date</th>
                            <th>Students</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--g500)' }}>
                                    No examinations created yet.
                                </td>
                            </tr>
                        ) : (
                            rows.map((exam) => (
                                <tr key={exam.id || exam.name}>
                                    <td className="exam-name">
                                        {exam.name}
                                    </td>

                                    <td>{exam.date}</td>

                                    <td>{exam.students}</td>

                                    <td>
                                        <span
                                            className={`status-badge ${exam.statusType}`}
                                        >
                                            {exam.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

function RecentActivity({ activities }) {
    const list = activities && activities.length > 0 ? activities : [
        {
            title: 'Workspace ready',
            description: 'Start by creating your first examination.',
            time: 'Just now',
        },
    ]

    return (
        <section className="dashboard-panel activity-panel">
            <div className="panel-header">
                <div>
                    <h2>Recent Activity</h2>
                    <p>Latest updates from your workspace</p>
                </div>
            </div>

            <div className="activity-list">
                {list.map((activity, index) => (
                    <div
                        className="activity-item"
                        key={`${activity.title}-${index}`}
                    >
                        <div className="activity-dot"></div>

                        <div className="activity-content">
                            <h3>{activity.title}</h3>
                            <p>{activity.description}</p>
                            <span>{activity.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

function Dashboard({ onNavigate }) {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchDashboard = () => {
        let isMounted = true
        setLoading(true)
        setError(null)
        api.get('/api/dashboard/')
            .then((res) => {
                if (isMounted) setData(res)
            })
            .catch((err) => {
                if (isMounted) setError(err.message || 'Unable to load dashboard data.')
            })
            .finally(() => {
                if (isMounted) setLoading(false)
            })
        return () => {
            isMounted = false
        }
    }

    useEffect(() => {
        const cleanup = fetchDashboard()
        return cleanup
    }, [])

    const stats = data?.statistics || {}

    const handleCreateExam = () => {
        navigate('/CreateExam')
        if (onNavigate) {
            onNavigate('create-exam')
        }
    }

    const handlePastExams = () => {
        navigate('/PastExams')
        if (onNavigate) {
            onNavigate('past-exams')
        }
    }

    if (loading) {
        return <PageLoader message="Loading dashboard overview..." />
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchDashboard} />
    }

    return (
        <div className="dashboard">
            <header className="main-header">
                <h1>Good morning, {data?.teacher?.name || 'Teacher'}</h1>

                <p>
                    Here is an overview of your evaluation activities.
                </p>
            </header>

            <div className="top-cards">
                <div className="action-card">
                    <div className="action-card-icon dark">
                        <CreateExamIcon />
                    </div>

                    <div className="action-card-content">
                        <h3>Create New Exam</h3>

                        <p>
                            Set up a new assessment for your students.
                        </p>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleCreateExam}
                    >
                        + Create Exam
                    </button>
                </div>

                <div className="action-card">
                    <div className="action-card-icon light">
                        <ArchiveIcon />
                    </div>

                    <div className="action-card-content">
                        <h3>View Past Exams</h3>

                        <p>
                            Review analytics and graded papers from
                            previous tests.
                        </p>
                    </div>

                    <button
                        className="btn btn-outline"
                        onClick={handlePastExams}
                    >
                        View Archive →
                    </button>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-label">
                        Total Exams
                    </div>

                    <div className="stat-value">
                        {stats.total_exams ?? 0}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        Total Students
                    </div>

                    <div className="stat-value">
                        {stats.total_students ?? 0}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        Pending Review
                    </div>

                    <div className="stat-value">
                        {stats.pending_review ?? 0}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        Evaluations Done
                    </div>

                    <div className="stat-value">
                        {stats.evaluations ?? 0}
                    </div>
                </div>
            </div>

            <div className="content-grid">
                <RecentExams onNavigate={onNavigate} exams={data?.recent_exams || []} />
                <RecentActivity activities={data?.recent_activity || []} />
            </div>
        </div>
    )
}

export default Dashboard
