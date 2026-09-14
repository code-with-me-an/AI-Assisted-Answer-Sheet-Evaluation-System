import { useState } from 'react'
import '../style/CreateExam.css'

function ArrowLeftIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
        </svg>
    )
}

function ArrowRightIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    )
}

function CheckIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}

function PlusIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    )
}

const initialQuestions = [
    {
        id: 1,
        type: 'mcq',
        text: '',
        marks: 5,
        options: ['', '', '', ''],
        correctOption: 0
    }
]

const initialCriteria = [
    {
        name: 'Accuracy',
        weight: '40%',
        description: 'Correctness of the answer'
    },
    {
        name: 'Clarity',
        weight: '30%',
        description: 'Clear and well-structured response'
    }
]

const initialStudents = [
    {
        name: 'John Smith',
        id: 'STU001',
        email: 'john.smith@university.edu'
    },
    {
        name: 'Sarah Johnson',
        id: 'STU002',
        email: 'sarah.j@university.edu'
    },
    {
        name: 'Michael Chen',
        id: 'STU003',
        email: 'm.chen@university.edu'
    }
]

function CreateExam() {
    const totalSteps = 4

    const [currentStep, setCurrentStep] = useState(1)

    const [examDetails, setExamDetails] = useState({
        title: '',
        subject: '',
        semester: 'Fall 2023',
        date: '',
        marks: '100',
        studentCount: '45'
    })

    const [questions, setQuestions] = useState(initialQuestions)

    const [criteria, setCriteria] = useState(initialCriteria)

    const [students, setStudents] = useState(initialStudents)

    const [autoGrade, setAutoGrade] = useState(true)

    const [gradingNotes, setGradingNotes] = useState('')

    const [modal, setModal] = useState({
        open: false,
        title: '',
        message: ''
    })

    // ------------------------------------------
    // Exam Details
    // ------------------------------------------

    const updateExamDetails = (field, value) => {
        setExamDetails((current) => ({
            ...current,
            [field]: value
        }))
    }

    // ------------------------------------------
    // Questions
    // ------------------------------------------

    const updateQuestion = (questionIndex, field, value) => {
        setQuestions((current) =>
            current.map((question, index) =>
                index === questionIndex
                    ? {
                          ...question,
                          [field]: value
                      }
                    : question
            )
        )
    }

    const updateQuestionOption = (
        questionIndex,
        optionIndex,
        value
    ) => {
        setQuestions((current) =>
            current.map((question, index) => {
                if (index !== questionIndex) {
                    return question
                }

                const options = [...question.options]
                options[optionIndex] = value

                return {
                    ...question,
                    options
                }
            })
        )
    }

    const updateCorrectOption = (questionIndex, optionIndex) => {
        setQuestions((current) =>
            current.map((question, index) =>
                index === questionIndex
                    ? {
                          ...question,
                          correctOption: optionIndex
                      }
                    : question
            )
        )
    }

    const addQuestion = () => {
        setQuestions((current) => [
            ...current,
            {
                id: Date.now(),
                type: 'mcq',
                text: '',
                marks: 5,
                options: ['', '', '', ''],
                correctOption: 0
            }
        ])
    }

    const removeQuestion = (questionIndex) => {
        if (questions.length <= 1) {
            return
        }

        setQuestions((current) =>
            current.filter((_, index) => index !== questionIndex)
        )
    }

    const addOption = (questionIndex) => {
        setQuestions((current) =>
            current.map((question, index) =>
                index === questionIndex
                    ? {
                          ...question,
                          options: [...question.options, '']
                      }
                    : question
            )
        )
    }

    const removeOption = (questionIndex, optionIndex) => {
        setQuestions((current) =>
            current.map((question, index) => {
                if (index !== questionIndex) {
                    return question
                }

                if (question.options.length <= 2) {
                    return question
                }

                const options = question.options.filter(
                    (_, optionIndexValue) =>
                        optionIndexValue !== optionIndex
                )

                let correctOption = question.correctOption

                if (optionIndex === correctOption) {
                    correctOption = 0
                } else if (optionIndex < correctOption) {
                    correctOption -= 1
                }

                return {
                    ...question,
                    options,
                    correctOption
                }
            })
        )
    }

    // ------------------------------------------
    // Marking Criteria
    // ------------------------------------------

    const updateCriteria = (criteriaIndex, field, value) => {
        setCriteria((current) =>
            current.map((criterion, index) =>
                index === criteriaIndex
                    ? {
                          ...criterion,
                          [field]: value
                      }
                    : criterion
            )
        )
    }

    const addCriteria = () => {
        setCriteria((current) => [
            ...current,
            {
                name: '',
                weight: '',
                description: ''
            }
        ])
    }

    const removeCriteria = (criteriaIndex) => {
        if (criteria.length <= 1) {
            return
        }

        setCriteria((current) =>
            current.filter((_, index) => index !== criteriaIndex)
        )
    }

    // ------------------------------------------
    // Students
    // ------------------------------------------

    const updateStudent = (studentIndex, field, value) => {
        setStudents((current) =>
            current.map((student, index) =>
                index === studentIndex
                    ? {
                          ...student,
                          [field]: value
                      }
                    : student
            )
        )
    }

    const addStudent = () => {
        setStudents((current) => [
            ...current,
            {
                name: '',
                id: '',
                email: ''
            }
        ])
    }

    const removeStudent = (studentIndex) => {
        setStudents((current) =>
            current.filter((_, index) => index !== studentIndex)
        )
    }

    // ------------------------------------------
    // Navigation
    // ------------------------------------------

    const goToStep = (step) => {
        if (step <= currentStep || step === currentStep + 1) {
            setCurrentStep(step)
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep((current) => current + 1)

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        } else {
            submitExam()
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((current) => current - 1)

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }

    // ------------------------------------------
    // Modal
    // ------------------------------------------

    const showModal = (title, message) => {
        setModal({
            open: true,
            title,
            message
        })
    }

    const closeModal = () => {
        setModal({
            open: false,
            title: '',
            message: ''
        })
    }

    const saveDraft = () => {
        showModal(
            'Draft Saved!',
            'Your exam has been saved as a draft. You can continue editing it later.'
        )
    }

    const submitExam = () => {
        showModal(
            'Exam Submitted!',
            `Your exam has been successfully created and assigned to ${students.length} student(s). Grading will begin once submissions are received.`
        )
    }

    // ------------------------------------------
    // Render
    // ------------------------------------------

    return (
        <div className="create-exam-page">
            <div className="create-exam-content">

                {/* Stepper */}
                <div className="exam-stepper">

                    {[1, 2, 3, 4].map((step, index) => (
                        <div
                            className="stepper-wrapper"
                            key={step}
                        >
                            <button
                                type="button"
                                className={`exam-step ${
                                    step === currentStep
                                        ? 'active'
                                        : step < currentStep
                                          ? 'completed'
                                          : ''
                                }`}
                                onClick={() => goToStep(step)}
                            >
                                <span className="step-circle">
                                    {step}
                                </span>

                                <span className="step-label">
                                    {step === 1 && 'Details'}
                                    {step === 2 && 'Question Paper'}
                                    {step === 3 && 'Marking Scheme'}
                                    {step === 4 && 'Students'}
                                </span>
                            </button>

                            {index < 3 && (
                                <div
                                    className={`step-line ${
                                        step < currentStep
                                            ? 'completed'
                                            : ''
                                    }`}
                                />
                            )}
                        </div>
                    ))}

                </div>

                {/* STEP 1 */}
                {currentStep === 1 && (
                    <div className="form-card">
                        <h2>Exam Details</h2>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Title</label>

                                <input
                                    type="text"
                                    value={examDetails.title}
                                    onChange={(event) =>
                                        updateExamDetails(
                                            'title',
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. Midterm Examination"
                                />
                            </div>

                            <div className="form-group">
                                <label>Subject</label>

                                <input
                                    type="text"
                                    value={examDetails.subject}
                                    onChange={(event) =>
                                        updateExamDetails(
                                            'subject',
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. Computer Science 101"
                                />
                            </div>

                            <div className="form-group">
                                <label>Semester</label>

                                <select
                                    value={examDetails.semester}
                                    onChange={(event) =>
                                        updateExamDetails(
                                            'semester',
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Select Semester
                                    </option>

                                    <option value="Fall 2023">
                                        Fall 2023
                                    </option>

                                    <option value="Spring 2024">
                                        Spring 2024
                                    </option>

                                    <option value="Summer 2024">
                                        Summer 2024
                                    </option>

                                    <option value="Fall 2024">
                                        Fall 2024
                                    </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Date</label>

                                <input
                                    type="date"
                                    value={examDetails.date}
                                    onChange={(event) =>
                                        updateExamDetails(
                                            'date',
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Total Marks</label>

                                <input
                                    type="number"
                                    value={examDetails.marks}
                                    onChange={(event) =>
                                        updateExamDetails(
                                            'marks',
                                            event.target.value
                                        )
                                    }
                                    placeholder="100"
                                />
                            </div>

                            <div className="form-group">
                                <label>Student Count</label>

                                <input
                                    type="number"
                                    value={examDetails.studentCount}
                                    onChange={(event) =>
                                        updateExamDetails(
                                            'studentCount',
                                            event.target.value
                                        )
                                    }
                                    placeholder="45"
                                />
                            </div>

                        </div>
                    </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                    <div className="form-card">
                        <h2>Question Paper</h2>

                        <div className="question-list">

                            {questions.map((question, questionIndex) => (
                                <div
                                    className="question-item"
                                    key={question.id}
                                >
                                    <div className="question-item-header">

                                        <span className="question-number">
                                            Question {questionIndex + 1}
                                        </span>

                                        <button
                                            type="button"
                                            className="question-remove"
                                            onClick={() =>
                                                removeQuestion(
                                                    questionIndex
                                                )
                                            }
                                            disabled={
                                                questions.length <= 1
                                            }
                                        >
                                            ✕ Remove
                                        </button>

                                    </div>

                                    <div className="question-fields">

                                        <div className="form-group full-width">
                                            <label>
                                                Question Text
                                            </label>

                                            <textarea
                                                value={question.text}
                                                onChange={(event) =>
                                                    updateQuestion(
                                                        questionIndex,
                                                        'text',
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Enter your question..."
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>
                                                Question Type
                                            </label>

                                            <select
                                                value={question.type}
                                                onChange={(event) =>
                                                    updateQuestion(
                                                        questionIndex,
                                                        'type',
                                                        event.target.value
                                                    )
                                                }
                                            >
                                                <option value="mcq">
                                                    Multiple Choice
                                                </option>

                                                <option value="short">
                                                    Short Answer
                                                </option>

                                                <option value="essay">
                                                    Essay
                                                </option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label>Marks</label>

                                            <input
                                                type="number"
                                                min="1"
                                                value={question.marks}
                                                onChange={(event) =>
                                                    updateQuestion(
                                                        questionIndex,
                                                        'marks',
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        {question.type === 'mcq' && (
                                            <div className="form-group full-width">

                                                <label>
                                                    Options (select correct answer)
                                                </label>

                                                <div className="options-list">

                                                    {question.options.map(
                                                        (
                                                            option,
                                                            optionIndex
                                                        ) => (
                                                            <div
                                                                className="option-row"
                                                                key={optionIndex}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={`correct-${questionIndex}`}
                                                                    checked={
                                                                        question.correctOption ===
                                                                        optionIndex
                                                                    }
                                                                    onChange={() =>
                                                                        updateCorrectOption(
                                                                            questionIndex,
                                                                            optionIndex
                                                                        )
                                                                    }
                                                                />

                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        option
                                                                    }
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        updateQuestionOption(
                                                                            questionIndex,
                                                                            optionIndex,
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder={`Option ${
                                                                        optionIndex +
                                                                        1
                                                                    }`}
                                                                />

                                                                <button
                                                                    type="button"
                                                                    className="option-remove"
                                                                    onClick={() =>
                                                                        removeOption(
                                                                            questionIndex,
                                                                            optionIndex
                                                                        )
                                                                    }
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        )
                                                    )}

                                                </div>

                                                <button
                                                    type="button"
                                                    className="add-option-btn"
                                                    onClick={() =>
                                                        addOption(
                                                            questionIndex
                                                        )
                                                    }
                                                >
                                                    + Add Option
                                                </button>

                                            </div>
                                        )}

                                    </div>
                                </div>
                            ))}

                        </div>

                        <button
                            type="button"
                            className="add-question-btn"
                            onClick={addQuestion}
                        >
                            <PlusIcon />
                            Add Question
                        </button>
                    </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                    <div className="form-card">
                        <h2>Marking Scheme</h2>

                        <div className="auto-grade-toggle">

                            <div className="toggle-info">
                                <h4>
                                    Enable AI Auto-Grading
                                </h4>

                                <p>
                                    Automatically grade MCQ and short
                                    answer questions
                                </p>
                            </div>

                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={autoGrade}
                                    onChange={(event) =>
                                        setAutoGrade(
                                            event.target.checked
                                        )
                                    }
                                />

                                <span className="toggle-slider" />
                            </label>

                        </div>

                        <div className="rubric-section">

                            <div className="rubric-header">
                                <h4>Grading Rubric</h4>

                                <button
                                    type="button"
                                    className="add-option-btn"
                                    onClick={addCriteria}
                                >
                                    + Add Criteria
                                </button>
                            </div>

                            <div className="rubric-criteria">

                                {criteria.map(
                                    (criterion, criteriaIndex) => (
                                        <div
                                            className="criteria-row"
                                            key={criteriaIndex}
                                        >

                                            <div className="form-group">
                                                <label>
                                                    Criteria Name
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        criterion.name
                                                    }
                                                    onChange={(event) =>
                                                        updateCriteria(
                                                            criteriaIndex,
                                                            'name',
                                                            event.target
                                                                .value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>
                                                    Weight
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        criterion.weight
                                                    }
                                                    onChange={(event) =>
                                                        updateCriteria(
                                                            criteriaIndex,
                                                            'weight',
                                                            event.target
                                                                .value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>
                                                    Description
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        criterion.description
                                                    }
                                                    onChange={(event) =>
                                                        updateCriteria(
                                                            criteriaIndex,
                                                            'description',
                                                            event.target
                                                                .value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                className="question-remove criteria-remove"
                                                onClick={() =>
                                                    removeCriteria(
                                                        criteriaIndex
                                                    )
                                                }
                                                disabled={
                                                    criteria.length <= 1
                                                }
                                            >
                                                ✕
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>
                        </div>

                        <div className="form-group full-width grading-notes">
                            <label>
                                Additional Grading Notes
                            </label>

                            <textarea
                                value={gradingNotes}
                                onChange={(event) =>
                                    setGradingNotes(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter any special instructions for graders..."
                            />
                        </div>
                    </div>
                )}

                {/* STEP 4 */}
                {currentStep === 4 && (
                    <div className="form-card">
                        <h2>Assign Students</h2>

                        <div className="students-header">

                            <span className="student-count-badge">
                                {students.length}{' '}
                                {students.length === 1
                                    ? 'student'
                                    : 'students'}{' '}
                                added
                            </span>

                            <button
                                type="button"
                                className="add-student-btn"
                                onClick={addStudent}
                            >
                                <PlusIcon />
                                Add Student
                            </button>

                        </div>

                        <div className="table-wrapper">

                            <table className="student-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Student Name</th>
                                        <th>Student ID</th>
                                        <th>Email</th>
                                        <th />
                                    </tr>
                                </thead>

                                <tbody>
                                    {students.map(
                                        (student, studentIndex) => (
                                            <tr key={studentIndex}>

                                                <td>
                                                    {studentIndex + 1}
                                                </td>

                                                <td>
                                                    <input
                                                        type="text"
                                                        value={
                                                            student.name
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateStudent(
                                                                studentIndex,
                                                                'name',
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </td>

                                                <td>
                                                    <input
                                                        type="text"
                                                        value={
                                                            student.id
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateStudent(
                                                                studentIndex,
                                                                'id',
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </td>

                                                <td>
                                                    <input
                                                        type="email"
                                                        value={
                                                            student.email
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateStudent(
                                                                studentIndex,
                                                                'email',
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="student-delete"
                                                        onClick={() =>
                                                            removeStudent(
                                                                studentIndex
                                                            )
                                                        }
                                                    >
                                                        ✕
                                                    </button>
                                                </td>

                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>

                        </div>

                        {/* Review */}
                        <div className="review-container">

                            <h2>Review Summary</h2>

                            <div className="review-section">
                                <h4>Exam Details</h4>

                                <div className="review-grid">

                                    <ReviewItem
                                        label="Title"
                                        value={
                                            examDetails.title ||
                                            'Untitled Exam'
                                        }
                                    />

                                    <ReviewItem
                                        label="Subject"
                                        value={
                                            examDetails.subject ||
                                            'Not specified'
                                        }
                                    />

                                    <ReviewItem
                                        label="Semester"
                                        value={
                                            examDetails.semester ||
                                            'Not specified'
                                        }
                                    />

                                    <ReviewItem
                                        label="Date"
                                        value={
                                            examDetails.date ||
                                            'Not specified'
                                        }
                                    />

                                    <ReviewItem
                                        label="Total Marks"
                                        value={
                                            examDetails.marks || '0'
                                        }
                                    />

                                    <ReviewItem
                                        label="Students"
                                        value={
                                            examDetails.studentCount ||
                                            '0'
                                        }
                                    />

                                </div>
                            </div>

                            <div className="review-section">
                                <h4>
                                    Questions ({questions.length})
                                </h4>

                                {questions.map(
                                    (question, index) => (
                                        <div
                                            className="review-question"
                                            key={question.id}
                                        >
                                            <div className="q-title">
                                                Q{index + 1}.{' '}
                                                {question.text ||
                                                    '(No text)'}
                                            </div>

                                            <div className="q-meta">
                                                Type:{' '}
                                                {question.type ===
                                                'mcq'
                                                    ? 'Multiple Choice'
                                                    : question.type ===
                                                        'short'
                                                      ? 'Short Answer'
                                                      : 'Essay'}{' '}
                                                · Marks:{' '}
                                                {question.marks}{' '}
                                                · Options:{' '}
                                                {
                                                    question.options.filter(
                                                        Boolean
                                                    ).length
                                                }
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="review-section">
                                <h4>Marking Scheme</h4>

                                <div className="review-grid">

                                    <ReviewItem
                                        label="Auto-Grading"
                                        value={
                                            autoGrade
                                                ? 'Enabled'
                                                : 'Disabled'
                                        }
                                    />

                                    <ReviewItem
                                        label="Criteria Count"
                                        value={criteria.length}
                                    />

                                </div>

                                <div className="review-criteria-list">

                                    {criteria.map(
                                        (criterion, index) => (
                                            <div
                                                className="review-question"
                                                key={index}
                                            >
                                                <div className="q-title">
                                                    {criterion.name ||
                                                        '(Unnamed)'}{' '}
                                                    —{' '}
                                                    {criterion.weight}
                                                </div>

                                                <div className="q-meta">
                                                    {criterion.description ||
                                                        'No description'}
                                                </div>
                                            </div>
                                        )
                                    )}

                                </div>

                                <div className="review-item grading-notes-review">
                                    <div className="label">
                                        Grading Notes
                                    </div>

                                    <div className="value notes-value">
                                        {gradingNotes || 'None'}
                                    </div>
                                </div>
                            </div>

                            <div className="review-section">
                                <h4>
                                    Assigned Students (
                                    {students.length})
                                </h4>

                                {students.map(
                                    (student, index) => (
                                        <div
                                            className="review-question"
                                            key={index}
                                        >
                                            <div className="q-title">
                                                {student.name ||
                                                    '(No name)'}{' '}
                                                —{' '}
                                                {student.id ||
                                                    'No ID'}
                                            </div>

                                            <div className="q-meta">
                                                {student.email ||
                                                    'No email'}
                                            </div>
                                        </div>
                                    )
                                )}

                            </div>

                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="form-footer">

                    {currentStep > 1 && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handlePrevious}
                        >
                            <ArrowLeftIcon />
                            Previous
                        </button>
                    )}

                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={saveDraft}
                    >
                        Save as Draft
                    </button>

                    <button
                        type="button"
                        className={`btn ${
                            currentStep === totalSteps
                                ? 'btn-success'
                                : 'btn-primary'
                        }`}
                        onClick={handleNext}
                    >
                        {currentStep === totalSteps ? (
                            <>
                                <CheckIcon />
                                Submit Exam
                            </>
                        ) : (
                            <>
                                Next Step
                                <ArrowRightIcon />
                            </>
                        )}
                    </button>

                </div>
            </div>

            {/* Success Modal */}
            {modal.open && (
                <div
                    className="modal-overlay active"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            closeModal()
                        }
                    }}
                >
                    <div className="modal">

                        <div className="modal-icon">
                            <CheckIcon />
                        </div>

                        <h3>{modal.title}</h3>

                        <p>{modal.message}</p>

                        <button
                            type="button"
                            className="btn btn-primary modal-done"
                            onClick={closeModal}
                        >
                            Done
                        </button>

                    </div>
                </div>
            )}
        </div>
    )
}

function ReviewItem({ label, value }) {
    return (
        <div className="review-item">
            <div className="label">{label}</div>
            <div className="value">{value}</div>
        </div>
    )
}

export default CreateExam