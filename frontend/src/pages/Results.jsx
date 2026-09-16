import { useEffect, useMemo, useRef, useState } from 'react'
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

/* ============================================================
   DATA
   ============================================================ */

const EXAMS_DATA = [
    { id: 1, title: 'Data Structures — Internal Examination', subject: 'Computer Science', code: 'CS301', date: '16 Sep 2026', dateISO: '2026-09-16', totalMarks: 100, questions: 10, students: 50, evaluated: 47, pending: 3, average: 72.4, highest: 96, lowest: 31, median: 74, passRate: 84, status: 'processing' },
    { id: 2, title: 'DBMS — Internal Examination', subject: 'Computer Science', code: 'CS302', date: '12 Sep 2026', dateISO: '2026-09-12', totalMarks: 100, questions: 8, students: 45, evaluated: 45, pending: 0, average: 78.2, highest: 94, lowest: 42, median: 79, passRate: 89, status: 'completed' },
    { id: 3, title: 'Operating Systems — Internal', subject: 'Computer Science', code: 'CS303', date: '08 Sep 2026', dateISO: '2026-09-08', totalMarks: 100, questions: 10, students: 48, evaluated: 48, pending: 0, average: 68.5, highest: 92, lowest: 38, median: 70, passRate: 79, status: 'completed' },
    { id: 4, title: 'Computer Networks — Quiz', subject: 'Computer Science', code: 'CS304', date: '02 Sep 2026', dateISO: '2026-09-02', totalMarks: 50, questions: 5, students: 52, evaluated: 30, pending: 22, average: 71.8, highest: 98, lowest: 28, median: 73, passRate: 82, status: 'partial' },
    { id: 5, title: 'Algorithms — Unit Test', subject: 'Computer Science', code: 'CS305', date: '28 Aug 2026', dateISO: '2026-08-28', totalMarks: 80, questions: 6, students: 46, evaluated: 46, pending: 0, average: 74.1, highest: 80, lowest: 45, median: 75, passRate: 91, status: 'completed' },
]

const STUDENTS_DATA = [
    { id: 'CS001', name: 'Rahul Kumar', score: 87, pct: 87, status: 'reviewed', aiScore: 85, finalScore: 87 },
    { id: 'CS002', name: 'Anu Joseph', score: 74, pct: 74, status: 'evaluated', aiScore: 74, finalScore: 74 },
    { id: 'CS003', name: 'Arjun Raj', score: 91, pct: 91, status: 'reviewed', aiScore: 90, finalScore: 91 },
    { id: 'CS004', name: 'Meera S', score: null, pct: null, status: 'processing', aiScore: null, finalScore: null },
    { id: 'CS005', name: 'Vishnu P', score: 65, pct: 65, status: 'evaluated', aiScore: 65, finalScore: 65 },
    { id: 'CS006', name: 'Lakshmi Nair', score: 96, pct: 96, status: 'reviewed', aiScore: 95, finalScore: 96 },
    { id: 'CS007', name: 'Aditya Menon', score: 58, pct: 58, status: 'evaluated', aiScore: 58, finalScore: 58 },
    { id: 'CS008', name: 'Priya Sharma', score: 82, pct: 82, status: 'reviewed', aiScore: 81, finalScore: 82 },
    { id: 'CS009', name: 'Karthik R', score: 71, pct: 71, status: 'evaluated', aiScore: 71, finalScore: 71 },
    { id: 'CS010', name: 'Sneha Iyer', score: 88, pct: 88, status: 'reviewed', aiScore: 87, finalScore: 88 },
    { id: 'CS011', name: 'Rohan Das', score: 45, pct: 45, status: 'evaluated', aiScore: 45, finalScore: 45 },
    { id: 'CS012', name: 'Divya Krishnan', score: 79, pct: 79, status: 'evaluated', aiScore: 79, finalScore: 79 },
    { id: 'CS013', name: 'Aravind M', score: null, pct: null, status: 'pending', aiScore: null, finalScore: null },
    { id: 'CS014', name: 'Nandini V', score: 93, pct: 93, status: 'reviewed', aiScore: 92, finalScore: 93 },
    { id: 'CS015', name: 'Siddharth K', score: 67, pct: 67, status: 'evaluated', aiScore: 67, finalScore: 67 },
    { id: 'CS016', name: 'Aishwarya T', score: 84, pct: 84, status: 'reviewed', aiScore: 83, finalScore: 84 },
    { id: 'CS017', name: 'Manoj P', score: 72, pct: 72, status: 'evaluated', aiScore: 72, finalScore: 72 },
    { id: 'CS018', name: 'Revathi S', score: 89, pct: 89, status: 'reviewed', aiScore: 88, finalScore: 89 },
    { id: 'CS019', name: 'Gokul R', score: 55, pct: 55, status: 'evaluated', aiScore: 55, finalScore: 55 },
    { id: 'CS020', name: 'Swathi M', score: 77, pct: 77, status: 'evaluated', aiScore: 77, finalScore: 77 },
]

const QUESTIONS_DATA = [
    { number: 1, text: 'What is a Stack? Explain its operations with examples.', marks: 10, avgScore: 8.6, difficulty: 'high' },
    { number: 2, text: 'Compare BFS and DFS. When would you use each?', marks: 10, avgScore: 7.2, difficulty: 'moderate' },
    { number: 3, text: 'Explain the concept of AVL trees and their rotations.', marks: 10, avgScore: 4.9, difficulty: 'low' },
    { number: 4, text: 'Write an algorithm to detect a cycle in a directed graph.', marks: 10, avgScore: 8.8, difficulty: 'high' },
    { number: 5, text: 'What is hashing? Explain collision resolution techniques.', marks: 10, avgScore: 7.5, difficulty: 'moderate' },
    { number: 6, text: 'Differentiate between arrays and linked lists.', marks: 10, avgScore: 8.2, difficulty: 'high' },
    { number: 7, text: 'Explain quicksort algorithm with time complexity analysis.', marks: 10, avgScore: 6.8, difficulty: 'moderate' },
    { number: 8, text: 'What is a binary search tree? Discuss its properties.', marks: 10, avgScore: 7.9, difficulty: 'high' },
    { number: 9, text: 'Describe the applications of stacks in expression evaluation.', marks: 10, avgScore: 7.1, difficulty: 'moderate' },
    { number: 10, text: "Explain Dijkstra's shortest path algorithm.", marks: 10, avgScore: 5.4, difficulty: 'low' },
]

const SAMPLE_EVALUATIONS = [
    { qNumber: 1, studentAnswer: 'A stack is a linear data structure where insertion and deletion occur from one end. It follows the LIFO principle. Operations include push, pop, and peek.', referenceAnswer: 'A stack is a linear data structure where insertion and deletion are performed at the top. It follows the Last-In-First-Out (LIFO) principle. Key operations: push (insert), pop (remove), peek (view top).', aiScore: 9, finalScore: 9, verification: 'correct', components: { semantic: 0.94, coverage: 92, keywords: 'High', completeness: 90, htr: 96 }, feedback: 'The student correctly identified the stack as a linear data structure and correctly mentioned the LIFO principle. They also listed the key operations (push, pop, peek). However, the answer does not explicitly identify the top as the end from which operations are performed. Overall, a strong answer with minor omission.', reviewed: true, reason: '' },
    { qNumber: 2, studentAnswer: 'BFS uses a queue and explores level by level. DFS uses a stack or recursion and goes deep first. BFS is good for shortest path in unweighted graphs, DFS for topological sort.', referenceAnswer: 'BFS (Breadth-First Search) explores neighbors first using a queue, ideal for shortest paths in unweighted graphs. DFS (Depth-First Search) explores as deep as possible using a stack/recursion, useful for topological sorting, cycle detection, and path finding.', aiScore: 8, finalScore: 8, verification: 'correct', components: { semantic: 0.88, coverage: 85, keywords: 'High', completeness: 82, htr: 94 }, feedback: 'Good comparative answer. The student correctly distinguished BFS and DFS in terms of data structures (queue vs stack/recursion) and use cases. The answer could be improved by mentioning specific applications more clearly.', reviewed: true, reason: '' },
    { qNumber: 3, studentAnswer: 'AVL trees are balanced binary search trees. They use rotations to maintain balance. There are four types of rotations.', referenceAnswer: 'AVL trees are self-balancing binary search trees where the height difference between left and right subtrees is at most 1 (balance factor). They use rotations (LL, RR, LR, RL) to restore balance after insertions/deletions, ensuring O(log n) operations.', aiScore: 5, finalScore: 6, verification: 'partial', components: { semantic: 0.62, coverage: 55, keywords: 'Medium', completeness: 48, htr: 91 }, feedback: 'The student correctly identified AVL trees as balanced BSTs and mentioned rotations, but the answer lacks depth. Missing: balance factor definition, specific rotation types (LL, RR, LR, RL), and time complexity implications. Teacher adjusted score up by 1 mark due to partial correctness of core concept.', reviewed: true, reason: 'Student demonstrated understanding of core concept despite incomplete answer.' },
    { qNumber: 4, studentAnswer: "To detect a cycle in a directed graph, we can use DFS with colors: white (unvisited), gray (in progress), black (done). If we encounter a gray node during DFS, there is a cycle. Alternatively, use Kahn's algorithm for topological sort.", referenceAnswer: 'Cycle detection in directed graphs: (1) DFS with three-color marking (white/gray/black) — encountering a gray node indicates back edge = cycle. (2) Kahn\'s algorithm — if topological sort cannot process all nodes, cycle exists. (3) Union-Find (for undirected only).', aiScore: 9, finalScore: 9, verification: 'correct', components: { semantic: 0.95, coverage: 93, keywords: 'High', completeness: 92, htr: 95 }, feedback: "Excellent answer. The student correctly described both DFS three-color approach and mentioned Kahn's algorithm as an alternative. Clear and well-structured explanation.", reviewed: true, reason: '' },
    { qNumber: 5, studentAnswer: 'Hashing maps keys to indices using a hash function. Collisions occur when two keys map to the same index. Resolution techniques include chaining and open addressing (linear probing, quadratic probing, double hashing).', referenceAnswer: 'Hashing is a technique that maps keys to array indices using a hash function for O(1) average lookup. Collisions happen when different keys hash to the same index. Resolution: (1) Chaining — linked lists at each bucket. (2) Open addressing — linear probing, quadratic probing, double hashing.', aiScore: 9, finalScore: 9, verification: 'correct', components: { semantic: 0.93, coverage: 90, keywords: 'High', completeness: 88, htr: 93 }, feedback: 'Comprehensive answer covering both major collision resolution techniques with specific examples. Good technical vocabulary.', reviewed: true, reason: '' },
    { qNumber: 6, studentAnswer: 'Arrays have fixed size and contiguous memory. Linked lists are dynamic with nodes connected by pointers. Arrays allow random access O(1), linked lists need sequential access O(n). Insertion in arrays is O(n), in linked lists O(1) if position known.', referenceAnswer: 'Arrays: fixed size, contiguous memory, O(1) random access, O(n) insertion/deletion. Linked lists: dynamic size, non-contiguous memory with pointers, O(n) access, O(1) insertion/deletion at known position. Trade-offs in memory usage and cache performance.', aiScore: 9, finalScore: 9, verification: 'correct', components: { semantic: 0.94, coverage: 92, keywords: 'High', completeness: 90, htr: 94 }, feedback: 'Excellent comparative answer covering size, memory layout, access patterns, and operation complexities. Well-structured and complete.', reviewed: true, reason: '' },
    { qNumber: 7, studentAnswer: 'Quicksort picks a pivot, partitions array into elements less than and greater than pivot, then recursively sorts. Average time O(n log n), worst case O(n^2) when pivot is extreme.', referenceAnswer: 'Quicksort: (1) Choose pivot element. (2) Partition array around pivot. (3) Recursively sort sub-arrays. Time: O(n log n) average, O(n^2) worst case (mitigated by randomized pivot). Space: O(log n) for recursion. In-place sorting algorithm.', aiScore: 7, finalScore: 7, verification: 'partial', components: { semantic: 0.78, coverage: 72, keywords: 'Medium', completeness: 70, htr: 92 }, feedback: 'Good basic explanation of quicksort with correct time complexity. Missing: partition process details, space complexity, and optimization techniques (randomized pivot, median-of-three).', reviewed: true, reason: '' },
    { qNumber: 8, studentAnswer: 'A binary search tree is a binary tree where left child < parent < right child. Properties: in-order traversal gives sorted order, search/insert/delete in O(log n) average, O(n) worst case.', referenceAnswer: 'BST: binary tree with ordering property — left subtree keys < node key < right subtree keys. Properties: in-order traversal yields sorted sequence, O(log n) average operations, O(n) worst case (degenerate). No duplicates typically.', aiScore: 9, finalScore: 9, verification: 'correct', components: { semantic: 0.92, coverage: 88, keywords: 'High', completeness: 86, htr: 95 }, feedback: 'Strong answer covering the BST property, in-order traversal, and time complexity analysis. Could mention handling of duplicates.', reviewed: true, reason: '' },
    { qNumber: 9, studentAnswer: 'Stacks are used in expression evaluation for infix to postfix conversion and postfix evaluation. Also used for balancing parentheses and function call management.', referenceAnswer: 'Stack applications in expression evaluation: (1) Infix to postfix conversion using operator precedence. (2) Postfix expression evaluation. (3) Parentheses balancing. (4) Function call stack for recursion. (5) Undo operations.', aiScore: 7, finalScore: 7, verification: 'partial', components: { semantic: 0.75, coverage: 68, keywords: 'Medium', completeness: 65, htr: 90 }, feedback: 'Correct identification of main applications. Answer could be improved with more detailed explanation of how stacks are used in each application, especially the algorithm steps.', reviewed: true, reason: '' },
    { qNumber: 10, studentAnswer: 'Dijkstra finds shortest path from source to all vertices. Uses priority queue. Does not work with negative edges.', referenceAnswer: "Dijkstra's algorithm: finds shortest path from source to all vertices in weighted graphs with non-negative edges. Uses priority queue (min-heap). Greedy approach — always picks minimum distance vertex. Time: O((V+E) log V) with binary heap. Does not work with negative edge weights (use Bellman-Ford instead).", aiScore: 4, finalScore: 4, verification: 'incorrect', components: { semantic: 0.45, coverage: 38, keywords: 'Low', completeness: 35, htr: 88 }, feedback: 'The answer is too brief and lacks essential details. While the student correctly mentioned priority queue usage and the negative edge limitation, the answer is missing: algorithm steps, time complexity, greedy approach, and applications. Needs significant expansion.', reviewed: true, reason: '' },
]

const AVATAR_COLORS = ['#1e3a5f', '#2563eb', '#059669', '#d97706', '#7c3aed', '#dc2626', '#0891b2', '#be185d']

/* ============================================================
   HELPERS
   ============================================================ */

function initials(name) {
    return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
}

function avatarColor(name) {
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
    const [studentState, setStudentState] = useState('evaluated')
    const [studentEvaluations, setStudentEvaluations] = useState(SAMPLE_EVALUATIONS)
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

    /* ---------- Students data mutable copy ---------- */
    const [studentsData, setStudentsData] = useState(STUDENTS_DATA)

    const currentExam = useMemo(
        () => EXAMS_DATA.find((e) => e.id === currentExamId) || null,
        [currentExamId]
    )

    const currentStudent = useMemo(
        () => studentsData.find((s) => s.id === currentStudentId) || null,
        [studentsData, currentStudentId]
    )

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
                    { label: '90-100', count: studentsData.filter((s) => s.pct >= 90).length, color: '#059669' },
                    { label: '80-89', count: studentsData.filter((s) => s.pct >= 80 && s.pct < 90).length, color: '#2563eb' },
                    { label: '70-79', count: studentsData.filter((s) => s.pct >= 70 && s.pct < 80).length, color: '#0891b2' },
                    { label: '60-69', count: studentsData.filter((s) => s.pct >= 60 && s.pct < 70).length, color: '#d97706' },
                    { label: '50-59', count: studentsData.filter((s) => s.pct >= 50 && s.pct < 60).length, color: '#ea580c' },
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

            if (questionChartRef.current && !questionChartInstance.current) {
                questionChartInstance.current = new window.Chart(questionChartRef.current, {
                    type: 'line',
                    data: {
                        labels: QUESTIONS_DATA.map((q) => 'Q' + q.number),
                        datasets: [
                            {
                                label: 'Average Score',
                                data: QUESTIONS_DATA.map((q) => q.avgScore),
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
    }, [view, currentExam, studentsData])

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
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const openExam = (id) => {
        setCurrentExamId(id)
        setView('exam')
        setSearchQuery('')
        setStatusFilter('all')
        setScoreFilter('all')
        setSortField('name')
        setSortDir('asc')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const openStudent = (studentId) => {
        const student = studentsData.find((s) => s.id === studentId)
        if (!student) return
        setCurrentStudentId(studentId)
        if (student.status === 'pending') setStudentState('not_uploaded')
        else if (student.status === 'processing') setStudentState('htr_processing')
        else setStudentState('evaluation_completed')
        setStudentEvaluations(SAMPLE_EVALUATIONS.map((e) => ({ ...e })))
        setUploadedFile(null)
        setUploadProgress(0)
        setView('student')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    /* ============================================================
       FILE HANDLING
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
        setStudentState('not_uploaded')
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
            progress += Math.random() * 15 + 5
            if (progress >= 100) {
                setUploadProgress(100)
                clearInterval(interval)
                setTimeout(() => {
                    setStudentState('htr_processing')
                    setTimeout(() => setStudentState('text_extracted'), 4500)
                }, 600)
            } else {
                setUploadProgress(progress)
            }
        }, 250)
        return () => clearInterval(interval)
    }, [studentState])

    const startAIEvaluation = () => {
        setStudentState('ai_processing')
        setTimeout(() => {
            setStudentState('evaluation_completed')
            setStudentsData((prev) =>
                prev.map((s) =>
                    s.id === currentStudentId ? { ...s, status: 'evaluated' } : s
                )
            )
            showToast('✓ AI evaluation completed')
        }, 4000)
    }

    /* ============================================================
       TEACHER REVIEW
       ============================================================ */

    const approveAI = (idx) => {
        setStudentEvaluations((prev) =>
            prev.map((ev, i) =>
                i === idx
                    ? { ...ev, finalScore: ev.aiScore, reviewed: true, reason: '' }
                    : ev
            )
        )
        showToast('✓ AI score approved')
    }

    const saveReview = (idx) => {
        setStudentEvaluations((prev) =>
            prev.map((ev, i) => (i === idx ? { ...ev, reviewed: true } : ev))
        )
        showToast('✓ Review saved')
    }

    const updateFinalScore = (idx, value) => {
        const q = QUESTIONS_DATA.find((qq) => qq.number === studentEvaluations[idx].qNumber)
        const clamped = Math.max(0, Math.min(q.marks, Number(value) || 0))
        setStudentEvaluations((prev) =>
            prev.map((ev, i) => (i === idx ? { ...ev, finalScore: clamped } : ev))
        )
    }

    const updateReason = (idx, value) => {
        setStudentEvaluations((prev) =>
            prev.map((ev, i) => (i === idx ? { ...ev, reason: value } : ev))
        )
    }

    const finalizeResult = () => {
        const finalTotal = studentEvaluations.reduce((s, e) => s + e.finalScore, 0)
        setStudentsData((prev) =>
            prev.map((s) =>
                s.id === currentStudentId
                    ? { ...s, finalScore: finalTotal, score: finalTotal, pct: finalTotal, status: 'reviewed' }
                    : s
            )
        )
        setStudentState('finalized')
        showToast('✓ Result finalized successfully')
    }

    /* ============================================================
       EXPORT
       ============================================================ */

    const doExport = (type) => {
        setExportModalOpen(false)
        const msg =
            type === 'csv'
                ? '✓ CSV exported'
                : type === 'pdf'
                  ? '✓ PDF report generated'
                  : '✓ Student report exported'
        showToast(msg)
    }

    /* ============================================================
       FILTERED DATA
       ============================================================ */

    const filteredExams = useMemo(() => {
        const q = examSearchQuery.toLowerCase().trim()
        return EXAMS_DATA.filter((e) => {
            const matchSearch =
                !q ||
                e.title.toLowerCase().includes(q) ||
                e.code.toLowerCase().includes(q) ||
                e.subject.toLowerCase().includes(q)
            const matchFilter = examStatusFilter === 'all' || e.status === examStatusFilter
            return matchSearch && matchFilter
        })
    }, [examSearchQuery, examStatusFilter])

    const filteredStudents = useMemo(() => {
        const q = searchQuery.toLowerCase().trim()
        let list = studentsData.filter((s) => {
            const matchSearch =
                !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
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
            if (sortField === 'name') { va = a.name; vb = b.name }
            else if (sortField === 'id') { va = a.id; vb = b.id }
            else if (sortField === 'score') { va = a.pct || 0; vb = b.pct || 0 }
            else if (sortField === 'status') { va = a.status; vb = b.status }
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
        const totalStudents = EXAMS_DATA.reduce((s, e) => s + e.students, 0)
        const totalEvaluated = EXAMS_DATA.reduce((s, e) => s + e.evaluated, 0)
        const totalPending = EXAMS_DATA.reduce((s, e) => s + e.pending, 0)
        const avgScore = (
            EXAMS_DATA.reduce((s, e) => s + e.average, 0) / EXAMS_DATA.length
        ).toFixed(1)
        const highestScore = Math.max(...EXAMS_DATA.map((e) => e.highest))

        return (
            <>
                <div className="breadcrumb">
                    <span className="current">Results</span>
                </div>

                <div className="page-header">
                    <div>
                        <h1>Results</h1>
                        <p>
                            View and analyse AI-evaluated examination results and
                            review student answer sheets.
                        </p>
                    </div>
                    <div className="page-header-actions">
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setExportModalOpen(true)}
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
                        <div className="stat-value">{EXAMS_DATA.length}</div>
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
                            {Math.round((totalEvaluated / totalStudents) * 100)}%
                            completion rate
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
                            84<span>%</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Avg Eval Time</div>
                        <div className="stat-value">
                            2.4<span>min</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">HTR Accuracy</div>
                        <div className="stat-value">
                            94<span>%</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Reviewed</div>
                        <div className="stat-value">312</div>
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
                                {filteredExams.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="empty-state">
                                            No exams found.
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
                        <span>Showing {filteredExams.length} of {EXAMS_DATA.length} exams</span>
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
        const evalPct = Math.round((currentExam.evaluated / currentExam.students) * 100)

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
                                <strong>{currentExam.questions} questions</strong>
                            </div>
                            <div className="exam-meta-item">
                                <Icon name="users" size={15} />
                                <strong>{currentExam.students} students</strong>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setExportModalOpen(true)}
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
                                <strong>
                                    {currentExam.evaluated - (currentExam.status === 'processing' ? 2 : 0)}
                                </strong>{' '}
                                Completed
                            </div>
                            {currentExam.status === 'processing' && (
                                <div className="eval-status-item">
                                    <span className="dot proc"></span>
                                    <strong>2</strong> Processing
                                </div>
                            )}
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
                        {QUESTIONS_DATA.map((q) => {
                            const pct = Math.round((q.avgScore / q.marks) * 100)
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
                                <div className="qa-card" key={q.number}>
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
                                        {q.text.substring(0, 60)}...
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
                                    placeholder="Search by name or ID..."
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
                                <option value="processing">Processing</option>
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
                                <option value="id-asc">Register No.</option>
                                <option value="status-asc">Status</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Register No.</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="empty-state">
                                            No students found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((s) => (
                                        <tr key={s.id} onClick={() => openStudent(s.id)}>
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
                            Click any row to view detailed evaluation
                        </span>
                    </div>
                </div>
            </>
        )
    }

    /* ============================================================
       RENDER: STUDENT RESULT
       ============================================================ */

    const renderUploadZone = () => (
        <div className="panel">
            <div className="panel-header">
                <div>
                    <h3>
                        <Icon name="upload" size={20} />
                        Upload Answer Sheet
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
                        <div className="value">{QUESTIONS_DATA.length} questions</div>
                    </div>
                </div>

                <div className="info-banner" style={{ marginTop: 20 }}>
                    <Icon name="info" size={18} />
                    <div>
                        <strong>What happens next?</strong> The answer sheet will be
                        processed through our Handwritten Text Recognition (HTR)
                        engine, then evaluated by the AI system. You'll be able to
                        review extracted answers and AI feedback before finalizing.
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
                    <p>Handwritten Text Recognition (HTR) is analyzing the answer sheet</p>
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
                    Our HTR engine is extracting text from the answer sheet
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
                        <span>Answer segmentation</span>
                    </div>
                    <div className="htr-step">
                        <div className="check"></div>
                        <span>AI evaluation</span>
                    </div>
                    <div className="htr-step">
                        <div className="check"></div>
                        <span>Result generation</span>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderExtractedAnswers = () => {
        const sampleTexts = [
            'A stack is a linear data structure where insertion and deletion occur from one end. It follows the LIFO principle.',
            'BFS uses a queue and explores level by level. DFS uses a stack or recursion and goes deep first.',
            'AVL trees are balanced binary search trees. They use rotations to maintain balance.',
            'To detect a cycle in a directed graph, we can use DFS with colors: white, gray, black.',
            'Hashing maps keys to indices using a hash function. Collisions occur when two keys map to same index.',
        ]
        const confidences = [96, 94, 91, 95, 93]

        return (
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h3>
                            <Icon name="file" size={20} />
                            Extracted Answers
                        </h3>
                        <p>Review the text extracted from the handwritten answer sheet</p>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={startAIEvaluation}>
                        <Icon name="ai" size={14} />
                        Start AI Evaluation
                    </button>
                </div>

                <div className="info-banner">
                    <Icon name="info" size={18} />
                    <div>
                        HTR has extracted {QUESTIONS_DATA.length} answers with an average
                        confidence of <strong>94%</strong>. Please verify before AI
                        evaluation.
                    </div>
                </div>

                {QUESTIONS_DATA.slice(0, 5).map((q, i) => (
                    <div className="extracted-answer" key={q.number}>
                        <div className="q-label">
                            <span>Question {q.number}</span>
                            <span className="confidence">HTR: {confidences[i]}%</span>
                        </div>
                        <div className="text">"{sampleTexts[i]}"</div>
                    </div>
                ))}
                <div style={{ textAlign: 'center', padding: 16, color: 'var(--g500)', fontSize: 13 }}>
                    Showing 5 of {QUESTIONS_DATA.length} extracted answers
                </div>
            </div>
        )
    }

    const renderAIProcessing = () => (
        <div className="panel">
            <div className="panel-header">
                <div>
                    <h3>
                        <Icon name="ai" size={20} />
                        AI Evaluation in Progress
                    </h3>
                    <p>Semantic analysis and scoring is being performed</p>
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
                <div className="htr-title">AI is evaluating answers...</div>
                <div className="htr-subtitle">Semantic analysis and scoring in progress</div>
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
                        <span>Handwritten text recognition</span>
                    </div>
                    <div className="htr-step done">
                        <div className="check">
                            <Icon name="check" size={12} />
                        </div>
                        <span>Answer segmentation</span>
                    </div>
                    <div className="htr-step active">
                        <div className="check">
                            <div className="spinner" />
                        </div>
                        <span>AI semantic evaluation</span>
                    </div>
                    <div className="htr-step">
                        <div className="check"></div>
                        <span>Score generation</span>
                    </div>
                    <div className="htr-step">
                        <div className="check"></div>
                        <span>Feedback composition</span>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderEvaluations = () => {
        if (!currentExam) return null

        const aiTotal = studentEvaluations.reduce((s, e) => s + e.aiScore, 0)
        const finalTotal = studentEvaluations.reduce((s, e) => s + e.finalScore, 0)
        const correct = studentEvaluations.filter((e) => e.verification === 'correct').length
        const partial = studentEvaluations.filter((e) => e.verification === 'partial').length
        const incorrect = studentEvaluations.filter((e) => e.verification === 'incorrect').length
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
                                <button className="btn btn-success btn-sm" onClick={finalizeResult}>
                                    <Icon name="check" size={14} />
                                    Finalize Result
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
                        const q = QUESTIONS_DATA.find((qq) => qq.number === ev.qNumber)
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
                        const semClass =
                            ev.components.semantic >= 0.85
                                ? 'high'
                                : ev.components.semantic >= 0.65
                                  ? 'mid'
                                  : 'low'
                        const covClass =
                            ev.components.coverage >= 85 ? 'high' : ev.components.coverage >= 65 ? 'mid' : 'low'
                        const compClass =
                            ev.components.completeness >= 85
                                ? 'high'
                                : ev.components.completeness >= 65
                                  ? 'mid'
                                  : 'low'

                        return (
                            <div className="q-eval-card" key={ev.qNumber}>
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
                                            <div className="content">{ev.studentAnswer}</div>
                                        </div>
                                        <div className="answer-box reference">
                                            <div className="label">
                                                <Icon name="book" size={13} />
                                                Reference Answer
                                            </div>
                                            <div className="content">{ev.referenceAnswer}</div>
                                        </div>
                                    </div>

                                    <div className="eval-components">
                                        <div className="eval-component">
                                            <div className="label">Semantic</div>
                                            <div className={`value ${semClass}`}>
                                                {ev.components.semantic.toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="eval-component">
                                            <div className="label">Coverage</div>
                                            <div className={`value ${covClass}`}>{ev.components.coverage}%</div>
                                        </div>
                                        <div className="eval-component">
                                            <div className="label">Keywords</div>
                                            <div className="value" style={{ fontSize: 14 }}>
                                                {ev.components.keywords}
                                            </div>
                                        </div>
                                        <div className="eval-component">
                                            <div className="label">Complete</div>
                                            <div className={`value ${compClass}`}>
                                                {ev.components.completeness}%
                                            </div>
                                        </div>
                                        <div className="eval-component">
                                            <div className="label">HTR Conf.</div>
                                            <div className="value high">{ev.components.htr}%</div>
                                        </div>
                                    </div>

                                    <div className="ai-feedback">
                                        <div className="ai-feedback-header">
                                            <Icon name="ai" size={14} />
                                            AI Feedback
                                        </div>
                                        <div className="ai-feedback-text">{ev.feedback}</div>
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
                                {Math.round((finalTotal / currentExam.totalMarks) * 100)}%
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
                                    {correct} / {studentEvaluations.length}
                                </div>
                            </div>
                        </div>
                        <div className="breakdown-item">
                            <span className="breakdown-dot amber" />
                            <div className="breakdown-info">
                                <div className="label">Partially Correct</div>
                                <div className="value">
                                    {partial} / {studentEvaluations.length}
                                </div>
                            </div>
                        </div>
                        <div className="breakdown-item">
                            <span className="breakdown-dot red" />
                            <div className="breakdown-info">
                                <div className="label">Incorrect</div>
                                <div className="value">
                                    {incorrect} / {studentEvaluations.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const renderStudentResult = () => {
        if (!currentExam || !currentStudent) return null
        const pct = currentStudent.pct || 0

        let bodyContent = null
        if (studentState === 'not_uploaded') bodyContent = renderUploadZone()
        else if (studentState === 'file_selected') bodyContent = renderFileInfo()
        else if (studentState === 'uploading') bodyContent = renderUploading()
        else if (studentState === 'htr_processing') bodyContent = renderHTRProcessing()
        else if (studentState === 'text_extracted') bodyContent = renderExtractedAnswers()
        else if (studentState === 'ai_processing') bodyContent = renderAIProcessing()
        else if (
            studentState === 'evaluation_completed' ||
            studentState === 'teacher_review' ||
            studentState === 'finalized'
        )
            bodyContent = renderEvaluations()

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
                                Register: <strong>{currentStudent.id}</strong>
                            </div>
                            <div className="meta-chip">
                                <Icon name="file" size={14} />
                                Total: <strong>{currentExam.totalMarks}</strong>
                            </div>
                            <div className="meta-chip">{statusBadge(currentStudent.status)}</div>
                        </div>
                    </div>
                    {currentStudent.score !== null && (
                        <div className="score-circle" style={{ '--pct': pct }}>
                            <div className="score-circle-inner">
                                <div className="big">
                                    {currentStudent.finalScore || currentStudent.score}
                                </div>
                                <div className="small">
                                    / {currentExam.totalMarks} · {pct}%
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {bodyContent}
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
                    <p>Choose a format to export the evaluation results.</p>
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