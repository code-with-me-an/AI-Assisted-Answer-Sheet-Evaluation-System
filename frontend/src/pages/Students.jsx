import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { PageLoader, ErrorState } from '../components/PageLoader'
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
        trash: (
            <>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </>
        ),
    }

    return <svg {...props}>{paths[name]}</svg>
}

const AVATAR_COLORS = ['#1e3a5f', '#2563eb', '#059669', '#d97706', '#7c3aed', '#dc2626', '#0891b2', '#be185d']

/* ============================================================
   HELPERS
   ============================================================ */

function getInitials(name) {
    if (!name) return 'ST'
    return name
        .split(' ')
        .filter(Boolean)
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
}

function getAvatarColor(name) {
    if (!name) return AVATAR_COLORS[0]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getStatusBadge(status) {
    if (status === 'active' || status === 'completed') return <span className="badge badge-active">Active</span>
    if (status === 'inactive') return <span className="badge badge-inactive">Inactive</span>
    return <span className="badge badge-pending">Pending</span>
}

function calculateAverage(exams) {
    if (!exams || exams.length === 0) return 0
    const scoredExams = exams.filter((e) => e.total > 0 && e.score !== null && e.score !== undefined)
    if (scoredExams.length === 0) return 0
    const total = scoredExams.reduce((sum, exam) => sum + (Number(exam.score) / Number(exam.total)) * 100, 0)
    return Math.round(total / scoredExams.length)
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

function Students() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [examFilter, setExamFilter] = useState('all')

    const [selectedStudent, setSelectedStudent] = useState(null)
    const [activeTab, setActiveTab] = useState('overview')

    /* --- Add / Edit Modal State --- */
    const [modalMode, setModalMode] = useState(null) // null | 'add' | 'edit'
    const [formStudent, setFormStudent] = useState({ full_name: '', roll_number: '', email: '' })
    const [formError, setFormError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    /* --- Toast state --- */
    const [toast, setToast] = useState({ msg: '', error: false })

    const showToast = (msg, isError = false) => setToast({ msg, error: isError })

    useEffect(() => {
        if (!toast.msg) return undefined
        const t = setTimeout(() => setToast({ msg: '', error: false }), 3000)
        return () => clearTimeout(t)
    }, [toast])

    const fetchStudents = async () => {
        setLoading(true)
        setError(null)
        try {
            const items = await api.get('/api/students/')
            if (Array.isArray(items)) {
                const parsed = items.map((student) => {
                    const exams = (student.exams || []).map((e) => ({
                        id: e.exam_id,
                        code: e.code || 'EXAM',
                        title: e.title,
                        score: e.score !== null && e.score !== undefined ? Number(e.score) : null,
                        total: e.total ? Number(e.total) : 100,
                        pct: e.pct !== null && e.pct !== undefined ? Number(e.pct) : 0,
                        grade: e.grade || '',
                        status: e.status || 'pending',
                        isFinalized: !!e.is_finalized,
                        date: e.date || '',
                    }))

                    const enrolledDate = student.created_at
                        ? new Date(student.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        : 'Sep 2026'

                    const lastActive = exams.length > 0 ? `${exams.length} Exam${exams.length !== 1 ? 's' : ''}` : 'Recently'
                    const status = exams.length > 0 ? 'active' : 'pending'

                    return {
                        id: student.roll_number || String(student.student_id),
                        student_id: student.student_id,
                        name: student.full_name,
                        rollNumber: student.roll_number,
                        email: student.email || `${(student.roll_number || 'student').toLowerCase()}@university.edu`,
                        department: 'Department of Computer Science',
                        enrolledDate,
                        lastActive,
                        status,
                        exams,
                        averageScore: student.average_score !== undefined ? Number(student.average_score) : calculateAverage(exams),
                    }
                })
                setStudents(parsed)
            } else {
                setStudents([])
            }
        } catch (err) {
            setError(err.message || 'Unable to load students.')
            showToast(err.message || 'Unable to load students.', true)
            setStudents([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const availableExamCodes = useMemo(() => {
        const set = new Set()
        students.forEach((s) => s.exams?.forEach((e) => { if (e.code) set.add(e.code) }))
        return Array.from(set)
    }, [students])

    /* ---------- Escape key closes modal ---------- */
    useEffect(() => {
        if (!selectedStudent && !modalMode) return undefined
        function onKey(e) {
            if (e.key === 'Escape') {
                if (modalMode) setModalMode(null)
                else closeModal()
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [selectedStudent, modalMode])

    /* ---------- Body scroll lock while modal open ---------- */
    useEffect(() => {
        document.body.style.overflow = (selectedStudent || modalMode) ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [selectedStudent, modalMode])

    /* ============================================================
       FILTERING
       ============================================================ */

    const filteredStudents = useMemo(() => {
        const q = search.toLowerCase().trim()
        return students.filter((student) => {
            const matchSearch =
                !q ||
                student.name.toLowerCase().includes(q) ||
                student.id.toLowerCase().includes(q) ||
                student.rollNumber.toLowerCase().includes(q) ||
                student.email.toLowerCase().includes(q)
            const matchStatus = statusFilter === 'all' || student.status === statusFilter
            const matchExam =
                examFilter === 'all' ||
                student.exams.some((exam) => exam.code === examFilter || exam.title.toLowerCase().includes(examFilter.toLowerCase()))
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
        const scoredStudents = students.filter((s) => s.exams.length > 0)
        const avg = scoredStudents.length
            ? Math.round(scoredStudents.reduce((sum, s) => sum + calculateAverage(s.exams), 0) / scoredStudents.length * 10) / 10
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

    const openAddStudentModal = () => {
        setFormStudent({ full_name: '', roll_number: '', email: '' })
        setFormError('')
        setModalMode('add')
    }

    const openEditStudentModal = (student) => {
        const target = student || selectedStudent
        if (!target) return
        setFormStudent({
            full_name: target.name,
            roll_number: target.rollNumber || target.id,
            email: target.email || '',
            student_id: target.student_id,
        })
        setFormError('')
        setModalMode('edit')
    }

    const handleSaveStudent = async (e) => {
        if (e) e.preventDefault()
        const { full_name, roll_number, email, student_id } = formStudent
        if (!full_name.trim() || !roll_number.trim()) {
            setFormError('Please enter both student name and roll number.')
            return
        }

        setIsSubmitting(true)
        setFormError('')

        try {
            if (modalMode === 'add') {
                await api.post('/api/students/', {
                    full_name: full_name.trim(),
                    roll_number: roll_number.trim(),
                    email: email.trim(),
                })
                showToast('✓ Student added successfully')
            } else if (modalMode === 'edit' && student_id) {
                await api.patch(`/api/students/${student_id}/`, {
                    full_name: full_name.trim(),
                    roll_number: roll_number.trim(),
                    email: email.trim(),
                })
                showToast('✓ Student details updated')
            }
            setModalMode(null)
            await fetchStudents()
            if (selectedStudent && modalMode === 'edit') {
                setSelectedStudent((prev) => ({
                    ...prev,
                    name: full_name.trim(),
                    rollNumber: roll_number.trim(),
                    id: roll_number.trim(),
                    email: email.trim(),
                }))
            }
        } catch (err) {
            setFormError(err.message || 'Operation failed. Please check inputs.')
        } finally {
            setIsSubmitting(false)
        }
    }

    /* ============================================================
       MODAL DATA (derived)
       ============================================================ */

    const modalData = useMemo(() => {
        if (!selectedStudent) return null
        const s = selectedStudent
        const avgScore = calculateAverage(s.exams)
        const completedExams = s.exams.filter((e) => e.isFinalized || e.status === 'completed').length
        const scoredExams = s.exams.filter((e) => e.score !== null && e.total > 0)
        const highestScore = scoredExams.length > 0
            ? Math.max(...scoredExams.map((e) => (e.score / e.total) * 100))
            : 0

        const excellent = scoredExams.filter((e) => (e.score / e.total) * 100 >= 90).length
        const good = scoredExams.filter((e) => {
            const pct = (e.score / e.total) * 100
            return pct >= 80 && pct < 90
        }).length
        const average = scoredExams.filter((e) => {
            const pct = (e.score / e.total) * 100
            return pct >= 70 && pct < 80
        }).length
        const needsImprovement = scoredExams.filter((e) => (e.score / e.total) * 100 < 70).length

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

    if (loading) {
        return <PageLoader message="Loading student records..." />
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchStudents} />
    }

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
                    <div className="stat-sub">Awaiting evaluation</div>
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
                                placeholder="Search by name, roll number, or email..."
                            />
                        </div>
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                        </select>
                        <select
                            className="filter-select"
                            value={examFilter}
                            onChange={(e) => setExamFilter(e.target.value)}
                        >
                            <option value="all">All Exams</option>
                            {availableExamCodes.map((code) => (
                                <option key={code} value={code}>{code}</option>
                            ))}
                        </select>
                        <button className="btn btn-primary btn-sm" onClick={openAddStudentModal}>
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
                                <th>Roll Number</th>
                                <th>Enrolled Exams</th>
                                <th>Average Score</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="empty-state">
                                        Loading students...
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="empty-state">
                                        No students found. Add a new student or assign students in Create Exam.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => {
                                    const avgScore = calculateAverage(student.exams)
                                    return (
                                        <tr key={student.student_id || student.id} onClick={() => openModal(student)}>
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
                                            <td style={{ fontWeight: 500 }}>{student.rollNumber || student.id}</td>
                                            <td style={{ fontWeight: 500 }}>{student.exams.length}</td>
                                            <td style={{ fontWeight: 600 }}>{avgScore > 0 ? `${avgScore}%` : '—'}</td>
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
                        Click any row to view details &amp; exam history
                    </span>
                </div>
            </div>

            {/* Student Detail Modal */}
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
                                    <span>{selectedStudent.rollNumber || selectedStudent.id}</span>
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
                                            Assigned: <strong>{selectedStudent.lastActive}</strong>
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
                                    Assigned Exams ({selectedStudent.exams.length})
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
                                                <div className="value">{modalData.avgScore > 0 ? `${modalData.avgScore}%` : '—'}</div>
                                            </div>
                                            <div className="perf-item">
                                                <div className="label">Highest Score</div>
                                                <div className="value green">{modalData.highestScore > 0 ? `${modalData.highestScore}%` : '—'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h3>
                                            <Icon name="info" size={20} />
                                            Recent Examination Activity
                                        </h3>
                                        {selectedStudent.exams.length === 0 ? (
                                            <div style={{ padding: 20, textAlign: 'center', color: 'var(--g500)', background: 'var(--g50)', borderRadius: 8 }}>
                                                No examinations assigned yet.
                                            </div>
                                        ) : (
                                            <div className="exam-list">
                                                {selectedStudent.exams.slice(0, 4).map((exam, idx) => (
                                                    <div className="exam-item" key={`${exam.id || exam.code}-${idx}`}>
                                                        <div className="exam-item-left">
                                                            <div className="exam-item-title">{exam.title}</div>
                                                            <div className="exam-item-meta">
                                                                <span>{exam.code}</span>
                                                                <span>•</span>
                                                                <span>{exam.date}</span>
                                                                <span>•</span>
                                                                <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                                                    {exam.isFinalized ? 'FINALIZED' : (exam.status || 'PENDING')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="exam-item-score">
                                                            <div className="score">
                                                                {exam.score !== null ? exam.score : '—'}
                                                            </div>
                                                            <div className="total">
                                                                / {exam.total} {exam.grade ? `(${exam.grade})` : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Exams Tab */}
                            {activeTab === 'exams' && (
                                <div className="detail-section">
                                    <h3>
                                        <Icon name="file" size={20} />
                                        Assigned Examinations
                                    </h3>
                                    {selectedStudent.exams.length === 0 ? (
                                        <div style={{ padding: 20, textAlign: 'center', color: 'var(--g500)', background: 'var(--g50)', borderRadius: 8 }}>
                                            No examinations assigned yet.
                                        </div>
                                    ) : (
                                        <div className="exam-list">
                                            {selectedStudent.exams.map((exam, idx) => {
                                                const pct = exam.score !== null && exam.total > 0 ? Math.round((exam.score / exam.total) * 100) : 0
                                                return (
                                                    <div className="exam-item" key={`${exam.id || exam.code}-${idx}`}>
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
                                                                        color: exam.isFinalized ? 'var(--green)' : 'var(--amber)',
                                                                    }}
                                                                >
                                                                    {exam.isFinalized ? `Finalized (${exam.grade || 'Pass'})` : (exam.status || 'Pending')}
                                                                </span>
                                                            </div>
                                                            {exam.score !== null && (
                                                                <div className="progress-bar">
                                                                    <div
                                                                        className="progress-fill"
                                                                        style={{ width: `${pct}%` }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="exam-item-score">
                                                            <div className="score">{exam.score !== null ? `${pct}%` : '—'}</div>
                                                            <div className="total">
                                                                {exam.score !== null ? `${exam.score}/${exam.total}` : 'Pending evaluation'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
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
                                        {selectedStudent.exams.length === 0 ? (
                                            <div style={{ padding: 20, textAlign: 'center', color: 'var(--g500)', background: 'var(--g50)', borderRadius: 8 }}>
                                                No scored examinations available.
                                            </div>
                                        ) : (
                                            <div className="exam-list">
                                                {selectedStudent.exams.map((exam, idx) => {
                                                    const pct = exam.score !== null && exam.total > 0 ? Math.round((exam.score / exam.total) * 100) : 0
                                                    return (
                                                        <div className="exam-item" key={`${exam.id || exam.code}-${idx}`}>
                                                            <div className="exam-item-left">
                                                                <div className="exam-item-title">{exam.title}</div>
                                                                <div className="exam-item-meta">
                                                                    <span>{exam.code}</span>
                                                                    <span>•</span>
                                                                    <span>{exam.date}</span>
                                                                </div>
                                                                {exam.score !== null && (
                                                                    <div className="progress-bar">
                                                                        <div
                                                                            className="progress-fill"
                                                                            style={{ width: `${pct}%` }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="exam-item-score">
                                                                <div className="score">{exam.score !== null ? `${pct}%` : '—'}</div>
                                                                <div className="total">
                                                                    {exam.score !== null ? `${exam.score}/${exam.total}` : 'Pending'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={closeModal}>
                                Close
                            </button>
                            <button className="btn btn-outline" onClick={() => openEditStudentModal(selectedStudent)}>
                                <Icon name="edit" size={14} />
                                Edit Student
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add / Edit Student Modal */}
            <div
                className={`modal-overlay ${modalMode ? 'open' : ''}`}
                onClick={(e) => {
                    if (e.target === e.currentTarget && !isSubmitting) setModalMode(null)
                }}
            >
                {modalMode && (
                    <div className="modal" role="dialog" aria-modal="true" style={{ maxWidth: 520 }}>
                        <div className="modal-header">
                            <div className="modal-header-left">
                                <h2 className="modal-title">
                                    {modalMode === 'add' ? 'Add New Student' : 'Edit Student Details'}
                                </h2>
                                <p style={{ margin: 0, fontSize: 13, color: 'var(--g500)' }}>
                                    {modalMode === 'add' ? 'Register a student for your courses and examinations.' : 'Update student roll number, full name, or email.'}
                                </p>
                            </div>
                            <button
                                className="modal-close"
                                aria-label="Close"
                                onClick={() => !isSubmitting && setModalMode(null)}
                            >
                                <Icon name="x" size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveStudent}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {formError && (
                                    <div style={{ padding: '10px 14px', background: 'var(--red-l)', border: '1px solid var(--red)', borderRadius: 8, color: 'var(--red)', fontSize: 13 }}>
                                        {formError}
                                    </div>
                                )}
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: 'var(--g700)', marginBottom: 6 }}>
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--brd)', borderRadius: 8, fontSize: 14 }}
                                        placeholder="e.g. Rahul Kumar"
                                        value={formStudent.full_name}
                                        onChange={(e) => setFormStudent({ ...formStudent, full_name: e.target.value })}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: 'var(--g700)', marginBottom: 6 }}>
                                        Roll Number / Student ID *
                                    </label>
                                    <input
                                        type="text"
                                        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--brd)', borderRadius: 8, fontSize: 14 }}
                                        placeholder="e.g. CS001"
                                        value={formStudent.roll_number}
                                        onChange={(e) => setFormStudent({ ...formStudent, roll_number: e.target.value })}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, color: 'var(--g700)', marginBottom: 6 }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--brd)', borderRadius: 8, fontSize: 14 }}
                                        placeholder="e.g. rahul@university.edu"
                                        value={formStudent.email}
                                        onChange={(e) => setFormStudent({ ...formStudent, email: e.target.value })}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setModalMode(null)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : (modalMode === 'add' ? 'Register Student' : 'Save Changes')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Toast */}
            <div className={`toast ${toast.msg ? 'show' : ''} ${toast.error ? 'error' : ''}`}>
                {toast.msg}
            </div>
        </div>
    )
}

export default Students
