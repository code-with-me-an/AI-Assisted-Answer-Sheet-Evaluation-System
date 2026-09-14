import { useState } from 'react'

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

    const handleLogin = () => {
        setIsLoggedIn(true)
        setActivePage('dashboard')
    }

    const handleNavigate = (page) => {
        if (page === 'logout') {
            setIsLoggedIn(false)
            setActivePage('dashboard')
            return
        }

        setActivePage(page)
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
                        <p>Help and documentation will be available here.</p>
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