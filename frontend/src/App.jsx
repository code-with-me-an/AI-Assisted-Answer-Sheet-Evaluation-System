import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from './lib/router'

import { supabase } from './lib/supabase'
import { syncTeacherProfile } from './lib/api'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateExam from './pages/CreateExam'
import PastExams from './pages/PastExams'
import Results from './pages/Results'
import Students from './pages/Students'
import Profile from './pages/Profile'

import MainLayout from './layouts/MainLayout'

import './App.css'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [authLoading, setAuthLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        let mounted = true

        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession()

            if (error) {
                console.error('Error checking Supabase session:', error)
            }

            if (mounted) {
                setIsLoggedIn(!!data?.session)
                setAuthLoading(false)
            }

            if (data?.session) {
                syncTeacherProfile().catch((syncError) => {
                    console.error('Unable to synchronize teacher profile:', syncError)
                })
            }
        }

        checkSession()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!mounted) {
                    return
                }

                setIsLoggedIn(!!session)

                if (session) {
                    syncTeacherProfile().catch((syncError) => {
                        console.error('Unable to synchronize teacher profile:', syncError)
                    })
                }
            }
        )

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const handleLogin = () => {
        setIsLoggedIn(true)
        if (location.pathname === '/' || location.pathname.toLowerCase() === '/login') {
            navigate('/Dashboard')
        }
    }

    if (authLoading) {
        return (
            <div className="auth-loading">
                <p>Loading...</p>
            </div>
        )
    }

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />
    }

    return (
        <MainLayout>
            <Routes>
                {/* Conceptual primary routes with PascalCase */}
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/CreateExam" element={<CreateExam />} />
                <Route path="/PastExams" element={<PastExams />} />
                <Route path="/Results" element={<Results />} />
                <Route path="/Students" element={<Students />} />
                <Route path="/Profile" element={<Profile />} />
                <Route
                    path="/Help"
                    element={
                        <div className="placeholder-page">
                            <h1>Help Center</h1>
                            <p>Help and documentation will be available here.</p>
                        </div>
                    }
                />

                {/* Lowercase aliases / direct route aliases */}
                <Route path="/dashboard" element={<Navigate to="/Dashboard" replace />} />
                <Route path="/create-exam" element={<Navigate to="/CreateExam" replace />} />
                <Route path="/createexam" element={<Navigate to="/CreateExam" replace />} />
                <Route path="/past-exams" element={<Navigate to="/PastExams" replace />} />
                <Route path="/pastexams" element={<Navigate to="/PastExams" replace />} />
                <Route path="/results" element={<Navigate to="/Results" replace />} />
                <Route path="/students" element={<Navigate to="/Students" replace />} />
                <Route path="/profile" element={<Navigate to="/Profile" replace />} />
                <Route path="/settings" element={<Navigate to="/Profile" replace />} />
                <Route path="/Settings" element={<Navigate to="/Profile" replace />} />
                <Route path="/help" element={<Navigate to="/Help" replace />} />

                {/* Default route */}
                <Route path="/" element={<Navigate to="/Dashboard" replace />} />

                {/* Unknown fallback route */}
                <Route path="*" element={<Navigate to="/Dashboard" replace />} />
            </Routes>
        </MainLayout>
    )
}

export default App
