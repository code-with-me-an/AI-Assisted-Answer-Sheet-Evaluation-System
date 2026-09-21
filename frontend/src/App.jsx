import { useEffect, useState } from 'react'

import { supabase } from './lib/supabase'

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
    const [activePage, setActivePage] = useState('dashboard')
    const [authLoading, setAuthLoading] = useState(true)

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
                    setActivePage('dashboard')
                }
            }
        )

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    const handleLogin = (user) => {
        console.log('Successfully logged in:', user)

        setIsLoggedIn(true)
        setActivePage('dashboard')
    }

    const handleNavigate = async (page) => {
        if (page === 'logout') {
            const { error } = await supabase.auth.signOut()

            if (error) {
                console.error('Logout error:', error)
                return
            }

            setIsLoggedIn(false)
            setActivePage('dashboard')

            return
        }

        setActivePage(page)
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

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return <Dashboard onNavigate={handleNavigate} />

            case 'create-exam':
                return <CreateExam />

            case 'past-exams':
                return <PastExams />

            case 'results':
                return <Results />

            case 'students':
                return <Students />

            case 'settings':
                return <Profile />

            case 'help':
                return (
                    <div className="placeholder-page">
                        <h1>Help Center</h1>
                        <p>
                            Help and documentation will be available here.
                        </p>
                    </div>
                )

            default:
                return <Dashboard onNavigate={handleNavigate} />
        }
    }

    return (
        <MainLayout
            activePage={activePage}
            onNavigate={handleNavigate}
        >
            {renderPage()}
        </MainLayout>
    )
}

export default App