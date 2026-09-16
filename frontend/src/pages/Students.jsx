import { useEffect, useMemo, useState } from 'react'
import '../style/Students.css'

/* ============================================================
   ICONS
   ============================================================ */

function Icon({ name, size = 16 }) {
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
        users: (
            <>
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 19c.5-3.2 2.4-5 5.5-5s5 1.8 5.5 5" />
            </>
        ),
        checkCircle: (
            <>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </>
        ),
        clock: (
            <>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </>
        ),
        chart: (
            <>
                <path d="M3 3v18h18" />
                <path d="M7 14l4-4 4 4 5-5" />
            </>
        ),
        search: (
            <>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
        calendar: (
            <>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </>
        ),
        info: (
            <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </>
        ),
        file: (
            <>
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M8 9h8M8 13h8M8 17h5" />
            </>
        ),
        edit: (
            <>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </>
        ),
    }

    return <svg {...props}>{paths[name]}</svg>
}

/* ============================================================
   DATA
   ============================================================ */

const STUDENTS_DATA = [
    {
        id: 'STU001',
        name: 'John Smith',
        email: 'john.smith@university.edu',
        department: 'Department of Science',
        enrolledDate: 'Sep 2023',
        lastActive: '2 days ago',
        status: 'active',
        exams: [
            { code: 'Biology 401', title: 'Final Term - Advanced Biology', score: 92, total: 150, status: 'completed', date: 'Oct 24, 2023' },
            { code: 'Chemistry 302', title: 'Mid Term - Organic Chemistry', score: 95, total: 100, status: 'completed', date: 'Oct 18, 2023' },
            { code: 'Biology 205', title: 'Unit Test - Cell Biology', score: 88, total: 50, status: 'completed', date: 'Oct 10, 2023' },
            { code: 'Biology 310', title: 'Quiz - Genetics', score: 90, total: 40, status: 'completed', date: 'Sep 28, 2023' },
            { code: 'Biology 405', title: 'Final - Molecular Biology', score: 85, total: 150, status: 'completed', date: 'Sep 15, 2023' },
        ],
    },
    {
        id: 'STU002',
        name: 'Sarah Johnson',
        email: 'sarah.j@university.edu',
        department: 'Department of Science',
        enrolledDate: 'Sep 2023',
        lastActive: '1 day ago',
        status: 'active',
        exams: [
            { code: 'Biology 401', title: 'Final Term - Advanced Biology', score: 85, total: 150, status: 'completed', date: 'Oct 24, 2023' },
            { code: 'Chemistry 302', title: 'Mid Term - Organic Chemistry', score: 88, total: 100, status: 'completed', date: 'Oct 18, 2023' },
            { code: 'Biology 205', title: 'Unit Test - Cell Biology', score: 79, total: 50, status: 'completed', date: 'Oct 10, 2023' },
            { code: 'Biology 310', title: 'Quiz - Genetics', score: 82, total: 40, status: 'completed', date: 'Sep 28, 2023' },
            { code: 'Biology 405', title: 'Final - Molecular Biology', score: 91, total: 150, status: 'completed', date: 'Sep 15, 2023' },
        ],
    },
    {
        id: 'STU003',
        name: 'Michael Chen',
        email: 'm.chen@university.edu',
        department: 'Department of Science',
        enrolledDate: 'Sep 2023',
        lastActive: '5 days ago',
        status: 'active',
        exams: [
            { code: 'Biology 401', title: 'Final Term - Advanced Biology', score: 78, total: 150, status: 'completed', date: 'Oct 24, 2023' },
            { code: 'Chemistry 302', title: 'Mid Term - Organic Chemistry', score: 82, total: 100, status: 'completed', date: 'Oct 18, 2023' },
            { code: 'Biology 205', title: 'Unit Test - Cell Biology', score: 94, total: 50, status: 'completed', date: 'Oct 10, 2023' },
            { code: 'Biology 310', title: 'Quiz - Genetics', score: 98, total: 40, status: 'completed', date: 'Sep 28, 2023' },
            { code: 'Biology 405', title: 'Final - Molecular Biology', score: 78, total: 150, status: 'completed', date: 'Sep 15, 2023' },
        ],
    },
    {
        id: 'STU004',
        name: 'Emily Davis',
        email: 'e.davis@university.edu',
        department: 'Department of Science',
        enrolledDate: 'Sep 2023',
        lastActive: '1 week ago',
        status: 'inactive',
        exams: [
            { code: 'Biology 401', title: 'Final Term - Advanced Biology', score: 65, total: 150, status: 'completed', date: 'Oct 24, 2023' },
            { code: 'Chemistry 302', title: 'Mid Term - Organic Chemistry', score: 76, total: 100, status: 'completed', date: 'Oct 18, 2023' },
            { code: 'Biology 205', title: 'Unit Test - Cell Biology', score: 68, total: 50, status: 'completed', date: 'Oct 10, 2023' },
        ],
    },
    {
        id: 'STU005',
        name: 'David Wilson',
        email: 'd.wilson@university.edu',
        department: 'Department of Science',
        enrolledDate: 'Sep 2023',
        lastActive: '3 days ago',
        status: 'active',
        exams: [
            { code: 'Biology 401', title: 'Final Term - Advanced Biology', score: 88, total: 150, status: 'completed', date: 'Oct 24, 2023' },
            { code: 'Chemistry 302', title: 'Mid Term - Organic Chemistry', score: 91, total: 100, status: 'completed', date: 'Oct 18, 2023' },
            { code: 'Biology 205', title: 'Unit Test - Cell Biology', score: 85, total: 50, status: 'completed', date: 'Oct 10, 2023' },
        ],
    },
    {
        id: 'STU006',
        name: 'Jessica Brown',
        email: 'j.brown@university.edu',
        department: 'Department of Science',
        enrolledDate: 'Sep 2023',
        lastActive: '1 day ago',
        status: 'active',
        exams: [
            { code: 'Biology 401', title: 'Final Term - Advanced Biology', score: 96, total: 150, status: 'completed', date: 'Oct 24, 2023' },
            { code: 'Chemistry 302', title: 'Mid Term - Organic Chemistry', score: 97, total: 100, status: 'completed', date: 'Oct 18, 2023' },
            { code: 'Biology 205', title: 'Unit Test - Cell Biology', score: 92, total: 50, status: 'completed', date: 'Oct 10, 2023' },
        ],
    },
    {
        id: 'STU007',
        name: 'Daniel Martinez',
        email: 'd.martinez@university.edu',
        department: 'Department of Science',
        enrolledDate: 'Sep 2023',
        lastActive: '4 days ago',
        status: 'active',
        exams: [
            { code: 'Biology 401', title: 'Final Term - Advanced Biology', score: 72, total: 150, status: 'completed', date: 'Oct 24, 2023' },
            { code: 'Chemistry 302', title: 'Mid Term - Organic Chemistry', score: 78, total: 100, status: 'completed', date: 'Oct 18, 2023' },
        ],
    },
    {
        id: 'STU008',
        name: 'Sophia Taylor',
        email: 's.taylor@university.edu',
        department: 'Department of Science',
        enrolledDate: 'Sep 2023',
        lastActive: '2 weeks ago',
        status: 'inactive',
        exams: [
            { code: 'Biology 401', title: 'Final Term - Advanced Biology', score: 58, total: 150, status: 'completed', date: 'Oct 24, 2023' },
        ],
    },
    {
        id: 'STU009',
        name: 'James Anderson',
        email: 'j.anderson@university.edu',
        department: 'Department of Science',
        enrolledDate: 'Sep 2023',
        lastActive: '6 hours ago',
        status: 'active',
        exams: [
            { code: 'Biology 401', title: 'Final Term - Advanced Biology', score: 81, total: 150, status: 'completed', date: 'Oct 24, 2023' },
            { code: 'Chemistry 302', title: 'Mid Term - Organic Chemistry', score: 85, total: 100, status: 'completed', date: 'Oct 18, 2023' },
            { code: 'Biology 205', title: 'Unit Test - Cell Biology', score: 78, total: 50, status: 'completed', date: 'Oct 10, 2023' },
            { code: 'Biology 310', title: 'Quiz - Genetics', score: 88, total: 40, status: 'completed', date: 'Sep 28, 2023' },
        ],
    },
    {
        id: 'STU010',
        name: 'Olivia Thomas',
        email: 'o.thomas@university.edu',
        department: 'Department of Science',
        enrolledDate: 'Sep 2023',
        lastActive: '3 days ago',
        status: 'pending',
        exams: [
            { code: 'Biology 401', title: 'Final Term - Advanced Biology', score: 45, total: 150, status: 'pending', date: 'Oct 24, 2023' },
        ],
    },
]

const AVATAR_COLORS = ['#1e3a5f', '#2563eb', '#059669', '#d97706', '#7c3aed', '#dc2626', '#0891b2', '#be185d']

/* ============================================================
   HELPERS
   ============================================================ */

function getInitials(name) {
    return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

function getAvatarColor(name) {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getStatusBadge(status) {
    if (status === 'active') return <span className="badge badge-active">Active</span>
    if (status === 'inactive') return <span className="badge badge-inactive">Inactive</span>
    return <span className="badge badge-pending">Pending</span>
}

function calculateAverage(exams) {
    if (exams.length === 0) return 0
    const total = exams.reduce((sum, exam) => sum + (exam.score / exam.total) * 100, 0)
    return Math.round(total / exams.length)
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

function Students() {
    const [students] = useState(STUDENTS_DATA)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [examFilter, setExamFilter] = useState('all')

    const [selectedStudent, setSelectedStudent] = useState(null)
    const [activeTab, setActiveTab] = useState('overview')

    /* ---------- Escape key closes modal ---------- */
    useEffect(() => {
        if (!selectedStudent) return undefined
        function onKey(e) {
            if (e.key === 'Escape') closeModal()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStudent])

    /* ---------- Body scroll lock while modal open ---------- */
    useEffect(() => {
        document.body.style.overflow = selectedStudent ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [selectedStudent])

    /* ============================================================
       FILTERING
       ============================================================ */

    const filteredStudents = useMemo(() => {
        const q = search.toLowerCase()
        return students.filter((student) => {
            const matchSearch =
                !q ||
                student.name.toLowerCase().includes(q) ||
                student.id.toLowerCase().includes(q) ||
                student.email.toLowerCase().includes(q)
            const matchStatus = statusFilter === 'all' || student.status === statusFilter
            const matchExam =
                examFilter === 'all' ||
                student.exams.some((exam) => exam.code === examFilter)
            return matchSearch && matchStatus && matchExam
        })
    }, [students, search, statusFilter, examFilter])

    /* ============================================================
       STATS (derived)
       ============================================================ */

    const stats = useMemo(() => {
        const total = students.length
        const active = students.filter((s) => s.status === 'active').length
        const pending = students.filter((s) => s.status === 'pending').length
        const avg = total
            ? Math.round(students.reduce((sum, s) => sum + calculateAverage(s.exams), 0) / total * 10) / 10
            : 0
        return { total, active, pending, avg }
    }, [students])

    /* ============================================================
       MODAL ACTIONS
       ============================================================ */

    const openModal = (student) => {
        setSelectedStudent(student)
        setActiveTab('overview')
    }

    const closeModal = () => {
        setSelectedStudent(null)
    }

    const addStudent = () => {
        window.alert('Add Student functionality would open a form here.')
    }

    const editStudent = () => {
        window.alert('Edit Student functionality would open a form here.')
    }

    /* ============================================================
       MODAL DATA (derived)
       ============================================================ */

    const modalData = useMemo(() => {
        if (!selectedStudent) return null
        const s = selectedStudent
        const avgScore = calculateAverage(s.exams)
        const completedExams = s.exams.filter((e) => e.status === 'completed').length
        const highestScore = s.exams.length > 0
            ? Math.max(...s.exams.map((e) => (e.score / e.total) * 100))
            : 0

        const excellent = s.exams.filter((e) => (e.score / e.total) * 100 >= 90).length
        const good = s.exams.filter((e) => {
            const pct = (e.score / e.total) * 100
            return pct >= 80 && pct < 90
        }).length
        const average = s.exams.filter((e) => {
            const pct = (e.score / e.total) * 100
            return pct >= 70 && pct < 80
        }).length
        const needsImprovement = s.exams.filter((e) => (e.score / e.total) * 100 < 70).length

        return {
            avgScore,
            completedExams,
            highestScore: Math.round(highestScore),
            excellent,
            good,
            average,
            needsImprovement,
        }
    }, [selectedStudent])

    /* ============================================================
       RENDER
       ============================================================ */

    return (
        <div className="students-page">
            <div className="page-header">
                <p>Manage and monitor all enrolled students across your examinations.</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">
                        <Icon name="users" size={14} />
                        Total Students
                    </div>
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-sub">Across all exams</div>
                </div>
                <div className="stat-card highlight">
                    <div className="stat-label">
                        <Icon name="checkCircle" size={14} />
                        Active Students
                    </div>
                    <div className="stat-value">{stats.active}</div>
                    <div className="stat-sub">
                        {stats.total ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% engagement
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">
                        <Icon name="clock" size={14} />
                        Pending Reviews
                    </div>
                    <div className="stat-value">{stats.pending}</div>
                    <div className="stat-sub">Awaiting feedback</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">
                        <Icon name="chart" size={14} />
                        Average Score
                    </div>
                    <div className="stat-value">
                        {stats.avg}
                        <span>%</span>
                    </div>
                    <div className="stat-sub">Class mean</div>
                </div>
            </div>

            {/* Table */}
            <div className="table-card">
                <div className="table-toolbar">
                    <h3>All Students</h3>
                    <div className="toolbar-controls">
                        <div className="search-box">
                            <Icon name="search" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search students..."
                            />
                        </div>
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </select>
                        <select
                            className="filter-select"
                            value={examFilter}
                            onChange={(e) => setExamFilter(e.target.value)}
                        >
                            <option value="all">All Exams</option>
                            <option value="Biology 401">Biology 401</option>
                            <option value="Chemistry 302">Chemistry 302</option>
                            <option value="Biology 205">Biology 205</option>
                            <option value="Biology 310">Biology 310</option>
                            <option value="Biology 405">Biology 405</option>
                        </select>
                        <button className="btn btn-primary btn-sm" onClick={addStudent}>
                            <Icon name="plus" size={14} />
                            Add Student
                        </button>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Student ID</th>
                                <th>Enrolled Exams</th>
                                <th>Average Score</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="empty-state">
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => {
                                    const avgScore = calculateAverage(student.exams)
                                    return (
                                        <tr key={student.id} onClick={() => openModal(student)}>
                                            <td>
                                                <div className="student-info-cell">
                                                    <div
                                                        className="student-avatar"
                                                        style={{ background: getAvatarColor(student.name) }}
                                                    >
                                                        {getInitials(student.name)}
                                                    </div>
                                                    <div>
                                                        <div className="student-name">{student.name}</div>
                                                        <div className="student-email">{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 500 }}>{student.id}</td>
                                            <td style={{ fontWeight: 500 }}>{student.exams.length}</td>
                                            <td style={{ fontWeight: 600 }}>{avgScore}%</td>
                                            <td>{getStatusBadge(student.status)}</td>
                                            <td>
                                                <button
                                                    className="btn btn-outline btn-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        openModal(student)
                                                    }}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="table-footer">
                    <span>
                        Showing {filteredStudents.length} of {students.length} students
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--g400)' }}>
                        Click any row to view details
                    </span>
                </div>
            </div>

            {/* Modal */}
            <div
                className={`modal-overlay ${selectedStudent ? 'open' : ''}`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) closeModal()
                }}
            >
                {selectedStudent && modalData && (
                    <div className="modal" role="dialog" aria-modal="true">
                        <div className="modal-header">
                            <div className="modal-header-left">
                                <h2 className="modal-title">{selectedStudent.name}</h2>
                                <div className="modal-subtitle">
                                    <span>{selectedStudent.id}</span>
                                    <span>•</span>
                                    <span>{selectedStudent.email}</span>
                                </div>
                            </div>
                            <button className="modal-close" aria-label="Close" onClick={closeModal}>
                                <Icon name="x" size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Student header */}
                            <div className="student-detail-header">
                                <div
                                    className="student-detail-avatar"
                                    style={{ background: getAvatarColor(selectedStudent.name) }}
                                >
                                    {getInitials(selectedStudent.name)}
                                </div>
                                <div className="student-detail-info">
                                    <h2>{selectedStudent.name}</h2>
                                    <p>{selectedStudent.department}</p>
                                    <div className="student-detail-meta">
                                        <div className="meta-chip">
                                            <Icon name="calendar" size={14} />
                                            Enrolled: <strong>{selectedStudent.enrolledDate}</strong>
                                        </div>
                                        <div className="meta-chip">
                                            <Icon name="clock" size={14} />
                                            Last Active: <strong>{selectedStudent.lastActive}</strong>
                                        </div>
                                        <div className="meta-chip">
                                            {getStatusBadge(selectedStudent.status)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="tabs">
                                <button
                                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('overview')}
                                >
                                    Overview
                                </button>
                                <button
                                    className={`tab ${activeTab === 'exams' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('exams')}
                                >
                                    Assigned Exams
                                </button>
                                <button
                                    className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('performance')}
                                >
                                    Performance
                                </button>
                            </div>

                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <>
                                    <div className="detail-section">
                                        <h3>
                                            <Icon name="chart" size={20} />
                                            Performance Summary
                                        </h3>
                                        <div className="perf-grid">
                                            <div className="perf-item">
                                                <div className="label">Total Exams</div>
                                                <div className="value">{selectedStudent.exams.length}</div>
                                            </div>
                                            <div className="perf-item">
                                                <div className="label">Completed</div>
                                                <div className="value green">{modalData.completedExams}</div>
                                            </div>
                                            <div className="perf-item">
                                                <div className="label">Average Score</div>
                                                <div className="value">{modalData.avgScore}%</div>
                                            </div>
                                            <div className="perf-item">
                                                <div className="label">Highest Score</div>
                                                <div className="value green">{modalData.highestScore}%</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h3>
                                            <Icon name="info" size={20} />
                                            Recent Activity
                                        </h3>
                                        <div className="exam-list">
                                            {selectedStudent.exams.slice(0, 3).map((exam, idx) => (
                                                <div className="exam-item" key={`${exam.code}-${idx}`}>
                                                    <div className="exam-item-left">
                                                        <div className="exam-item-title">{exam.title}</div>
                                                        <div className="exam-item-meta">
                                                            <span>{exam.code}</span>
                                                            <span>•</span>
                                                            <span>{exam.date}</span>
                                                        </div>
                                                    </div>
                                                    <div className="exam-item-score">
                                                        <div className="score">{exam.score}</div>
                                                        <div className="total">/ {exam.total}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Exams Tab */}
                            {activeTab === 'exams' && (
                                <div className="detail-section">
                                    <h3>
                                        <Icon name="file" size={20} />
                                        Assigned Exams
                                    </h3>
                                    <div className="exam-list">
                                        {selectedStudent.exams.map((exam, idx) => {
                                            const pct = Math.round((exam.score / exam.total) * 100)
                                            return (
                                                <div className="exam-item" key={`${exam.code}-${idx}`}>
                                                    <div className="exam-item-left">
                                                        <div className="exam-item-title">{exam.title}</div>
                                                        <div className="exam-item-meta">
                                                            <span>{exam.code}</span>
                                                            <span>•</span>
                                                            <span>{exam.date}</span>
                                                            <span>•</span>
                                                            <span
                                                                style={{
                                                                    textTransform: 'uppercase',
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                {exam.status}
                                                            </span>
                                                        </div>
                                                        <div className="progress-bar">
                                                            <div
                                                                className="progress-fill"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="exam-item-score">
                                                        <div className="score">{pct}%</div>
                                                        <div className="total">
                                                            {exam.score}/{exam.total}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Performance Tab */}
                            {activeTab === 'performance' && (
                                <>
                                    <div className="detail-section">
                                        <h3>
                                            <Icon name="chart" size={20} />
                                            Score Breakdown
                                        </h3>
                                        <div className="perf-grid">
                                            <div className="perf-item">
                                                <div className="label">Excellent (90-100)</div>
                                                <div className="value green">{modalData.excellent}</div>
                                            </div>
                                            <div className="perf-item">
                                                <div className="label">Good (80-89)</div>
                                                <div className="value">{modalData.good}</div>
                                            </div>
                                            <div className="perf-item">
                                                <div className="label">Average (70-79)</div>
                                                <div className="value amber">{modalData.average}</div>
                                            </div>
                                            <div className="perf-item">
                                                <div className="label">Needs Improvement (&lt;70)</div>
                                                <div className="value" style={{ color: 'var(--red)' }}>
                                                    {modalData.needsImprovement}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h3>
                                            <Icon name="chart" size={20} />
                                            Exam Performance
                                        </h3>
                                        <div className="exam-list">
                                            {selectedStudent.exams.map((exam, idx) => {
                                                const pct = Math.round((exam.score / exam.total) * 100)
                                                return (
                                                    <div className="exam-item" key={`${exam.code}-${idx}`}>
                                                        <div className="exam-item-left">
                                                            <div className="exam-item-title">{exam.title}</div>
                                                            <div className="exam-item-meta">
                                                                <span>{exam.code}</span>
                                                                <span>•</span>
                                                                <span>{exam.date}</span>
                                                            </div>
                                                            <div className="progress-bar">
                                                                <div
                                                                    className="progress-fill"
                                                                    style={{ width: `${pct}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="exam-item-score">
                                                            <div className="score">{pct}%</div>
                                                            <div className="total">
                                                                {exam.score}/{exam.total}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={closeModal}>
                                Close
                            </button>
                            <button className="btn btn-outline" onClick={editStudent}>
                                <Icon name="edit" size={14} />
                                Edit Student
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Students