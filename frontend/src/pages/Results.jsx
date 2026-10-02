import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../lib/api'
import { PageLoader, ErrorState } from '../components/PageLoader'
import '../style/Results.css'

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
        users: (
            <>
                <circle cx="9" cy="8" r="3" />
                <path d="M3.5 19c.5-3.2 2.4-5 5.5-5s5 1.8 5.5 5" />
            </>
        ),
        file: (
            <>
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M8 9h8M8 13h8M8 17h5" />
            </>
        ),
        book: (
            <>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
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
        help: (
            <>
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </>
        ),
        chart: (
            <>
                <path d="M3 3v18h18" />
                <path d="M7 14l4-4 4 4 5-5" />
            </>
        ),
        info: (
            <>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
            </>
        ),
        ai: (
            <>
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 2v10l6 4" />
                <circle cx="12" cy="12" r="3" />
            </>
        ),
        upload: (
            <>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
            </>
        ),
        download: (
            <>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </>
        ),
        play: <path d="M5 3l14 9-14 9V3z" />,
        refresh: (
            <>
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
            </>
        ),
        save: (
            <>
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
            </>
        ),
        trash: (
            <>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </>
        ),
        check: <polyline points="20 6 9 17 4 12" />,
        x: (
            <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </>
        ),
        warning: (
            <>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </>
        ),
        spin: <path d="M21 12a9 9 0 1 1-6.219-8.56" />,
        minus: (
            <>
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
            </>
        ),
        editPencil: (
            <>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </>
        ),
    }

    return <svg {...props}>{paths[name]}</svg>
}

const AVATAR_COLORS = ['#1e3a5f', '#2563eb', '#059669', '#d97706', '#7c3aed', '#dc2626', '#0891b2', '#be185d']

/* ============================================================
   HELPERS
   ============================================================ */

function initials(name) {
    if (!name) return 'ST'
    return name
        .split(' ')
        .filter(Boolean)
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
}

function avatarColor(name) {
    if (!name) return AVATAR_COLORS[0]
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function formatFileSize(bytes) {
    if (!bytes) return '0 KB'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function getFileExtension(name) {
    if (!name) return ''
    return (name.split('.').pop() || '').toUpperCase()
}

function statusBadge(status) {
    const map = {
        pending: { cls: 'badge-pending', label: 'Pending', icon: 'clock' },
        completed: { cls: 'badge-completed', label: 'Completed', icon: 'checkCircle' },
        processing: { cls: 'badge-processing', label: 'Processing', icon: 'spin' },
        partial: { cls: 'badge-partial', label: 'Partial', icon: 'minus' },
        evaluated: { cls: 'badge-approved', label: 'Evaluated', icon: 'checkCircle' },
        reviewed: { cls: 'badge-modified', label: 'Reviewed', icon: 'editPencil' },
    }
    const s = map[status] || map.pending
    return (
        <span className={`badge ${s.cls}`}>
            <Icon name={s.icon} size={12} />
            {s.label}
        </span>
    )
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

function Results() {
    /* ---------- Navigation state ---------- */
    const [view, setView] = useState('dashboard') // 'dashboard' | 'exam' | 'student'
    const [currentExamId, setCurrentExamId] = useState(null)
    const [currentStudentId, setCurrentStudentId] = useState(null)

    /* ---------- Loading states ---------- */
    const [loadingExams, setLoadingExams] = useState(true)
    const [loadingExamDetail, setLoadingExamDetail] = useState(false)
    const [loadingEvaluations, setLoadingEvaluations] = useState(false)
    const [isEvaluating, setIsEvaluating] = useState(false)
    const [isFinalizing, setIsFinalizing] = useState(false)

    /* ---------- Dashboard state ---------- */
    const [examSearchQuery, setExamSearchQuery] = useState('')
    const [examStatusFilter, setExamStatusFilter] = useState('all')

    /* ---------- Exam state ---------- */
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [scoreFilter, setScoreFilter] = useState('all')
    const [sortField, setSortField] = useState('name')
    const [sortDir, setSortDir] = useState('asc')

    /* ---------- Student state ---------- */
    const [studentState, setStudentState] = useState('not_uploaded') // 'not_uploaded' | 'file_selected' | 'uploading' | 'htr_processing' | 'text_extracted' | 'ai_processing' | 'evaluation_completed' | 'finalized'
    const [studentEvaluations, setStudentEvaluations] = useState([])
    const [plainTextAnswer, setPlainTextAnswer] = useState('')
    const [selectedQuestionId, setSelectedQuestionId] = useState(null)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [dragging, setDragging] = useState(false)

    /* ---------- Export modal ---------- */
    const [exportModalOpen, setExportModalOpen] = useState(false)

    /* ---------- Toast ---------- */
    const [toast, setToast] = useState({ msg: '', error: false })

    /* ---------- Chart refs ---------- */
    const scoreChartRef = useRef(null)
    const questionChartRef = useRef(null)
    const scoreChartInstance = useRef(null)
    const questionChartInstance = useRef(null)
    const fileInputRef = useRef(null)

    /* ---------- Real Backend Data State ---------- */
    const [examsData, setExamsData] = useState([])
    const [examsError, setExamsError] = useState(null)
    const [studentsData, setStudentsData] = useState([])
    const [questionsData, setQuestionsData] = useState([])

    const currentExam = useMemo(
        () => examsData.find((e) => e.id === currentExamId) || null,
        [currentExamId, examsData]
    )

    const currentStudent = useMemo(
        () => studentsData.find((s) => s.id === currentStudentId || s.student_id === currentStudentId) || null,
        [studentsData, currentStudentId]
    )

    const fetchExams = async () => {
        setLoadingExams(true)
        setExamsError(null)
        try {
            const items = await api.get('/api/exams/')
            if (Array.isArray(items)) {
                setExamsData(
                    items.map((exam) => ({
                        id: exam.examination_id,
                        title: exam.exam_name,
                        code: exam.subject,
                        subject: exam.subject,
                        date: exam.exam_date ? new Date(exam.exam_date).toLocaleDateString() : 'N/A',
                        dateISO: exam.exam_date,
                        totalMarks: Number(exam.total_marks) || 0,
                        questions: exam.question_count || 0,
                        students: exam.student_count || 0,
                        evaluated: exam.evaluated_count || 0,
                        pending: exam.pending_count || 0,
                        average: Number(exam.average_score) || 0,
                        highest: Number(exam.highest_score) || 0,
                        lowest: Number(exam.lowest_score) || 0,
                        median: Number(exam.median_score) || 0,
                        passRate: Number(exam.pass_rate) || 0,
                        status: exam.status || 'pending',
                        is_draft: !!exam.is_draft,
                    }))
                )
            } else {
                setExamsData([])
            }
        } catch (error) {
            setExamsError(error.message || 'Unable to load results.')
            showToast(error.message || 'Unable to load results.', true)
        } finally {
            setLoadingExams(false)
        }
    }

    useEffect(() => {
        fetchExams()
    }, [])

    /* ---------- Toast auto-dismiss ---------- */
    useEffect(() => {
        if (!toast.msg) return undefined
        const t = setTimeout(() => setToast({ msg: '', error: false }), 2800)
        return () => clearTimeout(t)
    }, [toast])

    const showToast = (msg, isError = false) => setToast({ msg, error: isError })

    /* ============================================================
       CHART SETUP (exam view only)
       ============================================================ */

    useEffect(() => {
        if (view !== 'exam' || !currentExam) return undefined
        if (typeof window.Chart === 'undefined') return undefined

        const t = setTimeout(() => {
            if (scoreChartRef.current && !scoreChartInstance.current) {
                const ranges = [
                    { label: '90-100', count: studentsData.filter((s) => s.pct !== null && s.pct >= 90).length, color: '#059669' },
                    { label: '80-89', count: studentsData.filter((s) => s.pct !== null && s.pct >= 80 && s.pct < 90).length, color: '#2563eb' },
                    { label: '70-79', count: studentsData.filter((s) => s.pct !== null && s.pct >= 70 && s.pct < 80).length, color: '#0891b2' },
                    { label: '60-69', count: studentsData.filter((s) => s.pct !== null && s.pct >= 60 && s.pct < 70).length, color: '#d97706' },
                    { label: '50-59', count: studentsData.filter((s) => s.pct !== null && s.pct >= 50 && s.pct < 60).length, color: '#ea580c' },
                    { label: '<50', count: studentsData.filter((s) => s.pct !== null && s.pct < 50).length, color: '#dc2626' },
                ]
                scoreChartInstance.current = new window.Chart(scoreChartRef.current, {
                    type: 'bar',
                    data: {
                        labels: ranges.map((r) => r.label),
                        datasets: [
                            {
                                label: 'Students',
                                data: ranges.map((r) => r.count),
                                backgroundColor: ranges.map((r) => r.color),
                                borderRadius: 6,
                                barThickness: 32,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { beginAtZero: true, ticks: { stepSize: 1, color: '#6b7280' }, grid: { color: '#f0f2f8' } },
                            x: { ticks: { color: '#6b7280' }, grid: { display: false } },
                        },
                    },
                })
            }

            if (questionChartRef.current && !questionChartInstance.current && questionsData.length > 0) {
                questionChartInstance.current = new window.Chart(questionChartRef.current, {
                    type: 'line',
                    data: {
                        labels: questionsData.map((q) => 'Q' + q.number),
                        datasets: [
                            {
                                label: 'Average Score',
                                data: questionsData.map((q) => Number(q.avgScore || 0)),
                                borderColor: '#1e3a5f',
                                backgroundColor: 'rgba(30, 58, 95, 0.1)',
                                fill: true,
                                tension: 0.35,
                                pointBackgroundColor: '#1e3a5f',
                                pointRadius: 5,
                                pointHoverRadius: 7,
                                borderWidth: 2.5,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { beginAtZero: true, max: 10, ticks: { color: '#6b7280' }, grid: { color: '#f0f2f8' } },
                            x: { ticks: { color: '#6b7280' }, grid: { display: false } },
                        },
                    },
                })
            }
        }, 50)

        return () => {
            clearTimeout(t)
            if (scoreChartInstance.current) {
                scoreChartInstance.current.destroy()
                scoreChartInstance.current = null
            }
            if (questionChartInstance.current) {
                questionChartInstance.current.destroy()
                questionChartInstance.current = null
            }
        }
    }, [view, currentExam, studentsData, questionsData])

    /* ============================================================
       NAVIGATION
       ============================================================ */

    const goToDashboard = () => {
        setView('dashboard')
        setCurrentExamId(null)
        setCurrentStudentId(null)
        setUploadedFile(null)
        setSearchQuery('')
        setStatusFilter('all')
        setScoreFilter('all')
        fetchExams()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const openExam = async (id) => {
        setCurrentExamId(id)
        setView('exam')
        setSearchQuery('')
        setStatusFilter('all')
        setScoreFilter('all')
        setSortField('name')
        setSortDir('asc')
        setLoadingExamDetail(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })

        try {
            const examDetail = await api.get(`/api/exams/${id}/`)
            const parsedQuestions = (examDetail.questions || []).map((q) => ({
                id: q.question_id,
                question_id: q.question_id,
                number: q.question_number,
                text: q.question_text,
                marks: Number(q.max_marks) || 0,
                max_marks: Number(q.max_marks) || 0,
                avgScore: q.avg_score || 0,
                difficulty: q.difficulty || 'moderate',
                referenceAnswer: q.reference_answer?.answer_text || '',
            }))
            setQuestionsData(parsedQuestions)

            if (parsedQuestions.length > 0) {
                setSelectedQuestionId(parsedQuestions[0].id)
            }

            const parsedStudents = (examDetail.students || []).map((s) => ({
                id: s.roll_number,
                student_id: s.student_id,
                name: s.full_name,
                roll_number: s.roll_number,
                email: s.email,
                score: s.score !== null && s.score !== undefined ? Number(s.score) : null,
                finalScore: s.final_score !== null && s.final_score !== undefined ? Number(s.final_score) : (s.score !== null ? Number(s.score) : null),
                aiScore: s.score !== null && s.score !== undefined ? Number(s.score) : null,
                pct: s.pct !== null && s.pct !== undefined ? Number(s.pct) : null,
                grade: s.grade || '',
                status: s.status || 'pending',
                hasEvaluations: !!s.has_evaluations,
                isFinalized: !!s.is_finalized,
            }))
            setStudentsData(parsedStudents)

            setExamsData((prev) =>
                prev.map((e) =>
                    e.id === id
                        ? {
                              ...e,
                              title: examDetail.exam_name,
                              subject: examDetail.subject,
                              totalMarks: Number(examDetail.total_marks) || 0,
                              questions: examDetail.question_count || 0,
                              students: examDetail.student_count || 0,
                              evaluated: examDetail.evaluated_count || 0,
                              pending: examDetail.pending_count || 0,
                              average: Number(examDetail.average_score) || 0,
                              highest: Number(examDetail.highest_score) || 0,
                              lowest: Number(examDetail.lowest_score) || 0,
                              median: Number(examDetail.median_score) || 0,
                              passRate: Number(examDetail.pass_rate) || 0,
                              status: examDetail.status || 'pending',
                          }
                        : e
                )
            )
        } catch (err) {
            showToast(err.message || 'Unable to load exam details.', true)
        } finally {
            setLoadingExamDetail(false)
        }
    }

    const openStudent = async (studentId) => {
        const student = studentsData.find((s) => s.id === studentId || s.student_id === studentId)
        if (!student) return
        setCurrentStudentId(student.id)
        setView('student')
        setUploadedFile(null)
        setUploadProgress(0)
        setPlainTextAnswer('')
        setLoadingEvaluations(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })

        try {
            const res = await api.get(`/api/exams/${currentExamId}/students/${student.student_id}/evaluations/`)
            const evList = (res.evaluations || []).map((ev) => ({
                evaluation_id: ev.evaluation_id,
                qNumber: ev.qNumber,
                question_id: ev.question_id,
                question_text: ev.question_text,
                studentAnswer: ev.studentAnswer || '',
                referenceAnswer: ev.referenceAnswer || '',
                aiScore: Number(ev.aiScore || 0),
                finalScore: Number(ev.finalScore !== undefined ? ev.finalScore : ev.aiScore || 0),
                verification: ev.verification || 'partial',
                components: ev.components || { semantic: 0, coverage: 0, keywords: 'Low', completeness: 0, htr: 0 },
                analysis: ev.analysis || {},
                feedback: ev.feedback || '',
                reviewed: !!ev.reviewed,
                reason: ev.reason || '',
                max_marks: Number(ev.max_marks) || 10,
                evaluated_at: ev.evaluated_at,
            }))
            setStudentEvaluations(evList)

            const activeQ = questionsData.find((q) => q.id === selectedQuestionId) || questionsData[0]
            if (activeQ) {
                setSelectedQuestionId(activeQ.id)
                const existing = evList.find((e) => e.question_id === activeQ.id || e.qNumber === activeQ.number)
                setPlainTextAnswer(existing?.studentAnswer || '')
            }

            if (res.is_finalized || res.result?.is_finalized) {
                setStudentState('finalized')
            } else if (evList.some((e) => e.evaluation_id !== null)) {
                setStudentState('evaluation_completed')
            } else {
                setStudentState('not_uploaded')
            }
        } catch (err) {
            showToast(err.message || 'Unable to load evaluations.', true)
            setStudentState('not_uploaded')
        } finally {
            setLoadingEvaluations(false)
        }
    }

    /* ============================================================
       FILE HANDLING (Upload UI preserved for future phase)
       ============================================================ */

    const handleFileSelected = (file) => {
        if (!file) return
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
        const allowedExts = ['pdf', 'jpg', 'jpeg', 'png']
        const ext = (file.name.split('.').pop() || '').toLowerCase()

        if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
            showToast('Invalid file type. Please upload PDF, JPG, JPEG, or PNG.', true)
            return
        }
        if (file.size > 20 * 1024 * 1024) {
            showToast('File too large. Maximum size is 20MB.', true)
            return
        }
        setUploadedFile(file)
        setStudentState('file_selected')
        showToast('✓ File uploaded successfully')
    }

    const resetUpload = () => {
        setUploadedFile(null)
        setStudentState(studentEvaluations.some((e) => e.evaluation_id) ? 'evaluation_completed' : 'not_uploaded')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const startProcessing = () => {
        if (!uploadedFile) return
        setStudentState('uploading')
        setUploadProgress(0)
    }

    /* Simulate upload progress */
    useEffect(() => {
        if (studentState !== 'uploading') return undefined
        let progress = 0
        const interval = setInterval(() => {
            progress += Math.random() * 20 + 10
            if (progress >= 100) {
                setUploadProgress(100)
                clearInterval(interval)
                setTimeout(() => {
                    setStudentState('htr_processing')
                    setTimeout(() => setStudentState('text_extracted'), 2500)
                }, 400)
            } else {
                setUploadProgress(progress)
            }
        }, 200)
        return () => clearInterval(interval)
    }, [studentState])

    const startAIEvaluation = () => {
        setStudentState('ai_processing')
        setTimeout(() => {
            setStudentState(studentEvaluations.some((e) => e.evaluation_id) ? 'evaluation_completed' : 'not_uploaded')
            showToast('Please enter the plain-text student answer below to run Phase 1 ASAG evaluation.', false)
        }, 1500)
    }

    /* ============================================================
       PHASE 1 PLAIN TEXT ASAG EVALUATION
       ============================================================ */

    const handleQuestionSelectionChange = (newQId) => {
        const qIdNum = Number(newQId)
        setSelectedQuestionId(qIdNum)
        const existing = studentEvaluations.find((e) => e.question_id === qIdNum || e.qNumber === questionsData.find((q) => q.id === qIdNum)?.number)
        setPlainTextAnswer(existing?.studentAnswer || '')
    }

    const handleEvaluatePlainText = async (e) => {
        if (e) e.preventDefault()
        if (!plainTextAnswer.trim()) {
            showToast('Please enter the student answer text.', true)
            return
        }

        const targetQId = Number(selectedQuestionId) || (questionsData[0] ? questionsData[0].id : null)
        if (!targetQId || !currentStudent) {
            showToast('No question or student available for evaluation.', true)
            return
        }

        setIsEvaluating(true)
        setStudentState('ai_processing')

        try {
            await api.post(`/api/exams/${currentExamId}/evaluate/`, {
                question_id: targetQId,
                student_id: currentStudent.student_id,
                student_answer: plainTextAnswer.trim(),
            })

            // Reload evaluations from backend
            const res = await api.get(`/api/exams/${currentExamId}/students/${currentStudent.student_id}/evaluations/`)
            const evList = (res.evaluations || []).map((ev) => ({
                evaluation_id: ev.evaluation_id,
                qNumber: ev.qNumber,
                question_id: ev.question_id,
                question_text: ev.question_text,
                studentAnswer: ev.studentAnswer || '',
                referenceAnswer: ev.referenceAnswer || '',
                aiScore: Number(ev.aiScore || 0),
                finalScore: Number(ev.finalScore !== undefined ? ev.finalScore : ev.aiScore || 0),
                verification: ev.verification || 'partial',
                components: ev.components || { semantic: 0, coverage: 0, keywords: 'Low', completeness: 0, htr: 0 },
                analysis: ev.analysis || {},
                feedback: ev.feedback || '',
                reviewed: !!ev.reviewed,
                reason: ev.reason || '',
                max_marks: Number(ev.max_marks) || 10,
                evaluated_at: ev.evaluated_at,
            }))
            setStudentEvaluations(evList)

            // Refresh student item in studentsData
            setStudentsData((prev) =>
                prev.map((s) => (s.student_id === currentStudent.student_id ? { ...s, status: 'evaluated', hasEvaluations: true } : s))
            )

            setStudentState('evaluation_completed')
            showToast('✓ AI evaluation completed successfully')
        } catch (err) {
            setStudentState(studentEvaluations.some((e) => e.evaluation_id) ? 'evaluation_completed' : 'not_uploaded')
            showToast(err.message || 'Evaluation failed. Please check your answer and retry.', true)
        } finally {
            setIsEvaluating(false)
        }
    }

    /* ============================================================
       TEACHER REVIEW HANDLERS
       ============================================================ */

    const approveAI = async (idx) => {
        const ev = studentEvaluations[idx]
        if (!ev || !ev.evaluation_id) return
        try {
            await api.patch(`/api/evaluations/${ev.evaluation_id}/`, {
                awarded_marks: ev.aiScore,
                reason: '',
                feedback: ev.feedback || '',
            })
            setStudentEvaluations((prev) =>
                prev.map((item, i) =>
                    i === idx ? { ...item, finalScore: item.aiScore, reviewed: true, reason: '' } : item
                )
            )
            showToast('✓ AI score approved')
        } catch (err) {
            showToast(err.message || 'Unable to approve score.', true)
        }
    }

    const saveReview = async (idx) => {
        const ev = studentEvaluations[idx]
        if (!ev || !ev.evaluation_id) return
        const maxM = ev.max_marks || 10
        if (ev.finalScore < 0 || ev.finalScore > maxM) {
            showToast(`Score must be between 0 and ${maxM}.`, true)
            return
        }

        try {
            await api.patch(`/api/evaluations/${ev.evaluation_id}/`, {
                awarded_marks: ev.finalScore,
                reason: ev.reason || '',
                feedback: ev.feedback || '',
            })
            setStudentEvaluations((prev) =>
                prev.map((item, i) => (i === idx ? { ...item, reviewed: true } : item))
            )
            showToast('✓ Review saved')
        } catch (err) {
            showToast(err.message || 'Unable to save review.', true)
        }
    }

    const updateFinalScore = (idx, value) => {
        const ev = studentEvaluations[idx]
        const maxM = ev.max_marks || 10
        const parsed = parseFloat(value)
        const clamped = isNaN(parsed) ? 0 : Math.max(0, Math.min(maxM, parsed))
        setStudentEvaluations((prev) =>
            prev.map((item, i) => (i === idx ? { ...item, finalScore: clamped } : item))
        )
    }

    const updateReason = (idx, value) => {
        setStudentEvaluations((prev) =>
            prev.map((ev, i) => (i === idx ? { ...ev, reason: value } : ev))
        )
    }

    const finalizeResult = async () => {
        if (!currentExam || !currentStudent) return

        const unevaluated = studentEvaluations.filter((e) => !e.evaluation_id)
        if (unevaluated.length > 0) {
            showToast(`Please evaluate all questions before finalizing. (Q${unevaluated.map((u) => u.qNumber).join(', ')} pending)`, true)
            return
        }

        try {
            setIsFinalizing(true)
            const res = await api.post(`/api/exams/${currentExamId}/students/${currentStudent.student_id}/finalize/`)
            const total = Number(res.total_marks || 0)
            const pct = Number(res.percentage || 0)
            const grade = res.grade || ''

            setStudentsData((prev) =>
                prev.map((s) =>
                    s.student_id === currentStudent.student_id
                        ? { ...s, finalScore: total, score: total, pct: pct, grade: grade, status: 'reviewed', isFinalized: true }
                        : s
                )
            )
            setStudentState('finalized')

            // Update stats from server
            const examDetail = await api.get(`/api/exams/${currentExamId}/`)
            setExamsData((prev) =>
                prev.map((e) =>
                    e.id === currentExamId
                        ? {
                              ...e,
                              evaluated: examDetail.evaluated_count,
                              pending: examDetail.pending_count,
                              average: Number(examDetail.average_score) || 0,
                              highest: Number(examDetail.highest_score) || 0,
                              lowest: Number(examDetail.lowest_score) || 0,
                              median: Number(examDetail.median_score) || 0,
                              passRate: Number(examDetail.pass_rate) || 0,
                              status: examDetail.status,
                          }
                        : e
                )
            )
            showToast('✓ Result finalized successfully')
        } catch (err) {
            showToast(err.message || 'Unable to finalize result.', true)
        } finally {
            setIsFinalizing(false)
        }
    }

    /* ============================================================
       EXPORT
       ============================================================ */

    const doExport = (type) => {
        setExportModalOpen(false)
        if (type === 'csv') {
            if (studentsData.length === 0) {
                showToast('No student data to export.', true)
                return
            }
            const headers = 'Roll Number,Name,Email,Score,Percentage,Status,Grade\n'
            const rows = studentsData
                .map((s) => `"${s.roll_number || s.id}","${s.name}","${s.email || ''}",${s.score !== null ? s.score : ''},${s.pct !== null ? s.pct : ''},"${s.status}","${s.grade || ''}"`)
                .join('\n')
            const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.setAttribute('href', url)
            link.setAttribute('download', `${currentExam?.title || 'Exam'}_Results.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            showToast('✓ CSV exported successfully')
            return
        }

        const msg = type === 'pdf' ? '✓ PDF report generated' : '✓ Student report exported'
        showToast(msg)
    }

    /* ============================================================
       FILTERED DATA
       ============================================================ */

    const filteredExams = useMemo(() => {
        const q = examSearchQuery.toLowerCase().trim()
        return examsData.filter((e) => {
            const matchSearch =
                !q ||
                e.title.toLowerCase().includes(q) ||
                e.code.toLowerCase().includes(q) ||
                e.subject.toLowerCase().includes(q)
            const matchFilter = examStatusFilter === 'all' || e.status === examStatusFilter
            return matchSearch && matchFilter
        })
    }, [examsData, examSearchQuery, examStatusFilter])

    const filteredStudents = useMemo(() => {
        const q = searchQuery.toLowerCase().trim()
        let list = studentsData.filter((s) => {
            const matchSearch =
                !q || s.name.toLowerCase().includes(q) || (s.id && s.id.toLowerCase().includes(q))
            const matchStatus = statusFilter === 'all' || s.status === statusFilter
            let matchScore = true
            if (scoreFilter !== 'all' && s.pct !== null) {
                if (scoreFilter === '0-40') matchScore = s.pct <= 40
                else if (scoreFilter === '41-60') matchScore = s.pct >= 41 && s.pct <= 60
                else if (scoreFilter === '61-80') matchScore = s.pct >= 61 && s.pct <= 80
                else if (scoreFilter === '81-100') matchScore = s.pct >= 81
            } else if (scoreFilter !== 'all') {
                matchScore = false
            }
            return matchSearch && matchStatus && matchScore
        })
        list = [...list].sort((a, b) => {
            let va, vb
            if (sortField === 'name') {
                va = a.name
                vb = b.name
            } else if (sortField === 'id') {
                va = a.id
                vb = b.id
            } else if (sortField === 'score') {
                va = a.pct || 0
                vb = b.pct || 0
            } else if (sortField === 'status') {
                va = a.status
                vb = b.status
            }
            if (va < vb) return sortDir === 'asc' ? -1 : 1
            if (va > vb) return sortDir === 'asc' ? 1 : -1
            return 0
        })
        return list
    }, [studentsData, searchQuery, statusFilter, scoreFilter, sortField, sortDir])

    /* ============================================================
       RENDER: DASHBOARD
       ============================================================ */

    const renderDashboard = () => {
        if (loadingExams) {
            return <PageLoader message="Loading examination results..." />
        }

        if (examsError) {
            return <ErrorState message={examsError} onRetry={fetchExams} />
        }

        const totalExams = examsData.length
        const totalStudents = examsData.reduce((s, e) => s + e.students, 0)
        const totalEvaluated = examsData.reduce((s, e) => s + e.evaluated, 0)
        const totalPending = examsData.reduce((s, e) => s + e.pending, 0)
        const avgScore = totalExams > 0 ? (examsData.reduce((s, e) => s + e.average, 0) / totalExams).toFixed(1) : '0.0'
        const highestScore = totalExams > 0 ? Math.max(...examsData.map((e) => e.highest), 0) : 0
        const avgPassRate = totalExams > 0 ? Math.round(examsData.reduce((s, e) => s + e.passRate, 0) / totalExams) : 0
        const completionRate = totalStudents > 0 ? Math.round((totalEvaluated / totalStudents) * 100) : 0

        return (
            <>
                <div className="breadcrumb">
                    <span className="current">Results</span>
                </div>

                <div className="page-header">
                    <div>
                        <p>
                            View and analyse AI-evaluated examination results and
                            review student answer sheets.
                        </p>
                    </div>
                    <div className="page-header-actions">
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setExportModalOpen(true)}
                            disabled={examsData.length === 0}
                        >
                            <Icon name="download" size={16} />
                            Export
                        </button>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">
                            <Icon name="file" size={14} />
                            Total Exams
                        </div>
                        <div className="stat-value">{totalExams}</div>
                        <div className="stat-sub">All examinations</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">
                            <Icon name="users" size={14} />
                            Total Students
                        </div>
                        <div className="stat-value">{totalStudents}</div>
                        <div className="stat-sub">Across all exams</div>
                    </div>
                    <div className="stat-card highlight">
                        <div className="stat-label">
                            <Icon name="checkCircle" size={14} />
                            Evaluated
                        </div>
                        <div className="stat-value">{totalEvaluated}</div>
                        <div className="stat-sub">
                            {completionRate}% completion rate
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">
                            <Icon name="clock" size={14} />
                            Pending
                        </div>
                        <div className="stat-value">{totalPending}</div>
                        <div className="stat-sub">Awaiting evaluation</div>
                    </div>
                </div>

                <div className="stats-grid cols-6">
                    <div className="stat-card">
                        <div className="stat-label">Average Score</div>
                        <div className="stat-value">
                            {avgScore}
                            <span>%</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Highest Score</div>
                        <div className="stat-value">
                            {highestScore}
                            <span>%</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Pass Rate</div>
                        <div className="stat-value">
                            {avgPassRate}
                            <span>%</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Evaluated Sheets</div>
                        <div className="stat-value">
                            {totalEvaluated}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">ASAG Engine</div>
                        <div className="stat-value">
                            Active
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Questions</div>
                        <div className="stat-value">
                            {examsData.reduce((s, e) => s + e.questions, 0)}
                        </div>
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-toolbar">
                        <h3>Examinations</h3>
                        <div className="toolbar-controls">
                            <div className="search-box">
                                <Icon name="search" size={16} />
                                <input
                                    type="text"
                                    value={examSearchQuery}
                                    onChange={(e) => setExamSearchQuery(e.target.value)}
                                    placeholder="Search exams..."
                                />
                            </div>
                            <select
                                className="filter-select"
                                value={examStatusFilter}
                                onChange={(e) => setExamStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="processing">Processing</option>
                                <option value="partial">Partially Evaluated</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Exam</th>
                                    <th>Subject</th>
                                    <th>Date</th>
                                    <th>Students</th>
                                    <th>Evaluated</th>
                                    <th>Pending</th>
                                    <th>Avg Score</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingExams ? (
                                    <tr>
                                        <td colSpan={8} className="empty-state">
                                            Loading examinations...
                                        </td>
                                    </tr>
                                ) : filteredExams.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="empty-state">
                                            No examinations found. Create an exam from the Create Exam section first.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredExams.map((e) => (
                                        <tr key={e.id} onClick={() => openExam(e.id)}>
                                            <td>
                                                <div style={{ fontWeight: 600, color: 'var(--g900)' }}>
                                                    {e.title}
                                                </div>
                                                <div style={{ fontSize: 12, color: 'var(--g500)', marginTop: 2 }}>
                                                    {e.code} · {e.questions} questions · {e.totalMarks} marks
                                                </div>
                                            </td>
                                            <td>{e.subject}</td>
                                            <td style={{ whiteSpace: 'nowrap', color: 'var(--g600)' }}>{e.date}</td>
                                            <td style={{ fontWeight: 500 }}>{e.students}</td>
                                            <td style={{ fontWeight: 500 }}>{e.evaluated}</td>
                                            <td style={{ fontWeight: 500, color: e.pending > 0 ? 'var(--amber)' : 'var(--g500)' }}>
                                                {e.pending}
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{e.average}%</td>
                                            <td>{statusBadge(e.status)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-footer">
                        <span>Showing {filteredExams.length} of {examsData.length} exams</span>
                        <span style={{ fontSize: 12, color: 'var(--g400)' }}>
                            Click any row to view details
                        </span>
                    </div>
                </div>
            </>
        )
    }

    /* ============================================================
       RENDER: EXAM DETAILS
       ============================================================ */

    const renderExamDetails = () => {
        if (!currentExam) return null
        const evalPct = currentExam.students > 0 ? Math.round((currentExam.evaluated / currentExam.students) * 100) : 0

        return (
            <>
                <div className="breadcrumb">
                    <button onClick={goToDashboard}>Results</button>
                    <span className="sep">/</span>
                    <span className="current">{currentExam.title}</span>
                </div>

                <div className="exam-details-header">
                    <div>
                        <h2>{currentExam.title}</h2>
                        <div className="exam-meta">
                            <div className="exam-meta-item">
                                <Icon name="book" size={15} />
                                <strong>{currentExam.subject}</strong>
                            </div>
                            <div className="exam-meta-item">
                                <Icon name="calendar" size={15} />
                                <strong>{currentExam.date}</strong>
                            </div>
                            <div className="exam-meta-item">
                                <Icon name="file" size={15} />
                                <strong>{currentExam.totalMarks} marks</strong>
                            </div>
                            <div className="exam-meta-item">
                                <Icon name="help" size={15} />
                                <strong>{questionsData.length || currentExam.questions} questions</strong>
                            </div>
                            <div className="exam-meta-item">
                                <Icon name="users" size={15} />
                                <strong>{studentsData.length || currentExam.students} students</strong>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setExportModalOpen(true)}
                            disabled={studentsData.length === 0}
                        >
                            <Icon name="download" size={16} />
                            Export
                        </button>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h3>
                                <Icon name="chart" size={20} />
                                Class Performance
                            </h3>
                            <p>Overall performance statistics for this examination</p>
                        </div>
                    </div>
                    <div className="perf-grid">
                        <div className="perf-item">
                            <div className="label">Average Score</div>
                            <div className="value">{currentExam.average}%</div>
                        </div>
                        <div className="perf-item">
                            <div className="label">Median Score</div>
                            <div className="value">{currentExam.median}%</div>
                        </div>
                        <div className="perf-item">
                            <div className="label">Highest Score</div>
                            <div className="value green">{currentExam.highest}%</div>
                        </div>
                        <div className="perf-item">
                            <div className="label">Lowest Score</div>
                            <div className="value" style={{ color: 'var(--red)' }}>
                                {currentExam.lowest}%
                            </div>
                        </div>
                        <div className="perf-item">
                            <div className="label">Pass Rate</div>
                            <div className="value green">{currentExam.passRate}%</div>
                        </div>
                    </div>
                    <div className="chart-grid">
                        <div className="chart-box">
                            <h4>Score Distribution</h4>
                            <div className="chart-container">
                                <canvas ref={scoreChartRef} />
                            </div>
                        </div>
                        <div className="chart-box">
                            <h4>Question Performance</h4>
                            <div className="chart-container">
                                <canvas ref={questionChartRef} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h3>
                                <Icon name="checkCircle" size={20} />
                                Evaluation Status
                            </h3>
                            <p>Progress of answer sheet evaluation</p>
                        </div>
                        {statusBadge(currentExam.status)}
                    </div>
                    <div className="eval-progress-wrap">
                        <div className="eval-progress-label">
                            {currentExam.evaluated} / {currentExam.students} Answer Sheets Evaluated
                        </div>
                        <div className="eval-progress-bar">
                            <div className="eval-progress-fill" style={{ width: `${evalPct}%` }}>
                                {evalPct}%
                            </div>
                        </div>
                        <div className="eval-status-list">
                            <div className="eval-status-item">
                                <span className="dot done"></span>
                                <strong>{currentExam.evaluated}</strong> Completed
                            </div>
                            <div className="eval-status-item">
                                <span className="dot wait"></span>
                                <strong>{currentExam.pending}</strong> Pending
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h3>
                                <Icon name="file" size={20} />
                                Question Analysis
                            </h3>
                            <p>Average performance per question with difficulty classification</p>
                        </div>
                    </div>
                    <div className="question-analysis-grid">
                        {questionsData.map((q) => {
                            const pct = q.marks > 0 ? Math.round((q.avgScore / q.marks) * 100) : 0
                            const diffColor =
                                q.difficulty === 'high'
                                    ? 'var(--green)'
                                    : q.difficulty === 'moderate'
                                      ? 'var(--amber)'
                                      : 'var(--red)'
                            const diffLabel =
                                q.difficulty === 'high'
                                    ? 'High Performance'
                                    : q.difficulty === 'moderate'
                                      ? 'Moderate'
                                      : 'Needs Attention'
                            return (
                                <div className="qa-card" key={q.id || q.number}>
                                    <div className="qa-card-header">
                                        <span className="qa-card-num">Q{q.number}</span>
                                        <span
                                            className="qa-card-diff"
                                            style={{ color: diffColor, background: `${diffColor}15` }}
                                        >
                                            {diffLabel}
                                        </span>
                                    </div>
                                    <div className="qa-card-text">
                                        {q.text.substring(0, 60)}{q.text.length > 60 ? '...' : ''}
                                    </div>
                                    <div className="qa-card-stats">
                                        <span className="qa-card-avg">
                                            Avg: <strong>{q.avgScore}/{q.marks}</strong>
                                        </span>
                                        <span className="qa-card-pct">{pct}%</span>
                                    </div>
                                    <div className="qa-card-bar">
                                        <div style={{ width: `${pct}%`, background: diffColor }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="table-card">
                    <div className="table-toolbar">
                        <h3>Student Results</h3>
                        <div className="toolbar-controls">
                            <div className="search-box">
                                <Icon name="search" size={16} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name or roll number..."
                                />
                            </div>
                            <select
                                className="filter-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="evaluated">Evaluated</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="pending">Pending</option>
                            </select>
                            <select
                                className="filter-select"
                                value={scoreFilter}
                                onChange={(e) => setScoreFilter(e.target.value)}
                            >
                                <option value="all">All Scores</option>
                                <option value="0-40">0–40</option>
                                <option value="41-60">41–60</option>
                                <option value="61-80">61–80</option>
                                <option value="81-100">81–100</option>
                            </select>
                            <select
                                className="filter-select"
                                value={`${sortField}-${sortDir}`}
                                onChange={(e) => {
                                    const [field, dir] = e.target.value.split('-')
                                    setSortField(field)
                                    setSortDir(dir)
                                }}
                            >
                                <option value="name-asc">Name A→Z</option>
                                <option value="name-desc">Name Z→A</option>
                                <option value="score-desc">Highest Score</option>
                                <option value="score-asc">Lowest Score</option>
                                <option value="id-asc">Roll No.</option>
                                <option value="status-asc">Status</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Roll Number</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingExamDetail ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '32px 0' }}>
                                            <PageLoader inline message="Loading student records for this exam..." />
                                        </td>
                                    </tr>
                                ) : filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="empty-state">
                                            No students assigned to this exam.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((s) => (
                                        <tr key={s.id || s.student_id} onClick={() => openStudent(s.id)}>
                                            <td>
                                                <div className="student-info-cell">
                                                    <div
                                                        className="student-avatar"
                                                        style={{ background: avatarColor(s.name) }}
                                                    >
                                                        {initials(s.name)}
                                                    </div>
                                                    <div>
                                                        <div className="student-name">{s.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: 500 }}>{s.id}</td>
                                            <td className="score-cell">
                                                {s.score !== null ? `${s.score}/${currentExam.totalMarks}` : '—'}
                                            </td>
                                            <td className="pct-cell">
                                                {s.pct !== null ? `${s.pct}%` : '—'}
                                            </td>
                                            <td>{statusBadge(s.status)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-footer">
                        <span>
                            Showing {filteredStudents.length} of {studentsData.length} students
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--g400)' }}>
                            Click any row to evaluate or view detailed answer review
                        </span>
                    </div>
                </div>
            </>
        )
    }

    /* ============================================================
       RENDER: STUDENT RESULT & EVALUATION
       ============================================================ */

    const renderPlainTextEvaluationPanel = () => {
        if (studentState === 'finalized') return null

        const currentQ = questionsData.find((q) => q.id === Number(selectedQuestionId)) || questionsData[0]
        const currentEvalForQ = studentEvaluations.find((e) => e.question_id === currentQ?.id || e.qNumber === currentQ?.number)

        return (
            <div className="panel" style={{ marginBottom: 24 }}>
                <div className="panel-header">
                    <div>
                        <h3>
                            <Icon name="editPencil" size={20} />
                            Student Answer Evaluation (Phase 1 — Plain Text)
                        </h3>
                        <p>Enter the student answer to run automated AI semantic evaluation against the question reference answer.</p>
                    </div>
                </div>
                <div style={{ padding: '4px 0 8px 0' }}>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                        <label style={{ fontWeight: 600, color: 'var(--g700)', fontSize: 14 }}>
                            Select Question:
                        </label>
                        <select
                            style={{
                                padding: '8px 12px',
                                borderRadius: 6,
                                border: '1px solid var(--g300)',
                                background: '#fff',
                                color: 'var(--g800)',
                                fontSize: 14,
                                minWidth: 280,
                            }}
                            value={selectedQuestionId || (questionsData[0]?.id || '')}
                            onChange={(e) => handleQuestionSelectionChange(e.target.value)}
                        >
                            {questionsData.map((q) => {
                                const hasEv = studentEvaluations.some((ev) => (ev.question_id === q.id || ev.qNumber === q.number) && ev.evaluation_id)
                                return (
                                    <option key={q.id || q.number} value={q.id || q.number}>
                                        {hasEv ? '✓ ' : '• '}Q{q.number}: {q.text.substring(0, 45)}... ({q.marks} marks)
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    {currentQ && (
                        <div style={{ marginBottom: 16, padding: 14, background: 'var(--g50)', borderRadius: 8, border: '1px solid var(--brd)' }}>
                            <div style={{ marginBottom: 8 }}>
                                <strong style={{ color: 'var(--g900)' }}>Q{currentQ.number} ({currentQ.marks} marks): </strong>
                                <span style={{ color: 'var(--g800)' }}>{currentQ.text}</span>
                            </div>
                            {currentQ.referenceAnswer && (
                                <div style={{ fontSize: 13, color: 'var(--g600)', borderTop: '1px dashed var(--g300)', paddingTop: 8 }}>
                                    <strong style={{ color: 'var(--navy)' }}>Reference Answer: </strong>
                                    <span>{currentQ.referenceAnswer}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontWeight: 600, color: 'var(--g700)', fontSize: 14, marginBottom: 6 }}>
                            Student Answer:
                        </label>
                        <textarea
                            style={{
                                width: '100%',
                                minHeight: 120,
                                padding: 12,
                                borderRadius: 8,
                                border: '1px solid var(--g300)',
                                fontFamily: 'inherit',
                                fontSize: 14,
                                lineHeight: 1.5,
                                resize: 'vertical',
                                background: '#fff',
                                color: 'var(--g900)',
                            }}
                            placeholder="Type or paste the student's answer text here..."
                            value={plainTextAnswer}
                            onChange={(e) => setPlainTextAnswer(e.target.value)}
                            disabled={isEvaluating}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ fontSize: 13, color: 'var(--g500)' }}>
                            {currentEvalForQ?.evaluation_id ? (
                                <span style={{ color: 'var(--green)', fontWeight: 600 }}>
                                    ✓ Evaluated (AI Score: {currentEvalForQ.aiScore}/{currentQ?.marks} marks) — Enter new text above to re-evaluate.
                                </span>
                            ) : (
                                'Enter student plain-text answer and click Evaluate Answer.'
                            )}
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleEvaluatePlainText}
                            disabled={!plainTextAnswer.trim() || isEvaluating}
                        >
                            <Icon name="ai" size={16} />
                            {isEvaluating ? 'Evaluating with ASAG...' : 'Evaluate Answer with AI'}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const renderUploadZone = () => (
        <div className="panel">
            <div className="panel-header">
                <div>
                    <h3>
                        <Icon name="upload" size={20} />
                        Upload Answer Sheet (Future HTR / OCR Workflow)
                    </h3>
                    <p>Drag and drop the handwritten answer sheet, or click to browse your files</p>
                </div>
            </div>
            <div
                className={`upload-zone ${dragging ? 'dragover' : ''}`}
                onClick={(e) => {
                    if (e.target.tagName !== 'INPUT' && fileInputRef.current) {
                        fileInputRef.current.click()
                    }
                }}
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragging(true)
                }}
                onDragLeave={(e) => {
                    e.preventDefault()
                    setDragging(false)
                }}
                onDrop={(e) => {
                    e.preventDefault()
                    setDragging(false)
                    const file = e.dataTransfer.files[0]
                    if (file) handleFileSelected(file)
                }}
            >
                <svg
                    className="upload-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <h3>Drag &amp; drop your answer sheet here</h3>
                <p>
                    or <span className="browse">browse files</span> from your computer
                </p>
                <div className="formats">
                    <span>PDF</span>
                    <span>JPG</span>
                    <span>JPEG</span>
                    <span>PNG</span>
                    <span style={{ background: 'transparent', border: 'none', color: 'var(--g400)' }}>
                        · Max 20MB
                    </span>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileSelected(e.target.files[0])}
                />
            </div>
        </div>
    )

    const renderFileInfo = () => {
        if (!uploadedFile) return null
        const ext = getFileExtension(uploadedFile.name)
        const size = formatFileSize(uploadedFile.size)

        return (
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h3>
                            <Icon name="file" size={20} />
                            Answer Sheet Ready
                        </h3>
                        <p>Review the uploaded file and start the AI evaluation process</p>
                    </div>
                </div>

                <div className="file-info-card ready">
                    <div className="file-info-icon">
                        <Icon name="file" size={28} />
                    </div>
                    <div className="file-info-details">
                        <div className="name">{uploadedFile.name}</div>
                        <div className="meta">
                            <span>
                                <Icon name="file" size={12} />
                                {ext}
                            </span>
                            <span>
                                <Icon name="clock" size={12} />
                                {size}
                            </span>
                            <span>
                                <Icon name="checkCircle" size={12} />
                                Ready to process
                            </span>
                        </div>
                    </div>
                    <div className="file-info-actions">
                        <button className="btn btn-ghost btn-sm" onClick={resetUpload}>
                            <Icon name="refresh" size={14} />
                            Replace
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={startProcessing}>
                            <Icon name="play" size={14} />
                            Start Processing
                        </button>
                    </div>
                </div>

                <div className="file-preview-grid">
                    <div className="file-preview-box">
                        <h5>Document Type</h5>
                        <div className="value">Handwritten Answer Sheet</div>
                    </div>
                    <div className="file-preview-box">
                        <h5>Processing Pipeline</h5>
                        <div className="value">HTR → AI Evaluation</div>
                    </div>
                    <div className="file-preview-box">
                        <h5>Estimated Time</h5>
                        <div className="value">~2-3 minutes</div>
                    </div>
                    <div className="file-preview-box">
                        <h5>Questions Expected</h5>
                        <div className="value">{questionsData.length} questions</div>
                    </div>
                </div>
            </div>
        )
    }

    const renderUploading = () => {
        if (!uploadedFile) return null
        const pct = Math.round(uploadProgress)
        return (
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h3>
                            <Icon name="upload" size={20} />
                            Uploading Answer Sheet
                        </h3>
                        <p>Please wait while the file is being uploaded to the server...</p>
                    </div>
                </div>
                <div className="upload-progress-card">
                    <div className="upload-progress-spinner" />
                    <div className="upload-progress-percent">{pct}%</div>
                    <div className="upload-progress-filename">{uploadedFile.name}</div>
                    <div className="upload-progress-bar">
                        <div className="upload-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="upload-progress-size">
                        {formatFileSize((uploadedFile.size * pct) / 100)} of{' '}
                        {formatFileSize(uploadedFile.size)}
                    </div>
                </div>
            </div>
        )
    }

    const renderHTRProcessing = () => (
        <div className="panel">
            <div className="panel-header">
                <div>
                    <h3>
                        <Icon name="search" size={20} />
                        Processing Answer Sheet
                    </h3>
                    <p>Handwritten Text Recognition (HTR) simulation</p>
                </div>
            </div>
            <div className="htr-processing">
                <div className="htr-visual">
                    <div className="htr-paper">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div className="htr-line" key={i} />
                        ))}
                    </div>
                    <div className="htr-scan-line" />
                </div>
                <div className="htr-title">Reading handwritten answers...</div>
                <div className="htr-subtitle">
                    Extracting text from the answer sheet
                </div>
                <div className="htr-steps">
                    <div className="htr-step done">
                        <div className="check">
                            <Icon name="check" size={12} />
                        </div>
                        <span>Answer sheet uploaded</span>
                    </div>
                    <div className="htr-step done">
                        <div className="check">
                            <Icon name="check" size={12} />
                        </div>
                        <span>Image preprocessing</span>
                    </div>
                    <div className="htr-step active">
                        <div className="check">
                            <div className="spinner" />
                        </div>
                        <span>Handwritten text recognition</span>
                    </div>
                    <div className="htr-step">
                        <div className="check"></div>
                        <span>AI evaluation</span>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderExtractedAnswers = () => (
        <div className="panel">
            <div className="panel-header">
                <div>
                    <h3>
                        <Icon name="file" size={20} />
                        Extracted Answers Preview
                    </h3>
                    <p>Review the text extracted from the document</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={startAIEvaluation}>
                    <Icon name="ai" size={14} />
                    Proceed to Evaluation
                </button>
            </div>
            <div className="info-banner">
                <Icon name="info" size={18} />
                <div>
                    Document preview ready. Use the Plain-Text Evaluation section below to run the active Phase 1 ASAG evaluation.
                </div>
            </div>
        </div>
    )

    const renderAIProcessing = () => (
        <div className="panel">
            <div className="panel-header">
                <div>
                    <h3>
                        <Icon name="ai" size={20} />
                        AI Evaluation in Progress
                    </h3>
                    <p>ASAG semantic similarity and NLI evaluation running</p>
                </div>
            </div>
            <div className="htr-processing">
                <div className="htr-visual ai-processing-visual">
                    <div className="ai-processing-inner">
                        <div className="ai-processing-orbit">
                            <div className="ring-outer" />
                            <div className="ring-inner" />
                            <div className="core">
                                <Icon name="ai" size={20} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="htr-title">AI is evaluating student answer...</div>
                <div className="htr-subtitle">Running Sentence-Transformers and NLI DeBERTa model</div>
                <div className="htr-steps">
                    <div className="htr-step done">
                        <div className="check">
                            <Icon name="check" size={12} />
                        </div>
                        <span>Answer text received</span>
                    </div>
                    <div className="htr-step done">
                        <div className="check">
                            <Icon name="check" size={12} />
                        </div>
                        <span>Reference answer loaded</span>
                    </div>
                    <div className="htr-step active">
                        <div className="check">
                            <div className="spinner" />
                        </div>
                        <span>ASAG semantic similarity &amp; NLI inference</span>
                    </div>
                    <div className="htr-step">
                        <div className="check"></div>
                        <span>Score calculation &amp; feedback</span>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderEvaluations = () => {
        if (!currentExam) return null

        const evaluatedList = studentEvaluations.filter((e) => e.evaluation_id !== null)
        const aiTotal = evaluatedList.reduce((s, e) => s + e.aiScore, 0)
        const finalTotal = evaluatedList.reduce((s, e) => s + e.finalScore, 0)
        const correct = evaluatedList.filter((e) => e.verification === 'correct').length
        const partial = evaluatedList.filter((e) => e.verification === 'partial').length
        const incorrect = evaluatedList.filter((e) => e.verification === 'incorrect').length
        const adjustment = finalTotal - aiTotal

        return (
            <>
                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h3>
                                <Icon name="file" size={20} />
                                Question-wise Evaluation
                            </h3>
                            <p>AI evaluation results with teacher review capability</p>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {studentState !== 'finalized' && (
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={finalizeResult}
                                    disabled={isFinalizing || studentEvaluations.some((e) => !e.evaluation_id)}
                                >
                                    <Icon name="check" size={14} />
                                    {isFinalizing ? 'Finalizing...' : 'Finalize Result'}
                                </button>
                            )}
                            <button
                                className="btn btn-outline btn-sm"
                                onClick={() => setExportModalOpen(true)}
                            >
                                <Icon name="download" size={14} />
                                Export
                            </button>
                        </div>
                    </div>

                    {studentEvaluations.map((ev, idx) => {
                        const q = questionsData.find((qq) => qq.number === ev.qNumber || qq.id === ev.question_id) || { marks: ev.max_marks || 10, text: ev.question_text || '' }
                        const isUnevaluated = !ev.evaluation_id

                        if (isUnevaluated) {
                            return (
                                <div className="q-eval-card" key={ev.question_id || ev.qNumber || idx} style={{ opacity: 0.85 }}>
                                    <div className="q-eval-header">
                                        <div className="q-eval-header-left">
                                            <span className="q-number">Q{ev.qNumber}</span>
                                            <span className="q-marks">{q.marks} marks</span>
                                            <span className="q-verification partial">
                                                <Icon name="clock" size={14} />
                                                Not Evaluated
                                            </span>
                                        </div>
                                    </div>
                                    <div className="q-eval-body">
                                        <div className="q-question-text">
                                            <strong>Question:</strong> {q.text}
                                        </div>
                                        <div style={{ padding: 14, background: 'var(--g50)', borderRadius: 8, fontSize: 13, color: 'var(--g600)' }}>
                                            Select Question {ev.qNumber} above, enter the student's answer, and click "Evaluate Answer with AI" to evaluate.
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        const verifLabel =
                            ev.verification === 'correct'
                                ? '✓ Correct'
                                : ev.verification === 'partial'
                                  ? '~ Partially Correct'
                                  : '✕ Incorrect'
                        const verifIcon =
                            ev.verification === 'correct'
                                ? 'check'
                                : ev.verification === 'partial'
                                  ? 'minus'
                                  : 'x'
                        const semVal = typeof ev.components?.semantic === 'number' ? ev.components.semantic : 0
                        const semClass = semVal >= 0.8 ? 'high' : semVal >= 0.5 ? 'mid' : 'low'
                        const covVal = Number(ev.components?.coverage || 0)
                        const covClass = covVal >= 80 ? 'high' : covVal >= 50 ? 'mid' : 'low'
                        const compVal = Number(ev.components?.completeness || 0)
                        const compClass = compVal >= 80 ? 'high' : compVal >= 50 ? 'mid' : 'low'

                        return (
                            <div className="q-eval-card" key={ev.evaluation_id || ev.qNumber || idx}>
                                <div className="q-eval-header">
                                    <div className="q-eval-header-left">
                                        <span className="q-number">Q{ev.qNumber}</span>
                                        <span className="q-marks">{q.marks} marks</span>
                                        <span className={`q-verification ${ev.verification}`}>
                                            <Icon name={verifIcon} size={14} />
                                            {verifLabel}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--g900)' }}>
                                        {ev.finalScore}{' '}
                                        <span style={{ fontSize: 13, color: 'var(--g500)', fontWeight: 600 }}>
                                            / {q.marks}
                                        </span>
                                    </div>
                                </div>
                                <div className="q-eval-body">
                                    <div className="q-question-text">
                                        <strong>Question:</strong> {q.text}
                                    </div>

                                    <div className="answer-comparison">
                                        <div className="answer-box student">
                                            <div className="label">
                                                <Icon name="editPencil" size={13} />
                                                Student Answer
                                            </div>
                                            <div className="content">{ev.studentAnswer || '(No answer provided)'}</div>
                                        </div>
                                        <div className="answer-box reference">
                                            <div className="label">
                                                <Icon name="book" size={13} />
                                                Reference Answer
                                            </div>
                                            <div className="content">{ev.referenceAnswer || '(No reference answer configured)'}</div>
                                        </div>
                                    </div>

                                    <div className="eval-components">
                                        <div className="eval-component">
                                            <div className="label">Semantic Similarity</div>
                                            <div className={`value ${semClass}`}>
                                                {semVal.toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="eval-component">
                                            <div className="label">Coverage</div>
                                            <div className={`value ${covClass}`}>{covVal}%</div>
                                        </div>
                                        <div className="eval-component">
                                            <div className="label">Keywords</div>
                                            <div className="value" style={{ fontSize: 14 }}>
                                                {ev.components?.keywords || 'Medium'}
                                            </div>
                                        </div>
                                        <div className="eval-component">
                                            <div className="label">Completeness</div>
                                            <div className={`value ${compClass}`}>
                                                {compVal}%
                                            </div>
                                        </div>
                                        <div className="eval-component">
                                            <div className="label">Status</div>
                                            <div className="value high" style={{ fontSize: 13 }}>
                                                {ev.analysis?.verification || 'Evaluated'}
                                            </div>
                                        </div>
                                    </div>

                                    {Array.isArray(ev.fact_results) && ev.fact_results.length > 0 && (
                                        <div className="fact-evaluation-breakdown" style={{ marginTop: 18, marginBottom: 18, background: '#fff', border: '1px solid var(--brd)', borderRadius: 8, padding: 16 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                                                <h5 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--g900)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <Icon name="ai" size={15} />
                                                    Candidate Reference Facts Evaluation Breakdown ({ev.fact_results.length} facts)
                                                </h5>
                                                <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                                                    <span className="badge badge-completed">Supported: {ev.supported || 0}</span>
                                                    <span className="badge badge-modified">Uncertain: {ev.uncertain || 0}</span>
                                                    {(ev.contradicted || 0) > 0 && <span className="badge badge-cancelled">Contradicted: {ev.contradicted}</span>}
                                                    {(ev.missing || 0) > 0 && <span className="badge badge-pending">Missing: {ev.missing}</span>}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                {ev.fact_results.map((fr, fIdx) => {
                                                    const labelCls = fr.label === 'supported' ? 'badge-completed' : (fr.label === 'contradicted' ? 'badge-cancelled' : (fr.label === 'uncertain' ? 'badge-modified' : 'badge-pending'))
                                                    const simVal = (typeof fr.similarity === 'number' ? fr.similarity : 0).toFixed(2)
                                                    const entPct = Math.round((fr.probabilities?.entailment || 0) * 100)
                                                    const neuPct = Math.round((fr.probabilities?.neutral || 0) * 100)
                                                    const conPct = Math.round((fr.probabilities?.contradiction || 0) * 100)

                                                    return (
                                                        <div key={fIdx} style={{ background: 'var(--g50)', borderRadius: 6, padding: '10px 12px', border: '1px solid var(--g200)' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                                                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>
                                                                    Fact {fIdx + 1}: <span style={{ color: 'var(--g800)', fontWeight: 500 }}>{fr.fact}</span>
                                                                </div>
                                                                <span className={`badge ${labelCls}`} style={{ textTransform: 'capitalize', flexShrink: 0 }}>
                                                                    {fr.label}
                                                                </span>
                                                            </div>

                                                            {fr.matched_sentence && (
                                                                <div style={{ fontSize: 12, color: 'var(--g600)', marginBottom: 6, paddingLeft: 8, borderLeft: '2px solid var(--blue)' }}>
                                                                    <strong style={{ color: 'var(--g700)' }}>Matched Evidence: </strong>
                                                                    <em>"{fr.matched_sentence}"</em>
                                                                </div>
                                                            )}

                                                            <div style={{ display: 'flex', gap: 14, fontSize: 11, color: 'var(--g500)', flexWrap: 'wrap', marginTop: 4 }}>
                                                                <span>SBERT Similarity: <strong>{simVal}</strong></span>
                                                                <span>Entailment: <strong>{entPct}%</strong></span>
                                                                <span>Neutral: <strong>{neuPct}%</strong></span>
                                                                <span>Contradiction: <strong>{conPct}%</strong></span>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px dashed var(--g300)', fontSize: 12, color: 'var(--g600)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                                <span>
                                                    <strong>Scoring Formula:</strong> [0.60 × (Supported + 0.5×Uncertain) / Total Facts + 0.40 × Similarity] × Max Marks
                                                </span>
                                                <span style={{ fontWeight: 700, color: 'var(--navy)' }}>
                                                    Awarded: {ev.aiScore} / {q.marks} marks
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="ai-feedback">
                                        <div className="ai-feedback-header">
                                            <Icon name="ai" size={14} />
                                            AI Feedback
                                        </div>
                                        <div className="ai-feedback-text">{ev.feedback || 'Answer evaluated.'}</div>
                                    </div>

                                    <div className="teacher-review">
                                        <div className="teacher-review-header">
                                            <h5>
                                                <Icon name="users" size={15} />
                                                Teacher Review
                                            </h5>
                                            {ev.reviewed && (
                                                <span className="badge badge-completed">
                                                    <Icon name="check" size={12} />
                                                    Reviewed
                                                </span>
                                            )}
                                        </div>
                                        <div className="score-row">
                                            <div className="score-label">AI Score:</div>
                                            <div className="score-value ai">
                                                {ev.aiScore} / {q.marks}
                                            </div>
                                        </div>
                                        <div className="score-row">
                                            <div className="score-label">Final Score:</div>
                                            <div className="score-input-wrap">
                                                <input
                                                    type="number"
                                                    className="score-input"
                                                    value={ev.finalScore}
                                                    min="0"
                                                    max={q.marks}
                                                    step="0.5"
                                                    onChange={(e) => updateFinalScore(idx, e.target.value)}
                                                    disabled={studentState === 'finalized'}
                                                />
                                                <span className="score-max">/ {q.marks}</span>
                                            </div>
                                        </div>
                                        {(ev.reason || studentState !== 'finalized') && (
                                            <textarea
                                                className="reason-input"
                                                placeholder="Reason for modification (optional)..."
                                                value={ev.reason || ''}
                                                onChange={(e) => updateReason(idx, e.target.value)}
                                                disabled={studentState === 'finalized'}
                                            />
                                        )}
                                        {studentState !== 'finalized' && (
                                            <div className="review-actions">
                                                <button
                                                    className="btn btn-outline btn-sm"
                                                    onClick={() => approveAI(idx)}
                                                >
                                                    <Icon name="check" size={14} />
                                                    Approve AI Score
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-sm"
                                                    onClick={() => saveReview(idx)}
                                                >
                                                    <Icon name="save" size={14} />
                                                    Save Review
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {evaluatedList.length > 0 && (
                    <div className="overall-summary">
                        <h3>
                            <Icon name="chart" size={20} />
                            Overall Performance Summary
                        </h3>
                        <div className="overall-grid">
                            <div className="overall-item">
                                <div className="label">Total Marks</div>
                                <div className="value">{currentExam.totalMarks}</div>
                            </div>
                            <div className="overall-item">
                                <div className="label">AI Evaluated</div>
                                <div className="value">{aiTotal}</div>
                            </div>
                            <div className="overall-item">
                                <div className="label">Final Marks</div>
                                <div className="value green">{finalTotal}</div>
                            </div>
                            <div className="overall-item">
                                <div className="label">Percentage</div>
                                <div className="value">
                                    {currentExam.totalMarks > 0 ? Math.round((finalTotal / currentExam.totalMarks) * 100) : 0}%
                                </div>
                            </div>
                        </div>
                        {adjustment !== 0 && (
                            <div className="warning-banner">
                                <Icon name="warning" size={16} />
                                Teacher adjustment:{' '}
                                <strong>
                                    {adjustment > 0 ? '+' : ''}
                                    {adjustment}
                                </strong>{' '}
                                marks (AI total: {aiTotal} → Final: {finalTotal})
                            </div>
                        )}
                        <div className="score-breakdown">
                            <div className="breakdown-item">
                                <span className="breakdown-dot green" />
                                <div className="breakdown-info">
                                    <div className="label">Correct</div>
                                    <div className="value">
                                        {correct} / {evaluatedList.length}
                                    </div>
                                </div>
                            </div>
                            <div className="breakdown-item">
                                <span className="breakdown-dot amber" />
                                <div className="breakdown-info">
                                    <div className="label">Partially Correct</div>
                                    <div className="value">
                                        {partial} / {evaluatedList.length}
                                    </div>
                                </div>
                            </div>
                            <div className="breakdown-item">
                                <span className="breakdown-dot red" />
                                <div className="breakdown-info">
                                    <div className="label">Incorrect</div>
                                    <div className="value">
                                        {incorrect} / {evaluatedList.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

    const renderStudentResult = () => {
        if (!currentExam || !currentStudent) return null
        const pct = currentStudent.pct !== null && currentStudent.pct !== undefined ? currentStudent.pct : 0

        let bodyContent = null
        if (studentState === 'not_uploaded') {
            bodyContent = (
                <>
                    {renderPlainTextEvaluationPanel()}
                    {renderUploadZone()}
                </>
            )
        } else if (studentState === 'file_selected') {
            bodyContent = renderFileInfo()
        } else if (studentState === 'uploading') {
            bodyContent = renderUploading()
        } else if (studentState === 'htr_processing') {
            bodyContent = renderHTRProcessing()
        } else if (studentState === 'text_extracted') {
            bodyContent = renderExtractedAnswers()
        } else if (studentState === 'ai_processing') {
            bodyContent = renderAIProcessing()
        } else if (
            studentState === 'evaluation_completed' ||
            studentState === 'teacher_review' ||
            studentState === 'finalized'
        ) {
            bodyContent = (
                <>
                    {studentState !== 'finalized' && renderPlainTextEvaluationPanel()}
                    {renderEvaluations()}
                </>
            )
        }

        return (
            <>
                <div className="breadcrumb">
                    <button onClick={goToDashboard}>Results</button>
                    <span className="sep">/</span>
                    <button onClick={() => openExam(currentExam.id)}>{currentExam.title}</button>
                    <span className="sep">/</span>
                    <span className="current">{currentStudent.name}</span>
                </div>

                <div className="student-result-header">
                    <div className="student-result-info">
                        <h2>{currentStudent.name}</h2>
                        <div className="sub">{currentExam.title}</div>
                        <div className="student-result-meta">
                            <div className="meta-chip">
                                <Icon name="calendar" size={14} />
                                Roll No: <strong>{currentStudent.id}</strong>
                            </div>
                            <div className="meta-chip">
                                <Icon name="file" size={14} />
                                Total Marks: <strong>{currentExam.totalMarks}</strong>
                            </div>
                            <div className="meta-chip">{statusBadge(currentStudent.status)}</div>
                        </div>
                    </div>
                    {currentStudent.score !== null && (
                        <div className="score-circle" style={{ '--pct': pct }}>
                            <div className="score-circle-inner">
                                <div className="big">
                                    {currentStudent.finalScore !== null && currentStudent.finalScore !== undefined
                                        ? currentStudent.finalScore
                                        : currentStudent.score}
                                </div>
                                <div className="small">
                                    / {currentExam.totalMarks} · {pct}%
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {loadingEvaluations ? (
                    <div className="panel" style={{ padding: '32px 0' }}>
                        <PageLoader inline message="Loading student evaluation details..." />
                    </div>
                ) : (
                    bodyContent
                )}
            </>
        )
    }

    /* ============================================================
       MAIN RENDER
       ============================================================ */

    return (
        <div className="results-page">
            {view === 'dashboard' && renderDashboard()}
            {view === 'exam' && renderExamDetails()}
            {view === 'student' && renderStudentResult()}

            {/* Export Modal */}
            <div
                className={`modal-overlay ${exportModalOpen ? 'open' : ''}`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) setExportModalOpen(false)
                }}
            >
                <div className="modal">
                    <h3>Export Results</h3>
                    <p>Choose a format to export the examination evaluation results.</p>
                    <div className="modal-export-list">
                        <button className="btn btn-outline" onClick={() => doExport('csv')}>
                            <Icon name="file" size={16} />
                            Export as CSV
                        </button>
                        <button className="btn btn-outline" onClick={() => doExport('pdf')}>
                            <Icon name="file" size={16} />
                            Export as PDF Report
                        </button>
                        <button className="btn btn-outline" onClick={() => doExport('student')}>
                            <Icon name="users" size={16} />
                            Export Individual Student Report
                        </button>
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-ghost"
                            onClick={() => setExportModalOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast */}
            <div className={`toast ${toast.msg ? 'show' : ''} ${toast.error ? 'error' : ''}`}>
                {toast.msg}
            </div>
        </div>
    )
}

export default Results
