import { useEffect, useRef, useState } from 'react'
import '../style/NotificationCenter.css'

function BellIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M10 21h4" />
        </svg>
    )
}

function CheckIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M5 12.5 10 17l9-10" />
        </svg>
    )
}

function AlertIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M12 3 2.8 20h18.4L12 3Z" />
            <path d="M12 9v5" />
            <path d="M12 17h.01" />
        </svg>
    )
}

function InfoIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 10v6" />
            <path d="M12 7h.01" />
        </svg>
    )
}

function FileIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M6 3h8l4 4v14H6z" />
            <path d="M14 3v5h4" />
            <path d="M9 13h6M9 17h6" />
        </svg>
    )
}

const initialNotifications = [
    {
        id: 1,
        type: 'success',
        title: 'Evaluation Completed',
        message: 'Biology Midterm evaluation has been completed.',
        time: '2 minutes ago',
        read: false,
        targetPage: 'results'
    },
    {
        id: 2,
        type: 'warning',
        title: 'Pending Review',
        message: '12 answer sheets are waiting for your review.',
        time: '15 minutes ago',
        read: false,
        targetPage: 'results'
    },
    {
        id: 3,
        type: 'info',
        title: 'New Exam Created',
        message: 'Physics Unit Test was successfully created.',
        time: '1 hour ago',
        read: false,
        targetPage: 'past-exams'
    },
    {
        id: 4,
        type: 'success',
        title: 'Answer Sheets Uploaded',
        message: '52 student submissions have been received.',
        time: 'Yesterday',
        read: true,
        targetPage: 'past-exams'
    },
    {
        id: 5,
        type: 'info',
        title: 'System Update',
        message: 'Your evaluation workspace is ready to use.',
        time: '2 days ago',
        read: true,
        targetPage: 'dashboard'
    }
]

function NotificationCenter({ onNavigate }) {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState(
        initialNotifications
    )

    const notificationRef = useRef(null)

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length

    useEffect(() => {
        function handleOutsideClick(event) {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }

        function handleEscape(event) {
            if (event.key === 'Escape') {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener(
                'mousedown',
                handleOutsideClick
            )

            document.removeEventListener(
                'keydown',
                handleEscape
            )
        }
    }, [])

    const toggleNotifications = () => {
        setIsOpen((current) => !current)
    }

    const markAsRead = (id) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        )
    }

    const markAllAsRead = () => {
        setNotifications((current) =>
            current.map((notification) => ({
                ...notification,
                read: true
            }))
        )
    }

    const handleNotificationClick = (notification) => {
        markAsRead(notification.id)

        if (notification.targetPage && onNavigate) {
            onNavigate(notification.targetPage)
        }

        setIsOpen(false)
    }

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckIcon />

            case 'warning':
                return <AlertIcon />

            case 'info':
                return <InfoIcon />

            default:
                return <FileIcon />
        }
    }

    return (
        <div
            className="notification-center"
            ref={notificationRef}
        >
            <button
                type="button"
                className={`notification-button ${
                    isOpen ? 'open' : ''
                }`}
                onClick={toggleNotifications}
                aria-label="Notifications"
                aria-expanded={isOpen}
            >
                <BellIcon />

                {unreadCount > 0 && (
                    <span className="notification-count">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-panel">

                    <div className="notification-header">
                        <div>
                            <h2>Notifications</h2>

                            <p>
                                {unreadCount === 0
                                    ? 'You are all caught up.'
                                    : `${unreadCount} unread notification${
                                          unreadCount === 1
                                              ? ''
                                              : 's'
                                      }`}
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className="mark-all-button"
                                onClick={markAllAsRead}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">

                        {notifications.length === 0 ? (
                            <div className="notification-empty">
                                <div className="empty-icon">
                                    <BellIcon />
                                </div>

                                <h3>No notifications</h3>

                                <p>
                                    You don't have any notifications
                                    right now.
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <button
                                    type="button"
                                    className={`notification-item ${
                                        notification.read
                                            ? 'read'
                                            : 'unread'
                                    }`}
                                    key={notification.id}
                                    onClick={() =>
                                        handleNotificationClick(
                                            notification
                                        )
                                    }
                                >
                                    <div
                                        className={`notification-icon ${notification.type}`}
                                    >
                                        {getNotificationIcon(
                                            notification.type
                                        )}
                                    </div>

                                    <div className="notification-content">
                                        <div className="notification-title-row">
                                            <h3>
                                                {notification.title}
                                            </h3>

                                            {!notification.read && (
                                                <span className="unread-dot"></span>
                                            )}
                                        </div>

                                        <p>
                                            {notification.message}
                                        </p>

                                        <span className="notification-time">
                                            {notification.time}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}

                    </div>

                    <div className="notification-footer">
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false)

                                if (onNavigate) {
                                    onNavigate('dashboard')
                                }
                            }}
                        >
                            View all activity →
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}

export default NotificationCenter