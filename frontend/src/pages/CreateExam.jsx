import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../lib/api'
import { PageLoader } from '../components/PageLoader'
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

/* ============================================================
   HELPERS
   ============================================================ */

function formatFileSize(bytes) {
    if (!bytes) return '0 KB'
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

function CreateExam() {
    const [step, setStep] = useState(1)
    const [details, setDetails] = useState({
        title: '',
        subject: '',
        semester: '',
        date: '',
        duration: '',
        marks: '',
    })

    /* --- Draft Persistence State --- */
    const [draftId, setDraftId] = useState(null)
    const [isSavingDraft, setIsSavingDraft] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    /* --- Question Paper state --- */
    const [qpSource, setQpSource] = useState('manual') // null | 'upload' | 'manual'
    const [qpFile, setQpFile] = useState(null)
    const [qpDocType, setQpDocType] = useState(null)
    const [qpState, setQpState] = useState('idle') // idle | doc-type | processing | complete
    const [qpQuestions, setQpQuestions] = useState([])

    /* --- Processing animation state (shared) --- */
    const [processingKind, setProcessingKind] = useState(null) // 'qp' | 'ak' | null
    const [processingStepIdx, setProcessingStepIdx] = useState(0)
    const [processingDone, setProcessingDone] = useState(false)

    /* --- Answer Key state --- */
    const [akSource, setAkSource] = useState('manual') // null | 'upload' | 'manual'
    const [akFile, setAkFile] = useState(null)
    const [akDocType, setAkDocType] = useState(null)
    const [akState, setAkState] = useState('idle') // idle | doc-type | processing | editing | confirmed
    const [akAnswers, setAkAnswers] = useState({})
    const [selectedQNumber, setSelectedQNumber] = useState(1)

    /* --- Students --- */
    const [students, setStudents] = useState([])
    const [loadingStudents, setLoadingStudents] = useState(true)
    const [studentSearch, setStudentSearch] = useState('')

    /* --- Modals --- */
    const [questionModal, setQuestionModal] = useState(null)
    const [studentModal, setStudentModal] = useState(false)
    const [editModal, setEditModal] = useState(null)
    const [successModal, setSuccessModal] = useState(false)
    const [successMessage, setSuccessMessage] = useState({ title: '', message: '' })

    /* --- Toast --- */
    const [toast, setToast] = useState('')
    const [toastType, setToastType] = useState('success') // 'success' | 'error'

    const showToast = (message, type = 'success') => {
        setToast(message)
        setToastType(type)
    }

    /* Load teacher's registered students from backend */
    useEffect(() => {
        let isMounted = true
        setLoadingStudents(true)
        api.get('/api/students/')
            .then((items) => {
                if (isMounted) {
                    if (Array.isArray(items)) {
                        setStudents(
                            items.map((s) => ({
                                id: s.roll_number,
                                name: s.full_name,
                                email: s.email || `${s.roll_number.toLowerCase()}@university.edu`,
                                selected: true,
                            }))
                        )
                    } else {
                        setStudents([])
                    }
                    setLoadingStudents(false)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error('Failed to load students:', err)
                    setStudents([])
                    setLoadingStudents(false)
                }
            })
        return () => {
            isMounted = false
        }
    }, [])

    useEffect(() => {
        if (!toast) return undefined
        const t = setTimeout(() => setToast(''), 3200)
        return () => clearTimeout(t)
    }, [toast])

    /* Ensure answer key state stays synchronized when questions change */
    useEffect(() => {
        setAkAnswers((prev) => {
            const next = { ...prev }
            qpQuestions.forEach((q) => {
                if (!next[q.number]) {
                    next[q.number] = {
                        reference: '',
                        concepts: [],
                        criteria: [{ name: 'Core concept', marks: q.marks || 0 }],
                        guidance: '',
                        reviewed: false,
                        aiGenerated: false,
                    }
                }
            })
            return next
        })
    }, [qpQuestions])

    /* Compute total calculated marks from questions */
    const calculatedTotalMarks = useMemo(() => {
        return qpQuestions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0)
    }, [qpQuestions])

    /* ============================================================
       STEP VALIDATION LOGIC
       ============================================================ */

    const validateStep = (stepNumber) => {
        if (stepNumber === 1) {
            if (!details.title?.trim()) {
                return { valid: false, message: 'Please enter the exam title.' }
            }
            if (!details.subject?.trim()) {
                return { valid: false, message: 'Please enter the exam subject.' }
            }
            if (!details.date?.trim()) {
                return { valid: false, message: 'Please select an exam date.' }
            }
            return { valid: true }
        }

        if (stepNumber === 2) {
            if (qpQuestions.length === 0) {
                return { valid: false, message: 'Please add at least one question to the exam.' }
            }
            const numbers = qpQuestions.map((q) => Number(q.number))
            if (new Set(numbers).size !== numbers.length) {
                return { valid: false, message: 'Question numbers must be unique.' }
            }
            for (const q of qpQuestions) {
                if (!q.text?.trim()) {
                    return { valid: false, message: `Question ${q.number} text cannot be empty.` }
                }
                const marks = Number(q.marks)
                if (isNaN(marks) || marks <= 0) {
                    return { valid: false, message: `Question ${q.number} must have a valid positive marks value.` }
                }
            }
            return { valid: true }
        }

        if (stepNumber === 3) {
            if (qpQuestions.length === 0) {
                return { valid: false, message: 'No questions to provide answer keys for.' }
            }
            for (const q of qpQuestions) {
                const answer = akAnswers[q.number]
                if (!answer?.reference?.trim()) {
                    return {
                        valid: false,
                        message: `Please provide a reference answer for Question ${q.number}.`,
                    }
                }
            }
            return { valid: true }
        }

        if (stepNumber === 4) {
            const selectedCount = students.filter((s) => s.selected).length
            if (selectedCount === 0) {
                return {
                    valid: false,
                    message: 'Please select at least one student before proceeding to review.',
                }
            }
            return { valid: true }
        }

        return { valid: true }
    }

    const goNext = () => {
        const validation = validateStep(step)
        if (!validation.valid) {
            showToast(validation.message, 'error')
            return
        }

        if (step < 5) {
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

    const goToStep = (targetStep) => {
        if (targetStep < step) {
            setStep(targetStep)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }

        // Validate intermediate steps before jumping forward
        for (let s = step; s < targetStep; s++) {
            const validation = validateStep(s)
            if (!validation.valid) {
                showToast(validation.message, 'error')
                return
            }
        }
        setStep(targetStep)
        window.scrollTo({ top: 0, behavior: 'smooth' })
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

        setProcessingDone(true)

        const timeout = setTimeout(() => {
            if (processingKind === 'qp') {
                setQpQuestions(SAMPLE_QUESTIONS.map((q) => ({ ...q })))
                setQpState('complete')
            } else if (processingKind === 'ak') {
                const answers = {}
                SAMPLE_QUESTIONS.forEach((q) => {
                    answers[q.number] = {
                        reference: `A comprehensive reference answer for Q${q.number} covering the primary concepts, terminology, and core points.`,
                        concepts: ['Core concept', 'Supporting details'],
                        criteria: [{ name: 'Understanding and accuracy', marks: q.marks }],
                        guidance: 'Award marks based on coverage and accuracy.',
                        reviewed: true,
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
    }, [processingStepIdx, processingSteps.length, processingKind, akSource])

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

    const startManualAnswerKey = () => {
        const answers = { ...akAnswers }
        qpQuestions.forEach((question) => {
            if (!answers[question.number]) {
                answers[question.number] = {
                    reference: '',
                    concepts: [],
                    criteria: [{ name: 'Correct understanding', marks: question.marks || 0 }],
                    guidance: '',
                    reviewed: false,
                    aiGenerated: false,
                }
            }
        })
        setAkAnswers(answers)
        if (qpQuestions.length > 0) {
            setSelectedQNumber(qpQuestions[0].number)
        }
        setAkState('editing')
    }

    const backToAkChoice = () => {
        setAkSource(null)
        setAkFile(null)
        setAkDocType(null)
        setAkState('idle')
    }

    /* ============================================================
       ANSWER KEY EDITOR HANDLERS
       ============================================================ */

    const activeQNum = qpQuestions.some((q) => q.number === selectedQNumber)
        ? selectedQNumber
        : (qpQuestions[0]?.number || 1)
    const currentQuestion = qpQuestions.find((q) => q.number === activeQNum) || qpQuestions[0]
    const currentAnswer = (currentQuestion && akAnswers[currentQuestion.number]) || {
        reference: '',
        concepts: [],
        criteria: [{ name: 'Core concept', marks: currentQuestion?.marks || 0 }],
        guidance: '',
        reviewed: false,
        aiGenerated: false,
    }

    const updateAnswer = (field, value) => {
        const qNum = currentQuestion ? currentQuestion.number : selectedQNumber
        setAkAnswers((prev) => {
            const existing = prev[qNum] || {
                reference: '',
                concepts: [],
                criteria: [{ name: 'Core concept', marks: currentQuestion?.marks || 0 }],
                guidance: '',
                reviewed: false,
                aiGenerated: false,
            }
            return {
                ...prev,
                [qNum]: {
                    ...existing,
                    [field]: value,
                    reviewed: field === 'reference' ? !!value.trim() : existing.reviewed,
                },
            }
        })
    }

    const markReviewed = () => {
        const qNum = currentQuestion ? currentQuestion.number : selectedQNumber
        const a = akAnswers[qNum] || currentAnswer
        updateAnswer('reviewed', !a?.reviewed)
    }

    const saveAnswer = () => {
        const qNum = currentQuestion ? currentQuestion.number : selectedQNumber
        const a = akAnswers[qNum] || currentAnswer
        if (!a?.reference?.trim()) {
            showToast(`Please enter reference answer text for Question ${qNum}.`, 'error')
            return
        }
        updateAnswer('reviewed', true)
        showToast(`Answer for Question ${qNum} saved.`)
    }

    const confirmAnswerKey = () => {
        const validation = validateStep(3)
        if (!validation.valid) {
            showToast(validation.message, 'error')
            return
        }
        setAkState('confirmed')
        showToast('Answer key confirmed for all questions.')
    }

    /* ============================================================
       QUESTION MODAL (add / edit manual questions)
       ============================================================ */

    const [qForm, setQForm] = useState({
        number: 1,
        text: '',
        marks: '',
        type: 'descriptive',
    })

    const openAddQuestion = () => {
        setQForm({
            number: qpQuestions.length + 1,
            text: '',
            marks: '',
            type: 'descriptive',
        })
        setQuestionModal({ index: null })
    }

    const openEditQuestion = (index) => {
        const q = qpQuestions[index]
        setQForm({
            number: q.number,
            text: q.text,
            marks: q.marks,
            type: 'descriptive',
        })
        setQuestionModal({ index })
    }

    const saveQuestion = () => {
        if (!qForm.text.trim()) {
            showToast('Please enter question text.', 'error')
            return
        }
        const parsedMarks = Number(qForm.marks)
        if (isNaN(parsedMarks) || parsedMarks <= 0) {
            showToast('Please enter a valid positive marks value.', 'error')
            return
        }

        const newQ = {
            number: Number(qForm.number),
            text: qForm.text.trim(),
            marks: parsedMarks,
            type: 'descriptive',
            status: 'ok',
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
        showToast('Question saved.')
    }

    const deleteManualQuestion = (index) => {
        setQpQuestions((prev) => {
            const copy = prev.filter((_, i) => i !== index)
            return copy.map((q, i) => ({ ...q, number: i + 1 }))
        })
        showToast('Question deleted.')
    }

    /* ============================================================
       EDIT QUESTION MODAL (from review)
       ============================================================ */

    const [editForm, setEditForm] = useState({ number: 1, marks: 5, text: '', type: 'descriptive' })

    const openEditReviewModal = (index) => {
        const q = qpQuestions[index]
        setEditForm({ number: q.number, marks: q.marks, text: q.text, type: 'descriptive' })
        setEditModal(index)
    }

    const saveEditReview = () => {
        if (!editForm.text.trim()) {
            showToast('Please enter question text.', 'error')
            return
        }
        const parsedMarks = Number(editForm.marks)
        if (isNaN(parsedMarks) || parsedMarks <= 0) {
            showToast('Please enter valid positive marks.', 'error')
            return
        }

        setQpQuestions((prev) => {
            const copy = [...prev]
            copy[editModal] = {
                ...copy[editModal],
                ...editForm,
                number: Number(editForm.number),
                marks: parsedMarks,
                type: 'descriptive',
                status: 'ok',
            }
            return copy
        })
        setEditModal(null)
        showToast('Question updated.')
    }

    /* ============================================================
       STUDENTS HANDLERS
       ============================================================ */

    const filteredStudents = useMemo(() => {
        const q = studentSearch.toLowerCase().trim()
        if (!q) return students
        return students.filter(
            (s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q)
        )
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

    const saveStudent = async () => {
        const { name, id, email } = newStudent
        if (!name.trim() || !id.trim()) {
            setStudentError('Please fill in student name and roll number.')
            return
        }
        if (students.some((s) => s.id.toLowerCase() === id.trim().toLowerCase())) {
            setStudentError('A student with this roll number already exists.')
            return
        }

        try {
            await api.post('/api/students/', {
                full_name: name.trim(),
                roll_number: id.trim(),
                email: email.trim(),
            })
            setStudents((prev) => [
                ...prev,
                { id: id.trim(), name: name.trim(), email: email.trim(), selected: true },
            ])
            setStudentModal(false)
            showToast('Student added successfully.')
        } catch (err) {
            setStudentError(err.message || 'Failed to register student.')
        }
    }

    /* ============================================================
       SAVE AS DRAFT & CREATE EXAM
       ============================================================ */

    const saveDraft = async () => {
        if (isSavingDraft || isSubmitting) return

        if (!details.title.trim()) {
            showToast('Please enter an exam title before saving draft.', 'error')
            return
        }
        if (!details.subject.trim()) {
            showToast('Please enter an exam subject before saving draft.', 'error')
            return
        }

        setIsSavingDraft(true)
        try {
            const payload = {
                draft_id: draftId,
                is_draft: true,
                exam_name: details.title.trim(),
                subject: details.subject.trim(),
                exam_date: details.date || today,
                questions: qpQuestions.map((q) => ({
                    question_number: q.number,
                    question_text: q.text || '',
                    max_marks: q.marks || 1,
                    question_type: 'descriptive',
                    reference_answer: akAnswers[q.number]?.reference || '',
                })),
                students: students
                    .filter((s) => s.selected)
                    .map((s) => ({
                        full_name: s.name,
                        roll_number: s.id,
                        email: s.email,
                    })),
            }

            const res = await api.post('/api/exams/', payload)
            if (res && res.examination_id) {
                setDraftId(res.examination_id)
            }
            showToast('Exam draft saved successfully.')
        } catch (error) {
            showToast(error.message || 'Unable to save draft.', 'error')
        } finally {
            setIsSavingDraft(false)
        }
    }

    const createExam = async () => {
        if (isSubmitting || isSavingDraft) return

        // Strict validation across all steps
        for (let s = 1; s <= 4; s++) {
            const validation = validateStep(s)
            if (!validation.valid) {
                showToast(validation.message, 'error')
                setStep(s)
                return
            }
        }

        setIsSubmitting(true)
        try {
            const payload = {
                draft_id: draftId,
                is_draft: false,
                exam_name: details.title.trim(),
                subject: details.subject.trim(),
                exam_date: details.date,
                questions: qpQuestions.map((question) => ({
                    question_number: question.number,
                    question_text: question.text.trim(),
                    max_marks: question.marks,
                    question_type: 'descriptive',
                    reference_answer: akAnswers[question.number]?.reference?.trim() || '',
                })),
                students: students
                    .filter((student) => student.selected)
                    .map((student) => ({
                        full_name: student.name,
                        roll_number: student.id,
                        email: student.email,
                    })),
            }

            await api.post('/api/exams/', payload)
            setSuccessMessage({
                title: 'Exam Created Successfully!',
                message: `Your exam "${details.title}" has been created with ${qpQuestions.length} question(s) and assigned to ${selectedStudentCount} student(s).`,
            })
            resetFormState()
            setSuccessModal(true)
        } catch (error) {
            showToast(error.message || 'Unable to create the exam.', 'error')
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetFormState = () => {
        setDetails({
            title: '',
            subject: '',
            semester: '',
            date: '',
            duration: '',
            marks: '',
        })
        setDraftId(null)
        setQpSource('manual')
        setQpFile(null)
        setQpDocType(null)
        setQpState('idle')
        setQpQuestions([])
        setAkSource('manual')
        setAkFile(null)
        setAkDocType(null)
        setAkState('idle')
        setAkAnswers({})
        setSelectedQNumber(1)
        setStudentSearch('')
        setStudents((prev) => prev.map((s) => ({ ...s, selected: true })))
        setStep(1)
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
                                    {isCompleted ? <Icon name="check" size={14} /> : s.number}
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
                    <label>Exam Title *</label>
                    <input
                        type="text"
                        value={details.title}
                        onChange={(e) => setDetails({ ...details, title: e.target.value })}
                        placeholder="e.g. Midterm Examination"
                    />
                </div>
                <div className="ce-form-group">
                    <label>Subject / Course *</label>
                    <input
                        type="text"
                        value={details.subject}
                        onChange={(e) => setDetails({ ...details, subject: e.target.value })}
                        placeholder="e.g. Computer Science"
                    />
                </div>
                <div className="ce-form-group">
                    <label>Semester</label>
                    <select
                        value={details.semester}
                        onChange={(e) => setDetails({ ...details, semester: e.target.value })}
                    >
                        <option value="">Select Semester</option>
                        <option value="S1">S1</option>
                        <option value="S2">S2</option>
                        <option value="S3">S3</option>
                        <option value="S4">S4</option>
                        <option value="S5">S5</option>
                        <option value="S6">S6</option>
                        <option value="S7">S7</option>
                        <option value="S8">S8</option>
                    </select>
                </div>
                <div className="ce-form-group">
                    <label>Exam Date *</label>
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
                    <label>Total Marks (Calculated: {calculatedTotalMarks} marks)</label>
                    <input
                        type="number"
                        value={details.marks}
                        onChange={(e) => setDetails({ ...details, marks: e.target.value })}
                        placeholder="e.g. 100"
                    />
                </div>
            </div>
        </div>
    )

    /* ---------- STEP 2: Question Paper ---------- */
    const renderStep2 = () => {
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
                            onClick={() => setQpSource('manual')}
                        >
                            <div className="ce-choice-icon">
                                <Icon name="edit" size={28} />
                            </div>
                            <h3>Create Manually</h3>
                            <p>Add descriptive questions one by one with marks and question numbers.</p>
                        </button>
                        <button
                            type="button"
                            className="ce-choice-card"
                            onClick={() => setQpSource('upload')}
                        >
                            <div className="ce-choice-icon">
                                <Icon name="upload" size={28} />
                            </div>
                            <h3>Upload Question Paper</h3>
                            <p>Upload an existing PDF or document for preview.</p>
                        </button>
                    </div>
                </div>
            )
        }

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

        if (qpSource === 'upload' && qpState === 'doc-type') {
            return (
                <div className="ce-card">
                    <div className="ce-card-header">
                        <h2>Question Paper Uploaded</h2>
                        <p>Confirm the document type before preview.</p>
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
                        <p>Select the document type.</p>
                        <div className="ce-doc-type-grid">
                            <DocTypeCard
                                title="Digital Document"
                                desc="Computer-generated PDF/document"
                                method="OCR · Digital Document"
                                selected={qpDocType === DOC_TYPES.DIGITAL}
                                onClick={() => setQpDocType(DOC_TYPES.DIGITAL)}
                            />
                            <DocTypeCard
                                title="Handwritten Document"
                                desc="Scanned or photographed handwritten document"
                                method="HTR · Handwriting Processing"
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

        if (qpSource === 'upload' && qpState === 'processing') {
            return (
                <ProcessingCard
                    title={
                        qpDocType === DOC_TYPES.DIGITAL
                            ? 'Processing Question Paper'
                            : 'Processing Handwritten Question Paper'
                    }
                    subtitle={
                        processingDone ? 'Extraction complete!' : 'Please wait while we extract your questions...'
                    }
                    steps={processingSteps}
                    currentStepIdx={processingStepIdx}
                    showSpinner={!processingDone}
                />
            )
        }

        if (qpSource === 'upload' && qpState === 'complete') {
            return (
                <div className="ce-card">
                    <div className="ce-review-header">
                        <h2>Question Paper</h2>
                        <span className="ce-review-badge">
                            <Icon name="check" size={14} />
                            {qpQuestions.length} Questions Extracted
                        </span>
                    </div>
                    <div className="ce-question-list">
                        {qpQuestions.map((q, i) => (
                            <QuestionCard key={i} question={q} onEdit={() => openEditReviewModal(i)} />
                        ))}
                    </div>
                </div>
            )
        }

        // Manual mode
        return (
            <div className="ce-card">
                <div className="ce-manual-creator-header">
                    <h2>Question Paper</h2>
                    <span className="ce-question-count-badge">
                        {qpQuestions.length} Question{qpQuestions.length !== 1 ? 's' : ''} ({calculatedTotalMarks} Total Marks)
                    </span>
                </div>

                {qpQuestions.length === 0 ? (
                    <div className="ce-empty-questions">
                        <Icon name="emptyFile" size={64} />
                        <h3>No questions added yet</h3>
                        <p>Click "Add New Question" below to add descriptive questions.</p>
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

    /* ---------- STEP 3: Answer Key ---------- */
    const renderStep3 = () => {
        if (qpQuestions.length === 0) {
            return (
                <div className="ce-card">
                    <div className="ce-card-header">
                        <h2>Reference Answers</h2>
                        <p>Provide the expected reference answer for each question.</p>
                    </div>
                    <div className="ce-empty-questions">
                        <Icon name="emptyFile" size={64} />
                        <h3>No questions found</h3>
                        <p>Please return to Step 2 (Questions) and add questions first.</p>
                    </div>
                </div>
            )
        }

        if (akSource === 'upload' && akState === 'idle') {
            return (
                <div className="ce-card">
                    <div className="ce-card-header">
                        <h2>Upload Answer Key</h2>
                        <p>Upload your answer key document.</p>
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
                        <p>Confirm the document type before preview.</p>
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
                        <div className="ce-doc-type-grid">
                            <DocTypeCard
                                title="Digital Document"
                                desc="Computer-generated PDF"
                                method="OCR · Text Extraction"
                                selected={akDocType === DOC_TYPES.DIGITAL}
                                onClick={() => setAkDocType(DOC_TYPES.DIGITAL)}
                            />
                            <DocTypeCard
                                title="Handwritten Document"
                                desc="Scanned handwritten key"
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
                    title="Processing Answer Key"
                    subtitle={processingDone ? 'Processing complete!' : 'Structuring reference answers...'}
                    steps={processingSteps}
                    currentStepIdx={processingStepIdx}
                    showSpinner={!processingDone}
                />
            )
        }

        const completedCount = qpQuestions.filter((q) => akAnswers[q.number]?.reference?.trim()).length
        const totalQuestions = qpQuestions.length

        if (akState === 'confirmed') {
            return (
                <div className="ce-card ce-ak-confirm-card">
                    <div className="ce-ak-confirm-icon">
                        <Icon name="check" size={32} />
                    </div>
                    <h2>Answer Key Ready</h2>
                    <p>Reference answers for all {totalQuestions} question(s) are ready.</p>
                    <div className="ce-ak-confirm-checklist">
                        <div className="ce-review-checklist">
                            <div className="ce-review-check-item">
                                <Icon name="check" size={16} />
                                <span>{totalQuestions} Descriptive Questions</span>
                            </div>
                            <div className="ce-review-check-item">
                                <Icon name="check" size={16} />
                                <span>{completedCount} Reference Answers Configured</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 20, textAlign: 'center' }}>
                        <button
                            className="ce-btn ce-btn-outline ce-btn-sm"
                            onClick={() => setAkState('editing')}
                        >
                            <Icon name="edit" size={14} />
                            Edit Reference Answers
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <div className="ce-card">
                <div className="ce-card-header">
                    <h2>Reference Answers</h2>
                    <p>Provide the expected reference answer for each question.</p>
                </div>

                <div className="ce-completion-grid">
                    <CompletionItem
                        label="Completed Answers"
                        value={`${completedCount} / ${totalQuestions}`}
                        complete={completedCount === totalQuestions && totalQuestions > 0}
                    />
                    <CompletionItem
                        label="Questions"
                        value={`${totalQuestions}`}
                        complete={totalQuestions > 0}
                    />
                </div>

                <div className="ce-answer-key-layout">
                    <div className="ce-question-sidebar">
                        <h4>Questions</h4>
                        {qpQuestions.map((q) => {
                            const a = akAnswers[q.number]
                            const hasAnswer = !!a?.reference?.trim()
                            const cls = hasAnswer ? 'done' : ''
                            const isSelected = (currentQuestion ? currentQuestion.number : selectedQNumber) === q.number
                            return (
                                <button
                                    key={q.number}
                                    className={`ce-sidebar-question ${cls} ${isSelected ? 'active' : ''}`}
                                    onClick={() => setSelectedQNumber(q.number)}
                                >
                                    <span className="status-dot" />
                                    <span>Q{q.number} ({q.marks}M)</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="ce-editor-panel">
                        {currentQuestion && (
                            <AnswerKeyEditor
                                question={currentQuestion}
                                answer={currentAnswer}
                                onUpdate={updateAnswer}
                                onMarkReviewed={markReviewed}
                                onSave={saveAnswer}
                            />
                        )}
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

    /* ---------- STEP 4: Students ---------- */
    const renderStep4 = () => (
        <div className="ce-card">
            <div className="ce-card-header">
                <h2>Assign Students</h2>
                <p>Select the registered students who will take this examination.</p>
            </div>

            <div className="ce-students-toolbar">
                <div className="ce-search-box">
                    <Icon name="search" size={16} />
                    <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="Search students by name, roll number, or email..."
                    />
                </div>
                <button
                    className="ce-btn ce-btn-outline ce-btn-sm"
                    onClick={selectAllStudents}
                    disabled={students.length === 0}
                >
                    Select All
                </button>
                <button
                    className="ce-btn ce-btn-ghost ce-btn-sm"
                    onClick={deselectAllStudents}
                    disabled={students.length === 0}
                >
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
                            <th>Roll Number</th>
                            <th>Email</th>
                            <th style={{ width: 60 }} />
                        </tr>
                    </thead>
                    <tbody>
                        {loadingStudents ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px 0' }}>
                                    <PageLoader inline message="Loading registered students..." />
                                </td>
                            </tr>
                        ) : students.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--g500)', padding: 36 }}>
                                    No students registered yet. Click <strong>"+ Add Student"</strong> above to register students for this exam.
                                </td>
                            </tr>
                        ) : filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--g500)', padding: 36 }}>
                                    No students match your search filter.
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((s) => (
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
                                    <td>{s.email || '—'}</td>
                                    <td>
                                        <button
                                            className="ce-student-remove"
                                            title="Remove student"
                                            onClick={() => removeStudent(s.id)}
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

            <div
                style={{
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: '1px solid var(--brd)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 12,
                }}
            >
                <span className="ce-review-badge">
                    {selectedStudentCount} student{selectedStudentCount !== 1 ? 's' : ''} assigned
                </span>
                <span style={{ fontSize: 13, color: 'var(--g500)' }}>
                    Showing {filteredStudents.length} of {students.length} students
                </span>
            </div>
        </div>
    )

    /* ---------- STEP 5: Review ---------- */
    const renderStep5 = () => {
        const selectedStudents = students.filter((s) => s.selected)

        return (
            <div className="ce-card">
                <div className="ce-card-header">
                    <h2>Review & Create Exam</h2>
                    <p>Verify all exam details, questions, reference answers, and student assignments before creating.</p>
                </div>

                <div className="ce-review-section">
                    <h4>
                        <span className="check-icon">✓</span> Exam Details
                    </h4>
                    <div className="ce-review-grid">
                        <ReviewItem label="Exam Name" value={details.title || 'Untitled'} />
                        <ReviewItem label="Subject" value={details.subject || 'Not specified'} />
                        <ReviewItem label="Semester" value={details.semester || 'N/A'} />
                        <ReviewItem label="Date" value={details.date || 'Not specified'} />
                        <ReviewItem label="Duration" value={details.duration || 'Not specified'} />
                        <ReviewItem label="Total Marks" value={`${calculatedTotalMarks} marks`} />
                    </div>
                </div>

                <div className="ce-review-section">
                    <h4>
                        <span className="check-icon">✓</span> Question Paper & Reference Answers
                    </h4>
                    <div className="ce-review-checklist" style={{ marginBottom: 16 }}>
                        <CheckLine>{qpQuestions.length} descriptive question(s) configured</CheckLine>
                        <CheckLine>Reference answers provided for all questions</CheckLine>
                    </div>

                    <div className="ce-question-list">
                        {qpQuestions.map((q) => {
                            const ref = akAnswers[q.number]?.reference
                            return (
                                <div key={q.number} className="ce-question-card" style={{ marginBottom: 12 }}>
                                    <div className="ce-question-card-header">
                                        <span className="ce-question-number">Q{q.number}</span>
                                        <span className="ce-question-type-badge descriptive">Descriptive</span>
                                        <span className="ce-question-marks">{q.marks} marks</span>
                                    </div>
                                    <p className="ce-question-text" style={{ fontWeight: 600 }}>{q.text}</p>
                                    <div style={{ marginTop: 8, padding: 12, background: 'var(--g50)', borderRadius: 8, borderLeft: '3px solid var(--green)' }}>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--g600)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 }}>
                                            Reference Answer:
                                        </span>
                                        <p style={{ margin: 0, fontSize: 14, color: 'var(--g800)', lineHeight: 1.5 }}>
                                            {ref || '(No reference answer entered)'}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="ce-review-section">
                    <h4>
                        <span className="check-icon">✓</span> Assigned Students ({selectedStudents.length})
                    </h4>
                    <div className="ce-review-checklist">
                        <CheckLine>{selectedStudents.length} student(s) assigned</CheckLine>
                    </div>
                    {selectedStudents.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                            {selectedStudents.map((s) => (
                                <span
                                    key={s.id}
                                    style={{
                                        padding: '4px 10px',
                                        background: 'var(--blue-s)',
                                        border: '1px solid var(--blue-l)',
                                        borderRadius: 6,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: 'var(--navy)',
                                    }}
                                >
                                    {s.name} ({s.id})
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    /* ============================================================
       MAIN RENDER
       ============================================================ */

    return (
        <div className="create-exam-page">
            <div className="page-header">
                <p>
                    Create and configure a new examination for AI-assisted answer evaluation.
                </p>
            </div>
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
                    <button
                        className="ce-btn ce-btn-outline"
                        onClick={saveDraft}
                        disabled={isSavingDraft || isSubmitting}
                    >
                        {isSavingDraft ? 'Saving Draft...' : 'Save as Draft'}
                    </button>
                    {step < 5 ? (
                        <button className="ce-btn ce-btn-primary" onClick={goNext}>
                            Next
                            <Icon name="arrowRight" size={14} />
                        </button>
                    ) : (
                        <button
                            className="ce-btn ce-btn-success"
                            onClick={createExam}
                            disabled={isSubmitting || isSavingDraft}
                        >
                            {isSubmitting ? 'Creating Exam...' : 'Create Exam'}
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
                    onClose={() => {
                        setSuccessModal(false)
                        setStep(1)
                    }}
                />
            )}

            {toast && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        background: toastType === 'error' ? 'var(--red-l)' : 'var(--green-l)',
                        color: toastType === 'error' ? 'var(--red)' : 'var(--green)',
                        padding: '12px 18px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        boxShadow: 'var(--sh)',
                        zIndex: 300,
                        border: toastType === 'error' ? '1px solid var(--red)' : '1px solid var(--green)',
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
                Drop your question paper here or <span className="browse">browse</span>
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
                Drop your answer key here or <span className="browse">browse</span>
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
                <span className="ce-question-type-badge descriptive">Descriptive</span>
                <span className="ce-question-marks">{question.marks} marks</span>
            </div>
            <p className="ce-question-text">{question.text}</p>
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
    return (
        <div className="ce-manual-question-card">
            <div className="ce-manual-q-header">
                <div className="ce-manual-q-header-left">
                    <span className="ce-manual-q-number">{question.number}</span>
                    <span className="ce-manual-q-type descriptive">Descriptive</span>
                </div>
                <span className="ce-manual-q-marks">{question.marks} marks</span>
            </div>

            <div className="ce-manual-q-body">
                <div className="ce-manual-q-text">{question.text || '(No question text)'}</div>
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

function AnswerKeyEditor({ question, answer, onUpdate, onMarkReviewed, onSave }) {
    return (
        <>
            <div className="ce-editor-panel-header">
                <h3>Question {question.number}</h3>
            </div>

            <div className="ce-linked-question">
                <strong style={{ color: 'var(--g800)' }}>Question:</strong> {question.text}
            </div>

            <div className="ce-editor-section">
                <label>Reference Answer (Required for Phase 1 ASAG Evaluation) *</label>
                <textarea
                    rows="5"
                    value={answer.reference}
                    onChange={(e) => onUpdate('reference', e.target.value)}
                    placeholder="Enter the expected reference answer..."
                />
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 10,
                    marginTop: 20,
                    paddingTop: 20,
                    borderTop: '1px solid var(--brd)',
                }}
            >
                <button className="ce-btn ce-btn-ghost" onClick={onMarkReviewed}>
                    {answer.reviewed ? '✓ Reviewed' : 'Mark as Reviewed'}
                </button>
                <button className="ce-btn ce-btn-primary" onClick={onSave}>
                    Save Answer
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
                    <label>Question Number *</label>
                    <input
                        type="number"
                        min="1"
                        value={form.number}
                        onChange={(e) => setField('number', e.target.value)}
                    />
                </div>
                <div className="ce-form-group">
                    <label>Question Type</label>
                    <input
                        type="text"
                        value="Descriptive"
                        disabled
                        style={{ background: 'var(--g100)', color: 'var(--g600)' }}
                    />
                </div>
                <div className="ce-form-group full-width">
                    <label>Question Text *</label>
                    <textarea
                        rows="3"
                        value={form.text}
                        onChange={(e) => setField('text', e.target.value)}
                        placeholder="Enter the descriptive question text..."
                    />
                </div>
                <div className="ce-form-group full-width">
                    <label>Maximum Marks *</label>
                    <input
                        type="number"
                        min="1"
                        value={form.marks}
                        onChange={(e) => setField('marks', e.target.value)}
                    />
                </div>
            </div>

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
                    <label>Roll Number / Student ID *</label>
                    <input
                        type="text"
                        value={value.id}
                        onChange={(e) => setField('id', e.target.value)}
                        placeholder="e.g. CS009"
                    />
                </div>
                <div className="ce-form-group">
                    <label>Email</label>
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
                    <label>Question Number *</label>
                    <input
                        type="number"
                        min="1"
                        value={form.number}
                        onChange={(e) => setField('number', e.target.value)}
                    />
                </div>
                <div className="ce-form-group">
                    <label>Maximum Marks *</label>
                    <input
                        type="number"
                        min="1"
                        value={form.marks}
                        onChange={(e) => setField('marks', e.target.value)}
                    />
                </div>
                <div className="ce-form-group full-width">
                    <label>Question Text *</label>
                    <textarea
                        rows="3"
                        value={form.text}
                        onChange={(e) => setField('text', e.target.value)}
                    />
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
