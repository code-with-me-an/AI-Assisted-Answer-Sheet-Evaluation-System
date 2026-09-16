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

function RecentExams({ onNavigate }) {
    const exams = [
        {
            name: 'Biology Midterm',
            date: 'Sep 08, 2026',
            students: '64',
            status: 'Completed',
            statusType: 'completed'
        },
        {
            name: 'Physics Unit Test',
            date: 'Sep 05, 2026',
            students: '52',
            status: 'In Progress',
            statusType: 'progress'
        },
        {
            name: 'Chemistry Quiz',
            date: 'Sep 02, 2026',
            students: '48',
            status: 'Review',
            statusType: 'review'
        },
        {
            name: 'Environmental Science',
            date: 'Aug 28, 2026',
            students: '71',
            status: 'Completed',
            statusType: 'completed'
        }
    ]

    return (
        <section className="dashboard-panel exams-panel">

            <div className="panel-header">
                <div>
                    <h2>Recent Exams</h2>
                    <p>Your latest assessment activity</p>
                </div>

                <button
                    className="text-button"
                    onClick={() => onNavigate('past-exams')}
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
                        {exams.map((exam) => (
                            <tr key={exam.name}>
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
                        ))}
                    </tbody>
                </table>
            </div>

        </section>
    )
}

function RecentActivity() {
    const activities = [
        {
            title: 'Biology Midterm completed',
            description: '64 answer sheets evaluated',
            time: 'Today, 10:42 AM'
        },
        {
            title: 'Physics Unit Test uploaded',
            description: '52 student submissions received',
            time: 'Yesterday, 3:18 PM'
        },
        {
            title: 'Chemistry Quiz requires review',
            description: '12 evaluations are pending',
            time: 'Sep 02, 11:30 AM'
        },
        {
            title: 'New exam created',
            description: 'Environmental Science',
            time: 'Aug 28, 9:15 AM'
        }
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
                {activities.map((activity, index) => (
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
    return (
        <div className="dashboard">

            <header className="main-header">
                <h1>Good morning, Prof. Ananthu TP</h1>

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
                        onClick={() => onNavigate('create-exam')}
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
                        onClick={() => onNavigate('past-exams')}
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
                        42
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        In Progress
                    </div>

                    <div className="stat-value">
                        3
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        Pending Review
                    </div>

                    <div className="stat-value">
                        12
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-label">
                        Evaluations Done
                    </div>

                    <div className="stat-value">
                        1,204
                    </div>
                </div>

            </div>

            <div className="content-grid">

                <RecentExams onNavigate={onNavigate} />

                <RecentActivity />

            </div>

        </div>
    )
}

export default Dashboard