import { useEffect, useMemo, useRef, useState } from 'react'
import '../style/CreateExam.css'

/* ============================================================
   ICONS
   ============================================================ */

function Icon({ name, size = 20, className = '' }) {
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
        className,
    }

    const paths = {
        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),
        upload: (
            <>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
            </>
        ),
        edit: (
            <>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </>
        ),
        file: (
            <>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
            </>
        ),
        check: <polyline points="20 6 9 17 4 12" />,
        warning: (
            <>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </>
        ),
        ai: (
            <>
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 2v10l6 4" />
                <circle cx="12" cy="12" r="3" />
            </>
        ),
        search: (
            <>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </>
        ),
        trash: (
            <>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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
        arrowLeft: (
            <>
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
            </>
        ),
        arrowRight: (
            <>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </>
        ),
        emptyFile: (
            <>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
            </>
        ),
    }

    return <svg {...props}>{paths[name]}</svg>
}

/* ============================================================
   CONSTANTS
   ============================================================ */

const STEPS = [
    { number: 1, label: 'Details' },
    { number: 2, label: 'Question Paper' },
    { number: 3, label: 'Answer Key' },
    { number: 4, label: 'Students' },
    { number: 5, label: 'Review & Create' },
]

const DOC_TYPES = {
    DIGITAL: 'digital',
    HANDWRITTEN: 'handwritten',
}

const QUESTION_TYPES = {
    descriptive: 'Descriptive',
    mcq: 'MCQ',
    short: 'Short Answer',
    truefalse: 'True / False',
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

const INITIAL_STUDENTS = [
    { id: 'STU001', name: 'John Smith', email: 'john.smith@university.edu', selected: true },
    { id: 'STU002', name: 'Sarah Johnson', email: 'sarah.j@university.edu', selected: true },
    { id: 'STU003', name: 'Michael Chen', email: 'm.chen@university.edu', selected: true },
    { id: 'STU004', name: 'Emily Davis', email: 'e.davis@university.edu', selected: true },
    { id: 'STU005', name: 'David Wilson', email: 'd.wilson@university.edu', selected: false },
    { id: 'STU006', name: 'Jessica Brown', email: 'j.brown@university.edu', selected: true },
    { id: 'STU007', name: 'Daniel Martinez', email: 'd.martinez@university.edu', selected: true },
    { id: 'STU008', name: 'Sophia Taylor', email: 's.taylor@university.edu', selected: false },
]

const INITIAL_DETAILS = {
    title: 'Midterm Examination',
    subject: 'Biology',
    semester: 'S5',
    date: '2026-10-24',
    duration: '2 Hours',
    marks: 100,
}

// Placeholder questions used when an upload is "processed"
const SAMPLE_QUESTIONS = [
    {
        number: 1,
        type: 'descriptive',
        text: 'Explain the process of photosynthesis and describe the role of chlorophyll in the light-dependent reactions.',
        marks: 10,
        status: 'ok',
    },
    {
        number: 2,
        type: 'descriptive',
        text: 'Discuss the structure and function of the cell membrane. Include a description of the fluid mosaic model.',
        marks: 10,
        status: 'ok',
    },
    {
        number: 3,
        type: 'mcq',
        text: 'Which organelle is responsible for protein synthesis in eukaryotic cells?',
        marks: 5,
        options: ['Mitochondria', 'Ribosome', 'Golgi apparatus', 'Lysosome'],
        correctAnswer: 1,
        status: 'ok',
    },
    {
        number: 4,
        type: 'short',
        text: 'Define osmosis and explain how it differs from diffusion.',
        marks: 5,
        status: 'ok',
    },
    {
        number: 5,
        type: 'descriptive',
        text: 'Describe the stages of mitosis and explain the importance of each stage.',
        marks: 10,
        status: 'warning',
    },
]

/* ============================================================
   HELPERS
   ============================================================ */

function formatFileSize(bytes) {
    if (!bytes) return '0 KB'
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function initials(name) {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

function CreateExam() {
    const [step, setStep] = useState(1)
    const [details, setDetails] = useState(INITIAL_DETAILS)

    /* --- Question Paper state --- */
    const [qpSource, setQpSource] = useState(null) // null | 'upload' | 'manual'
    const [qpFile, setQpFile] = useState(null)
    const [qpDocType, setQpDocType] = useState(null)
    const [qpState, setQpState] = useState('idle') // idle | doc-type | processing | complete
    const [qpQuestions, setQpQuestions] = useState([])

    /* --- Processing animation state (shared) --- */
    const [processingKind, setProcessingKind] = useState(null) // 'qp' | 'ak' | null
    const [processingStepIdx, setProcessingStepIdx] = useState(0)
    const [processingDone, setProcessingDone] = useState(false)

    /* --- Answer Key state --- */
    const [akSource, setAkSource] = useState(null) // null | 'upload' | 'ai'
    const [akFile, setAkFile] = useState(null)
    const [akDocType, setAkDocType] = useState(null)
    const [akState, setAkState] = useState('idle') // idle | doc-type | processing | editing | confirmed
    const [akAnswers, setAkAnswers] = useState({}) // { [qNumber]: answerObj }
    const [selectedQNumber, setSelectedQNumber] = useState(1)

    /* --- Students --- */
    const [students, setStudents] = useState(INITIAL_STUDENTS)
    const [studentSearch, setStudentSearch] = useState('')

    /* --- Modals --- */
    const [questionModal, setQuestionModal] = useState(null)
    // null = closed, { index: null | number } = open (add or edit)
    const [studentModal, setStudentModal] = useState(false)
    const [editModal, setEditModal] = useState(null) // index into qpQuestions
    const [successModal, setSuccessModal] = useState(false)
    const [successMessage, setSuccessMessage] = useState({ title: '', message: '' })

    /* --- Toast --- */
    const [toast, setToast] = useState('')

    useEffect(() => {
        if (!toast) return undefined
        const t = setTimeout(() => setToast(''), 2800)
        return () => clearTimeout(t)
    }, [toast])

    /* ============================================================
       STEP NAVIGATION
       ============================================================ */

    const goNext = () => {
        if (step < 5) {
            if (step === 1) {
                // details already bound to state
            }
            setStep((s) => s + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            createExam()
        }
    }

    const goBack = () => {
        if (step > 1) {
            setStep((s) => s - 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const goToStep = (n) => {
        if (n >= 1 && n <= 5) {
            setStep(n)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    /* ============================================================
       PROCESSING ANIMATION
       ============================================================ */

    const processingSteps = useMemo(() => {
        if (processingKind === 'qp') {
            const digital = qpDocType === DOC_TYPES.DIGITAL
            return digital
                ? ['File uploaded', 'Digital document confirmed', 'Text extracted', 'Question numbers detected', 'Questions identified']
                : ['File uploaded', 'Handwritten document confirmed', 'Recognizing handwriting', 'Identifying question numbers', 'Structuring questions']
        }
        if (processingKind === 'ak') {
            const isAI = akSource === 'ai'
            const digital = akDocType === DOC_TYPES.DIGITAL || isAI
            if (isAI) {
                return ['Question paper analyzed', 'AI generating reference answers', 'Identifying key concepts', 'Creating marking schemes', 'Structuring evaluation data']
            }
            return digital
                ? ['File uploaded', 'Digital document confirmed', 'Text extracted', 'Question matching', 'Answer structuring']
                : ['File uploaded', 'Handwritten document confirmed', 'Recognizing handwriting', 'Question matching', 'Answer structuring']
        }
        return []
    }, [processingKind, qpDocType, akSource, akDocType])

    useEffect(() => {
        if (!processingKind) return undefined
        setProcessingStepIdx(0)
        setProcessingDone(false)

        const interval = setInterval(() => {
            setProcessingStepIdx((i) => {
                if (i < processingSteps.length) return i + 1
                return i
            })
        }, 700)

        return () => clearInterval(interval)
    }, [processingKind, processingSteps.length])

    useEffect(() => {
        if (!processingKind) return undefined
        if (processingStepIdx < processingSteps.length) return undefined

        // All steps done — finalize
        setProcessingDone(true)

        const timeout = setTimeout(() => {
            if (processingKind === 'qp') {
                setQpQuestions(SAMPLE_QUESTIONS.map((q) => ({ ...q })))
                setQpState('complete')
            } else if (processingKind === 'ak') {
                // Build answer keys for each question
                const answers = {}
                SAMPLE_QUESTIONS.forEach((q) => {
                    answers[q.number] = {
                        reference:
                            q.type === 'mcq'
                                ? q.options[q.correctAnswer] || ''
                                : `A complete reference answer for Q${q.number} covering the core concept, supporting details, and key terminology.`,
                        concepts:
                            q.type === 'mcq'
                                ? ['Correct option', 'Core concept']
                                : ['Core concept', 'Explanation', 'Supporting points', 'Terminology'],
                        criteria: [
                            { name: 'Correct understanding of the concept', marks: Math.max(1, Math.round(q.marks * 0.4)) },
                            { name: 'Relevant explanation and supporting details', marks: Math.max(1, Math.round(q.marks * 0.35)) },
                            { name: 'Clarity and completeness', marks: Math.max(1, q.marks - Math.round(q.marks * 0.4) - Math.round(q.marks * 0.35)) },
                        ],
                        guidance: 'Award marks according to the presence and correctness of the required concepts.',
                        reviewed: false,
                        aiGenerated: akSource === 'ai',
                    }
                })
                setAkAnswers(answers)
                setSelectedQNumber(1)
                setAkState('editing')
            }
            setProcessingKind(null)
        }, 1200)

        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processingStepIdx, processingSteps.length, processingKind])

    /* ============================================================
       QUESTION PAPER HANDLERS
       ============================================================ */

    const handleQpFile = (file) => {
        if (!file) return
        setQpFile(file)
        setQpDocType(null)
        setQpState('doc-type')
    }

    const startQpProcessing = () => {
        if (!qpDocType) return
        setQpState('processing')
        setProcessingKind('qp')
    }

    const resetQpUpload = () => {
        setQpFile(null)
        setQpDocType(null)
        setQpState('idle')
    }

    const backToQpChoice = () => {
        setQpSource(null)
        setQpFile(null)
        setQpDocType(null)
        setQpState('idle')
        setQpQuestions([])
    }

    /* ============================================================
       ANSWER KEY HANDLERS
       ============================================================ */

    const handleAkFile = (file) => {
        if (!file) return
        setAkFile(file)
        setAkDocType(null)
        setAkState('doc-type')
    }

    const startAkProcessing = (isAI = false) => {
        if (!isAI && !akDocType) return
        setAkState('processing')
        setProcessingKind('ak')
    }

    const backToAkChoice = () => {
        setAkSource(null)
        setAkFile(null)
        setAkDocType(null)
        setAkState('idle')
        setAkAnswers({})
    }

    /* ============================================================
       ANSWER KEY EDITOR HANDLERS
       ============================================================ */

    const currentAnswer = akAnswers[selectedQNumber]
    const currentQuestion = qpQuestions.find((q) => q.number === selectedQNumber)

    const updateAnswer = (field, value) => {
        setAkAnswers((prev) => ({
            ...prev,
            [selectedQNumber]: { ...prev[selectedQNumber], [field]: value, reviewed: false },
        }))
    }

    const addConcept = (concept) => {
        if (!concept.trim()) return
        const a = akAnswers[selectedQNumber]
        updateAnswer('concepts', [...a.concepts, concept.trim()])
    }

    const removeConcept = (index) => {
        const a = akAnswers[selectedQNumber]
        updateAnswer('concepts', a.concepts.filter((_, i) => i !== index))
    }

    const updateCriterion = (index, field, value) => {
        const a = akAnswers[selectedQNumber]
        const criteria = a.criteria.map((c, i) => (i === index ? { ...c, [field]: value } : c))
        updateAnswer('criteria', criteria)
    }

    const addCriterion = () => {
        const a = akAnswers[selectedQNumber]
        updateAnswer('criteria', [...a.criteria, { name: 'New criterion', marks: 1 }])
    }

    const removeCriterion = (index) => {
        const a = akAnswers[selectedQNumber]
        updateAnswer('criteria', a.criteria.filter((_, i) => i !== index))
    }

    const markReviewed = () => {
        const a = akAnswers[selectedQNumber]
        updateAnswer('reviewed', !a.reviewed)
    }

    const saveAnswer = () => {
        updateAnswer('reviewed', true)
        setToast('Answer saved.')
    }

    const confirmAnswerKey = () => {
        setAkState('confirmed')
        setToast('Answer key confirmed.')
    }

    /* ============================================================
       QUESTION MODAL (add / edit manual questions)
       ============================================================ */

    const [qForm, setQForm] = useState({
        number: 1,
        text: '',
        marks: 5,
        type: 'descriptive',
        options: ['', '', '', ''],
        correctAnswer: 0,
        tfAnswer: 'True',
    })

    const openAddQuestion = () => {
        setQForm({
            number: qpQuestions.length + 1,
            text: '',
            marks: 5,
            type: 'descriptive',
            options: ['', '', '', ''],
            correctAnswer: 0,
            tfAnswer: 'True',
        })
        setQuestionModal({ index: null })
    }

    const openEditQuestion = (index) => {
        const q = qpQuestions[index]
        setQForm({
            number: q.number,
            text: q.text,
            marks: q.marks,
            type: q.type,
            options: q.options ? [...q.options] : ['', '', '', ''],
            correctAnswer: q.correctAnswer ?? 0,
            tfAnswer: q.correctAnswer ?? 'True',
        })
        setQuestionModal({ index })
    }

    const saveQuestion = () => {
        if (!qForm.text.trim()) {
            setToast('Please enter question text.')
            return
        }
        if (!qForm.marks || qForm.marks < 1) {
            setToast('Please enter valid marks.')
            return
        }

        const newQ = {
            number: Number(qForm.number),
            text: qForm.text.trim(),
            marks: Number(qForm.marks),
            type: qForm.type,
            status: 'ok',
        }
        if (qForm.type === 'mcq') {
            newQ.options = [...qForm.options]
            newQ.correctAnswer = Number(qForm.correctAnswer)
        } else if (qForm.type === 'truefalse') {
            newQ.correctAnswer = qForm.tfAnswer
        }

        setQpQuestions((prev) => {
            if (questionModal.index !== null) {
                const copy = [...prev]
                copy[questionModal.index] = newQ
                return copy.sort((a, b) => a.number - b.number)
            }
            return [...prev, newQ].sort((a, b) => a.number - b.number)
        })
        setQuestionModal(null)
    }

    const deleteManualQuestion = (index) => {
        setQpQuestions((prev) => {
            const copy = prev.filter((_, i) => i !== index)
            return copy.map((q, i) => ({ ...q, number: i + 1 }))
        })
    }

    /* ============================================================
       EDIT QUESTION (from review list)
       ============================================================ */

    const [editForm, setEditForm] = useState({ number: 1, marks: 1, text: '', type: 'descriptive' })

    const openEditReviewModal = (index) => {
        const q = qpQuestions[index]
        setEditForm({ number: q.number, marks: q.marks, text: q.text, type: q.type })
        setEditModal(index)
    }

    const saveEditReview = () => {
        setQpQuestions((prev) => {
            const copy = [...prev]
            copy[editModal] = { ...copy[editModal], ...editForm, number: Number(editForm.number), marks: Number(editForm.marks), status: 'ok' }
            return copy
        })
        setEditModal(null)
    }

    /* ============================================================
       STUDENTS
       ============================================================ */

    const filteredStudents = useMemo(() => {
        const q = studentSearch.toLowerCase()
        return students.filter((s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))
    }, [students, studentSearch])

    const selectedStudentCount = students.filter((s) => s.selected).length

    const toggleStudent = (id) => {
        setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s)))
    }

    const selectAllStudents = () => {
        setStudents((prev) => prev.map((s) => ({ ...s, selected: true })))
    }

    const deselectAllStudents = () => {
        setStudents((prev) => prev.map((s) => ({ ...s, selected: false })))
    }

    const removeStudent = (id) => {
        setStudents((prev) => prev.filter((s) => s.id !== id))
    }

    const [newStudent, setNewStudent] = useState({ name: '', id: '', email: '' })
    const [studentError, setStudentError] = useState('')

    const openStudentModal = () => {
        setNewStudent({ name: '', id: '', email: '' })
        setStudentError('')
        setStudentModal(true)
    }

    const saveStudent = () => {
        const { name, id, email } = newStudent
        if (!name.trim() || !id.trim() || !email.trim()) {
            setStudentError('Please fill in all required fields.')
            return
        }
        if (students.some((s) => s.id.toLowerCase() === id.toLowerCase())) {
            setStudentError('A student with this ID already exists.')
            return
        }
        setStudents((prev) => [...prev, { id, name: name.trim(), email: email.trim(), selected: true }])
        setStudentModal(false)
    }

    /* ============================================================
       CREATE EXAM
       ============================================================ */

    const createExam = () => {
        setSuccessMessage({
            title: 'Exam Created!',
            message: `Your exam "${details.title || 'Untitled'}" has been successfully created and assigned to ${selectedStudentCount} student(s). Grading will begin once submissions are received.`,
        })
        setSuccessModal(true)
    }

    const saveDraft = () => {
        setSuccessMessage({
            title: 'Draft Saved!',
            message: 'Your exam has been saved as a draft. You can continue editing it later.',
        })
        setSuccessModal(true)
    }

    /* ============================================================
       RENDER HELPERS
       ============================================================ */

    const renderStepper = () => (
        <div className="ce-stepper-wrapper">
            <div className="ce-stepper">
                {STEPS.map((s, i) => {
                    const isActive = step === s.number
                    const isCompleted = step > s.number
                    return (
                        <div key={s.number} style={{ display: 'contents' }}>
                            <button
                                type="button"
                                className={`ce-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                                onClick={() => goToStep(s.number)}
                            >
                                <div className="ce-step-circle">
                                    {isCompleted ? (
                                        <Icon name="check" size={14} />
                                    ) : (
                                        s.number
                                    )}
                                </div>
                                <span className="ce-step-label">{s.label}</span>
                            </button>
                            {i < STEPS.length - 1 && (
                                <div className={`ce-step-line ${isCompleted ? 'completed' : ''}`} />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )

    /* ---------- STEP 1: Details ---------- */
    const renderStep1 = () => (
        <div className="ce-card">
            <div className="ce-card-header">
                <h2>Exam Details</h2>
                <p>Enter basic information about the examination.</p>
            </div>
            <div className="ce-form-grid">
                <div className="ce-form-group full-width">
                    <label>Exam Title</label>
                    <input
                        type="text"
                        value={details.title}
                        onChange={(e) => setDetails({ ...details, title: e.target.value })}
                        placeholder="e.g. Midterm Examination"
                    />
                </div>
                <div className="ce-form-group">
                    <label>Subject / Course</label>
                    <input
                        type="text"
                        value={details.subject}
                        onChange={(e) => setDetails({ ...details, subject: e.target.value })}
                        placeholder="e.g. Biology"
                    />
                </div>
                <div className="ce-form-group">
                    <label>Semester</label>
                    <select
                        value={details.semester}
                        onChange={(e) => setDetails({ ...details, semester: e.target.value })}
                    >
                        <option value="">Select Semester</option>
                        <option value="S4">S4</option>
                        <option value="S5">S5</option>
                        <option value="S6">S6</option>
                    </select>
                </div>
                <div className="ce-form-group">
                    <label>Exam Date</label>
                    <input
                        type="date"
                        value={details.date}
                        onChange={(e) => setDetails({ ...details, date: e.target.value })}
                    />
                </div>
                <div className="ce-form-group">
                    <label>Duration</label>
                    <input
                        type="text"
                        value={details.duration}
                        onChange={(e) => setDetails({ ...details, duration: e.target.value })}
                        placeholder="e.g. 2 Hours"
                    />
                </div>
                <div className="ce-form-group full-width">
                    <label>Total Marks</label>
                    <input
                        type="number"
                        value={details.marks}
                        onChange={(e) => setDetails({ ...details, marks: e.target.value })}
                        placeholder="100"
                    />
                </div>
            </div>
        </div>
    )

    /* ---------- STEP 2: Question Paper ---------- */
    const renderStep2 = () => {
        // Choice screen
        if (qpSource === null && qpState === 'idle') {
            return (
                <div className="ce-card">
                    <div className="ce-card-header">
                        <h2>Question Paper</h2>
                        <p>How would you like to create your question paper?</p>
                    </div>
                    <div className="ce-choice-grid">
                        <button
                            type="button"
                            className="ce-choice-card recommended"
                            onClick={() => setQpSource('upload')}
                        >
                            <div className="ce-choice-icon">
                                <Icon name="upload" size={28} />
                            </div>
                            <h3>Upload Question Paper</h3>
                            <p>Upload an existing PDF or image for automatic extraction.</p>
                        </button>
                        <button
                            type="button"
                            className="ce-choice-card"
                            onClick={() => setQpSource('manual')}
                        >
                            <div className="ce-choice-icon">
                                <Icon name="edit" size={28} />
                            </div>
                            <h3>Create Manually</h3>
                            <p>Add questions one by one with full control over type, marks, and options.</p>
                        </button>
                    </div>
                </div>
            )
        }

        // Upload flow — upload zone
        if (qpSource === 'upload' && qpState === 'idle') {
            return (
                <div className="ce-card">
                    <div className="ce-card-header">
                        <h2>Upload Question Paper</h2>
                        <p>Upload your question paper document.</p>
                    </div>
                    <QpUploadZone onFile={handleQpFile} />
                </div>
            )
        }

        // Upload flow — doc type confirmation
        if (qpSource === 'upload' && qpState === 'doc-type') {
            return (
                <div className="ce-card">
                    <div className="ce-card-header">
                        <h2>Question Paper Uploaded</h2>
                        <p>Confirm the document type before processing.</p>
                    </div>

                    <div className="ce-file-info">
                        <div className="ce-file-icon">
                            <Icon name="file" size={22} />
                        </div>
                        <div className="ce-file-details">
                            <div className="name">{qpFile?.name}</div>
                            <div className="size">{formatFileSize(qpFile?.size)}</div>
                        </div>
                        <button className="ce-replace-btn" onClick={resetQpUpload}>
                            Replace File
                        </button>
                    </div>

                    <div className="ce-doc-type-section">
                        <h3>How was this question paper created?</h3>
                        <p>Select the document type so AutoGrade can use the correct processing method.</p>
                        <div className="ce-doc-type-grid">
                            <DocTypeCard
                                title="Digital Document"
                                desc="Computer-generated PDF/document"
                                method="OCR · Fast Text Extraction"
                                selected={qpDocType === DOC_TYPES.DIGITAL}
                                onClick={() => setQpDocType(DOC_TYPES.DIGITAL)}
                            />
                            <DocTypeCard
                                title="Handwritten Document"
                                desc="Scanned or photographed handwritten question paper"
                                method="HTR · Handwriting Recognition"
                                selected={qpDocType === DOC_TYPES.HANDWRITTEN}
                                onClick={() => setQpDocType(DOC_TYPES.HANDWRITTEN)}
                            />
                        </div>
                    </div>

                    <div className="ce-form-footer" style={{ borderTop: 'none', marginTop: 24, paddingTop: 0 }}>
                        <div className="ce-footer-left">
                            <button className="ce-btn ce-btn-ghost" onClick={backToQpChoice}>
                                ← Back
                            </button>
                        </div>
                        <div className="ce-footer-right">
                            <button
                                className="ce-btn ce-btn-primary"
                                disabled={!qpDocType}
                                onClick={startQpProcessing}
                            >
                                Confirm & Extract
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        // Upload flow — processing
        if (qpSource === 'upload' && qpState === 'processing') {
            return (
                <ProcessingCard
                    title={qpDocType === DOC_TYPES.DIGITAL ? 'Processing Question Paper' : 'Processing Handwritten Question Paper'}
                    subtitle={
                        processingDone
                            ? 'Extraction complete!'
                            : 'Please wait while we extract your questions...'
                    }
                    steps={processingSteps}
                    currentStepIdx={processingStepIdx}
                    showSpinner={!processingDone}
                />
            )
        }

        // Upload flow — review
        if (qpSource === 'upload' && qpState === 'complete') {
            return (
                <div className="ce-card">
                    <div className="ce-review-header">
                        <h2>Question Paper</h2>
                        <span className="ce-review-badge">
                            <Icon name="check" size={14} />
                            {qpQuestions.length} Questions Created Automatically
                        </span>
                    </div>
                    <div className="ce-question-list">
                        {qpQuestions.map((q, i) => (
                            <QuestionCard
                                key={i}
                                question={q}
                                onEdit={() => openEditReviewModal(i)}
                            />
                        ))}
                    </div>
                </div>
            )
        }

        // Manual flow
        if (qpSource === 'manual') {
            return (
                <div className="ce-card">
                    <div className="ce-manual-creator-header">
                        <h2>Question Paper</h2>
                        <span className="ce-question-count-badge">
                            {qpQuestions.length} Question{qpQuestions.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {qpQuestions.length === 0 ? (
                        <div className="ce-empty-questions">
                            <Icon name="emptyFile" size={64} />
                            <h3>No questions added yet</h3>
                            <p>Click "Add New Question" to start building your question paper.</p>
                        </div>
                    ) : (
                        qpQuestions.map((q, i) => (
                            <ManualQuestionCard
                                key={i}
                                question={q}
                                onEdit={() => openEditQuestion(i)}
                                onDelete={() => deleteManualQuestion(i)}
                            />
                        ))
                    )}

                    <button className="ce-add-question-btn-large" onClick={openAddQuestion}>
                        <Icon name="plus" size={20} />
                        Add New Question
                    </button>
                </div>
            )
        }

        return null
    }

    /* ---------- STEP 3: Answer Key ---------- */
    const renderStep3 = () => {
        if (akSource === null && akState === 'idle') {
            return (
                <div className="ce-card">
                    <div className="ce-card-header">
                        <h2>Answer Key & Marking Scheme</h2>
                        <p>Create structured reference information for AI evaluation.</p>
                    </div>
                    <div className="ce-choice-grid">
                        <button
                            type="button"
                            className="ce-choice-card recommended"
                            onClick={() => setAkSource('upload')}
                        >
                            <div className="ce-choice-icon">
                                <Icon name="upload" size={28} />
                            </div>
                            <h3>Upload Existing Answer Key</h3>
                            <p>Upload an existing answer-key or marking-scheme document.</p>
                        </button>
                        <button
                            type="button"
                            className="ce-choice-card"
                            onClick={() => {
                                setAkSource('ai')
                                startAkProcessing(true)
                            }}
                        >
                            <div className="ce-choice-icon">
                                <Icon name="ai" size={28} />
                            </div>
                            <h3>Create with AI</h3>
                            <p>Use the confirmed question paper to generate a draft answer key and marking scheme.</p>
                        </button>
                    </div>
                </div>
            )
        }

        if (akSource === 'upload' && akState === 'idle') {
            return (
                <div className="ce-card">
                    <div className="ce-card-header">
                        <h2>Upload Answer Key</h2>
                        <p>Upload your answer key or marking scheme document.</p>
                    </div>
                    <AkUploadZone onFile={handleAkFile} />
                </div>
            )
        }

        if (akSource === 'upload' && akState === 'doc-type') {
            return (
                <div className="ce-card">
                    <div className="ce-card-header">
                        <h2>Answer Key Uploaded</h2>
                        <p>Confirm the document type before processing.</p>
                    </div>

                    <div className="ce-file-info">
                        <div className="ce-file-icon">
                            <Icon name="file" size={22} />
                        </div>
                        <div className="ce-file-details">
                            <div className="name">{akFile?.name}</div>
                            <div className="size">{formatFileSize(akFile?.size)}</div>
                        </div>
                        <button
                            className="ce-replace-btn"
                            onClick={() => {
                                setAkFile(null)
                                setAkDocType(null)
                                setAkState('idle')
                            }}
                        >
                            Replace File
                        </button>
                    </div>

                    <div className="ce-doc-type-section">
                        <h3>How was this document created?</h3>
                        <p>Select the document type so AutoGrade can use the correct processing method.</p>
                        <div className="ce-doc-type-grid">
                            <DocTypeCard
                                title="Digital Document"
                                desc="Computer-generated PDF/document"
                                method="OCR · Fast Text Extraction"
                                selected={akDocType === DOC_TYPES.DIGITAL}
                                onClick={() => setAkDocType(DOC_TYPES.DIGITAL)}
                            />
                            <DocTypeCard
                                title="Handwritten Document"
                                desc="Scanned or photographed handwritten answer key"
                                method="HTR · Handwriting Recognition"
                                selected={akDocType === DOC_TYPES.HANDWRITTEN}
                                onClick={() => setAkDocType(DOC_TYPES.HANDWRITTEN)}
                            />
                        </div>
                    </div>

                    <div className="ce-form-footer" style={{ borderTop: 'none', marginTop: 24, paddingTop: 0 }}>
                        <div className="ce-footer-left">
                            <button className="ce-btn ce-btn-ghost" onClick={backToAkChoice}>
                                ← Back
                            </button>
                        </div>
                        <div className="ce-footer-right">
                            <button
                                className="ce-btn ce-btn-primary"
                                disabled={!akDocType}
                                onClick={() => startAkProcessing(false)}
                            >
                                Confirm & Process
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        if (akState === 'processing') {
            return (
                <ProcessingCard
                    title={
                        akSource === 'ai'
                            ? 'Generating Answer Key with AI'
                            : akDocType === DOC_TYPES.DIGITAL
                              ? 'Processing Answer Key'
                              : 'Processing Handwritten Answer Key'
                    }
                    subtitle={
                        processingDone
                            ? 'Processing complete!'
                            : akSource === 'ai'
                              ? 'AI is preparing a structured answer key...'
                              : 'Please wait while we structure your answer key...'
                    }
                    steps={processingSteps}
                    currentStepIdx={processingStepIdx}
                    showSpinner={!processingDone}
                />
            )
        }

        if (akState === 'editing' && currentAnswer) {
            return (
                <div className="ce-card">
                    <div className="ce-card-header">
                        <h2>Answer Key Editor</h2>
                        <p>Review and edit the structured answer key for each question.</p>
                    </div>

                    <div className="ce-completion-grid">
                        <CompletionItem
                            label="Reference Answers"
                            value={`${Object.keys(akAnswers).length} / ${Object.keys(akAnswers).length}`}
                            complete
                        />
                        <CompletionItem
                            label="Key Concepts"
                            value={`${Object.values(akAnswers).filter((a) => a.concepts.length).length} / ${Object.keys(akAnswers).length}`}
                            complete
                        />
                        <CompletionItem
                            label="Marking Schemes"
                            value={`${Object.values(akAnswers).filter((a) => a.criteria.length).length} / ${Object.keys(akAnswers).length}`}
                            complete
                        />
                        <CompletionItem
                            label="Teacher Review"
                            value={`${Object.values(akAnswers).filter((a) => a.reviewed).length} / ${Object.keys(akAnswers).length}`}
                            complete={Object.values(akAnswers).every((a) => a.reviewed)}
                        />
                    </div>

                    <div className="ce-answer-key-layout">
                        <div className="ce-question-sidebar">
                            <h4>Questions</h4>
                            {qpQuestions.map((q) => {
                                const a = akAnswers[q.number]
                                const cls = a?.reviewed ? 'done' : q.status === 'warning' ? 'warning' : ''
                                return (
                                    <button
                                        key={q.number}
                                        className={`ce-sidebar-question ${cls} ${selectedQNumber === q.number ? 'active' : ''}`}
                                        onClick={() => setSelectedQNumber(q.number)}
                                    >
                                        <span className="status-dot" />
                                        <span>Q{q.number}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <div className="ce-editor-panel">
                            <AnswerKeyEditor
                                question={currentQuestion}
                                answer={currentAnswer}
                                onUpdate={updateAnswer}
                                onAddConcept={addConcept}
                                onRemoveConcept={removeConcept}
                                onUpdateCriterion={updateCriterion}
                                onAddCriterion={addCriterion}
                                onRemoveCriterion={removeCriterion}
                                onMarkReviewed={markReviewed}
                                onSave={saveAnswer}
                            />
                        </div>
                    </div>

                    <div className="ce-form-footer">
                        <div />
                        <div className="ce-footer-right">
                            <button className="ce-btn ce-btn-success" onClick={confirmAnswerKey}>
                                <Icon name="check" size={16} />
                                Confirm Answer Key
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        if (akState === 'confirmed') {
            const total = Object.keys(akAnswers).length
            return (
                <div className="ce-card ce-ak-confirm-card">
                    <div className="ce-ak-confirm-icon">
                        <Icon name="check" size={32} />
                    </div>
                    <h2>Answer Key Ready</h2>
                    <p>All questions have been reviewed and confirmed.</p>
                    <div className="ce-ak-confirm-checklist">
                        <div className="ce-review-checklist">
                            <div className="ce-review-check-item">
                                <Icon name="check" size={16} />
                                <span>{total} Questions</span>
                            </div>
                            <div className="ce-review-check-item">
                                <Icon name="check" size={16} />
                                <span>{total} Reference Answers</span>
                            </div>
                            <div className="ce-review-check-item">
                                <Icon name="check" size={16} />
                                <span>{total} Marking Schemes</span>
                            </div>
                            <div className="ce-review-check-item">
                                <Icon name="check" size={16} />
                                <span>Teacher Review Completed</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return null
    }

    /* ---------- STEP 4: Students ---------- */
    const renderStep4 = () => (
        <div className="ce-card">
            <div className="ce-card-header">
                <h2>Assign Students</h2>
                <p>Select the students who will take this examination.</p>
            </div>

            <div className="ce-students-toolbar">
                <div className="ce-search-box">
                    <Icon name="search" size={16} />
                    <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="Search students by name or ID..."
                    />
                </div>
                <button className="ce-btn ce-btn-outline ce-btn-sm" onClick={selectAllStudents}>
                    Select All
                </button>
                <button className="ce-btn ce-btn-ghost ce-btn-sm" onClick={deselectAllStudents}>
                    Deselect All
                </button>
                <button className="ce-btn ce-btn-primary ce-btn-sm" onClick={openStudentModal}>
                    <Icon name="plus" size={14} />
                    Add Student
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table className="ce-student-table">
                    <thead>
                        <tr>
                            <th style={{ width: 40 }} />
                            <th>Student Name</th>
                            <th>Student ID</th>
                            <th>Email</th>
                            <th style={{ width: 60 }} />
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((s) => (
                            <tr key={s.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="ce-student-checkbox"
                                        checked={s.selected}
                                        onChange={() => toggleStudent(s.id)}
                                    />
                                </td>
                                <td><strong>{s.name}</strong></td>
                                <td>{s.id}</td>
                                <td>{s.email}</td>
                                <td>
                                    <button
                                        className="ce-student-remove"
                                        onClick={() => removeStudent(s.id)}
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--g500)', padding: 30 }}>
                                    No students found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--brd)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <span className="ce-review-badge">
                    {selectedStudentCount} student{selectedStudentCount !== 1 ? 's' : ''} selected
                </span>
                <span style={{ fontSize: 13, color: 'var(--g500)' }}>
                    Showing {filteredStudents.length} of {students.length} students
                </span>
            </div>
        </div>
    )

    /* ---------- STEP 5: Review ---------- */
    const renderStep5 = () => {
        const selected = students.filter((s) => s.selected)
        const qpLabel =
            qpSource === 'manual'
                ? 'Created Manually'
                : `Uploaded${qpFile ? ': ' + qpFile.name : ''}`
        const akLabel =
            akSource === 'ai'
                ? 'AI Generated'
                : akSource === 'upload'
                  ? `Uploaded${akFile ? ': ' + akFile.name : ''}`
                  : 'Not configured'

        return (
            <div className="ce-card">
                <div className="ce-card-header">
                    <h2>Review & Create</h2>
                    <p>Review all exam details before creating the examination.</p>
                </div>

                <div className="ce-review-section">
                    <h4>
                        <span className="check-icon">✓</span> Exam Details
                    </h4>
                    <div className="ce-review-grid">
                        <ReviewItem label="Exam Name" value={details.title || 'Untitled'} />
                        <ReviewItem label="Subject" value={details.subject || 'Not specified'} />
                        <ReviewItem label="Semester" value={details.semester || 'Not specified'} />
                        <ReviewItem label="Date" value={details.date || 'Not specified'} />
                        <ReviewItem label="Duration" value={details.duration || 'Not specified'} />
                        <ReviewItem label="Total Marks" value={details.marks || '0'} />
                    </div>
                </div>

                <div className="ce-review-section">
                    <h4>
                        <span className="check-icon">✓</span> Question Paper
                    </h4>
                    <div className="ce-review-checklist">
                        <CheckLine>{qpLabel}</CheckLine>
                        <CheckLine>{qpQuestions.length} questions created</CheckLine>
                        <CheckLine>Teacher reviewed</CheckLine>
                    </div>
                </div>

                <div className="ce-review-section">
                    <h4>
                        <span className="check-icon">✓</span> Answer Key
                    </h4>
                    <div className="ce-review-checklist">
                        <CheckLine>{akLabel}</CheckLine>
                        <CheckLine>{Object.keys(akAnswers).length} reference answers</CheckLine>
                        <CheckLine>Marking schemes configured</CheckLine>
                        <CheckLine>Teacher confirmed</CheckLine>
                    </div>
                </div>

                <div className="ce-review-section">
                    <h4>
                        <span className="check-icon">✓</span> Students
                    </h4>
                    <div className="ce-review-checklist">
                        <CheckLine>{selected.length} students selected</CheckLine>
                    </div>
                </div>
            </div>
        )
    }

    /* ============================================================
       MAIN RENDER
       ============================================================ */

    return (
        <div className="create-exam-page">
            {renderStepper()}

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}

            <div className="ce-form-footer">
                <div className="ce-footer-left">
                    {step > 1 && (
                        <button className="ce-btn ce-btn-ghost" onClick={goBack}>
                            <Icon name="arrowLeft" size={14} />
                            Previous
                        </button>
                    )}
                </div>
                <div className="ce-footer-right">
                    <button className="ce-btn ce-btn-outline" onClick={saveDraft}>
                        Save as Draft
                    </button>
                    {step < 5 ? (
                        <button className="ce-btn ce-btn-primary" onClick={goNext}>
                            Next
                            <Icon name="arrowRight" size={14} />
                        </button>
                    ) : (
                        <button className="ce-btn ce-btn-success" onClick={createExam}>
                            Create Exam
                            <Icon name="check" size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* ---------- Modals ---------- */}
            {questionModal && (
                <QuestionModal
                    form={qForm}
                    setForm={setQForm}
                    isEdit={questionModal.index !== null}
                    onClose={() => setQuestionModal(null)}
                    onSave={saveQuestion}
                />
            )}

            {studentModal && (
                <StudentModal
                    value={newStudent}
                    setValue={setNewStudent}
                    error={studentError}
                    onClose={() => setStudentModal(false)}
                    onSave={saveStudent}
                />
            )}

            {editModal !== null && (
                <EditQuestionModal
                    form={editForm}
                    setForm={setEditForm}
                    onClose={() => setEditModal(null)}
                    onSave={saveEditReview}
                />
            )}

            {successModal && (
                <SuccessModal
                    title={successMessage.title}
                    message={successMessage.message}
                    onClose={() => setSuccessModal(false)}
                />
            )}

            {toast && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        background: 'var(--green-l)',
                        color: 'var(--green)',
                        padding: '12px 18px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        boxShadow: 'var(--sh)',
                        zIndex: 300,
                    }}
                >
                    {toast}
                </div>
            )}
        </div>
    )
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function QpUploadZone({ onFile }) {
    const inputRef = useRef(null)
    const [dragging, setDragging] = useState(false)

    return (
        <div
            className={`ce-upload-zone ${dragging ? 'dragover' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                onFile(e.dataTransfer.files[0])
            }}
        >
            <Icon name="upload" size={48} />
            <h3>
                Drop your file here or <span className="browse">browse</span>
            </h3>
            <p>PDF, PNG, JPG up to 20MB</p>
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={(e) => onFile(e.target.files[0])}
            />
        </div>
    )
}

function AkUploadZone({ onFile }) {
    const inputRef = useRef(null)
    const [dragging, setDragging] = useState(false)

    return (
        <div
            className={`ce-upload-zone ${dragging ? 'dragover' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                onFile(e.dataTransfer.files[0])
            }}
        >
            <Icon name="upload" size={48} />
            <h3>
                Drop your file here or <span className="browse">browse</span>
            </h3>
            <p>PDF, PNG, JPG up to 20MB</p>
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={(e) => onFile(e.target.files[0])}
            />
        </div>
    )
}

function DocTypeCard({ title, desc, method, selected, onClick }) {
    return (
        <button
            type="button"
            className={`ce-doc-type-card ${selected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <div className="ce-doc-type-radio" />
            <div className="ce-doc-type-info">
                <h4>{title}</h4>
                <p>{desc}</p>
                <span className="method">{method}</span>
            </div>
        </button>
    )
}

function ProcessingCard({ title, subtitle, steps, currentStepIdx, showSpinner }) {
    return (
        <div className="ce-processing-card">
            <div className="ce-processing-header">
                {showSpinner && <div className="ce-processing-spinner" />}
                <h3>{title}</h3>
                <p>{subtitle}</p>
            </div>
            <div className="ce-processing-steps">
                {steps.map((label, i) => {
                    const done = i < currentStepIdx
                    const active = i === currentStepIdx && showSpinner
                    const cls = done ? 'done' : active ? 'active' : ''
                    return (
                        <div key={i} className={`ce-processing-step ${cls}`}>
                            <div className="check">
                                <Icon name="check" size={12} />
                            </div>
                            <span>{label}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function QuestionCard({ question, onEdit }) {
    return (
        <div className={`ce-question-card ${question.status === 'warning' ? 'needs-review' : ''}`}>
            <div className="ce-question-card-header">
                <span className={`ce-question-number ${question.status === 'warning' ? 'warning' : ''}`}>
                    Q{question.number}
                </span>
                <span className={`ce-question-type-badge ${question.type}`}>
                    {QUESTION_TYPES[question.type]}
                </span>
                <span className="ce-question-marks">{question.marks} marks</span>
            </div>
            <p className="ce-question-text">{question.text}</p>
            {question.status === 'warning' && (
                <div className="ce-question-warning">
                    <Icon name="warning" size={16} />
                    <span>Question number could not be confidently detected. Please review.</span>
                </div>
            )}
            <div className="ce-question-actions">
                <button className="ce-btn ce-btn-ghost ce-btn-sm" onClick={onEdit}>
                    <Icon name="edit" size={14} />
                    Edit
                </button>
            </div>
        </div>
    )
}

function ManualQuestionCard({ question, onEdit, onDelete }) {
    const isMcq = question.type === 'mcq' && question.options?.length
    const isTf = question.type === 'truefalse'

    return (
        <div className="ce-manual-question-card">
            <div className="ce-manual-q-header">
                <div className="ce-manual-q-header-left">
                    <span className="ce-manual-q-number">{question.number}</span>
                    <span className={`ce-manual-q-type ${question.type}`}>
                        {QUESTION_TYPES[question.type]}
                    </span>
                </div>
                <span className="ce-manual-q-marks">{question.marks} marks</span>
            </div>

            <div className="ce-manual-q-body">
                <div className="ce-manual-q-text">{question.text || '(No question text)'}</div>

                {isMcq && (
                    <div className="ce-manual-q-options">
                        {question.options.map((o, i) => (
                            <div key={i} className={`ce-manual-option ${i === question.correctAnswer ? 'correct' : ''}`}>
                                <span className="opt-letter">{OPTION_LETTERS[i] || i + 1}</span>
                                <span>{o || '(Empty option)'}</span>
                            </div>
                        ))}
                    </div>
                )}

                {isTf && (
                    <div className="ce-manual-q-options">
                        <div className={`ce-manual-option ${question.correctAnswer === 'True' ? 'correct' : ''}`}>
                            <span className="opt-letter">T</span>
                            <span>True</span>
                        </div>
                        <div className={`ce-manual-option ${question.correctAnswer === 'False' ? 'correct' : ''}`}>
                            <span className="opt-letter">F</span>
                            <span>False</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="ce-manual-q-actions">
                <button className="ce-btn ce-btn-ghost ce-btn-sm" onClick={onEdit}>
                    <Icon name="edit" size={14} />
                    Edit
                </button>
                <button
                    className="ce-btn ce-btn-ghost ce-btn-sm"
                    style={{ color: 'var(--red)' }}
                    onClick={onDelete}
                >
                    <Icon name="trash" size={14} />
                    Delete
                </button>
            </div>
        </div>
    )
}

function CompletionItem({ label, value, complete }) {
    return (
        <div className="ce-completion-item">
            <span className="label">{label}</span>
            <span className={`value ${complete ? 'complete' : 'incomplete'}`}>{value}</span>
        </div>
    )
}

function AnswerKeyEditor({
    question,
    answer,
    onUpdate,
    onAddConcept,
    onRemoveConcept,
    onUpdateCriterion,
    onAddCriterion,
    onRemoveCriterion,
    onMarkReviewed,
    onSave,
}) {
    const [newConcept, setNewConcept] = useState('')
    const totalMarks = answer.criteria.reduce((s, c) => s + (Number(c.marks) || 0), 0)

    return (
        <>
            <div className="ce-editor-panel-header">
                <h3>Q{question.number}</h3>
                {answer.aiGenerated && (
                    <span className="ce-ai-draft-badge">
                        <Icon name="warning" size={12} />
                        AI Generated Draft — Teacher Review Required
                    </span>
                )}
            </div>

            <div className="ce-linked-question">
                <strong style={{ color: 'var(--g800)' }}>Question:</strong> {question.text}
            </div>

            <div className="ce-editor-section">
                <label>Reference Answer</label>
                <textarea
                    value={answer.reference}
                    onChange={(e) => onUpdate('reference', e.target.value)}
                />
            </div>

            <div className="ce-editor-section">
                <label>Key Concepts</label>
                <div className="ce-concept-tags">
                    {answer.concepts.map((c, i) => (
                        <span key={i} className="ce-concept-tag">
                            {c}
                            <button onClick={() => onRemoveConcept(i)}>×</button>
                        </span>
                    ))}
                </div>
                <div className="ce-add-concept-row">
                    <input
                        type="text"
                        value={newConcept}
                        onChange={(e) => setNewConcept(e.target.value)}
                        placeholder="Add a key concept..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                onAddConcept(newConcept)
                                setNewConcept('')
                            }
                        }}
                    />
                    <button
                        className="ce-btn ce-btn-ghost ce-btn-sm"
                        onClick={() => {
                            onAddConcept(newConcept)
                            setNewConcept('')
                        }}
                    >
                        + Add
                    </button>
                </div>
            </div>

            <div className="ce-editor-section">
                <label>Marking Scheme</label>
                <table className="ce-marking-table">
                    <thead>
                        <tr>
                            <th>Criterion</th>
                            <th style={{ width: 100 }}>Marks</th>
                            <th style={{ width: 40 }} />
                        </tr>
                    </thead>
                    <tbody>
                        {answer.criteria.map((c, i) => (
                            <tr key={i}>
                                <td>
                                    <input
                                        type="text"
                                        value={c.name}
                                        onChange={(e) => onUpdateCriterion(i, 'name', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        value={c.marks}
                                        onChange={(e) => onUpdateCriterion(i, 'marks', Number(e.target.value) || 0)}
                                    />
                                </td>
                                <td>
                                    <button className="remove-btn" onClick={() => onRemoveCriterion(i)}>
                                        ×
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="ce-btn ce-btn-ghost ce-btn-sm" style={{ marginTop: 8 }} onClick={onAddCriterion}>
                    + Add Criterion
                </button>
                <div className="ce-marking-total" style={{ marginTop: 12 }}>
                    <span>Total</span>
                    <span className="total-value">
                        {totalMarks} / {question.marks}
                    </span>
                </div>
            </div>

            <div className="ce-editor-section">
                <label>
                    Evaluation Guidance <span style={{ fontWeight: 400, color: 'var(--g400)' }}>(Optional)</span>
                </label>
                <textarea
                    value={answer.guidance}
                    onChange={(e) => onUpdate('guidance', e.target.value)}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--brd)' }}>
                <button className="ce-btn ce-btn-ghost" onClick={onMarkReviewed}>
                    {answer.reviewed ? '✓ Reviewed' : 'Mark as Reviewed'}
                </button>
                <button className="ce-btn ce-btn-primary" onClick={onSave}>
                    Save
                </button>
            </div>
        </>
    )
}

function ReviewItem({ label, value }) {
    return (
        <div className="ce-review-item">
            <div className="label">{label}</div>
            <div className="value">{value}</div>
        </div>
    )
}

function CheckLine({ children }) {
    return (
        <div className="ce-review-check-item">
            <Icon name="check" size={16} />
            <span>{children}</span>
        </div>
    )
}

/* ---------- Modals ---------- */

function ModalShell({ children, onClose, className = '' }) {
    return (
        <div
            className={`ce-modal-overlay ${className}`}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className="ce-modal">{children}</div>
        </div>
    )
}

function QuestionModal({ form, setForm, isEdit, onClose, onSave }) {
    const setField = (field, value) => setForm((f) => ({ ...f, [field]: value }))

    const updateOption = (i, value) => {
        setForm((f) => {
            const options = [...f.options]
            options[i] = value
            return { ...f, options }
        })
    }

    const addOption = () => {
        setForm((f) => (f.options.length < 6 ? { ...f, options: [...f.options, ''] } : f))
    }

    const removeOption = (i) => {
        setForm((f) => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }))
    }

    return (
        <ModalShell onClose={onClose}>
            <div className="ce-modal-header">
                <h3>{isEdit ? 'Edit Question' : 'Add Question'}</h3>
                <button className="ce-modal-close" onClick={onClose}>
                    <Icon name="x" size={20} />
                </button>
            </div>

            <div className="ce-form-grid">
                <div className="ce-form-group">
                    <label>Question Number</label>
                    <input
                        type="number"
                        min="1"
                        value={form.number}
                        onChange={(e) => setField('number', e.target.value)}
                    />
                </div>
                <div className="ce-form-group">
                    <label>Question Type</label>
                    <select value={form.type} onChange={(e) => setField('type', e.target.value)}>
                        <option value="descriptive">Descriptive</option>
                        <option value="mcq">Multiple Choice (MCQ)</option>
                        <option value="short">Short Answer</option>
                        <option value="truefalse">True / False</option>
                    </select>
                </div>
                <div className="ce-form-group full-width">
                    <label>Question Text</label>
                    <textarea
                        rows="3"
                        value={form.text}
                        onChange={(e) => setField('text', e.target.value)}
                        placeholder="Enter your question..."
                    />
                </div>
                <div className="ce-form-group">
                    <label>Maximum Marks</label>
                    <input
                        type="number"
                        min="1"
                        value={form.marks}
                        onChange={(e) => setField('marks', e.target.value)}
                    />
                </div>
            </div>

            {form.type === 'mcq' && (
                <div style={{ marginTop: 20 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--g700)', marginBottom: 10, display: 'block' }}>
                        Options
                    </label>
                    {form.options.map((opt, i) => (
                        <div key={i} className="ce-mcq-row">
                            <span className="letter">{OPTION_LETTERS[i]}.</span>
                            <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateOption(i, e.target.value)}
                                placeholder={`Option ${i + 1}`}
                            />
                            {form.options.length > 2 && (
                                <button
                                    type="button"
                                    className="ce-btn ce-btn-ghost ce-btn-sm"
                                    style={{ color: 'var(--red)', padding: '6px 10px' }}
                                    onClick={() => removeOption(i)}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="ce-btn ce-btn-ghost ce-btn-sm" style={{ marginTop: 10 }} onClick={addOption}>
                        <Icon name="plus" size={14} />
                        Add Option
                    </button>

                    <div style={{ marginTop: 16 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--g700)', marginBottom: 8, display: 'block' }}>
                            Correct Answer
                        </label>
                        <select
                            value={form.correctAnswer}
                            onChange={(e) => setField('correctAnswer', e.target.value)}
                            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--brd)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit' }}
                        >
                            {form.options.map((opt, i) => (
                                <option key={i} value={i}>
                                    Option {OPTION_LETTERS[i]}: {opt || '(empty)'}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {form.type === 'truefalse' && (
                <div style={{ marginTop: 20 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--g700)', marginBottom: 10, display: 'block' }}>
                        Correct Answer
                    </label>
                    <select
                        value={form.tfAnswer}
                        onChange={(e) => setField('tfAnswer', e.target.value)}
                        style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--brd)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit' }}
                    >
                        <option value="True">True</option>
                        <option value="False">False</option>
                    </select>
                </div>
            )}

            <div className="ce-modal-footer">
                <button className="ce-btn ce-btn-ghost" onClick={onClose}>
                    Cancel
                </button>
                <button className="ce-btn ce-btn-primary" onClick={onSave}>
                    Save Question
                </button>
            </div>
        </ModalShell>
    )
}

function StudentModal({ value, setValue, error, onClose, onSave }) {
    const setField = (field, v) => setValue((s) => ({ ...s, [field]: v }))

    return (
        <ModalShell onClose={onClose}>
            <div className="ce-modal-header">
                <h3>Add New Student</h3>
                <button className="ce-modal-close" onClick={onClose}>
                    <Icon name="x" size={20} />
                </button>
            </div>
            <div className="ce-form-grid">
                <div className="ce-form-group full-width">
                    <label>Student Name *</label>
                    <input
                        type="text"
                        value={value.name}
                        onChange={(e) => setField('name', e.target.value)}
                        placeholder="e.g. John Smith"
                    />
                </div>
                <div className="ce-form-group">
                    <label>Student ID *</label>
                    <input
                        type="text"
                        value={value.id}
                        onChange={(e) => setField('id', e.target.value)}
                        placeholder="e.g. STU009"
                    />
                </div>
                <div className="ce-form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        value={value.email}
                        onChange={(e) => setField('email', e.target.value)}
                        placeholder="e.g. john@university.edu"
                    />
                </div>
            </div>
            {error && <div className="ce-alert-error">{error}</div>}
            <div className="ce-modal-footer">
                <button className="ce-btn ce-btn-ghost" onClick={onClose}>
                    Cancel
                </button>
                <button className="ce-btn ce-btn-primary" onClick={onSave}>
                    Add Student
                </button>
            </div>
        </ModalShell>
    )
}

function EditQuestionModal({ form, setForm, onClose, onSave }) {
    const setField = (field, v) => setForm((f) => ({ ...f, [field]: v }))

    return (
        <ModalShell onClose={onClose}>
            <div className="ce-modal-header">
                <h3>Edit Question</h3>
                <button className="ce-modal-close" onClick={onClose}>
                    <Icon name="x" size={20} />
                </button>
            </div>
            <div className="ce-form-grid">
                <div className="ce-form-group">
                    <label>Question Number</label>
                    <input
                        type="number"
                        min="1"
                        value={form.number}
                        onChange={(e) => setField('number', e.target.value)}
                    />
                </div>
                <div className="ce-form-group">
                    <label>Maximum Marks</label>
                    <input
                        type="number"
                        min="1"
                        value={form.marks}
                        onChange={(e) => setField('marks', e.target.value)}
                    />
                </div>
                <div className="ce-form-group full-width">
                    <label>Question Text</label>
                    <textarea
                        rows="3"
                        value={form.text}
                        onChange={(e) => setField('text', e.target.value)}
                    />
                </div>
                <div className="ce-form-group full-width">
                    <label>Question Type</label>
                    <select value={form.type} onChange={(e) => setField('type', e.target.value)}>
                        <option value="descriptive">Descriptive</option>
                        <option value="mcq">Multiple Choice</option>
                        <option value="short">Short Answer</option>
                    </select>
                </div>
            </div>
            <div className="ce-modal-footer">
                <button className="ce-btn ce-btn-ghost" onClick={onClose}>
                    Cancel
                </button>
                <button className="ce-btn ce-btn-primary" onClick={onSave}>
                    Save Changes
                </button>
            </div>
        </ModalShell>
    )
}

function SuccessModal({ title, message, onClose }) {
    return (
        <ModalShell onClose={onClose} className="ce-success-modal">
            <div className="ce-success-icon">
                <Icon name="check" size={36} />
            </div>
            <h3>{title}</h3>
            <p>{message}</p>
            <button className="ce-btn ce-btn-primary" style={{ width: '100%' }} onClick={onClose}>
                Done
            </button>
        </ModalShell>
    )
}

export default CreateExam