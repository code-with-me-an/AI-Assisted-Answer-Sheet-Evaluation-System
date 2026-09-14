import { useMemo, useState } from 'react'
import '../style/PastExams.css'

const exams = [
    {
        title: 'Final Term - Advanced Biology',
        code: 'Biology 401',
        date: 'Oct 24, 2023',
        students: 45,
        evaluated: 45,
        pending: 12,
        average: 78,
        highest: 96,
        status: 'pending',
    },
    {
        title: 'Mid Term - Organic Chemistry',
        code: 'Chemistry 302',
        date: 'Oct 18, 2023',
        students: 38,
        evaluated: 38,
        pending: 0,
        average: 82,
        highest: 97,
        status: 'approved',
    },
    {
        title: 'Unit Test - Cell Biology',
        code: 'Biology 205',
        date: 'Oct 10, 2023',
        students: 42,
        evaluated: 42,
        pending: 0,
        average: 75,
        highest: 94,
        status: 'modified',
    },
    {
        title: 'Quiz - Genetics',
        code: 'Biology 310',
        date: 'Sep 28, 2023',
        students: 35,
        evaluated: 35,
        pending: 0,
        average: 81,
        highest: 98,
        status: 'approved',
    },
    {
        title: 'Final - Molecular Biology',
        code: 'Biology 405',
        date: 'Sep 15, 2023',
        students: 40,
        evaluated: 40,
        pending: 0,
        average: 79,
        highest: 95,
        status: 'approved',
    },
]

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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}

function ClockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}

function EditIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    )
}

function FilterIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
        </svg>
    )
}

function SearchIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    )
}

function SettingsFilterIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="8" cy="6" r="1" fill="currentColor" />
            <circle cx="16" cy="12" r="1" fill="currentColor" />
            <circle cx="10" cy="18" r="1" fill="currentColor" />
        </svg>
    )
}

function StatusBadge({ status }) {
    if (status === 'pending') {
        return (
            <span className="past-exam-badge badge-pending">
                <ClockIcon />
                Pending
            </span>
        )
    }

    if (status === 'modified') {
        return (
            <span className="past-exam-badge badge-modified">
                <EditIcon />
                Modified
            </span>
        )
    }

    return (
        <span className="past-exam-badge badge-approved">
            <CheckIcon />
            Approved
        </span>
    )
}

function PastExams() {
    const [search, setSearch] = useState('')
    const [filterOpen, setFilterOpen] = useState(false)

    const [filters, setFilters] = useState({
        pending: true,
        approved: true,
        modified: true,
    })

    const filteredExams = useMemo(() => {
        const query = search.toLowerCase().trim()

        return exams.filter((exam) => {
            const matchesSearch =
                !query ||
                exam.title.toLowerCase().includes(query) ||
                exam.code.toLowerCase().includes(query) ||
                exam.date.toLowerCase().includes(query)

            const matchesFilter = filters[exam.status]

            return matchesSearch && matchesFilter
        })
    }, [search, filters])

    const toggleFilter = (filter) => {
        setFilters((previous) => ({
            ...previous,
            [filter]: !previous[filter],
        }))
    }

    const handleReview = (exam) => {
        console.log('Reviewing:', exam.title)
    }

    return (
        <div className="past-exams-page">

            {/* Statistics */}
            <section className="past-exams-stats">
                <div className="past-stat-card">
                    <div className="past-stat-label">Total Exams</div>
                    <div className="past-stat-value">42</div>
                </div>

                <div className="past-stat-card">
                    <div className="past-stat-label">Evaluated</div>
                    <div className="past-stat-value">39</div>
                </div>

                <div className="past-stat-card past-stat-highlight">
                    <div className="past-stat-label">Pending Review</div>
                    <div className="past-stat-value">12</div>
                </div>

                <div className="past-stat-card">
                    <div className="past-stat-label">Average Mark</div>
                    <div className="past-stat-value">
                        78<span>%</span>
                    </div>
                </div>

                <div className="past-stat-card">
                    <div className="past-stat-label">Highest</div>
                    <div className="past-stat-value">
                        96<span>%</span>
                    </div>
                </div>
            </section>

            {/* Exams Table */}
            <section className="past-exams-table-card">

                <div className="past-exams-toolbar">

                    <div className="past-search-box">
                        <SearchIcon />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search exams..."
                        />
                    </div>

                    <div className="past-filter-wrapper">

                        <button
                            className="past-filter-btn"
                            onClick={() =>
                                setFilterOpen((previous) => !previous)
                            }
                            aria-label="Filter exams"
                        >
                            <FilterIcon />
                        </button>

                        {filterOpen && (
                            <div className="past-filter-dropdown">

                                <label className="past-filter-option">
                                    <input
                                        type="checkbox"
                                        checked={filters.pending}
                                        onChange={() =>
                                            toggleFilter('pending')
                                        }
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
                            {filteredExams.length > 0 ? (
                                filteredExams.map((exam) => (
                                    <tr key={exam.title}>

                                        <td>
                                            <div className="exam-name">
                                                {exam.title}
                                            </div>

                                            <div className="exam-code">
                                                {exam.code}
                                            </div>
                                        </td>

                                        <td className="exam-date">
                                            {exam.date}
                                        </td>

                                        <td className="exam-number">
                                            {exam.students}
                                        </td>

                                        <td className="exam-number">
                                            {exam.evaluated}
                                        </td>

                                        <td className="exam-percentage">
                                            {exam.average}%
                                        </td>

                                        <td className="exam-percentage">
                                            {exam.highest}%
                                        </td>

                                        <td>
                                            <StatusBadge
                                                status={exam.status}
                                            />
                                        </td>

                                        <td>
                                            <button
                                                className={
                                                    exam.status === 'pending'
                                                        ? 'past-action-btn primary'
                                                        : 'past-action-btn'
                                                }
                                                onClick={() =>
                                                    handleReview(exam)
                                                }
                                            >
                                                {exam.status === 'pending'
                                                    ? 'Review'
                                                    : 'View'}
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="past-empty-state"
                                    >
                                        No exams found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>

                </div>

                <div className="past-table-footer">
                    Showing {filteredExams.length} of {exams.length} exams
                </div>

            </section>

        </div>
    )
}

export default PastExams