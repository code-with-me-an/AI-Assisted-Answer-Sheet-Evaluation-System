import { useLocation } from '../lib/router'
import Navbar from '../components/Navbar'
import NotificationCenter from '../components/NotificationCenter'
import PageHeader from '../components/PageHeader'
import '../style/MainLayout.css'
import '../style/PageHeader.css'

function MainLayout({ children, onNavigate }) {
    const location = useLocation()
    const path = location.pathname.toLowerCase()

    let pageTitle = 'Dashboard'
    if (path.startsWith('/createexam') || path.startsWith('/create-exam')) {
        pageTitle = 'Create New Exam'
    } else if (path.startsWith('/pastexams') || path.startsWith('/past-exams')) {
        pageTitle = 'Past Exams'
    } else if (path.startsWith('/results')) {
        pageTitle = 'Results'
    } else if (path.startsWith('/students')) {
        pageTitle = 'Students'
    } else if (path.startsWith('/profile') || path.startsWith('/settings')) {
        pageTitle = 'Profile / Settings'
    } else if (path.startsWith('/help')) {
        pageTitle = 'Help Center'
    }

    return (
        <div className="app-layout">
            <Navbar onNavigate={onNavigate} />
            <NotificationCenter onNavigate={onNavigate} />
            <main className="main-content">
                <PageHeader title={pageTitle} />
                {children}
            </main>
        </div>
    )
}

export default MainLayout