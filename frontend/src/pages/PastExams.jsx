import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../lib/api'
import { PageLoader, ErrorState } from '../components/PageLoader'
import '../style/PastExams.css'

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
        search: (
            <>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </>
        ),
        filter: (
            <>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="7" y1="12" x2="17" y2="12" />
                <line x1="10" y1="18" x2="14" y2="18" />
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
        edit: (
            <>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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
        grid: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),
        users: (
            <>
                <circle cx="9" cy="8" r="3" />
                <circle cx="17" cy="9" r="2.5" />
                <path d="M3.5 19c.5-3.2 2.4-5 5.5-5s5 1.8 5.5 5" />
                <path d="M14.5 14.5c2.8-.1 4.8 1.4 5.3 4.5" />
            </>
        ),
        file: (
            <>
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M8 9h8M8 13h8M8 17h5" />
            </>
        ),
        chart: (
            <>
                <path d="M3 3v18h18" />
                <path d="M7 14l4-4 4 4 5-5" />
            </>
        ),
        plus: (
            <>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </>
        ),
        trash: (
            <>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </>
        ),
        info: (
            <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </>
        ),
        sparkles: (
            <>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </>
        ),
        check: <polyline points="20 6 9 17 4 12" />,
    }

    return <svg {...props}>{paths[name]}</svg>
}

/* ============================================================
   DATA
   ============================================================ */

const AVATAR_COLORS = [
    '#1e3a5f',
    '#2563eb',
    '#059669',
    '#d97706',
    '#7c3aed',
    '#dc2626',
    '#0891b2',
    '#be185d',
]

const GRADE_LABELS = [
    { label: 'A (90-100)', key: 'a', cls: 'a' },
    { label: 'B (80-89)', key: 'b', cls: 'b' },
    { label: 'C (70-79)', key: 'c', cls: 'c' },
    { label: 'D (60-69)', key: 'd', cls: 'd' },
    { label: 'F (<60)', key: 'f', cls: 'f' },
]

/* ============================================================
   HELPERS
   ============================================================ */

function initials(name) {
    return name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
}

function avatarColor(name) {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

function PastExams() {
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [filterOpen, setFilterOpen] = useState(false)
    const [filters, setFilters] = useState({
        pending: true,
        approved: true,
        modified: true,
    })

    const [openExamId, setOpenExamId] = useState(null)
    const [currentTab, setCurrentTab] = useState('overview')
    const [studentSearch, setStudentSearch] = useState('')

    const [toast, setToast] = useState('')

    const filterRef = useRef(null)

    const fetchExams = () => {
        let isMounted = true
        setLoading(true)
        setError(null)
        api.get('/api/exams/')
            .then((items) => {
                if (isMounted) {
                    setExams(items.map((exam) => ({
                        id: exam.examination_id,
                        title: exam.exam_name,
                        code: exam.subject,
                        date: new Date(exam.exam_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                        }),
                        dateISO: exam.exam_date,
                        students: exam.student_count,
                        evaluated: exam.evaluated_count,
                        pending: exam.pending_count,
                        average: exam.average_score,
                        highest: exam.highest_score,
                        status: exam.status === 'completed' ? 'approved' : (exam.status === 'partial' ? 'modified' : 'pending'),
                        semester: 'S5',
                        duration: '2 Hours',
                        marks: Number(exam.total_marks || 0),
                        description: '',
                        location: '',
                        supervisor: '',
                        studentList: [],
                        questions: [],
                    })))
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message || 'Unable to load exams.')
                    setToast(err.message || 'Unable to load exams.')
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false)
                }
            })
        return () => {
            isMounted = false
        }
    }

    useEffect(() => {
        const cleanup = fetchExams()
        return cleanup
    }, [])

    /* Close filter dropdown on outside click */
    useEffect(() => {
        function onClick(e) {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setFilterOpen(false)
            }
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [])

    /* Escape key closes modal */
    useEffect(() => {
        if (openExamId === null) return undefined
        function onKey(e) {
            if (e.key === 'Escape') closeModal()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openExamId])

    /* Lock body scroll while modal is open */
    useEffect(() => {
        document.body.style.overflow = openExamId !== null ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [openExamId])

    /* Toast auto-dismiss */
    useEffect(() => {
        if (!toast) return undefined
        const t = setTimeout(() => setToast(''), 2500)
        return () => clearTimeout(t)
    }, [toast])

    /* ============================================================
       FILTERED EXAMS
       ============================================================ */

    const filteredExams = useMemo(() => {
        const q = search.toLowerCase().trim()
        return exams.filter((e) => {
            const matchSearch =
                !q ||
                e.title.toLowerCase().includes(q) ||
                e.code.toLowerCase().includes(q) ||
                e.date.toLowerCase().includes(q)
            const matchFilter = filters[e.status]
            return matchSearch && matchFilter
        })
    }, [exams, search, filters])

    const toggleFilter = (key) => {
        setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    /* ============================================================
       MODAL OPEN / CLOSE
       ============================================================ */

    const openExam = exams.find((e) => e.id === openExamId) || null

    const openModal = async (examId) => {
        setOpenExamId(examId)
        setCurrentTab('overview')
        setStudentSearch('')
        try {
            const detail = await api.get(`/api/exams/${examId}/`)
            setExams((prev) => prev.map((exam) => exam.id !== examId ? exam : {
                ...exam,
                title: detail.exam_name,
                code: detail.subject,
                date: new Date(detail.exam_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                }),
                dateISO: detail.exam_date,
                students: detail.student_count,
                evaluated: detail.evaluated_count,
                pending: detail.pending_count,
                average: detail.average_score,
                highest: detail.highest_score,
                marks: Number(detail.total_marks || 0),
                questions: (detail.questions || []).map((question) => ({
                    number: question.question_number,
                    type: question.question_type,
                    text: question.question_text,
                    marks: Number(question.max_marks),
                    avgScore: question.avg_score || 0,
                    correct: question.avg_score ? Math.round(question.avg_score) : 0,
                })),
                studentList: (detail.students || []).map((student) => ({
                    id: student.roll_number,
                    name: student.full_name,
                    email: student.email,
                    score: student.score || 0,
                    grade: (student.grade || (student.score >= 90 ? 'a' : (student.score >= 80 ? 'b' : (student.score >= 70 ? 'c' : (student.score >= 60 ? 'd' : 'f'))))).toLowerCase(),
                    selected: true,
                })),
            }))
        } catch (error) {
            setToast(error.message || 'Unable to load exam details.')
        }
    }

    const closeModal = () => {
        setOpenExamId(null)
    }

    /* Update the currently open exam */
    const updateOpenExam = (updater) => {
        setExams((prev) =>
            prev.map((e) => (e.id === openExamId ? updater(e) : e))
        )
    }

    /* ============================================================
       MODAL ACTIONS
       ============================================================ */

    const handleSave = async () => {
        if (!openExam) return
        try {
            await api.patch(`/api/exams/${openExam.id}/`, {
                exam_name: openExam.title,
                subject: openExam.code,
                exam_date: openExam.dateISO,
            })
            setToast('✓ Changes saved successfully')
        } catch (err) {
            setToast(err.message || 'Unable to save changes.')
        }
    }

    const handleDelete = async () => {
        if (!openExam) return
        if (
            !window.confirm(
                `Delete "${openExam.title}"? This action cannot be undone.`
            )
        ) {
            return
        }
        try {
            await api.delete(`/api/exams/${openExam.id}/`)
            setExams((prev) => prev.filter((e) => e.id !== openExam.id))
            closeModal()
            setToast('Exam deleted')
        } catch (err) {
            setToast(err.message || 'Unable to delete exam.')
        }
    }

    /* Details form field update */
    const updateDetail = (field, value) => {
        updateOpenExam((e) => ({ ...e, [field]: value }))
    }

    /* Students */
    const toggleStudentSelected = (studentId) => {
        updateOpenExam((e) => ({
            ...e,
            studentList: e.studentList.map((s) =>
                s.id === studentId ? { ...s, selected: !s.selected } : s
            ),
        }))
    }

    const selectAllStudents = () => {
        updateOpenExam((e) => ({
            ...e,
            studentList: e.studentList.map((s) => ({ ...s, selected: true })),
        }))
    }

    const deselectAllStudents = () => {
        updateOpenExam((e) => ({
            ...e,
            studentList: e.studentList.map((s) => ({ ...s, selected: false })),
        }))
    }

    const addStudent = () => {
        const name = window.prompt('Student name:')
        if (!name) return
        const id = window.prompt('Student ID:')
        if (!id) return
        const email =
            window.prompt('Email:') || `${id.toLowerCase()}@university.edu`
        const score = Math.floor(Math.random() * 50) + 50
        const grade =
            score >= 90 ? 'a' : score >= 80 ? 'b' : score >= 70 ? 'c' : score >= 60 ? 'd' : 'f'
        updateOpenExam((e) => ({
            ...e,
            studentList: [
                ...e.studentList,
                { id, name, email, score, grade, selected: true },
            ],
            students: e.studentList.length + 1,
        }))
        setToast('Student added')
    }

    const removeStudent = (studentId) => {
        const s = openExam?.studentList.find((x) => x.id === studentId)
        if (!s) return
        if (!window.confirm(`Remove ${s.name} from this exam?`)) return
        updateOpenExam((e) => {
            const next = e.studentList.filter((x) => x.id !== studentId)
            return { ...e, studentList: next, students: next.length }
        })
        setToast('Student removed')
    }

    /* ============================================================
       RENDER HELPERS
       ============================================================ */

    const statusBadge = (status) => {
        if (status === 'pending') {
            return (
                <span className="past-exam-badge badge-pending">
                    <Icon name="clock" size={12} />
                    Pending
                </span>
            )
        }
        if (status === 'modified') {
            return (
                <span className="past-exam-badge badge-modified">
                    <Icon name="edit" size={12} />
                    Modified
                </span>
            )
        }
        return (
            <span className="past-exam-badge badge-approved">
                <Icon name="checkCircle" size={12} />
                Approved
            </span>
        )
    }

    /* ---------- Table ---------- */
    const renderTable = () => (
        <div className="past-table-wrapper">
            <table className="past-exams-table">
                <thead>
                    <tr>
                        <th>Exam</th>
                        <th>Date</th>
                        <th>Students</th>
                        <th>Evaluated</th>
                        <th>Avg Mark</th>
                        <th>Highest</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExams.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="past-empty-state">
                                No exams found.
                            </td>
                        </tr>
                    ) : (
                        filteredExams.map((e) => (
                            <tr key={e.id} onClick={() => openModal(e.id)}>
                                <td>
                                    <div className="exam-name">{e.title}</div>
                                    <div className="exam-code">{e.code}</div>
                                    <div className="row-click-hint">
                                        Click to manage →
                                    </div>
                                </td>
                                <td className="exam-date">{e.date}</td>
                                <td className="exam-number">{e.students}</td>
                                <td className="exam-number">{e.evaluated}</td>
                                <td className="exam-percentage">{e.average}%</td>
                                <td className="exam-percentage">{e.highest}%</td>
                                <td>{statusBadge(e.status)}</td>
                                <td>
                                    <button
                                        className={`past-action-btn ${e.status === 'pending' ? 'primary' : ''
                                            }`}
                                        onClick={(ev) => {
                                            ev.stopPropagation()
                                            openModal(e.id)
                                        }}
                                    >
                                        {e.status === 'pending' ? 'Review' : 'View'}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )

    /* ---------- Overview Tab ---------- */
    const renderOverview = () => {
        if (!openExam) return null

        const evalPct = Math.round(
            (openExam.evaluated / openExam.students) * 100
        )

        const grades = { a: 0, b: 0, c: 0, d: 0, f: 0 }
        openExam.studentList.forEach((s) => {
            grades[s.grade] = (grades[s.grade] || 0) + 1
        })
        const total = openExam.studentList.length || 1

        return (
            <div className="tab-content">
                <div className="overview-grid">
                    <div className="overview-stat">
                        <div className="label">
                            <Icon name="users" size={14} />
                            Enrolled
                        </div>
                        <div className="value">{openExam.students}</div>
                        <div className="sub">Total students</div>
                    </div>
                    <div className="overview-stat">
                        <div className="label">
                            <Icon name="checkCircle" size={14} />
                            Evaluated
                        </div>
                        <div className="value green">{openExam.evaluated}</div>
                        <div className="sub">{evalPct}% complete</div>
                    </div>
                    <div className="overview-stat">
                        <div className="label">
                            <Icon name="clock" size={14} />
                            Pending
                        </div>
                        <div className="value amber">{openExam.pending}</div>
                        <div className="sub">Awaiting review</div>
                    </div>
                    <div className="overview-stat">
                        <div className="label">
                            <Icon name="chart" size={14} />
                            Average
                        </div>
                        <div className="value">{openExam.average}%</div>
                        <div className="sub">Class mean</div>
                    </div>
                </div>

                <div className="overview-row">
                    <div className="overview-panel">
                        <h3>
                            <Icon name="chart" size={18} />
                            Question Performance
                        </h3>
                        <div>
                            {openExam.questions.map((q) => {
                                const pct = Math.round(
                                    (q.avgScore / q.marks) * 100
                                )
                                return (
                                    <div className="progress-row" key={q.number}>
                                        <div className="progress-label">
                                            Q{q.number}
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <div className="progress-value">
                                            {pct}%
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="overview-panel">
                        <h3>
                            <Icon name="sparkles" size={18} />
                            Grade Distribution
                        </h3>
                        <div className="grade-bars">
                            {GRADE_LABELS.map((g) => {
                                const count = grades[g.key] || 0
                                const pct = Math.round((count / total) * 100)
                                return (
                                    <div className="grade-bar-row" key={g.key}>
                                        <div className="grade-label">
                                            {g.label}
                                        </div>
                                        <div className="grade-bar">
                                            <div
                                                className={`grade-fill ${g.cls}`}
                                                style={{ width: `${pct}%` }}
                                            >
                                                {count}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /* ---------- Details Tab ---------- */
    const renderDetails = () => {
        if (!openExam) return null
        return (
            <div className="tab-content">
                <div className="section-title">
                    <Icon name="file" size={16} />
                    Basic Information
                </div>
                <div className="details-grid">
                    <div className="form-group full">
                        <label>Exam Title</label>
                        <input
                            type="text"
                            value={openExam.title}
                            onChange={(e) =>
                                updateDetail('title', e.target.value)
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Course Code</label>
                        <input
                            type="text"
                            value={openExam.code}
                            onChange={(e) =>
                                updateDetail('code', e.target.value)
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Semester</label>
                        <select
                            value={openExam.semester}
                            onChange={(e) =>
                                updateDetail('semester', e.target.value)
                            }
                        >
                            <option value="S4">S4</option>
                            <option value="S5">S5</option>
                            <option value="S6">S6</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Exam Date</label>
                        <input
                            type="date"
                            value={openExam.dateISO}
                            onChange={(e) =>
                                updateDetail('dateISO', e.target.value)
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Duration</label>
                        <input
                            type="text"
                            value={openExam.duration}
                            onChange={(e) =>
                                updateDetail('duration', e.target.value)
                            }
                            placeholder="e.g. 2 Hours"
                        />
                    </div>
                    <div className="form-group">
                        <label>Total Marks</label>
                        <input
                            type="number"
                            value={openExam.marks}
                            onChange={(e) =>
                                updateDetail('marks', Number(e.target.value))
                            }
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            value={openExam.status}
                            onChange={(e) =>
                                updateDetail('status', e.target.value)
                            }
                        >
                            <option value="pending">Pending Review</option>
                            <option value="approved">Approved</option>
                            <option value="modified">Modified</option>
                        </select>
                    </div>
                </div>

                <div className="section-title">
                    <Icon name="info" size={16} />
                    Additional Information
                </div>
                <div className="details-grid">
                    <div className="form-group full">
                        <label>Description / Instructions</label>
                        <textarea
                            value={openExam.description || ''}
                            onChange={(e) =>
                                updateDetail('description', e.target.value)
                            }
                            placeholder="Add exam instructions or notes..."
                        />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            value={openExam.location || ''}
                            onChange={(e) =>
                                updateDetail('location', e.target.value)
                            }
                            placeholder="e.g. Hall A"
                        />
                    </div>
                    <div className="form-group">
                        <label>Supervisor</label>
                        <input
                            type="text"
                            value={openExam.supervisor || ''}
                            onChange={(e) =>
                                updateDetail('supervisor', e.target.value)
                            }
                            placeholder="e.g. Prof. Anderson"
                        />
                    </div>
                </div>
            </div>
        )
    }

    /* ---------- Students Tab ---------- */
    const renderStudents = () => {
        if (!openExam) return null

        const q = studentSearch.toLowerCase().trim()
        const filtered = openExam.studentList.filter(
            (s) =>
                !q ||
                s.name.toLowerCase().includes(q) ||
                s.id.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q)
        )

        const selectedCount = openExam.studentList.filter((s) => s.selected).length

        return (
            <div className="tab-content">
                <div className="students-toolbar">
                    <div className="search-box">
                        <Icon name="search" size={16} />
                        <input
                            type="text"
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            placeholder="Search students..."
                        />
                    </div>
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={selectAllStudents}
                    >
                        Select All
                    </button>
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={deselectAllStudents}
                    >
                        Deselect All
                    </button>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={addStudent}
                    >
                        <Icon name="plus" size={14} />
                        Add Student
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="student-table">
                        <thead>
                            <tr>
                                <th style={{ width: 40 }} />
                                <th>Student</th>
                                <th>Student ID</th>
                                <th>Score</th>
                                <th>Grade</th>
                                <th style={{ width: 60 }} />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        style={{
                                            textAlign: 'center',
                                            padding: 30,
                                            color: 'var(--g500)',
                                        }}
                                    >
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((s) => (
                                    <tr key={s.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="student-checkbox"
                                                checked={s.selected}
                                                onChange={() =>
                                                    toggleStudentSelected(s.id)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <div className="student-info">
                                                <div
                                                    className="student-avatar"
                                                    style={{
                                                        background: avatarColor(
                                                            s.name
                                                        ),
                                                    }}
                                                >
                                                    {initials(s.name)}
                                                </div>
                                                <div>
                                                    <div className="student-name">
                                                        {s.name}
                                                    </div>
                                                    <div className="student-email">
                                                        {s.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{s.id}</td>
                                        <td>
                                            <strong>{s.score}</strong> /{' '}
                                            {openExam.marks}
                                        </td>
                                        <td>
                                            <span
                                                className={`student-grade ${s.grade}`}
                                            >
                                                {s.grade.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="student-remove"
                                                title="Remove"
                                                onClick={() =>
                                                    removeStudent(s.id)
                                                }
                                            >
                                                ×
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="students-summary">
                    <span className="badge">
                        {selectedCount} student
                        {selectedCount !== 1 ? 's' : ''} selected
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--g500)' }}>
                        Showing {filtered.length} of{' '}
                        {openExam.studentList.length}
                    </span>
                </div>
            </div>
        )
    }

    /* ---------- Questions Tab ---------- */
    const renderQuestions = () => {
        if (!openExam) return null
        const list = openExam.questions

        if (list.length === 0) {
            return (
                <div
                    className="tab-content"
                    style={{
                        textAlign: 'center',
                        padding: 40,
                        color: 'var(--g500)',
                    }}
                >
                    No questions available.
                </div>
            )
        }

        const typeLabel = (t) =>
            t === 'mcq'
                ? 'MCQ'
                : t === 'descriptive'
                    ? 'Descriptive'
                    : t === 'short'
                        ? 'Short Answer'
                        : 'True/False'

        return (
            <div className="tab-content">
                {list.map((q) => (
                    <div className="question-card" key={q.number}>
                        <div className="question-header">
                            <div className="question-header-left">
                                <span className="question-number">
                                    Q{q.number}
                                </span>
                                <span className={`question-type ${q.type}`}>
                                    {typeLabel(q.type)}
                                </span>
                            </div>
                            <span className="question-marks">
                                {q.marks} marks
                            </span>
                        </div>
                        <div className="question-text">{q.text}</div>
                        <div className="question-stats">
                            <div className="question-stat">
                                Avg Score:{' '}
                                <strong>
                                    {q.avgScore}/{q.marks}
                                </strong>
                            </div>
                            <div className="question-stat">
                                Correct:{' '}
                                <strong>
                                    {q.correct}/{openExam.students}
                                </strong>
                            </div>
                            <div className="question-stat">
                                Success Rate:{' '}
                                <strong>
                                    {Math.round(
                                        (q.correct / openExam.students) * 100
                                    )}
                                    %
                                </strong>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    /* ---------- Results Tab ---------- */
    const renderResults = () => {
        if (!openExam) return null

        const passing = openExam.studentList.filter(
            (s) => s.score >= openExam.marks * 0.5
        ).length
        const passRate = openExam.studentList.length
            ? Math.round((passing / openExam.studentList.length) * 100)
            : 0

        const ranges = [
            { label: '90-100', min: 90, max: 100, cls: 'a' },
            { label: '80-89', min: 80, max: 89, cls: 'b' },
            { label: '70-79', min: 70, max: 79, cls: 'c' },
            { label: '60-69', min: 60, max: 69, cls: 'd' },
            { label: '<60', min: 0, max: 59, cls: 'f' },
        ]
        const total = openExam.studentList.length || 1

        return (
            <div className="tab-content">
                <div className="results-summary">
                    <div className="result-card">
                        <div className="label">Class Average</div>
                        <div className="value">{openExam.average}%</div>
                    </div>
                    <div className="result-card">
                        <div className="label">Highest Score</div>
                        <div className="value green">{openExam.highest}%</div>
                    </div>
                    <div className="result-card">
                        <div className="label">Pass Rate</div>
                        <div className="value">{passRate}%</div>
                    </div>
                </div>

                <div className="overview-panel">
                    <h3>
                        <Icon name="sparkles" size={18} />
                        Score Distribution
                    </h3>
                    <div className="grade-bars">
                        {ranges.map((r) => {
                            const count = openExam.studentList.filter(
                                (s) => s.score >= r.min && s.score <= r.max
                            ).length
                            const pct = Math.round((count / total) * 100)
                            return (
                                <div className="grade-bar-row" key={r.label}>
                                    <div className="grade-label">{r.label}</div>
                                    <div className="grade-bar">
                                        <div
                                            className={`grade-fill ${r.cls}`}
                                            style={{ width: `${pct}%` }}
                                        >
                                            {count}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    /* ============================================================
       MAIN RENDER
       ============================================================ */

    if (loading) {
        return <PageLoader message="Loading past examinations..." />
    }

    if (error) {
        return <ErrorState message={error} onRetry={fetchExams} />
    }

    const avgMark = exams.length > 0
        ? Math.round(exams.reduce((s, e) => s + (Number(e.average) || 0), 0) / exams.length)
        : 0

    const highestMark = exams.length > 0
        ? Math.max(0, ...exams.map((e) => Number(e.highest) || 0))
        : 0

    return (
        <div className="past-exams-page">
            <div className="page-header">
                <p>
                   View previous examinations, analyse AI-evaluated results and review student performance.
                </p>
            </div>
            <section className="past-exams-stats">
                <div className="past-stat-card">
                    <div className="past-stat-label">Total Exams</div>
                    <div className="past-stat-value">{exams.length}</div>
                </div>
                <div className="past-stat-card">
                    <div className="past-stat-label">Evaluated</div>
                    <div className="past-stat-value">
                        {exams.filter((e) => e.evaluated === e.students && e.students > 0).length}
                    </div>
                </div>
                <div className="past-stat-card past-stat-highlight">
                    <div className="past-stat-label">Pending Review</div>
                    <div className="past-stat-value">
                        {exams.filter((e) => e.status === 'pending').length}
                    </div>
                </div>
                <div className="past-stat-card">
                    <div className="past-stat-label">Average Mark</div>
                    <div className="past-stat-value">
                        {avgMark}
                        <span>%</span>
                    </div>
                </div>
                <div className="past-stat-card">
                    <div className="past-stat-label">Highest</div>
                    <div className="past-stat-value">
                        {highestMark}
                        <span>%</span>
                    </div>
                </div>
            </section>

            <section className="past-exams-table-card">
                <div className="past-exams-toolbar">
                    <div className="past-search-box">
                        <Icon name="search" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search exams..."
                        />
                    </div>
                    <div className="past-filter-wrapper" ref={filterRef}>
                        <button
                            className="past-filter-btn"
                            onClick={() => setFilterOpen((o) => !o)}
                            aria-label="Filter exams"
                        >
                            <Icon name="filter" size={18} />
                        </button>
                        {filterOpen && (
                            <div className="past-filter-dropdown">
                                <label className="past-filter-option">
                                    <input
                                        type="checkbox"
                                        checked={filters.pending}
                                        onChange={() => toggleFilter('pending')}
                                    />
                                    Pending Review
                                </label>
                                <label className="past-filter-option">
                                    <input
                                        type="checkbox"
                                        checked={filters.approved}
                                        onChange={() =>
                                            toggleFilter('approved')
                                        }
                                    />
                                    Approved
                                </label>
                                <label className="past-filter-option">
                                    <input
                                        type="checkbox"
                                        checked={filters.modified}
                                        onChange={() =>
                                            toggleFilter('modified')
                                        }
                                    />
                                    Modified
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {renderTable()}

                <div className="past-table-footer">
                    Showing {filteredExams.length} of {exams.length} exams
                </div>
            </section>

            {/* ---------- Modal ---------- */}
            <div
                className={`modal-overlay ${openExamId !== null ? 'open' : ''}`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) closeModal()
                }}
            >
                {openExam && (
                    <div className="modal" role="dialog" aria-modal="true">
                        <div className="modal-header">
                            <div className="modal-header-left">
                                <div className="modal-breadcrumb">
                                    <span>Past Exams</span>
                                    <span className="sep">/</span>
                                    <span>{openExam.code}</span>
                                </div>
                                <h2 className="modal-title">
                                    {openExam.title}
                                </h2>
                                <div className="modal-subtitle">
                                    <span className="exam-code-tag">
                                        {openExam.code}
                                    </span>
                                    <span className="date-tag">
                                        <Icon name="calendar" size={14} />
                                        <span>{openExam.date}</span>
                                    </span>
                                    <span>{statusBadge(openExam.status)}</span>
                                </div>
                            </div>
                            <button
                                className="modal-close"
                                aria-label="Close"
                                onClick={closeModal}
                            >
                                <Icon name="x" size={20} />
                            </button>
                        </div>

                        <div className="modal-tabs">
                            <button
                                className={`modal-tab ${currentTab === 'overview' ? 'active' : ''
                                    }`}
                                onClick={() => setCurrentTab('overview')}
                            >
                                <Icon name="grid" size={16} />
                                Overview
                            </button>
                            <button
                                className={`modal-tab ${currentTab === 'details' ? 'active' : ''
                                    }`}
                                onClick={() => setCurrentTab('details')}
                            >
                                <Icon name="edit" size={16} />
                                Details
                            </button>
                            <button
                                className={`modal-tab ${currentTab === 'students' ? 'active' : ''
                                    }`}
                                onClick={() => setCurrentTab('students')}
                            >
                                <Icon name="users" size={16} />
                                Students
                                <span className="tab-count">
                                    {openExam.studentList.length}
                                </span>
                            </button>
                            <button
                                className={`modal-tab ${currentTab === 'questions' ? 'active' : ''
                                    }`}
                                onClick={() => setCurrentTab('questions')}
                            >
                                <Icon name="file" size={16} />
                                Questions
                                <span className="tab-count">
                                    {openExam.questions.length}
                                </span>
                            </button>
                            <button
                                className={`modal-tab ${currentTab === 'results' ? 'active' : ''
                                    }`}
                                onClick={() => setCurrentTab('results')}
                            >
                                <Icon name="chart" size={16} />
                                Results
                            </button>
                        </div>

                        <div className="modal-body">
                            {currentTab === 'overview' && renderOverview()}
                            {currentTab === 'details' && renderDetails()}
                            {currentTab === 'students' && renderStudents()}
                            {currentTab === 'questions' && renderQuestions()}
                            {currentTab === 'results' && renderResults()}
                        </div>

                        <div className="modal-footer">
                            <div className="modal-footer-left">
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={handleDelete}
                                >
                                    <Icon name="trash" size={14} />
                                    Delete Exam
                                </button>
                            </div>
                            <div className="modal-footer-right">
                                <button
                                    className="btn btn-ghost"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={handleSave}
                                >
                                    <Icon name="check" size={14} />
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
        </div>
    )
}

export default PastExams
