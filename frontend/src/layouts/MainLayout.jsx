import Navbar from '../components/Navbar'
import NotificationCenter from '../components/NotificationCenter'
import PageHeader from '../components/PageHeader'
import '../style/MainLayout.css'
import '../style/PageHeader.css'

function MainLayout({
    children,
    activePage,
    onNavigate
}) {
    const pageTitles = {
        dashboard: 'Dashboard',
        'create-exam': 'Create New Exam',
        'past-exams': 'Past Exams',
        results: 'Results',
        students: 'Students',
        profile: 'Profile',
        settings: 'Settings',
    }

    const pageTitle = pageTitles[activePage] || 'Dashboard'

    return (
        <div className="app-layout">

            <Navbar
                activePage={activePage}
                onNavigate={onNavigate}
            />

            <NotificationCenter
                onNavigate={onNavigate}
            />

            <main className="main-content">
                <PageHeader title={pageTitle} />

                {children}
            </main>

        </div>
    )
}

export default MainLayout